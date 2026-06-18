import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";

import { ViewTRipTab } from "../pages/cart/view-trip-page";

import { HomePage } from "../pages/home-page";

let driver: Browser;
let data: TestData;

const opts = {
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:platformVersion": "11",
    "appium:automationName": "UiAutomator2",
    // "appium:appPackage": "com.catalyca.tcat.mobile",
    // "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 5.apk",
    // "appium:noReset": true,
    // "appium:fullReset": false,
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:newCommandTimeout": 360,
    "appium:adbExecTimeout": 120000,
    "appium:clearSystemFiles": true,
    "appium:uiautomator2ServerLaunchTimeout": 120000,
    "appium:uiautomator2ServerInstallTimeout": 120000,
    "appium:uiautomator2ServerReadTimeout": 120000,

    "appium:androidInstallTimeout": 120000,
    "appium:noReset": true,
    "appium:disableWindowAnimation": true,
  },
};

describe("TCAT Mobile App  Login & View Request Tab ", function () {
  before(async function () {
    this.timeout(800000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data RAIL…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing !");
    }

    console.log(" Connecting to Appium…");
    driver = await remote(opts);
    allureReporter.addStep("APP LAUNCHING SUCCESSFULLY");
  });

  after(async function () {
    this.timeout(20000);

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

  it("MY TRIP   TAB", async function () {
    this.timeout(2500000);

    const homePage = new HomePage(driver);
    await homePage.login();
    console.log(
      "..............................................................................Login successful, now navigating to My Trip tab...",
    );
    await driver.pause(5000);
    const myTripPage = new ViewTRipTab(driver);
    console.log(
      ".............................................................................................Navigating to My Trip tab...",
    );
    await myTripPage.viewTripScreen();

    // await homePage.logout();
  });
});
