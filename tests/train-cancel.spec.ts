import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";

import { TestsData } from "../pages/types/common/data-test";
import { loadRailTestData } from "../pages/util/rail/rail-util";
import { TrainCancelPage } from "../pages/cart/train-cancel-page";
import { HomePage } from "../pages/home-page";
import logger from '@wdio/logger'
const log = logger('TrainCancel')


let driver: Browser;
let data: TestData;
let railData: TestsData;

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
    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 5.apk",
    "appium:noReset": false,
    "appium:fullReset": true,
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:ensureWebviewsHavePages": true,
    "appium:nativeWebScreenshot": true,
    "appium:newCommandTimeout": 360,
    "appium:connectHardwareKeyboard": true,
    "appium:clearSystemFiles": true,
    "appium:uiautomator2ServerLaunchTimeout": 60000,
    "appium:adbExecTimeout": 120000,
  },
};

describe("TCAT Mobile App  Login & Rail Flow", function () {
  before(async function () {
    this.timeout(800000);

    allure.feature
    allure.severity

    log.debug("  loading test data rail");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing !");
    }
    log.debug(" loading rail data ............................");

    railData = await loadRailTestData();
    if (!railData?.routes?.length) {
      throw new Error("RAIL test‑data missing or empty!");
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
        allure.step("SESSION DELETED");
      } catch (err: any) {
        log.warn("error during session cleanup:", err.message || err);
      }
    }
  });

  /* ------------------ tests ------------------ */

  it("RAIL SEARCH -COMPANY_ADMIN", async function () {
    this.timeout(2500000);
    const homePage = new HomePage(driver);
    await homePage.login();
    await driver.pause(7000);
    const trainCancel = new TrainCancelPage(driver, data, railData);

    await trainCancel.trainCancelRequest();
    log.info("travel request created for train cancelled successfully");

    await driver.pause(5000);
  });
});
