import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";

import { loadTestData } from "../pages/util/flight/flight-util";
// import { login } from "../pages/cart/login/login-page";
// import { HomePage } from "../pages/home-page";

import { TestData } from "../pages/types/testdata";
import { TestsData } from "../pages/types/common/data-test";
import { loadBusTestData } from "../pages/util/bus/bus-util";
import { BusCancelPage } from "../pages/cart/bus-cancel-page";
import { HomePage } from "../pages/home-page";
import logger from '@wdio/logger'
const log = logger('BusCancel')


let driver: Browser;
let data: TestData;
let busData: TestsData;

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

describe("TCAT Mobile App  Login & Bus Flow", function () {
  before(async function () {
    log.info(
      " 12122222212112121212121211212212212121212121212121212121212setting up test environment…",
   );
    this.timeout(1500000);

    allure.feature("Login Feature");
    allure.severity("critical");

    log.debug("  loading test data");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    log.debug(" loading hotel data ............................");

    busData = await loadBusTestData();
    if (!busData?.routes?.length) {
      throw new Error("Bus test‑data missing or empty!");
    }

    log.info(" connecting to appium");
    driver = await remote(opts);
    allure.step("APP LAUNCHING SUCCESSFULLY");
  });

  after(async function () {
    if (driver?.sessionId) {
      log.info(
        "  535365375354745375353535353563653653537475375cleaning up test environment…",
     );
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

  it("BUS SEARCH -TRAVELLER ", async function () {
    this.timeout(2500000);
    log.info(
      " starting test0000000000000000000000000000000000000000000000000000: bus search -traveller",
   );
    await driver.pause(2000);
    const homePage = new HomePage(driver);
    await homePage.login();
    log.info(
      "login successfully for traveller111111111111111111111111111111111111111111111111111111111111111",
   );
    const busCancel = new BusCancelPage(driver, data, busData);
    log.info(
      "222222222222222222222222222222222222222222222222222222222222222222222222222222222222222bus cancel page object created successfully",
   );
    await busCancel.busCancelRequest();
    log.info("travel request created for bus cancelled successfully");

    await driver.pause(5000);
  });
});
