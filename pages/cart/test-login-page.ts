import logger from '@wdio/logger'
const log = logger('TestLoginPage')

﻿export class TestLoginPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  // Email input field
  get inputEmail() {
    return this.driver.$(
      'android=new UiSelector().className("android.widget.EditText").instance(0)'
    );
  }

  // Password input field
  get inputPassword() {
    return this.driver.$(
      'android=new UiSelector().className("android.widget.EditText").instance(1)'
    );
  }

  // Login button
  get btnLogin() {
    return this.driver.$('android=new UiSelector().description("Login")');
  }

  private async waitForHomeScreen() {
    await this.driver.$("~Home").waitForDisplayed({ 
      timeout: 15000,
      interval: 2000  // poll less aggressively
    });
    log.debug("home screen found");
  }

  async testLogin() {
    const driver = this.driver;

    log.info(
      "================================================================================================================================================================================================================================================================================================== login test started ==========",
   );

    // 1. Enter Email
    log.info("\nstep 1: entering email..");
    const email = this.inputEmail;

    await email.waitForDisplayed({ timeout: 20000 });
    await email.click();
    await driver.pause(300); // keyboard attach
    await email.clearValue();
    await email.setValue("admin.ibs@catalyca.com");
    
    const emailValue = await email.getText();
    log.info(" email value:", emailValue);

    if (!emailValue.includes("@")) {
      throw new Error(" Email NOT entered correctly!");
    }
    log.info("✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓ email entered");

    // 2. Enter Password
    log.info("\nstep 2: entering password..");
    await this.inputPassword.waitForExist({ timeout: 30000 });
    await this.inputPassword.click();
    await driver.pause(500);
    await this.inputPassword.clearValue();
    await this.inputPassword.setValue("test");
    const pwdLength = await this.inputPassword.getAttribute("text");

    log.info("✓ password entered");

    // 3. Hide keyboard
    log.info("\nstep 3: hiding keyboard and waiting for validation..");
    const { height, width } = await driver.getWindowRect();
    await driver.performActions([{
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: Math.floor(width / 2), y: Math.floor(height * 0.15) },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 100 },
        { type: "pointerUp", button: 0 },
      ],
    }]);
    await driver.releaseActions();

    await driver.pause(5000);

    // 4. Click Login Button
    log.info("\nstep 4: clicking login button..");
    await this.btnLogin.waitForExist({ timeout: 10000 });
    await this.btnLogin.click();
    log.info(
      "✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓ login button clicked",
   );

    // 5. Wait for navigation
    log.info("\nstep 5: waiting for next screen..");
    await this.waitForHomeScreen();
    log.info("dashboard screen displayed");
  }
}
