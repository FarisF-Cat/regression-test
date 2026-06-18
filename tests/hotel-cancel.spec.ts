import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";

import { loadHotelTestData } from "../pages/util/hotel/hotel-util";
import { HotelTestData } from "../pages/types/common/hotel-test-data";
import { TestsData } from "../pages/types/common/data-test";
import { HotelCancelPage } from "../pages/cart/hotel-cancel-page";

let driver: Browser;
let data: TestsData;
let hotelData: HotelTestData;

const opts = {
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
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

describe("TCAT Mobile App  Login & Hotel Flow", function () {
  before(async function () {
    this.timeout(350000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }

    console.log(" Loading HOTEL DATA .............................");
    hotelData = await loadHotelTestData();
    if (!hotelData?.locationData?.length) {
      throw new Error("Hotel test‑data missing or empty!");
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

  it("HOTEL SEARCH - COMPANY_ADMIN", async function () {
    this.timeout(2500000);

    // const { city } = getRandomDomesticCity(data);
    // console.log("Generated Route for HOTEL :", { city });

    await homePage.login();
    // await homePage.login(data, "COMPANY_ADMIN");
    const hotelCancel = new HotelCancelPage(driver, data);

    await hotelCancel.hotelCancelRequest();
    console.log("TRAVEL REQUEST CREATED FOR HOTEL  CANCELLED SUCCESSFULLY");

    await driver.pause(2000);
    // await homePage.logout();
  });
});
