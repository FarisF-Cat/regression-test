import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";
import { TestData } from "../pages/types/testdata";

import { FlightMulticityCancelPage } from "../pages/cart/flight-multicity-cancel-page";

function normaliseTrip(
  raw?: string,
): "ONEWAY" | "ROUNDTRIP" | "MULTICITY" | "" {
  return (raw ?? "").trim().toUpperCase() as any;
}

let driver: Browser;
let data: TestData;

const TRIP_TYPE = normaliseTrip(process.env.TRIP_TYPE);

console.log("Effective TRIP_TYPE:", TRIP_TYPE || "(not set)");

const opts = {
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:ensureWebviewsHavePages": true,
    "appium:nativeWebScreenshot": true,
    "appium:newCommandTimeout": 3600,
    "appium:connectHardwareKeyboard": true,
    "appium:clearSystemFiles": true,
    "appium:uiautomator2ServerLaunchTimeout": 60000,
  },
};

describe("TCAT Mobile App  Login & Flight Flow", function () {
  before(async function () {
    this.timeout(350000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    console.log(" Loading HOTEL DATA .............................");

    console.log(" Connecting to Appium…");
    driver = await remote(opts);
    allureReporter.addStep("APP LAUNCHING SUCCESSFULLY");
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        console.log(" Deleting session…");
        await driver.deleteSession();
        allureReporter.addStep("SESSION DELETED");
      } catch (err: any) {
        console.warn("Error during session cleanup:", err.message || err);
      }
    }
  });

  /* ------------------ tests ------------------ */

  it("Multicity - COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "MULTICITY") this.skip();

    this.timeout(900000);

    await driver.pause(2000);

    const homePage = new HomePage(driver);
    await homePage.login();
    // const homePage = new HomePage(driver);
    // await homePage.login(data, "COMPANY_ADMIN");
    console.log("TRIP_TYPE:", TRIP_TYPE);
    console.log(
      "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111Running Multicity Cancel Test...",
    );
    const flightCancel = new FlightMulticityCancelPage(driver, data);

    await flightCancel.flightMulticityCancelRequest();
    console.log(
      "TRAVEL REQUEST CREATED FOR MULTICITY JOURNEY TYPE CANCELLED SUCCESSFULLY",
    );
    await driver.pause(2000);

    await driver.pause(2000);
    // await homePage.logout();
  });
});
