import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { describe, it, before, after, afterEach } from "mocha";
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
    "appium:deviceName": "emulator-5554",
    "appium:platformVersion": "11",
    "appium:automationName": "UiAutomator2",

    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 4.apk",
    "appium:app": "/home/faris_faruk/Downloads/app.apk",

    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,

    "appium:settings[enforceXPath1]": true,
    "appium:disableWindowAnimation": true,
    "appium:ignoreHiddenApiPolicyError": true,
    "appium:newCommandTimeout": 360,
    "appium:adbExecTimeout": 120000,
    // "appium:uiautomator2ServerLaunchTimeout": 180000,
    // "appium:uiautomator2ServerInstallTimeout": 180000,
    // "appium:uiautomator2ServerReadTimeout": 120000,

    // "appium:connectHardwareKeyboard": false,
    // "appium:ignoreHiddenApiPolicyError": true,
    "appium:adbExecTimeout": 300000,
  },
};

describe("TCAT Mobile App  Login & Bus Flow", function () {
describe("TCAT Mobile App Login & Bus Flow", function () {
  before(async function () {
    this.timeout(800000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");
    console.log(
      "⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...⏳ Waiting for emulator to stabilize...",
    );
    console.log("  Loading test data…");

    console.log("Loading test data…");
    data = await loadTestData();

    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
      throw new Error("Test data or accounts missing!");
    }

    console.log(" Connecting to Appium…");
    console.log("Connecting to Appium…");
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
    if (driver?.sessionId) {
      try {
        console.log(" Deleting session…");
        console.log("Deleting session…");
        await driver.deleteSession();
        allureReporter.addStep("SESSION DELETED");
      } catch (err: any) {
        console.warn("Error during session cleanup:", err.message || err);
        console.warn("Cleanup error:", err.message || err);
      }
    }
  }).timeout(20000);

  afterEach(async function () {
    if (this.currentTest?.state === "failed") {
      console.log("X Test failed X — capturing debug artifacts");

      const timestamp = Date.now();

      try {
        await driver.saveScreenshot(`failure-${timestamp}.png`);
        console.log(`Screenshot saved: failure-${timestamp}.png`);
      } catch {}

      try {
        const source = await driver.getPageSource();
        require("fs").writeFileSync(`failure-${timestamp}.xml`, source);
        console.log(`Page source saved: failure-${timestamp}.xml`);
      } catch {}
    }
  });

  /* ------------------ tests ------------------ */

  it("TEST LOGIN ", async function () {
  it("TEST LOGIN", async function () {
    this.timeout(2500000);
    console.log(
      "1111111111111111111111111111111111111111111111111111111111111111111111111111Starting login test...",
    );
    console.log("Starting login test");
    const loginPage = new TestLoginPage(driver);
    console.log(
      "2222222222222222222222222222222222222222222222222222222222222222222222222TestLoginPage instance created",
    );
    await loginPage.testLogin();
    console.log("Login action completed");
   // const home = await driver.$('~Home');
   // await home.waitForDisplayed({ timeout: 10000 });
   // console.log("Home screen detected");
  });
});
