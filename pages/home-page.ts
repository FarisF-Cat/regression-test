import allureReporter from "@wdio/allure-reporter";
import assert from "assert";
import LoginPage from "./login.page";
// import { TestData } from "./types/testdata";
import { TestData } from "./types/testdata";

export class HomePage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async login() {
    // data: TestData, role: string = "TRAVELLER"
    // console.log(`LOGGING IN WITH ROLE:
    //   // ${role}`
    // );
  /**
   * Login entry point exposed from HomePage
   * Internally delegates login actions to LoginPage
   */
  async login(data: TestData, role: string = "TRAVELLER") {
    console.log(`LOGGING IN WITH ROLE: ${role}`);
    const loginPage = new LoginPage(this.driver);
    await loginPage.testLogin();
    // await loginPage.login(data, role);
    await loginPage.login(data, role);
  }

  async logout() {
    try {
      console.log("Attempting to log out...");

      const menuButton = await this.driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.Button").instance(0)',
        '-android uiautomator:new UiSelector().className("android.widget.Button").instance(0)'
      );
      await menuButton.waitForExist({ timeout: 15000 });
      await menuButton.click();
      allureReporter.addStep("HAMBURGER MENU CLICKED");

      const logoutButton = await this.driver.$("~Logout");
      await logoutButton.waitForExist({ timeout: 10000 });
      await logoutButton.click();
      allureReporter.addStep("LOGOUT BUTTON CLICKED");

      const emailField = await this.driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(0)',
        '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(0)'
      );
      await emailField.waitForExist({ timeout: 20000 });
      allureReporter.addStep("Login screen appeared");
    } catch (error) {
      console.log(" ERROR LOGGING OUT:", error);
      assert.fail("LOGOUT FAILED");
    }
  }
}
