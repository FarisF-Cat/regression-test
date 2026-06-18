import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";
// import { login } from "../pages/cart/login/login-page";
import { HomePage } from "../pages/home-page";

import { TestData } from "../pages/types/testdata";
import { TestsData } from "../pages/types/common/data-test";
import { getRandomRoute } from "../util/common/cities-util";
import { loadBusTestData } from "../pages/util/bus/bus-util";
import { AddBusPage } from "../pages/cart/add-bus-page";
import { BusRequestSearchPage } from "../pages/cart/bus-request-page";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";

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

describe("TCAT Mobile App  Login & Bus Flow", function () {
  before(async function () {
    this.timeout(800000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing!");
    }
    console.log(" Loading HOTEL DATA .............................");

    busData = await loadBusTestData();
    if (!busData?.routes?.length) {
      throw new Error("Bus test‑data missing or empty!");
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

  it("BUS SEARCH -TRAVELLER ", async function () {
    this.timeout(2500000);

    const { origin, destination } = getRandomRoute(busData);
    console.log("Generated Route for BUS :", { origin, destination });
    await driver.pause(2000);
    const homePage = new HomePage(driver);
    await driver.pause(2000);
    console.log(
      "222222222222222222222222222222222222222LOGIN PROCESS STARTED for BUS FLOW",
    );
    await homePage.login();
    await driver.pause(2000);
    console.log("LOGIN PROCESS STARTED for BUS FLOW");
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
    await homePage.login();

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
