import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";
import { HomePage } from "../pages/home-page";
import { TestsData } from "../pages/types/common/data-test";
import { getRandomRoute } from "../util/common/cities-util";
import { loadCabTestData } from "../pages/util/cab/cab-util";
import { getRandomDomesticAirports } from "../util/common/airport-util";
import { AddCabPage } from "../pages/cart/add-cab-page";
import { CabRequestSearchPage } from "../pages/cart/cab-request-page";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";
// import { login } from "../pages/cart/login/login-page";
import { AddFlightPage } from "../pages/cart/add-flight-page";
import { FlightRequestSearchPage } from "../pages/cart/flight-request-page";

function normaliseCabTrip(
  raw?: string,
): "LOCALCAB" | "OUTSTATIONCAB" | "AIRPORTTRANSFER" | "" {
  return (raw ?? "").trim().toUpperCase() as any;
}

let driver: Browser;
let data: TestData;
let cabData: TestsData;

const TRIP_TYPE = normaliseCabTrip(process.env.TRIP_TYPE);

console.log("Effective TRIP_TYPE:", TRIP_TYPE || "(not set)");

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

describe("TCAT Mobile App  Login & Cab Flow", function () {
  before(async function () {
    this.timeout(900000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    console.log(" Loading HOTEL DATA .............................");

    cabData = await loadCabTestData();
    if (!cabData?.routes?.length) {
      throw new Error("CAB test‑data missing or empty!");
    }

    console.log(" Connecting to Appium…");
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
        console.log("✅ App restarted for fresh test run");
      } catch (err: any) {
        console.warn("⚠️ App restart failed:", err.message);
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
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
      } catch (err: any) {
        console.warn("⚠️ Could not take screenshot:", err.message);
      }
    }
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        console.log(" Deleting session…");
        await driver.deleteSession();
        allureReporter.addStep("SESSION DELETED");
      } catch (err: any) {
        console.warn("Error during session cleanup:", err.message || err);
      }
    }
  });

  /* ------------------ tests ------------------ */

  it("LOCALCAB -TRAVELLER", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "LOCALCAB") this.skip();

    this.timeout(500000);

    // const role = "TRAVELLER";
    const { origin, destination } = getRandomRoute(cabData);
    console.log("Generated Route for LOCAL CAB:", { origin, destination });
    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login();
    await homePage.login(data, "TRAVELLER");

    const cabSearch = new AddCabPage(driver);
    console.log("Starting LOCAL CAB test...");

    try {
      await cabSearch.cabCreationLocalCab(origin, "LOCALCAB");
      console.log("LOCAL CAB test completed successfully");
    } catch (error) {
      console.error("Error during LOCAL CAB test:", error);
      throw error;
    }

    const cabRequestPage = new CabRequestSearchPage(driver);

    await cabRequestPage.cabRequest();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForCab("LOCAL");

    await driver.pause(5000);
    // await homePage.logout();
  });
  it("LOCALCAB -COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "LOCALCAB") this.skip();

    this.timeout(500000);

    // const role = "COMPANY_ADMIN";
    const { origin, destination } = getRandomRoute(cabData);
    console.log("Generated Route for LOCAL CAB:", { origin, destination });
    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login();
    await homePage.login(data, "COMPANY_ADMIN");

    const cabSearch = new AddCabPage(driver);

    try {
      await cabSearch.cabCreationLocalCab(origin, "LOCALCAB");
      console.log("LOCAL CAB test completed successfully");
    } catch (error) {
      console.error("Error during LOCAL CAB test:", error);
      throw error;
    }

    const cabRequestPage = new CabRequestSearchPage(driver);

    await cabRequestPage.cabRequest();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForCab("LOCAL");

    await driver.pause(5000);
    // await homePage.logout();
  });

  it("OUTSTATIONCAB -COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "OUTSTATIONCAB") this.skip();

    this.timeout(900000);

    // const role = "COMPANY_ADMIN";
    const { origin, destination } = getRandomRoute(cabData);
    console.log("Generated Route for OUTSTATION CAB:", { origin, destination });

    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login();
    await homePage.login(data, "COMPANY_ADMIN");

    const cabSearch = new AddCabPage(driver);
    console.log("Creating OUTSTATION CAB from", origin, "to", destination);
    try {
      await cabSearch.cabCreationOutstation(origin, destination);
      console.log("OUTSTATION CAB test completed successfully");
    } catch (error) {
      console.error("Error during OUTSTATION CAB test:", error);
      throw error;
    }

    const cabRequestPage = new CabRequestSearchPage(driver);

    await cabRequestPage.cabRequestOutstationCab();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);
    await requestSummaryOneWay.viewTravelRequestSummaryForCab("OUTSTATION");

    await driver.pause(5000);

    // await homePage.logout();
  });

  it("OUTSTATION CAB -TRAVELLER", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "OUTSTATIONCAB") this.skip();

    this.timeout(900000);

    // const role = "TRAVELLER";
    const { origin, destination } = getRandomRoute(cabData);
    console.log("Generated Route for OUTSTATION CAB:", { origin, destination });

    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login();
    await homePage.login(data, "TRAVELLER");

    const cabSearch = new AddCabPage(driver);
    console.log("Creating OUTSTATION CAB from", origin, "to", destination);
    try {
      await cabSearch.cabCreationOutstation(origin, destination);
      console.log("OUTSTATION CAB test completed successfully");
    } catch (error) {
      console.error("Error during OUTSTATION CAB test:", error);
      throw error;
    }

    const cabRequestPage = new CabRequestSearchPage(driver);

    await cabRequestPage.cabRequestOutstationCab();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForCab("OUTSTATION");

    await driver.pause(5000);

    // await homePage.logout();
  });

  it("AIRPORT TRANSFER CAB -COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "AIRPORTTRANSFER") this.skip();

    this.timeout(9000000);

    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login();
    await homePage.login(data, "COMPANY_ADMIN");

    const routeCab = getRandomRoute(cabData);
    const airportCab = getRandomDomesticAirports(data.airports!);

    console.log("Generated Route CAB:", routeCab);
    console.log("Generated Airport CAB:", airportCab);

    const airportCodes = data.airports!.map((a) => a.airport);
    const addFlightPage = new AddFlightPage(driver);
    await addFlightPage.createTravelRequestAddFlightPageOneWay(
      airportCab.origin,
      airportCab.destination,
      airportCodes,
      "ONEWAY",
    );
    console.log(
      "Flight added from",
      airportCab.origin,
      "to",
      airportCab.destination,
    );
    const flightRequestPage = new FlightRequestSearchPage(driver);
    await flightRequestPage.flightRequestSearchOneWay();

    const cabSearchAirportCab = new AddCabPage(driver);
    console.log(
      "Creating AIRPORTTRANSFER CAB from",
      airportCab.origin,
      "to",
      airportCab.destination,
    );
    try {
      await cabSearchAirportCab.cabCreationAirportTransfer();
    } catch (error) {
      console.error("Error during AIRPORTTRANSFER CAB test:", error);
      throw error;
    }
    const cabRequestPage = new CabRequestSearchPage(driver);
    await cabRequestPage.cabRequestAirportTransferCab();
    const requestSummaryCab = new RequestSummaryPage(driver);
    await requestSummaryCab.viewTravelRequestSummaryForCab("AIRPORT_TRANSFER");

    await driver.pause(2000);
    // await homePage.logout();
  });
  it("AIRPORT TRANSFER CAB -TRAVELLER", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "AIRPORTTRANSFER") this.skip();

    this.timeout(3000000);

    const homePage = new HomePage(driver);
    await homePage.login();
    await homePage.login(data, "TRAVELLER");

    await driver.pause(2000);

    const routeCab = getRandomRoute(cabData);
    const airportCab = getRandomDomesticAirports(data.airports!);

    console.log("Generated Route CAB:", routeCab);
    console.log("Generated Airport CAB:", airportCab);

    const airportCodes = data.airports!.map((a) => a.airport);
    const addFlightPage = new AddFlightPage(driver);
    await addFlightPage.createTravelRequestAddFlightPageOneWay(
      airportCab.origin,
      airportCab.destination,
      airportCodes,
      "ONEWAY",
    );
    console.log(
      "Flight added from",
      airportCab.origin,
      "to",
      airportCab.destination,
    );
    const flightRequestPage = new FlightRequestSearchPage(driver);
    await flightRequestPage.flightRequestSearchOneWay();

    const cabSearchAirportCab = new AddCabPage(driver);

    console.log(
      "Creating AIRPORTTRANSFER CAB from",
      airportCab.origin,
      "to",
      airportCab.destination,
    );
    try {
      await cabSearchAirportCab.cabCreationAirportTransfer();
    } catch (error) {
      console.error("Error during AIRPORTTRANSFER CAB test:", error);
      throw error;
    }
    const cabRequestPage = new CabRequestSearchPage(driver);
    await cabRequestPage.cabRequestAirportTransferCab();
    const requestSummaryCab = new RequestSummaryPage(driver);
    await requestSummaryCab.viewTravelRequestSummaryForCab("AIRPORT_TRANSFER");

    await driver.pause(2000);
  });
});
