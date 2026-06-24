import { allure } from "allure-js-commons";
import assert from "assert";
import LoginPage from "./login.page";
import { TestData } from "./types/testdata";
import logger from '@wdio/logger'
const log = logger('HomePage')


export class HomePage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async login(data: TestData, role: string = "TRAVELLER") {
    log.info(`logging in with role: ${role}`);
    const loginPage = new LoginPage(this.driver);
    await loginPage.login(data, role);
  }

  async logout() {
    try {
      log.info("attempting to log out..");

      const menuButton = await this.driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.Button").instance(0)'
      );
      await menuButton.waitForExist({ timeout: 15000 });
      await menuButton.click();
      allure.step("HAMBURGER MENU CLICKED");

      const logoutButton = await this.driver.$("~Logout");
      await logoutButton.waitForExist({ timeout: 10000 });
      await logoutButton.click();
      allure.step("LOGOUT BUTTON CLICKED");

      const emailField = await this.driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(0)'
      );
      await emailField.waitForExist({ timeout: 20000 });
      allure.stepeen appeared");
    } catch (error) {
      log.info(" error logging out:", error);
      assert.fail("LOGOUT FAILED");
    }
  }
}
