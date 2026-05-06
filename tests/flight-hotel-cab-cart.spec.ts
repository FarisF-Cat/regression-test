import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";
import { getRandomRoute } from "../util/common/cities-util";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";

import { loadTestData } from "../pages/util/flight/flight-util";

import { getRandomDomesticAirports } from "../util/common/airport-util";
import { TestData } from "../pages/types/testdata";
import { loadHotelTestData } from "../pages/util/hotel/hotel-util";

import { loadCabTestData } from "../pages/util/cab/cab-util";

import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { TestsData } from "../pages/types/common/data-test";
// import { HomePage } from "../pages/home-page";
import { AddFlightHotelCabPage } from "../pages/cart/add-flight-hotel-cab-page";
import { HomePage } from "../pages/home-page";
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
    "appium:platformVersion": "15",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 21.apk",
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
    this.timeout(200000000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      console.log(
        "HOTEL  DATA ROUTES LENTH :",
        data?.accounts?.length ?? "UNDEFINED AIPORT DATA LENGTH "
      );

      throw new Error(" Test data or accounts missing!");
    }
    console.log(" Loading HOTEL DATA .............................");

    hotelData = await loadHotelTestData();
    if (!hotelData?.locationData?.length) {
      console.log(
        "HOTEL  DATA ROUTES LENTH :",
        hotelData?.locationData?.length ?? "UNDEFINED HOTEL  DATA LENGTH "
      );
      throw new Error("  Hotel test‑data missing or empty!");
    }

    console.log("Entering into CAB DETAIL SCREEN ");
    cabData = await loadCabTestData();
    console.log("  Loading CAB DATA .............................");
    if (!cabData?.routes?.length) {
      console.log(
        "CAB DATA ROUTES LENTH :",
        cabData?.routes?.length ?? "UNDEFINED CAB DATA LENGTH "
      );
      throw new Error("CAB test‑data EMPTY !");
    }

    // cabData = await loadCabTestData();
    // if (!cabData?.routes?.length) {
    //   throw new Error("  Cab test‑data missing or empty!");
    // }
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

  

  it("Flight Roundtrip + Hotel Booking + Cab", async function () {
    this.timeout(200000000);

    const homePage = new HomePage(driver);
          await homePage.login(data, "TRAVELLER");
    // const homePage = new HomePage(driver);
        await driver.pause(2000);
        console.log("LOGIN PROCESS STARTED for FLIGHT + HOTEL+CAB");
          //  await homePage.login(data, "COMPANY_ADMIN");
 
    const { origin: flightOrigin, destination: flightDestination } =
      getRandomDomesticAirports(data.airports!);

    
    if (!cabData?.routes?.length) {
      throw new Error("CAB routes are missing or empty!");
    }

    // Pick a random cab route
    const { origin: cabPickupCity, destination: cabDropCity } =
      getRandomRoute(cabData); // ✅ This ensures cab data comes from routes.json
    const airportCodes = data.airports!.map((a) => a.airport);

    console.log("CAB PICKUP CITY :", cabPickupCity);
    console.log("CAB DROP CITY   :", cabDropCity);

    const flightHotelCabSearch = new AddFlightHotelCabPage(driver,cabData);
await flightHotelCabSearch.createFlightHotelCab(
      cabPickupCity,
      flightOrigin,
      flightDestination,
      airportCodes
    );
    
      console.log(`🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕 Running for Cab Type: `);
const flightHotelCabSearchRequestSummary = new RequestSummaryPage(driver);
console.log("                                                                                                                                                             VIEWING REQUEST SUMMARY FOR FLIGHT + HOTEL + CAB ");
await flightHotelCabSearchRequestSummary.viewTravelRequestSummaryForFlightHotelCab(
    
    );
     
  });

  it("Flight Roundtrip + Hotel Booking + Cab", async function () {
    this.timeout(200000000);

    const homePage = new HomePage(driver);
          await homePage.login(data, "COMPANY_ADMIN");
    // const homePage = new HomePage(driver);
        await driver.pause(2000);
        console.log("LOGIN PROCESS STARTED for FLIGHT + HOTEL+CAB");
          //  await homePage.login(data, "COMPANY_ADMIN");
 
    const { origin: flightOrigin, destination: flightDestination } =
      getRandomDomesticAirports(data.airports!);

    
    if (!cabData?.routes?.length) {
      throw new Error("CAB routes are missing or empty!");
    }

    // Pick a random cab route
    const { origin: cabPickupCity, destination: cabDropCity } =
      getRandomRoute(cabData); // ✅ This ensures cab data comes from routes.json
    const airportCodes = data.airports!.map((a) => a.airport);

    console.log("CAB PICKUP CITY :", cabPickupCity);
    console.log("CAB DROP CITY   :", cabDropCity);

    const flightHotelCabSearch = new AddFlightHotelCabPage(driver,cabData);
await flightHotelCabSearch.createFlightHotelCab(
      cabPickupCity,
      flightOrigin,
      flightDestination,
      airportCodes
    );
    
      console.log(`🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕 Running for Cab Type: `);
const flightHotelCabSearchRequestSummary = new RequestSummaryPage(driver);
console.log("                                                                                                                                                             VIEWING REQUEST SUMMARY FOR FLIGHT + HOTEL + CAB ");
await flightHotelCabSearchRequestSummary.viewTravelRequestSummaryForFlightHotelCab(
    
    );
     
  });
});
