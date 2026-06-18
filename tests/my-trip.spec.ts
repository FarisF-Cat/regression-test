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

  connectionRetryCount: 1,
  connectionRetryTimeout: 120000,

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
    "appium:app": "/home/faris_faruk/Downloads/app.apk",
    "appium:noReset": true,
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
    "appium:settings[enforceXPath1]": true,
    "appium:disableWindowAnimation": true,
    "appium:newCommandTimeout": 360,
    "appium:adbExecTimeout": 300000,
    "appium:uiautomator2ServerLaunchTimeout": 60000,
    "appium:uiautomator2ServerInstallTimeout": 60000,
  },
};

describe("TCAT Mobile App  Login & View Request Tab ", function () {
  before(async function () {
    this.timeout(800000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data RAIL…");
    console.log("Loading test data...");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing !");
      throw new Error("Test data or accounts missing!");
    }

    console.log(" Connecting to Appium…");
    console.log("Connecting to Appium...");
    driver = await remote(opts);

    try {
      await driver.waitUntil(
        async () => (await driver.$$("#aerr_wait")).length > 0,
        { timeout: 3000, interval: 1000 }
      );
      await driver.$("#aerr_wait").click();
      console.log("ANR popup dismissed");
    } catch {
      // Not present — continue normally
    }

    console.log("Waiting for app to stabilize...");
    await driver.waitUntil(
      async () => {
        await driver.pause(3000);
        const fields = await driver.$$(
          'android=new UiSelector().className("android.widget.EditText")'
        );
        return fields.length >= 2;
      },
      {
        timeout: 30000,
        interval: 3000,
        timeoutMsg: "Login screen did not load properly",
      }
    );

    allureReporter.addStep("APP LAUNCHING SUCCESSFULLY");
  });

  after(async function () {
    this.timeout(20000);

    if (driver?.sessionId) {
      try {
        console.log(" Deleting session…");
        console.log("Deleting session...");
        await driver.deleteSession();
        allureReporter.addStep("SESSION DELETED");
      } catch (err: any) {
        console.warn("Error during session cleanup:", err.message || err);
      }
    }
  });

  /* ------------------ tests ------------------ */

  it("MY TRIP   TAB", async function () {
  it("MY TRIP TAB", async function () {
    this.timeout(2500000);

    const homePage = new HomePage(driver);
    await homePage.login();
    console.log(
      "..............................................................................Login successful, now navigating to My Trip tab...",
    );
    await driver.pause(5000);
    await homePage.login(data, "COMPANY_ADMIN");

    await driver.pause(7500);

    console.log("HOME STABLE — navigating to My Trips...");

    const myTripPage = new ViewTRipTab(driver);
    console.log(
      ".............................................................................................Navigating to My Trip tab...",
    );
    await myTripPage.viewTripScreen();

    // await homePage.logout();
    console.log("My Trips flow completed.");
  });
});
