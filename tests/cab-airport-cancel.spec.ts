import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";
// import { HomePage } from "../pages/home-page";
import { TestsData } from "../pages/types/common/data-test";
// import { getRandomRoute } from "../util/common/cities-util";
import { loadCabTestData } from "../pages/util/cab/cab-util";

import { AirportCabCancelPage } from "../pages/cart/cab-airport-cancel-page";
import logger from '@wdio/logger'
const log = logger('CabAirportCancel')


function normaliseCabTrip(
  raw?: string,
): "LOCALCAB" | "OUTSTATIONCAB" | "AIRPORTTRANSFER" | "" {
  return (raw ?? "").trim().toUpperCase() as any;
}

let driver: Browser;
let data: TestData;
let cabData: TestsData;

const TRIP_TYPE = normaliseCabTrip(process.env.TRIP_TYPE);

log.info("effective trip_type:", TRIP_TYPE || "(not set");

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
    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 5.apk",
    "appium:noReset": false,
    "appium:fullReset": true,
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

describe("TCAT Mobile App  Login & Cab Flow", function () {
  before(async function () {
    this.timeout(900000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    log.debug("  loading test data");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    log.debug(" loading hotel data ............................");

    cabData = await loadCabTestData();
    if (!cabData?.routes?.length) {
      throw new Error("CAB test‑data missing or empty!");
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

  /* ------------------ tests ------------------ */

  it("AIRPORT TRANSFER CAB -TRAVELLER", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "AIRPORTTRANSFER") this.skip();

    this.timeout(3000000);

    const homePage = new HomePage(driver);
    await homePage.login();

    await driver.pause(2000);

    //  const routeCab = getRandomRoute(cabData);
    //  const airportCab = getRandomDomesticAirports(data.airports!);

    //  log.info("generated route cab:", routeCab);
    //  log.info("generated airport cab:", airportCab);

    //  const airportCodes = data.airports!.map((a) => a.airport);
    //  const addFlightPage = new AddFlightPage(driver);
    //  await addFlightPage.createTravelRequestAddFlightPageOneWay(
    //    airportCab.origin,
    //    airportCab.destination,
    //    airportCodes,
    //    "ONEWAY",
    //  );
    //  log.debug(
    //    "flight added from",
    //    airportCab.origin,
    //    "to",
    //    airportCab.destination,
    //  );
    //  const flightRequestPage = new FlightRequestSearchPage(driver);
    //  await flightRequestPage.flightRequestSearchOneWay();

    //  const cabSearchAirportCab = new AddCabPage(driver);

    //  log.debug(
    //    "creating airporttransfer cab from",
    //    airportCab.origin,
    //    "to",
    //    airportCab.destination,
    //  );
    //  try {
    //    await cabSearchAirportCab.cabCreationAirportTransfer(cabData);
    //  } catch (error) {
    //    log.error("error during airporttransfer cab test:", error);
    //    throw error;
    //  }
    //  const cabRequestPage = new CabRequestSearchPage(driver);
    //  await cabRequestPage.cabRequestAirportTransferCab();
    //  const requestSummaryCab = new RequestSummaryPage(driver);
    //  await requestSummaryCab.viewTravelRequestSummaryForCab("airport_transfer");
    const airportCabCancel = new AirportCabCancelPage(driver, data, cabData);

    await airportCabCancel.airportCabCancelRequest();
    log.info(
      "travel request created for airport cab cancelled successfully",
    );
    await driver.pause(2000);
  ));
});
