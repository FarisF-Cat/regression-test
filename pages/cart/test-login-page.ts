export class TestLoginPage {
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
    console.log("HOME SCREEN FOUND");
  }

  async testLogin() {
    const driver = this.driver;

    console.log(
      "============================================================================================= LOGIN TEST STARTED ==========",
    );

    // 1. Enter Email
    console.log("\nSTEP 1: Entering email...");
    const email = this.inputEmail;

    await email.waitForDisplayed({ timeout: 20000 });
    await email.click();
    await driver.pause(300); // keyboard attach
    await email.clearValue();
    await email.setValue("admin.ibs@catalyca.com");
    
    const emailValue = await email.getText();
    console.log(" Email value:", emailValue);

    if (!emailValue.includes("@")) {
      throw new Error(" Email NOT entered correctly!");
    }
    console.log("✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓ Email entered");

    // 2. Enter Password
    console.log("\nSTEP 2: Entering password...");
    await this.inputPassword.waitForExist({ timeout: 30000 });
    await this.inputPassword.click();
    await driver.pause(500);
    await this.inputPassword.clearValue();
    await this.inputPassword.setValue("test");
    const pwdLength = await this.inputPassword.getAttribute("text");

    console.log("✓ Password entered");

    // 3. Hide keyboard
    console.log("\nSTEP 3: Hiding keyboard and waiting for validation...");
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
    console.log("\nSTEP 4: Clicking Login button...");
    await this.btnLogin.waitForExist({ timeout: 10000 });
    await this.btnLogin.click();
    console.log(
      "✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓ Login button clicked",
    );

    // 5. Wait for navigation
    console.log("\nSTEP 5: Waiting for next screen...");
    await this.waitForHomeScreen();
    console.log("DASHBOARD SCREEN DISPLAYED");
  }
}
