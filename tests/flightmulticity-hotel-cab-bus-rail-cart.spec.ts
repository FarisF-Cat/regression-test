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
    "appium:noReset": true,
    "appium:fullReset": false,
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

    console.log("📦 Loading test data…");

    // ✅ Load airport test data (used across all modules)
    data = await loadTestData();
    if (!data?.accounts?.length) {
      console.log(
        "❌ AIRPORT DATA LENGTH:",
        data?.accounts?.length ?? "UNDEFINED AIRPORT DATA",
      );
      throw new Error("Test data or accounts missing!");
    }

    console.log("🏨 Loading HOTEL DATA...");
    hotelData = await loadHotelTestData();
    if (!hotelData?.locationData?.length) {
      console.log(
        "❌ HOTEL DATA LENGTH:",
        hotelData?.locationData?.length ?? "UNDEFINED HOTEL DATA",
      );
      throw new Error("Hotel test data missing or empty!");
    }

    console.log("🚌 Loading BUS DATA...");
    busData = await loadBusTestData();
    if (!busData?.routes?.length) {
      throw new Error("Bus test data missing or empty!");
    }

    console.log("🚕 Loading CAB DATA...");
    cabData = await loadCabTestData();
    if (!cabData?.routes?.length) {
      console.log(
        "❌ CAB DATA LENGTH:",
        cabData?.routes?.length ?? "UNDEFINED CAB DATA",
      );
      throw new Error("Cab test data missing or empty!");
    }

    console.log(
      "🚆 🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆 LOADING RAIL DATA ...🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆",
    );
    railData = await loadRailTestData();
    if (!railData?.routes?.length) {
      throw new Error(
        "🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆RAIL TEST DATA MISSING OR EMPTY🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆!",
      );
    }

    console.log("📱 Connecting to Appium...");
    driver = await remote(opts);
    allureReporter.addStep("✅ App launched successfully");
  });

  // ---------------------- AFTER HOOK ----------------------
  afterEach(async function () {
    this.timeout(10000);
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
  //   it("Flight MULTICITY + Hotel Booking + Cab + BUS + RAIL", async function () {
  //     this.timeout(2000000);

  //     // const role = "COMPANY_ADMIN"; // Uncomment if login required

  //     // ✈️ Flight data
  //     const { origin: flightOrigin, destination: flightDestination } =
  //       getRandomDomesticAirports(data.airports!);

  //     // 🚌 Bus data
  //     const { origin: busOrigin, destination: busDestination } =
  //       getRandomRoute(busData);
  //     console.log("🚌 Bus Origin:", busOrigin);
  //     console.log("🚌 Bus Destination:", busDestination);

  //     // 🚕 Airport Transfer Cab data
  //     const routeCab = getRandomRoute(cabData);
  //     console.log("Generated Route CAB:", routeCab);

  //     const airportCab = getRandomDomesticAirports(data.airports!);
  //     console.log("Generated Airport CAB:", airportCab);

  //     const airportCodes = data.airports!.map((a) => a.airport);

  //     // const homePage = new HomePage(driver);
  //     // await driver.pause(3000);
  //     // await homePage.login(data, role);

  //     // ---------------------------

  //     if (!cabData?.routes?.length) {
  //       throw new Error("CAB routes are missing or empty!");
  //     }

  //     const { origin: cabPickupCity, destination: cabDropCity } =
  //       getRandomRoute(cabData);

  //     console.log("Generated Route CAB:", routeCab);
  //     console.log(
  //       "Generated Airport CAB   12121212121212121221222222222222222222222222222222:",
  //       airportCab
  //     );
  //     console.log("✈️ Available Airport Codes:", airportCodes);
  //     console.log(
  //       "Creating AIRPORTTRANSFER CAB from",
  //       airportCab.origin,
  //       "to",
  //       airportCab.destination
  //     );

  //     console.log("🚖 CAB PICKUP CITY:", cabPickupCity);
  //     console.log("🏁 CAB DROP CITY  :", cabDropCity);

  //     // ---------------------------

  //     // ---------------------------
  //     // 🚆 Rail data (from rail.json)
  //     // ---------------------------
  //     // if (!railData?.routes?.length) {
  //     //   console.log("❌ RAIL DATA LENGTH:", railData?.routes?.length ?? "UNDEFINED RAIL DATA");
  //     //   throw new Error("RAIL routes are missing or empty!");
  //     // }

  //     // const { origin: railOrigin, destination: railDestination } = getRandomRoute(railData);
  //     // console.log("🚆 RAIL ORIGIN:", railOrigin);
  //     // console.log("🚆 RAIL DESTINATION:", railDestination);

  //     if (!railData?.routes?.length) {
  //       console.log(
  //         "❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌ RAIL DATA LENGTH❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌:",
  //         railData?.routes?.length ?? "UNDEFINED RAIL DATA"
  //       );
  //       throw new Error("RAIL routes are missing or empty!");
  //     }

  //     const { origin: railOrigin, destination: railDestination } =
  //       getRandomRoute(railData);

  //     console.log(
  //       "🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆 RAIL ORIGIN🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆:",
  //       railOrigin
  //     );
  //     console.log(
  //       "🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆 RAIL DESTINATION🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆🚆:",
  //       railDestination
  //     );

  //     // ---------------------------
  //     // 🧭 Initialize main flow
  //     // ---------------------------
  //     const flightHotelCabBusSearch = new FlightHotelCabBusRailSearchPage(driver);

  //     console.log(`
  // 🧭 ROUTE SUMMARY:
  // -----------------------------------
  // ✈️  FLIGHT: ${flightOrigin} ➡️ ${flightDestination}
  // 🚕  CAB: ${cabPickupCity} ➡️ ${cabDropCity}
  // 🚌  BUS: ${busOrigin} ➡️ ${busDestination}
  // 🚆  RAIL: ${railOrigin} ➡️ ${railDestination}
  // -----------------------------------
  //   `);

  //     allureReporter.addStep("🧭 Route summary prepared for all modules");

  //     // ---------------------------
  //     // 🚕 Run for both cab types (LOCAL, OUTSTATION)
  //     // ---------------------------
  //     const cabTypes = ["LOCALCAB", "OUTSTATIONCAB", "AIRPORTTRANSFER"];

  //     for (const cabType of cabTypes) {
  //       console.log(`🚗 Running for Cab Type: ${cabType}`);
  //       allureReporter.addStep(`🚗 Starting flow for Cab Type: ${cabType}`);

  //       try {
  //         // 🟢 Added airport transfer handling
  //         let pickupCity = cabPickupCity;
  //         let dropCity = cabDropCity;

  //         if (cabType === "AIRPORTTRANSFER") {
  //           pickupCity = airportCab.origin;
  //           dropCity = airportCab.destination;
  //           console.log(
  //             "✈️ Using Airport Transfer data:",
  //             pickupCity,
  //             "➡️",
  //             dropCity
  //           );
  //         }

  //         await flightHotelCabBusSearch.createTravelRequestFlightHotelCabAirportAndBus(
  //           pickupCity,
  //           flightOrigin,
  //           flightDestination,
  //           airportCodes,
  //           dropCity,
  //           cabType,
  //           busOrigin,
  //           busDestination,
  //           data, // ✔️ TestsData here
  //           railOrigin, // ✔️ now string matches expected
  //           railDestination
  //         );

  //         console.log(`✅ Successfully processed Cab Type: ${cabType}`);
  //         allureReporter.addStep(
  //           `✅ Successfully completed flow for Cab Type: ${cabType}`
  //         );

  //         console.log(`🛫 Flight Origin: ${flightOrigin}`);
  //         console.log(`🛬 Flight Destination: ${flightDestination}`);
  //         console.log(`🚖 Cab Pickup: ${pickupCity}`);
  //         console.log(`🏁 Cab Drop: ${dropCity}`);

  //         await driver.pause(2000);
  //       } catch (error) {
  //         console.error(`❌ Error during ${cabType} processing:`, error);
  //         allureReporter.addStep(`❌ Error during ${cabType} `);
  //         throw error;
  //       }
  //     }

  //     await driver.pause(2000);
  //   });

  it("Flight MULTICITY + Hotel Booking + Cab + BUS + RAIL", async function () {
    this.timeout(200000000);
    const homePage = new HomePage(driver);
    await driver.pause(2000);
    console.log("LOGIN PROCESS STARTED for FLIGHT + HOTEL");
    await homePage.login();
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
    console.log(
      "5555555555555555555555555555555555555555555555556666666666666666666666",
    );
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlighMulticitytHotelAirportCabBusRail();
  });

  it("Flight MULTICITY + Hotel Booking + Cab + BUS + RAIL", async function () {
    this.timeout(200000000);
    const homePage = new HomePage(driver);
    await driver.pause(2000);
    console.log("LOGIN PROCESS STARTED for FLIGHT + HOTEL");
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
    console.log(
      "5555555555555555555555555555555555555555555555556666666666666666666666",
    );
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlighMulticitytHotelAirportCabBusRail();
  });
});
