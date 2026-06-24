import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";

import { loadTestData } from "../pages/util/flight/flight-util";

import { getRandomDomesticCity } from "../util/common/cities-util";
import { loadHotelTestData } from "../pages/util/hotel/hotel-util";
import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { HomePage } from "../pages/home-page";
import { TestsData } from "../pages/types/common/data-test";
import { AddHotelPage } from "../pages/cart/add-hotel-page";
import { HotelRequestSearchPage } from "../pages/cart/hotel-request-page";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";
import logger from '@wdio/logger'
const log = logger('HotelCart')


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

describe("TCAT Mobile App  Login & Hotel Flow", function () {
  before(async function () {
    this.timeout(350000);

    allure.feature
    allure.severity

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
    allure.step
  });

  beforeEach(async function () {
    this.timeout(60000);
    if (driver?.sessionId) {
      try {
        // Terminate and relaunch the app — faster than full session restart
        await driver.terminateApp("com.catalyca.tcat.mobile");
        await driver.pause(2000);
        await driver.activateApp("com.catalyca.tcat.mobile");
        await driver.pause(3000);
        log.info("✅ app restarted for fresh test ru");
      } catch (err: any) {
        log.warn("⚠️ app restart failed:", err.messag);
      }
    }
  });

  afterEach(async function () {
    this.timeout(15000);
    if (this.currentTest?.state === "failed" && driver?.sessionId) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const screenshotPath = `/home/faris_faruk/tcat_regression/screenshots/failure-${timestamp}.png`;
        await driver.saveScreenshot(screenshotPath);
        log.info(`📸 screenshot saved: ${screenshotPath}`);
      } catch (err: any) {
        log.warn("⚠️ could not take screenshot:", err.messag);
      }
    }
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        log.info(" deleting session");
        await driver.deleteSession();
        allure.step
      } catch (err: any) {
        log.warn("error during session cleanup:", err.message || err);
      }
    }
  });

  it("HOTEL SEARCH - COMPANY_ADMIN", async function () {
    this.timeout(2500000);

    const { city } = getRandomDomesticCity(data);
    log.info("generated route for hotel :", { city );
    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login(data, "COMPANY_ADMIN");

    const createTravelRequestHotel = new AddHotelPage(driver);
    await createTravelRequestHotel.createHotel(city);

    await driver.pause(2000);
    log.info("entering into hotel request screen");
    const hotelRequest = new HotelRequestSearchPage(driver);

    await hotelRequest.hotelRequest();

    await driver.pause(2000);
    log.info("entering into hotel request summary screen");
    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForHotel();

    await driver.pause(2000);
    // await homePage.logout();
  });
  it("HOTEL SEARCH -TRAVELLER ", async function () {
    this.timeout(2500000);

    const { city } = getRandomDomesticCity(data);
    log.info("generated route for hotel :", { city );
    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login(data, "TRAVELLER");

    const createTravelRequestHotel = new AddHotelPage(driver);
    await createTravelRequestHotel.createHotel(city);

    await driver.pause(2000);

    const hotelRequest = new HotelRequestSearchPage(driver);

    await hotelRequest.hotelRequest();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForHotel();

    await driver.pause(2000);
    await homePage.logout();
  });
});
