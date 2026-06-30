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

import { OutstationCabCancelPage } from "../pages/cart/cab-outstationcab-cancel-page";
import logger from '@wdio/logger'
const log = logger('CabOutstationCancel')


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
  it("OUTSTATIONCAB -COMPANY_ADMIN", async function () {
    if (TRIP_TYPE && TRIP_TYPE !== "OUTSTATIONCAB") this.skip();

    this.timeout(900000);

    const { origin, destination } = getRandomRoute(cabData);
    log.info("generated route for outstation cab:", { origin, destination );
    const homePage = new HomePage(driver);

    await driver.pause(2000);
    await homePage.login();
    const outstationCabCancel = new OutstationCabCancelPage(
      driver,
      data,
      cabData,
    );

    await outstationCabCancel.outstationCabCancelRequest();
    log.info(
      "travel request created for outstation cab cancelled successfully",
   );

    await driver.pause(5000);
    // await homePage.logout();
  });
});
