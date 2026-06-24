import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";

import { loadTestData } from "../pages/util/flight/flight-util";
import { HomePage } from "../pages/home-page";

import { loadHotelTestData } from "../pages/util/hotel/hotel-util";
import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { TestsData } from "../pages/types/common/data-test";
import { HotelCancelPage } from "../pages/cart/hotel-cancel-page";
import logger from '@wdio/logger'
const log = logger('HotelCancel')


let driver: Browser;
let data: TestsData;
let hotelData: HotelTestData;

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
    "appium:noReset": true,
    "appium:fullReset": false,
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:ensureWebviewsHavePages": true,
    "appium:nativeWebScreenshot": true,
    "appium:newCommandTimeout": 3600,
    "appium:connectHardwareKeyboard": true,
    "appium:clearSystemFiles": true,
    "appium:uiautomator2ServerLaunchTimeout": 60000,
  },
};

describe("TCAT Mobile App  Login & Hotel Flow", function () {
  before(async function () {
    this.timeout(350000);

    allure.feature("Login Feature");
    allure.severity("critical");

    log.debug("  loading test data");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }

    log.debug(" loading hotel data ............................");
    hotelData = await loadHotelTestData();
    if (!hotelData?.locationData?.length) {
      throw new Error("Hotel test‑data missing or empty!");
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

  it("HOTEL SEARCH - COMPANY_ADMIN", async function () {
    this.timeout(2500000);

    // const { city } = getRandomDomesticCity(data);
    // log.info("generated route for hotel :", { city );
    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login();
    const hotelCancel = new HotelCancelPage(driver, data);

    await hotelCancel.hotelCancelRequest();
    log.info("travel request created for hotel  cancelled successfully");

    await driver.pause(2000);
    // await homePage.logout();
  });
});
