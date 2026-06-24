import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";
import { getRandomRoute } from "../util/common/cities-util";
import { loadHotelTestData } from "../pages/util/hotel/hotel-util";
import { loadCabTestData } from "../pages/util/cab/cab-util";
import { HomePage } from "../pages/home-page";

import { getRandomDomesticAirports } from "../util/common/airport-util";
import { TestData } from "../pages/types/testdata";
import { loadTestData } from "../pages/util/flight/flight-util";

import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { TestsData } from "../pages/types/common/data-test";
import { loadBusTestData } from "../pages/util/bus/bus-util";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";
import { AddFlightHotelAirportCabBusPage } from "../pages/cart/add-flight-hotel-airportcab-bus-page";
import logger from '@wdio/logger'
const log = logger('FlightHotelAirportcabBusCart')


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
    "appium:platformVersion": "15",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:app":"C:\\Users\\C1054\\Downloads\\app-release 21.apk",
    "appium:noReset": true,
    "appium:fullReset": false,
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:ensureWebviewsHavePages": true,
    "appium:nativeWebScreenshot": true,
    "appium:newCommandTimeout": 7200,
    "appium:connectHardwareKeyboard": true,
    "appium:clearSystemFiles": true,
    "appium:uiautomator2ServerLaunchTimeout": 60000,
  },
};

describe("TCAT Mobile App  Login & Flight Flow", function () {
  before(async function () {
    this.timeout(100000000);

    allure.feature
    allure.severity

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
    allure.step
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


it("Flight Roundtrip + Hotel Booking + AirportCab + Bus", async function () {
  this.timeout(200000000);
   await driver.pause(2000);
  
      const homePage = new HomePage(driver);
      await homePage.login(data, "COMPANY_ADMIN");
 const travelRequestFlightHotelAirportCabBus = new AddFlightHotelAirportCabBusPage(
      driver,
      cabData,
      data,
      busData
    );

    await travelRequestFlightHotelAirportCabBus.createTravelRequestFlightHotelAirportCabBus();
    await driver.pause(2000);
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlightHotelAirportCabBus();
  
});
it("Flight Roundtrip + Hotel Booking + AirportCab + Bus", async function () {
  this.timeout(200000000);
   await driver.pause(2000);
  
      const homePage = new HomePage(driver);
      await homePage.login(data, "TRAVELLER");
 const travelRequestFlightHotelAirportCabBus = new AddFlightHotelAirportCabBusPage(
      driver,
      cabData,
      data,
      busData
    );

    await travelRequestFlightHotelAirportCabBus.createTravelRequestFlightHotelAirportCabBus();
    await driver.pause(2000);
    log.info("555555555555555555555555555555555555555555555555666666666666666666666");
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlightHotelAirportCabBus();
  
});



});
