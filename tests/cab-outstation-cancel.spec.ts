import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";
// import { HomePage } from "../pages/home-page";
import { TestsData } from "../pages/types/common/data-test";
import { getRandomRoute } from "../util/common/cities-util";
import { loadCabTestData } from "../pages/util/cab/cab-util";

import { OutstationCabCancelPage } from "../pages/cart/cab-outstationcab-cancel-page";

function normaliseCabTrip(
  raw?: string,
): "LOCALCAB" | "OUTSTATIONCAB" | "AIRPORTTRANSFER" | "" {
  return (raw ?? "").trim().toUpperCase() as any;
}

let driver: Browser;
let data: TestData;
let cabData: TestsData;

const TRIP_TYPE = normaliseCabTrip(process.env.TRIP_TYPE);

console.log("Effective TRIP_TYPE:", TRIP_TYPE || "(not set)");

const opts = {
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",

    "appium:platformVersion": "15",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 18.apk",
    "appium:noReset": true,
    "appium:fullReset": false,
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

describe("TCAT Mobile App  Login & Cab Flow", function () {
  before(async function () {
    this.timeout(900000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    console.log(" Loading HOTEL DATA .............................");

    cabData = await loadCabTestData();
    if (!cabData?.routes?.length) {
      throw new Error("CAB test‑data missing or empty!");
    }

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
  it("OUTSTATIONCAB -COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "OUTSTATIONCAB") this.skip();

    this.timeout(900000);

    const { origin, destination } = getRandomRoute(cabData);
    console.log("Generated Route for OUTSTATION CAB:", { origin, destination });
    // const homePage = new HomePage(driver);

    await driver.pause(2000);
    // await homePage.login(data, "TRAVELLER");
    const outstationCabCancel = new OutstationCabCancelPage(
      driver,
      data,
      cabData,
    );

    await outstationCabCancel.outstationCabCancelRequest();
    console.log(
      "TRAVEL REQUEST CREATED FOR OUTSTATION CAB CANCELLED SUCCESSFULLY",
    );

    await driver.pause(5000);
    // await homePage.logout();
  });
});
