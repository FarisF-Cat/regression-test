import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
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
    "appium:deviceName": "emulator-5554",
    "appium:platformVersion": "11",
    "appium:automationName": "UiAutomator2",
    "appium:app": "/home/faris_faruk/Downloads/app.apk",

    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:settings[enforceXPath1]": true,
    "appium:disableWindowAnimation": true,
    
    "appium:ignoreHiddenApiPolicyError": true,
    "appium:newCommandTimeout": 360,
    "appium:adbExecTimeout": 300000,
  },
};

describe("TCAT Mobile App Login & Bus Flow", function () {

  before(async function () {
    this.timeout(800000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("Loading test data…");
    data = await loadTestData();

    if (!data?.accounts?.length) {
      throw new Error("Test data or accounts missing!");
    }

    console.log("Connecting to Appium…");
    driver = await remote(opts);

    try {
      const waitBtn = await driver.$('android:id/aerr_wait');
      await waitBtn.waitForDisplayed({ timeout: 3000 });
      await waitBtn.click();
      console.log("System UI ANR dismissed");
    } catch {
      // Not present — continue normally
    }

    allureReporter.addStep("APP LAUNCHED");

    console.log("Waiting for app to stabilize...");
    await driver.waitUntil(
      async () => {
        const fields = await driver.$$('android=new UiSelector().className("android.widget.EditText")');
    	return fields.length >= 2;
      },
      {
    	timeout: 20000,
    	interval: 1000,
        timeoutMsg: "Login screen did not load properly"
      }
    );
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        console.log("Deleting session…");
        await driver.deleteSession();
        allureReporter.addStep("SESSION DELETED");
      } catch (err: any) {
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

  it("TEST LOGIN", async function () {
    this.timeout(2500000);

    console.log("Starting login test");

    const loginPage = new TestLoginPage(driver);
    await loginPage.testLogin();

    console.log("Login action completed");

   // const home = await driver.$('~Home');
   // await home.waitForDisplayed({ timeout: 10000 });
   // console.log("Home screen detected");
  });

});
