import "mocha-allure-reporter";
import { remote, type Browser } from "webdriverio";
import { describe, it, before, after } from "mocha";
import allureReporter from "@wdio/allure-reporter";

import { loadTestData } from "../pages/util/flight/flight-util";
// import { login } from "../pages/cart/login/login-page";
// import { HomePage } from "../pages/home-page";

import { TestData } from "../pages/types/testdata";
import { TestsData } from "../pages/types/common/data-test";
import { loadBusTestData } from "../pages/util/bus/bus-util";
import { BusCancelPage } from "../pages/cart/bus-cancel-page";
import { HomePage } from "../pages/home-page";

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

    "appium:platformVersion": "15",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.catalyca.tcat.mobile",
    "appium:appActivity": "com.catalyca.tcat.mobile.MainActivity",
    "appium:app": "C:\\Users\\C1054\\Downloads\\app-release 21.apk",
    "appium:noReset": false,
    "appium:fullReset": false,
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:ensureWebviewsHavePages": true,
    "appium:nativeWebScreenshot": true,
    "appium:newCommandTimeout": 3600,
    "appium:connectHardwareKeyboard": true,
    "appium:clearSystemFiles": true,
    "appium:uiautomator2ServerLaunchTimeout": 120000,
    "appium:skipDeviceInitialization": false,
    "appium:skipServerInstallation": false,
  },
};

describe("TCAT Mobile App  Login & Bus Flow", function () {
  before(async function () {
    console.log(
      " 12122222212112121212121211212212212121212121212121212121212Setting up test environment…",
    );
    this.timeout(1500000);

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
      console.log(
        "  535365375354745375353535353563653653537475375Cleaning up test environment…",
      );
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
    console.log(
      " Starting test0000000000000000000000000000000000000000000000000000: BUS SEARCH -TRAVELLER",
    );
    await driver.pause(2000);
    const homePage = new HomePage(driver);
    await homePage.login(data, "TRAVELLER");
    console.log(
      "LOGIN SUCCESSFULLY FOR TRAVELLER111111111111111111111111111111111111111111111111111111111111111",
    );
    const busCancel = new BusCancelPage(driver, data, busData);
    console.log(
      "222222222222222222222222222222222222222222222222222222222222222222222222222222222222222BUS CANCEL PAGE OBJECT CREATED SUCCESSFULLY",
    );
    await busCancel.busCancelRequest();
    console.log("TRAVEL REQUEST CREATED FOR BUS CANCELLED SUCCESSFULLY");

    await driver.pause(5000);
  });
});
