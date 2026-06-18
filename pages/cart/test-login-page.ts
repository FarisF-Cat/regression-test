export class TestLoginPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  // Email input field
  get inputEmail() {
    return this.driver.$(
      'android=new UiSelector().className("android.widget.EditText").instance(0)',
    );
  }

  // Password input field
  get inputPassword() {
    return this.driver.$(
      'android=new UiSelector().className("android.widget.EditText").instance(1)',
    );
  }

  // Login button
  get btnLogin() {
    return this.driver.$('android=new UiSelector().description("Login")');
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

    console.log(
      "================================================================================================================================================================================================================================================================================================== LOGIN TEST STARTED ==========",
    );

    // 1. Enter Email
    console.log("\nSTEP 1: Entering email...");
    await this.inputEmail.waitForExist({ timeout: 30000 });
    await this.inputEmail.click();
    await this.inputEmail.clearValue();
    await this.inputEmail.setValue("admin.ibs@catalyca.com");
    console.log("✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓ Email entered");

    // 2. Enter Password
    console.log("\nSTEP 2: Entering password...");
    await this.inputPassword.waitForExist({ timeout: 30000 });
    await this.inputPassword.click();
    await this.inputPassword.clearValue();
    await this.inputPassword.setValue("test");
    console.log("✓ Password entered");

    // 3. Hide keyboard
    console.log("\nSTEP 3: Hiding keyboard and waiting for validation...");
    await driver.hideKeyboard();
    await driver.pause(2000);

    // 4. Click Login Button
    console.log("\nSTEP 4: Clicking Login button...");
    await this.btnLogin.waitForExist({ timeout: 10000 });
    await this.btnLogin.click();
    console.log(
      "✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓ Login button clicked",
    );
    await driver.pause(3000);
    await this.waitForHomeScreen();
    console.log("DASHBOARD SCREEN DISPLAYED");
  }
}
