import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import { allure } from "allure-js-commons";

import { loadTestData } from "../pages/util/flight/flight-util";
import { login } from "../pages/cart/login/login-page";
import { HomePage } from "../pages/home-page";

import { TestData } from "../pages/types/testdata";
import { TestsData } from "../pages/types/common/data-test";
import { getRandomRoute } from "../util/common/cities-util";
import { loadBusTestData } from "../pages/util/bus/bus-util";
import { AddBusPage } from "../pages/cart/add-bus-page";
import { BusRequestSearchPage } from "../pages/cart/bus-request-page";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";
import logger from '@wdio/logger'
const log = logger('BusCart')


let driver: Browser;
let data: TestData;
let busData: TestsData;

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

describe("TCAT Mobile App  Login & Bus Flow", function () {
  before(async function () {
    this.timeout(800000);

    allure.feature("Login Feature");
    allure.severity("critical");

    log.debug("  loading test data");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    log.debug(" loading hotel data ............................");

    busData = await loadBusTestData();
    if (!busData?.routes?.length) {
      throw new Error("Bus test‑data missing or empty!");
    }

    log.info(" connecting to appium");
    driver = await remote(opts);
    allure.step("APP LAUNCHING SUCCESSFULLY");
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
  this.timeout(15000);
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

  /* ------------------ tests ------------------ */

  it("BUS SEARCH -TRAVELLER ", async function () {
    this.timeout(2500000);

    const { origin, destination } = getRandomRoute(busData);
    log.info("generated route for bus :", { origin, destination );
    await driver.pause(2000);
    const homePage = new HomePage(driver);
    await driver.pause(6000);
    log.info(
      "222222222222222222222222222222222222222login process started for bus flow",
   );
    await homePage.login(data, "TRAVELLER");
    await driver.pause(2000);
    log.info("login process started for bus flo");
    const busSearch = new AddBusPage(driver);
    await busSearch.busCreation(origin, destination);

    const busRequestPage = new BusRequestSearchPage(driver);

    await busRequestPage.busRequest();

    await driver.pause(2000);
    const requestSummaryBus = new RequestSummaryPage(driver);
    await requestSummaryBus.viewTravelRequestSummaryForBus();

    // await homePage.logout();
  });

  it("BUS SEARCH -COMPANY_ADMIN ", async function () {
    this.timeout(2500000);

    const { origin, destination } = getRandomRoute(busData);
    await driver.pause(2000);
    const homePage = new HomePage(driver);
    await homePage.login(data, "COMPANY_ADMIN");

    const busSearch = new AddBusPage(driver);
    await busSearch.busCreation(origin, destination);

    const busRequestPage = new BusRequestSearchPage(driver);

    await busRequestPage.busRequest();

    await driver.pause(2000);
    const requestSummaryBus = new RequestSummaryPage(driver);
    await requestSummaryBus.viewTravelRequestSummaryForBus();

    await homePage.logout();
  });
});
