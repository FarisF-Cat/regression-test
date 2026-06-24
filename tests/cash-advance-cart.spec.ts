import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";

import { CashAdvanceRequest } from "../pages/cart/cash-advance-request-page";

import { HomePage } from "../pages/home-page";
import logger from '@wdio/logger'
const log = logger('CashAdvanceCart')


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
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:app": "/home/faris_faruk/Downloads/app.apk",
    "appium:noReset": false,
    "appium:fullReset": true,
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:ensureWebviewsHavePages": true,
    "appium:settings[enforceXPath1]": true,
    "appium:disableWindowAnimation": true,
    "appium:nativeWebScreenshot": true,
    "appium:newCommandTimeout": 3600,
    "appium:connectHardwareKeyboard": true,
    "appium:clearSystemFiles": true,
    "appium:uiautomator2ServerLaunchTimeout": 60000,
    "appium:uiautomator2ServerInstallTimeout": 60000,
  },
};

describe("TCAT Mobile App  Login & View Request Tab ", function () {
  before(async function () {
    this.timeout(800000);

    allure.featureture");
    allure.severity

    log.debug("  loading test data rail");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing !");
    }

    log.info(" connecting to appium");
    driver = await remote(opts);
    allure.step("APP LAUNCHING SUCCESSFULLY");
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        log.info(" deleting session");
        await driver.deleteSession();
        allure.step("SESSION DELETED SUCCESSFULLY");
      } catch (err: any) {
        log.warn("error during session cleanup:", err.message || err);
      }
    }
  });

  /* ------------------ tests ------------------ */

  it("VIEW REQUEST TAB", async function () {
    this.timeout(2500000);

    const homePage = new HomePage(driver);
    await homePage.login();
    log.info(
      "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111logged in successfully",
   );
    const cashAdvanceRequestPage = new CashAdvanceRequest(driver);
    log.info(
      "22222222222222222222222222222222222222222222222222222222222222222222222222222222222cash advance request page object created",
   );
    await cashAdvanceRequestPage.cashAdvanceScreen();
    // await homePage.logout();
  });
});
