import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";
import { getRandomDomesticAirports } from "../util/common/airport-util";
import { TestData } from "../pages/types/testdata";
// import { login } from "../pages/cart/login/login-page";
import { AddFlightPage } from "../pages/cart/add-flight-page";
import { FlightRequestSearchPage } from "../pages/cart/flight-request-page";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";

import { HomePage } from "../pages/home-page";
import logger from '@wdio/logger'
const log = logger('FlightCart')


function normaliseTrip(
  raw?: string,
): "ONEWAY" | "ROUNDTRIP" | "MULTICITY" | "" {
  return (raw ?? "").trim().toUpperCase() as any;
}

let driver: Browser;
let data: TestData;

const TRIP_TYPE = normaliseTrip(process.env.TRIP_TYPE);

log.info("effective trip_type:", TRIP_TYPE || "(not set");

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
    this.timeout(350000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    log.debug("  loading test data");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    log.debug(" loading hotel data ............................");

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
        await driver.pause(3000);
        log.info("✅ app restarted for fresh test ru");
      } catch (err: any) {
        log.warn("⚠️ app restart failed:", err.messag);
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
        allureReporter.addStep("SESSION DELETED");
      } catch (err: any) {
        log.warn("error during session cleanup:", err.message || err);
      }
    }
  });

  /* ------------------ tests ------------------ */

  it("ONEWAY - COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "ONEWAY") this.skip();
    this.timeout(900000);

    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);

    await driver.pause(2000);

    const homePage = new HomePage(driver);
    await homePage.login(data, "COMPANY_ADMIN");

    const createTravelRequestOneWay = new AddFlightPage(driver);

    await createTravelRequestOneWay.createTravelRequestAddFlightPageOneWay(
      origin,
      destination,
      airportCodes,
      "ONEWAY",
    );
    log.info("travel request created for oneway journey type");
    await driver.pause(2000);
    const flightRequestPageOneWay = new FlightRequestSearchPage(driver);

    await flightRequestPageOneWay.flightRequestSearchOneWay();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForFlight();

    await driver.pause(2000);
    // await homePage.logout();
  });

  it("ONEWAY -TRAVELLER ", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "ONEWAY") this.skip();
    this.timeout(900000);

    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);

    const homePage = new HomePage(driver);
    await driver.pause(2000);
    await homePage.login(data, "TRAVELLER");

    const createTravelRequestOneWay = new AddFlightPage(driver);

    await createTravelRequestOneWay.createTravelRequestAddFlightPageOneWay(
      origin,
      destination,
      airportCodes,
      "ONEWAY",
    );
    log.info("travel request created for oneway journey type");
    await driver.pause(2000);
    const flightRequestPageOneWay = new FlightRequestSearchPage(driver);

    await flightRequestPageOneWay.flightRequestSearchOneWay();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForFlight();

    await driver.pause(2000);
    // await homePage.logout();
  });

  it("ROUNDTRIP - COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "ROUNDTRIP") this.skip();
    this.timeout(900000);

    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);

    const homePage = new HomePage(driver);
    await driver.pause(2000);
    await homePage.login(data, "COMPANY_ADMIN");

    const createTravelRequestRoundTrip = new AddFlightPage(driver);

    await createTravelRequestRoundTrip.createTravelRequestAddFlightPageRoundTrip(
      origin,
      destination,
      airportCodes,
      "ROUNDTRIP",
    );

    log.info("travel request created for roundtrip journey type");
    await driver.pause(2000);

    const flightRequestPageRoundTrip = new FlightRequestSearchPage(driver);
    await flightRequestPageRoundTrip.flightRequestSearchRoundTrip();

    await driver.pause(2000);

    const requestSummaryRoundTrip = new RequestSummaryPage(driver);
    await requestSummaryRoundTrip.viewTravelRequestSummaryForFlight();

    await driver.pause(2000);
    // await homePage.logout();
  });
  it("ROUNDTRIP - TRAVELLER", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "ROUNDTRIP") this.skip();
    this.timeout(900000);

    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);

    const homePage = new HomePage(driver);
    await driver.pause(2000);
    await homePage.login(data, "TRAVELLER");

    const createTravelRequestRoundTrip = new AddFlightPage(driver);

    await createTravelRequestRoundTrip.createTravelRequestAddFlightPageRoundTrip(
      origin,
      destination,
      airportCodes,
      "ROUNDTRIP",
    );

    log.info("travel request created for roundtrip journey type");
    await driver.pause(2000);

    const flightRequestPageRoundTrip = new FlightRequestSearchPage(driver);
    await flightRequestPageRoundTrip.flightRequestSearchRoundTrip();

    await driver.pause(2000);

    const requestSummaryRoundTrip = new RequestSummaryPage(driver);
    await requestSummaryRoundTrip.viewTravelRequestSummaryForFlight();

    await driver.pause(2000);
    // await homePage.logout();
  });

  it("MULTICITY - COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "MULTICITY") this.skip();
    this.timeout(900000);

    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);

    const homePage = new HomePage(driver);
    await driver.pause(2000);
    await homePage.login(data, "COMPANY_ADMIN");

    const createTravelRequestMulticity = new AddFlightPage(driver);
    await createTravelRequestMulticity.createTravelRequestAddFlightPageMultiCity(
      origin,
      destination,
      airportCodes,
    );
    log.info("travel request created for multicity  journey type");
    await driver.pause(2000);
    const flightRequestPageMulticity = new FlightRequestSearchPage(driver);

    await flightRequestPageMulticity.flightRequestSearchMulticity();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForFlight();

    await driver.pause(2000);
    // await homePage.logout();
  });

  it("MULTICITY - TRAVELLER", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "MULTICITY") this.skip();
    this.timeout(900000);

    const { origin, destination } = getRandomDomesticAirports(data.airports!);
    const airportCodes = data.airports!.map((a) => a.airport);

    const homePage = new HomePage(driver);
    await driver.pause(2000);
    await homePage.login(data, "TRAVELLER");

    const createTravelRequestMulticity = new AddFlightPage(driver);
    await createTravelRequestMulticity.createTravelRequestAddFlightPageMultiCity(
      origin,
      destination,
      airportCodes,
    );
    log.info("travel request created for multicity  journey type");
    await driver.pause(2000);
    const flightRequestPageMulticity = new FlightRequestSearchPage(driver);

    await flightRequestPageMulticity.flightRequestSearchMulticity();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForFlight();

    await driver.pause(2000);
    // await homePage.logout();
  });
});
