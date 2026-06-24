import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";

import { loadTestData } from "../pages/util/flight/flight-util";
import { TestData } from "../pages/types/testdata";

import { HomePage } from "../pages/home-page";
import { FlightRoundTripCancelPage } from "../pages/cart/flight-roundtrip-cancel-page";
import logger from '@wdio/logger'
const log = logger('FlightRoundtripCancel')


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

describe("TCAT Mobile App  Login & Flight Flow", function () {
  before(async function () {
    this.timeout(350000);

    allure.feature
    allure.severity

    log.debug("  loading test data");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    log.debug(" loading hotel data ............................");

    log.info(" connecting to appium");
    driver = await remote(opts);
    allure.step("APP LAUNCHING SUCCESSFULLY");
  });

  after(async function () {
    if (driver?.sessionId) {
      try {
        log.info(" deleting session");
        await driver.deleteSession();
        allure.step("SESSION DELETED SUCCESSFULLY");
      } catch (err: any) {
        log.warn("error during session cleanup:", err.message || err);
      }
    }
  });

  /* ------------------ tests ------------------ */

  it("ROUNDTRIP - COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "ROUNDTRIP") this.skip();
    this.timeout(900000);

    await driver.pause(2000);

    const homePage = new HomePage(driver);
    await homePage.login();

    const flightCancel = new FlightRoundTripCancelPage(driver, data);

    await flightCancel.flightRoundTripCancelRequest();
    log.info(
      "travel request created for roundtrip journey type cancelled successfully",
   );
    await driver.pause(2000);

    await driver.pause(2000);
    // await homePage.logout();
  });
});
