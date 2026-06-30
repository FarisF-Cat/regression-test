import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";
import { loadHotelTestData } from "../pages/util/hotel/hotel-util";
import { loadTestData } from "../pages/util/flight/flight-util";
import { HomePage } from "../pages/home-page";

import { loadCabTestData } from "../pages/util/cab/cab-util";
import { TestData } from "../pages/types/testdata";
import { TestsData } from "../pages/types/common/data-test";
import { loadBusTestData } from "../pages/util/bus/bus-util";
// import { getRandomDomesticAirports } from "../util/common/airport-util";

import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { AddFlightHotelCabBusPage } from "../pages/cart/add-flight-hotel-bus-cab-page";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";
import logger from '@wdio/logger'
const log = logger('FlightHotelCabBusCart')

// // import { HomePage } from "../pages/home-page";
// import { loadTestData } from "../pages/util/flightUtil/flight-util";
// import { getRandomDomesticAirports } from "../util/common/airport-util";
// import { TestData } from "../pages/types/testdata";

// import { HotelTestData } from "../pages/types/common/hotel-test-data";
// import { TestsData } from "../pages/types/common/data-test";
// import { loadCabTestData } from "../pages/util/cabUtil.ts/cab-util";
// import { loadBusTestData } from "../pages/util/busUtil/bus-util";
// import { AddFlightHotelCabBusPage } from "../pages/cart/add-flight-hotel-bus-cab-page";

let driver: Browser;
let data: TestData;
let hotelData: HotelTestData;
let cabData: TestsData;

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

describe("TCAT Mobile App  Login & Flight Flow", function () {
  before(async function () {
    this.timeout(65000000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    log.debug("  loading test data");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      log.debug(
        "hotel  data routes lenth :",
        data?.accounts?.length ?? "undefined aiport data length "
     );

      throw new Error(" Test data or accounts missing!");
    }
    log.debug(" loading hotel data ............................");

    hotelData = await loadHotelTestData();
    if (!hotelData?.locationData?.length) {
      log.debug(
        "hotel  data routes lenth :",
        hotelData?.locationData?.length ?? "undefined hotel  data length "
     );
      throw new Error("  Hotel test‑data missing or empty!");
    }

    busData = await loadBusTestData();
    if (!busData?.routes?.length) {
      throw new Error("Bus test‑data missing or empty!");
    }

    log.info("entering into cab detail screen");
    cabData = await loadCabTestData();
    log.debug("  loading cab data ............................");
    if (!cabData?.routes?.length) {
      log.debug(
        "cab data routes lenth :",
        cabData?.routes?.length ?? "undefined cab data length "
     );
      throw new Error("CAB test‑data EMPTY !");
    }

    log.info(" connecting to appium");
    driver = await remote(opts);
    allureReporter.addStep("APP LAUNCHING SUCCESSFULLY");
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        log.info(" deleting session");
        await driver.deleteSession();
        allureReporter.addStep("SESSION DELETED");
      } catch (err: any) {
        log.warn("error during session cleanup:", err.message || err);
      }
    }
  });

  it("Flight Roundtrip + Hotel Booking + Cab", async function () {
    this.timeout(55000000);

    const homePage = new HomePage(driver);
    await homePage.login();
    const travelRequestFlightHotelCabBus = new AddFlightHotelCabBusPage(
      driver,
      cabData,
      data,
      busData
    );

    await travelRequestFlightHotelCabBus.createTravelRequestFlightHotelCabBus();
    await driver.pause(2000);

    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlightHotelCabBus();
  });
  it("Flight Roundtrip + Hotel Booking + Cab", async function () {
    this.timeout(55000000);
    const homePage = new HomePage(driver);
    await homePage.login();
    const travelRequestFlightHotelCabBus = new AddFlightHotelCabBusPage(
      driver,
      cabData,
      data,
      busData
    );

    await travelRequestFlightHotelCabBus.createTravelRequestFlightHotelCabBus();
    await driver.pause(2000);
    log.info("55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555entering into request summary page screen");
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlightHotelCabBus();
  });
});
