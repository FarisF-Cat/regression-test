import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";

import { TestsData } from "../pages/types/common/data-test";
import { getRandomRoute } from "../util/common/cities-util";
import { loadRailTestData } from "../pages/util/rail/rail-util";
import { login } from "../pages/cart/login/login-page";
import { AddRailPage } from "../pages/cart/add-rail-page";
import { RailRequestSearchPage } from "../pages/cart/rail-request-page";
import { RequestSummaryPage } from "../pages/cart/request-summary-page";
import { HomePage } from "../pages/home-page";

let driver: Browser;
let data: TestData;
let railData: TestsData;

const opts = {
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:platformVersion": "15",
    "appium:platformVersion": "11",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 5.apk",
    "appium:noReset": true,
    "appium:fullReset": false,
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

describe("TCAT Mobile App  Login & Rail Flow", function () {
  before(async function () {
    this.timeout(800000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data RAIL…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing !");
    }
    console.log(" Loading RAIL DATA .............................");

    railData = await loadRailTestData();
    if (!railData?.routes?.length) {
      throw new Error("RAIL test‑data missing or empty!");
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

  it("RAIL SEARCH -COMPANY_ADMIN", async function () {
    this.timeout(2500000);

    const { origin, destination } = getRandomRoute(railData);
    const homePage = new HomePage(driver);
    await homePage.login();
    await homePage.login(data, "COMPANY_ADMIN");

    const railSearch = new AddRailPage(driver);
    await railSearch.railCreation(origin, destination);
    const railRequestPage = new RailRequestSearchPage(driver);

    await railRequestPage.railRequest();

    await driver.pause(2000);
    const requestSummaryRail = new RequestSummaryPage(driver);
    await requestSummaryRail.viewTravelRequestSummaryForTrain();

    await homePage.logout();
  });

  it("RAIL SEARCH -TRAVELLER", async function () {
    this.timeout(2500000);

    const { origin, destination } = getRandomRoute(railData);
    const homePage = new HomePage(driver);
    await driver.pause(2000);
    await homePage.login();
    await homePage.login(data, "TRAVELLER");

    const railSearch = new AddRailPage(driver);
    await railSearch.railCreation(origin, destination);
    const railRequestPage = new RailRequestSearchPage(driver);

    await railRequestPage.railRequest();

    await driver.pause(2000);
    const requestSummaryRail = new RequestSummaryPage(driver);
    await requestSummaryRail.viewTravelRequestSummaryForTrain();

    await homePage.logout();
  });
});
