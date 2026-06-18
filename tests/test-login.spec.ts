import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";
import { TestLoginPage } from "../pages/cart/test-login-page";

let driver: Browser;
let data: TestData;

const opts = {
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",

  capabilities: {
    platformName: "Android",
    "appium:deviceName": "emulator-5556",
    "appium:platformVersion": "15",
    "appium:automationName": "UiAutomator2",

    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 4.apk",

    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,

    "appium:newCommandTimeout": 360,
    "appium:adbExecTimeout": 120000,
    // "appium:uiautomator2ServerLaunchTimeout": 180000,
    // "appium:uiautomator2ServerInstallTimeout": 180000,
    // "appium:uiautomator2ServerReadTimeout": 120000,

    // "appium:connectHardwareKeyboard": false,
    // "appium:ignoreHiddenApiPolicyError": true,
  },
};

describe("TCAT Mobile App  Login & Bus Flow", function () {
  before(async function () {
    this.timeout(800000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");
    console.log(
      "⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...",
    );
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
  }).timeout(20000);

  /* ------------------ tests ------------------ */

  it("TEST LOGIN ", async function () {
    this.timeout(2500000);
    console.log(
      "1111111111111111111111111111111111111111111111111111111111111111111111111111Starting login test...",
    );
    const loginPage = new TestLoginPage(driver);
    console.log(
      "2222222222222222222222222222222222222222222222222222222222222222222222222TestLoginPage instance created",
    );
    await loginPage.testLogin();
  });
});
