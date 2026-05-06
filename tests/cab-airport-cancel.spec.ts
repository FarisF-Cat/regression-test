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

    "appium:platformVersion": "15",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 18.apk",
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

  it("AIRPORT TRANSFER CAB -TRAVELLER", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "AIRPORTTRANSFER") this.skip();

    this.timeout(3000000);

    //  const homePage = new HomePage(driver);
    //  await homePage.login(data, "TRAVELLER");

    //  await driver.pause(2000);

    //  const routeCab = getRandomRoute(cabData);
    //  const airportCab = getRandomDomesticAirports(data.airports!);

    //  console.log("Generated Route CAB:", routeCab);
    //  console.log("Generated Airport CAB:", airportCab);

    //  const airportCodes = data.airports!.map((a) => a.airport);
    //  const addFlightPage = new AddFlightPage(driver);
    //  await addFlightPage.createTravelRequestAddFlightPageOneWay(
    //    airportCab.origin,
    //    airportCab.destination,
    //    airportCodes,
    //    "ONEWAY",
    //  );
    //  console.log(
    //    "Flight added from",
    //    airportCab.origin,
    //    "to",
    //    airportCab.destination,
    //  );
    //  const flightRequestPage = new FlightRequestSearchPage(driver);
    //  await flightRequestPage.flightRequestSearchOneWay();

    //  const cabSearchAirportCab = new AddCabPage(driver);

    //  console.log(
    //    "Creating AIRPORTTRANSFER CAB from",
    //    airportCab.origin,
    //    "to",
    //    airportCab.destination,
    //  );
    //  try {
    //    await cabSearchAirportCab.cabCreationAirportTransfer(cabData);
    //  } catch (error) {
    //    console.error("Error during AIRPORTTRANSFER CAB test:", error);
    //    throw error;
    //  }
    //  const cabRequestPage = new CabRequestSearchPage(driver);
    //  await cabRequestPage.cabRequestAirportTransferCab();
    //  const requestSummaryCab = new RequestSummaryPage(driver);
    //  await requestSummaryCab.viewTravelRequestSummaryForCab("AIRPORT_TRANSFER");
    const airportCabCancel = new AirportCabCancelPage(driver, data, cabData);

    await airportCabCancel.airportCabCancelRequest();
    console.log(
      "TRAVEL REQUEST CREATED FOR AIRPORT CAB CANCELLED SUCCESSFULLY",
    );
    await driver.pause(2000);
  });
});
