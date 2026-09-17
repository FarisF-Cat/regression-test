import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after, afterEach } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";
import { TestData } from "../pages/types/testdata";
import { TestLoginPage } from "../pages/cart/test-login-page";
import { AppLaunchPage } from "../pages/app-launch-page";
import logger from '@wdio/logger'
const log = logger('TestLogin')

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

    log.debug("loading test data");
    data = await loadTestData();

    if (!data?.accounts?.length) {
      throw new Error("Test data or accounts missing!");
    }

    log.info("connecting to appium");
    driver = await remote(opts);

    const appLaunch = new AppLaunchPage(driver);
    await appLaunch.dismissAnrPopupIfPresent();
    await appLaunch.waitForLoginScreen();

    allureReporter.addStep("APP LAUNCHING SUCCESSFULLY");
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        log.info("deleting session");
        await driver.deleteSession();
        allureReporter.addStep("SESSION DELETED");
      } catch (err: any) {
        log.warn("cleanup error:", err.message || err);
      }
    }
  }).timeout(20000);

  afterEach(async function () {
    if (this.currentTest?.state === "failed") {
      log.info("x test failed x — capturing debug artifact");

      const timestamp = Date.now();

      try {
        await driver.saveScreenshot(`failure-${timestamp}.png`);
        log.info(`screenshot saved: failure-${timestamp}.pn`);
      } catch {}

      try {
        const source = await driver.getPageSource();
        require("fs").writeFileSync(`failure-${timestamp}.xml`, source);
        log.info(`page source saved: failure-${timestamp}.xm`);
      } catch {}
    }
  });

  /* ------------------ tests ------------------ */

  it("TEST LOGIN", async function () {
    this.timeout(2500000);

    log.info("starting login tes");

    const loginPage = new TestLoginPage(driver);
    await loginPage.testLogin();

    log.info("login action completed");

  });

});
