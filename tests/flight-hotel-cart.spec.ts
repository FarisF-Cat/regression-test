import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";

// import { HomePage } from "../pages/home-page";
import { loadTestData } from "../pages/util/flight/flight-util";

import { getRandomDomesticAirports } from "../util/common/airport-util";
import { TestData } from "../pages/types/testdata";
import { loadHotelTestData } from "../pages/util/hotel/hotel-util";

import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { AddFlightHotelPage } from "../pages/cart/add-flight-hotel-page";
import { HomePage } from "../pages/home-page";
import logger from '@wdio/logger'
const log = logger('FlightHotelCart')


let driver: Browser;
let data: TestData;
let hotelData: HotelTestData;
// let cabData: TestData;

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
    "appium:noReset": true,
    "appium:settings[enforceXPath1]": true,
    "appium:disableWindowAnimation": true,
    // "appium:fullReset": true,
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

describe("TCAT Mobile App  Login & Flight Flow", function () {
  before(async function () {
    this.timeout(9000000);

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
      throw new Error("  Hotel test‑data missing or empty!");
    }

    // cabData = await loadCabTestData();
    // if (!cabData?.routes?.length) {
    //   throw new Error("  Cab test‑data missing or empty!");
    // }
    log.info(" connecting to appium");
    driver = await remote(opts);
    
    try {
     await driver.waitUntil(
       async () => (await driver.$$("#aerr_wait")).length > 0,
       { timeout: 3000, interval: 1000 }
     );
     await driver.$("#aerr_wait").click();
     log.info("anr popup dismisse");
    } catch { /* not present — continue */ }

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

  it("Flight Roundtrip + Hotel Booking", async function () {
    this.timeout(900000);

    // const role = "COMPANY_ADMIN";
    const homePage = new HomePage(driver);
    await driver.pause(2000);
    log.info("login process started for flight + hotel");

    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);
    const city = destination; // or: getRandomDomesticCity(data).city
    await driver.pause(4000);
    const flightHotelSearch = new AddFlightHotelPage(driver);

    await flightHotelSearch.createFlightHotel(
      city,
      origin,
      destination,
      airportCodes,
      // "ROUNDTRIP"
    );

    await driver.pause(2000);
    const requestSummaryFlightHotel = new RequestSummaryPage(driver);

    await requestSummaryFlightHotel.viewTravelRequestSummaryForFlightHotel();

    // await homePage.logout();
  });

  // it("Flight Roundtrip + Hotel Booking", async function () {
  //   this.timeout(900000);

  //   // const role = "COMPANY_ADMIN";
  //   const homePage = new HomePage(driver);
  //   await driver.pause(2000);
  //   log.info("login process started for flight + hotel");
  //   await homePage.login(data, "TRAVELLER");

  //   const { origin, destination } = getRandomDomesticAirports(data.airports!);
  //   const airportCodes = data.airports!.map((a) => a.airport);
  //   const city = destination; // or: getRandomDomesticCity(data).city
  //   const flightHotelSearch = new AddFlightHotelPage(driver);

  //   await flightHotelSearch.createFlightHotel(
  //     city,
  //     origin,
  //     destination,
  //     airportCodes
  //     // "ROUNDTRIP"
  //   );

  //   await driver.pause(2000);
  //   const requestSummaryFlightHotel = new RequestSummaryPage(driver);

  //   await requestSummaryFlightHotel.viewTravelRequestSummaryForFlightHotel();

  //   await driver.pause(2000);
  //   await homePage.logout();
  // });
});
