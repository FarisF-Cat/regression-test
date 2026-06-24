import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";
import { loadTestData } from "../pages/util/flight/flight-util";

// import { HomePage } from "../pages/home-page";
import { TestData } from "../pages/types/testdata";
import { loadHotelTestData } from "../pages/util/hotel/hotel-util";
import { loadCabTestData } from "../pages/util/cab/cab-util";

import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { TestsData } from "../pages/types/common/data-test";
import { loadBusTestData } from "../pages/util/bus/bus-util";
import { AddFlightMultiictyHotelCabBusRailPage } from "../pages/cart/add-flightmulticity-hotel-cab-bus-rail-page";

import { loadRailTestData } from "../pages/util/rail/rail-util.ts";
import { RequestSummaryPage } from "../pages/cart/request-summary-page.ts";
import { HomePage } from "../pages/home-page.ts";
import logger from '@wdio/logger'
const log = logger('FlightmulticityHotelCabBusRailCart')


// *helps make trip type handling in our  tests , takes  optional string ('oneway,) the input is undefined, it uses an empty string.

let driver: Browser;
let data: TestData;
let hotelData: HotelTestData;
let cabData: TestsData;
let busData: TestsData;
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
    "appium:app": "/home/faris_faruk/Downloads/app.apk",
    "appium:noReset": false,
    "appium:fullReset": true,
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:ensureWebviewsHavePages": true,
    "appium:disableWindowAnimation": true,
    "appium:settings[enforceXPath1]": true,
    "appium:nativeWebScreenshot": true,
    "appium:newCommandTimeout": 3600,
    "appium:connectHardwareKeyboard": true,
    "appium:clearSystemFiles": true,
    "appium:uiautomator2ServerLaunchTimeout": 60000,
    "appium:uiautomator2ServerInstallTimeout": 60000,
  },
};

describe("TCAT Mobile App  Login & Flight Flow", function () {
  // ---------------------- BEFORE HOOK ----------------------
  before(async function () {
    this.timeout(1200000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    log.debug("📦 loading test data");

    // ✅ Load airport test data (used across all modules)
    data = await loadTestData();
    if (!data?.accounts?.length) {
      log.debug(
        "❌ airport data length:",
        data?.accounts?.length ?? "undefined airport data",
     );
      throw new Error("Test data or accounts missing!");
    }

    log.info("🏨 loading hotel data..");
    hotelData = await loadHotelTestData();
    if (!hotelData?.locationData?.length) {
      log.debug(
        "❌ hotel data length:",
        hotelData?.locationData?.length ?? "undefined hotel data",
     );
      throw new Error("Hotel test data missing or empty!");
    }

    log.info("🚌 loading bus data..");
    busData = await loadBusTestData();
    if (!busData?.routes?.length) {
      throw new Error("Bus test data missing or empty!");
    }

    log.info("🚕 loading cab data..");
    cabData = await loadCabTestData();
    if (!cabData?.routes?.length) {
      log.debug(
        "❌ cab data length:",
        cabData?.routes?.length ?? "undefined cab data",
     );
      throw new Error("Cab test data missing or empty!");
    }

    log.debug(
      "🚆 🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆 loading rail data ...🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆",
   );
    railData = await loadRailTestData();
    if (!railData?.routes?.length) {
      throw new Error(
        "🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆RAIL TEST DATA MISSING OR EMPTY🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆!",
      );
    }

    log.info("📱 connecting to appium..");
    driver = await remote(opts);
    allureReporter.addStep("✅ App launched successfully");
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

  // ---------------------- AFTER HOOK ----------------------
  afterEach(async function () {
    this.timeout(10000);
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

  it("Flight MULTICITY + Hotel Booking + Cab + BUS + RAIL", async function () {
    this.timeout(200000000);
    const homePage = new HomePage(driver);
    await driver.pause(2000);
    log.info("login process started for flight + hotel");
    await homePage.login(data, "TRAVELLER");
    const travelRequestFlightMulticityHotelCabBusRail =
      new AddFlightMultiictyHotelCabBusRailPage(
        driver,
        cabData,
        data,
        busData,
        railData,
      );

    await travelRequestFlightMulticityHotelCabBusRail.createTravelRequestFlightMultiCityHotelCabBusRail();
    await driver.pause(2000);
    log.info(
      "5555555555555555555555555555555555555555555555556666666666666666666666",
   );
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlighMulticitytHotelAirportCabBusRail();
  });

  it("Flight MULTICITY + Hotel Booking + Cab + BUS + RAIL", async function () {
    this.timeout(200000000);
    const homePage = new HomePage(driver);
    await driver.pause(2000);
    log.info("login process started for flight + hotel");
    await homePage.login(data, "TRAVELLER");
    const travelRequestFlightMulticityHotelCabBusRail =
      new AddFlightMultiictyHotelCabBusRailPage(
        driver,
        cabData,
        data,
        busData,
        railData,
      );

    await travelRequestFlightMulticityHotelCabBusRail.createTravelRequestFlightMultiCityHotelCabBusRail();
    await driver.pause(2000);
    log.info(
      "5555555555555555555555555555555555555555555555556666666666666666666666",
   );
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlighMulticitytHotelAirportCabBusRail();
  });
});
