import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";

import { loadTestData } from "../pages/util/flight/flight-util";
import { TestData } from "../pages/types/testdata";
import { ViewTRipTab } from "../pages/cart/view-trip-page";
import { HomePage } from "../pages/home-page";
import logger from '@wdio/logger'
const log = logger('MyTrip')


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
    "appium:app": "/home/faris_faruk/Downloads/app.apk",
    "appium:noReset": true,
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
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

    allure.feature
    allure.severity

    log.debug("loading test data..");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error("Test data or accounts missing!");
    }

    log.info("connecting to appium..");
    driver = await remote(opts);

    try {
      await driver.waitUntil(
        async () => (await driver.$$("#aerr_wait")).length > 0,
        { timeout: 3000, interval: 1000 }
      );
      await driver.$("#aerr_wait").click();
      log.info("anr popup dismisse");
    } catch {
      // Not present — continue normally
    }

    log.info("waiting for app to stabilize..");
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

    allure.step
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        log.info("deleting session..");
        await driver.deleteSession();
        allure.step
      } catch (err: any) {
        log.warn("error during session cleanup:", err.message || err);
      }
    }
  });

  /* ------------------ tests ------------------ */

  it("MY TRIP TAB", async function () {
    this.timeout(2500000);

    const homePage = new HomePage(driver);
    await homePage.login(data, "COMPANY_ADMIN");

    await driver.pause(7500);

    log.info("home stable — navigating to my trips..");

    const myTripPage = new ViewTRipTab(driver);
    await myTripPage.viewTripScreen();

    log.info("my trips flow completed");
  });
});
