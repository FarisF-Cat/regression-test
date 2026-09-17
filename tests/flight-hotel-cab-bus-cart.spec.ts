import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";
import { loadHotelTestData } from "../pages/util/hotel/hotel-util";
import { loadTestData } from "../pages/util/flight/flight-util";
import { HomePage } from "../pages/home-page";

import { loadCabTestData } from "../pages/util/cab/cab-util";
import { TestData } from "../pages/types/testdata";
import { loadBusTestData } from "../pages/util/bus/bus-util";
import { getRandomDomesticAirports } from "../util/common/airport-util";
import { getRandomRoute } from "../util/common/cities-util";

import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { AddFlightHotelCabBusPage } from "../pages/cart/add-flight-hotel-bus-cab-page";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";
import logger from '@wdio/logger'
const log = logger('FlightHotelCabBusCart')

let driver: Browser;
let data: TestData;
let hotelData: HotelTestData;
let cabData: TestData;

let busData: TestData;

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
  
  beforeEach(async function () {
    this.timeout(60000);
    if (driver?.sessionId) {
      try {
        // Terminate and relaunch the app — faster than full session restart
        await driver.terminateApp("com.catalyca.tcat.mobile");
        await driver.pause(2000);
        await driver.activateApp("com.catalyca.tcat.mobile");
        await driver.activateApp("com.catalyca.tcat.mobile");

        await driver.waitUntil(
          async () => {
            const src = await driver.getPageSource();
            return (
              src.includes("Login") ||
              src.includes("Email") ||
              src.includes("Password")
            );
          },
          {
            timeout: 60000,
            interval: 1000
          }
        );
        log.info("✅ App restarted for fresh test run");
      } catch (err: any) {
        log.warn("⚠️ App restart failed:", err.message);
      }
    }
  });

  afterEach(async function () {
    this.timeout(10000);
    if (this.currentTest?.state === "failed" && driver?.sessionId) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const screenshotPath = `/home/faris_faruk/tcat_regression/screenshots/failure-${timestamp}.png`;
        await driver.saveScreenshot(screenshotPath);
        log.info(`📸 Screenshot saved: ${screenshotPath}`);
      } catch (err: any) {
        log.warn("⚠️ Could not take screenshot:", err.message);
      }
    }
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
    await homePage.login(data, "TRAVELLER");
    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);
    const { origin: cabOrigin } = getRandomRoute(cabData);
    const { origin: busOrigin, destination: busDestination } =
      getRandomRoute(busData);
    const travelRequestFlightHotelCabBus = new AddFlightHotelCabBusPage(driver);

    await travelRequestFlightHotelCabBus.createTravelRequestFlightHotelCabBus({
      origin,
      destination,
      airportCodes,
      cabOrigin,
      busOrigin,
      busDestination,
    });
    await driver.pause(2000);

    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlightHotelCabBus();
  });
  it("Flight Roundtrip + Hotel Booking + Cab", async function () {
    this.timeout(55000000);
    const homePage = new HomePage(driver);
    await homePage.login(data, "COMPANY_ADMIN");
    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);
    const { origin: cabOrigin } = getRandomRoute(cabData);
    const { origin: busOrigin, destination: busDestination } =
      getRandomRoute(busData);
    const travelRequestFlightHotelCabBus = new AddFlightHotelCabBusPage(driver);

    await travelRequestFlightHotelCabBus.createTravelRequestFlightHotelCabBus({
      origin,
      destination,
      airportCodes,
      cabOrigin,
      busOrigin,
      busDestination,
    });
    await driver.pause(2000);
    log.info("55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555entering into request summary page screen");
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlightHotelCabBus();
  });
});
