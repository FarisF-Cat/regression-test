import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";
import { getRandomRoute } from "../util/common/cities-util";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";

import { loadTestData } from "../pages/util/flight/flight-util";

import { getRandomDomesticAirports } from "../util/common/airport-util";
import { TestData } from "../pages/types/testdata";
import { loadHotelTestData } from "../pages/util/hotel/hotel-util";

import { loadCabTestData } from "../pages/util/cab/cab-util";

import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { TestsData } from "../pages/types/common/data-test";
import { HomePage } from "../pages/home-page";
import { AddFlightHotelCabPage } from "../pages/cart/add-flight-hotel-cab-page";
import logger from '@wdio/logger'
const log = logger('FlightHotelCabCart')

// import { HomePage } from "../pages/home-page";
// *helps make trip type handling in our  tests , takes  optional string ('oneway,) the input is undefined, it uses an empty string.

let driver: Browser;
let data: TestData;
let hotelData: HotelTestData;
let cabData: TestsData;

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
    "appium:fullReset": false,
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

describe("TCAT Mobile App  Login & Flight Flow", function () {
  before(async function () {
    this.timeout(200000000);

    allure.feature
    allure.severity

    log.debug("  loading test data");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      log.debug(
        "hotel  data routes lenth :",
        data?.accounts?.length ?? "undefined aiport data length ",
     );

      throw new Error(" Test data or accounts missing!");
    }
    log.debug(" loading hotel data ............................");

    hotelData = await loadHotelTestData();
    if (!hotelData?.locationData?.length) {
      log.debug(
        "hotel  data routes lenth :",
        hotelData?.locationData?.length ?? "undefined hotel  data length ",
     );
      throw new Error("  Hotel test‑data missing or empty!");
    }

    log.info("entering into cab detail screen");
    cabData = await loadCabTestData();
    log.debug("  loading cab data ............................");
    if (!cabData?.routes?.length) {
      log.debug(
        "cab data routes lenth :",
        cabData?.routes?.length ?? "undefined cab data length ",
     );
      throw new Error("CAB test‑data EMPTY !");
    }

    // cabData = await loadCabTestData();
    // if (!cabData?.routes?.length) {
    //   throw new Error("  Cab test‑data missing or empty!");
    // }
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

  // it("Flight Roundtrip + Hotel Booking + Cab", async function () {
  //   this.timeout(2000000000);
  //   await driver.pause(5000);

  //   const homePage = new HomePage(driver);
  //   await homePage.login(data, "TRAVELLER");

  //   // const homePage = new HomePage(driver);
  //   // await driver.pause(2000);
  //   // log.info("login process started for flight + hotel+ca");
  //   // await homePage.login(data, "COMPANY_ADMIN");

  //   const { origin: flightOrigin, destination: flightDestination } =
  //     getRandomDomesticAirports(data.airports!);

  //   if (!cabData?.routes?.length) {
  //     throw new Error("CAB routes are missing or empty!");
  //   }

  //   // Pick a random cab route
  //   const { origin: cabPickupCity, destination: cabDropCity } =
  //     getRandomRoute(cabData); // ✅ This ensures cab data comes from routes.json
  //   const airportCodes = data.airports!.map((a) => a.airport);

  //   log.info("cab pickup city :", cabPickupCity);
  //   log.info("cab drop city   :", cabDropCity);

  //   const flightHotelCabSearch = new AddFlightHotelCabPage(driver, cabData);
  //   await flightHotelCabSearch.createFlightHotelCab(
  //     cabPickupCity,
  //     flightOrigin,
  //     flightDestination,
  //     airportCodes,
  //   );

  //   log.debug(
  //     `🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕 running for cab type: `,
  //   );
  //   await driver.pause(2000);
  //   const flightHotelCabSearchRequestSummary = new RequestSummaryPage(driver);
  //   log.debug(
  //     "inside the request summary page ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ viewing request summary for flight + hotel + cab ",
  //   );
  //   await flightHotelCabSearchRequestSummary.viewTravelRequestSummaryForFlightHotelCab();
  // });

  it("flight roundtrip + hotel booking + cab", async function () {
    this.timeout(200000000);

    const homePage = new HomePage(driver);
    // const homePage = new HomePage(driver);
    await driver.pause(2000);
    log.info("login process started for flight + hotel+cab");
    //  await homePage.login(data, "company_admin");

    const { origin: flightOrigin, destination: flightDestination } =
      getRandomDomesticAirports(data.airports!);

    if (!cabData?.routes?.length) {
      throw new Error("cab routes are missing or empty!");
    }

    // Pick a random cab route
    const { origin: cabPickupCity, destination: cabDropCity } =
      getRandomRoute(cabData); // ✅ This ensures cab data comes from routes.json
    const airportCodes = data.airports!.map((a) => a.airport);

    log.info("cab pickup city :", cabPickupCity);
    log.info("cab drop city   :", cabDropCity);

    const flightHotelCabSearch = new AddFlightHotelCabPage(driver, cabData);
    await flightHotelCabSearch.createFlightHotelCab(
      cabPickupCity,
      flightOrigin,
      flightDestination,
      airportCodes,
    );

    log.info(
      `🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕 running for cab type: `,
    );
    const flightHotelCabSearchRequestSummary = new RequestSummaryPage(driver);
    log.info(
      "                                                                                                                                                             viewing request summary for flight + hotel + cab ",
    );
    await flightHotelCabSearchRequestSummary.viewTravelRequestSummaryForFlightHotelCab();
  });
));
