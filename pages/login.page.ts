class LoginPage {
  driver: WebdriverIO.Browser;
  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  get inputEmail() {
    return this.driver.$(
      'android=new UiSelector().className("android.widget.EditText").instance(0)',
    );
  }
  get inputPassword() {
    return this.driver.$(
      'android=new UiSelector().className("android.widget.EditText").instance(1)',
    );
  }
  get btnLogin() {
    return this.driver.$("~Login");
  }
  private async waitForHomeScreen() {
    const homeSelectors = [
      "~Home",
      'android=new UiSelector().description("Home")',
      '//android.view.View[@content-desc="Home"]',
      '//android.widget.BottomNavigationItemView[@content-desc="Home"]',
    ];
    for (const selector of homeSelectors) {
      const homeElement = await this.driver.$(selector);
      const found = await homeElement
        .waitForExist({ timeout: 12000 })
        .catch(() => false);
      if (found) {
        console.log(`HOME SCREEN FOUND WITH SELECTOR: ${selector}`);
        return;
      }
    }
    throw new Error(
      "Home screen not found after login (tried accessibility id, android UiSelector, and XPath fallbacks).",
    );
  }
  async testLogin() {
    const driver = this.driver;
    console.log("\nSTEP 1: Entering email...");
    await this.inputEmail.waitForExist({ timeout: 80000 });
    await this.inputEmail.click();
    await this.inputEmail.clearValue();
    await this.inputEmail.setValue("admin.ibs@catalyca.com");
    console.log("✓ Email entered");
    console.log("\nSTEP 2: Entering password...");
    await this.inputPassword.waitForExist({ timeout: 80000 });
    await this.inputPassword.click();
    await this.inputPassword.clearValue();
    await this.inputPassword.setValue("test");
    console.log("✓ Password entered");
    console.log("\nSTEP 3: Hiding keyboard and waiting for validation...");
    await driver.hideKeyboard();
    await driver.pause(2000);
    console.log("\nSTEP 4: Clicking Login button...");
    await this.btnLogin.waitForExist({ timeout: 80000 });
    await this.btnLogin.click();
    console.log("✓ Login button clicked");
    await driver.pause(6000);
    console.log("ENTERING INTO THE DASHBOARD SCREEN");

    await driver.waitUntil(
      async () => {
        try {
          return (await driver.$$(SEL_HOME)).length > 0;
        } catch {
          await driver.pause(2000);
          return false;
        }
      },
      { timeout: 40000, interval: 3000, timeoutMsg: "Home screen did not appear after login" }
    ).catch(async (err) => {
      const screenshot = await driver.takeScreenshot();
      require('fs').writeFileSync('./login-failure-screen.png', screenshot, 'base64');
      console.log("Screenshot saved to login-failure-screen.png");
      throw err;
    });

    console.log("Login successful");
  }
}
export default LoginPage;
