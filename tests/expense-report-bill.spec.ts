import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";

import { TestData } from "../pages/types/testdata";

import { ExpenseReportBill } from "../pages/cart/expense-report-bill-page";

// import { HomePage } from "../pages/home-page";

let driver: Browser;
let data: TestData;

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

describe("TCAT Mobile App  Login & View Request Tab ", function () {
  before(async function () {
    this.timeout(800000);

    allureReporter.addFeature("Login Feature");
    allureReporter.addSeverity("critical");

    console.log("  Loading test data RAIL…");
    data = await loadTestData();
    if (!data?.accounts?.length) {
      throw new Error(" Test data or accounts missing !");
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

  it("VIEW REQUEST TAB", async function () {
    this.timeout(2500000);

    // const homePage = new HomePage(driver);
    // await homePage.login(data, "COMPANY_ADMIN");
    const expenseReportBillPage = new ExpenseReportBill(driver);
    await expenseReportBillPage.expenseReportBillScreen();
    // await homePage.logout();
  });
});
