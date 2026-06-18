//// CODE UPDATED WITH THE WEBDRIVER IO CONFIGURATION IMPORT ISSUE , SYNTAX SAME AS THAT OF THE PLAYWRIGHT CODE
// import { fetchUser } from "../util/common/account-data";
// import { TestsData } from "./types/common/data-test";

import { fetchUser } from "../util/common/account-data";
import { TestsData } from "./types/common/data-test";
import Page from "./page";

// Selectors defined once as constants — never repeated inline
const SEL_EMAIL    = 'android=new UiSelector().className("android.widget.EditText").instance(0)';
const SEL_PASSWORD = 'android=new UiSelector().className("android.widget.EditText").instance(1)';
const SEL_LOGIN    = '~Login';
const SEL_HOME     = 'android=new UiSelector().description("Home")';

class LoginPage extends Page {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    super();
    this.driver = driver;
  }

  get inputEmail() {
    return this.driver.$(
      'android=new UiSelector().className("android.widget.EditText").instance(0)',
  // NO getter properties — getters re-execute driver.$() on every access,
  // producing a fresh findElement command each time they are read.
  // Instead, elements are resolved once per login() call and reused.

  public async login(data: TestsData, role: string = "COMPANY_ADMIN") {
    const driver = this.driver;
    const user = fetchUser(data, role);
    if (!user) throw new Error(`User not found for role: ${role}`);

    console.log(`STARTING LOGIN WITH EMAIL: ${user.email}`);

    // Initial settle — app may still be animating on first launch
    await driver.pause(3000);

    // ── EMAIL ─────────────────────────────────────────────────────────────
    // Wait for field to exist using controlled polling — waitForExist has a
    // hidden tight retry loop (~100ms) that hammers UiAutomator2
    await driver.waitUntil(
      async () => (await driver.$$(SEL_EMAIL)).length > 0,
      { timeout: 30000, interval: 2000, timeoutMsg: "Email field did not appear" }
    );
  }

  get inputPassword() {
    return this.driver.$(
      'android=new UiSelector().className("android.widget.EditText").instance(1)',
    // Resolve once — reuse the same element reference for click + setValue
    const emailField = await driver.$(SEL_EMAIL);
    console.log("EMAIL FIELD FOUND");
    await emailField.click();
    await driver.pause(500);
    await emailField.clearValue();
    await emailField.setValue(user.email!);
    console.log("EMAIL SET");

    // Brief pause between fields — keyboard/focus transition
    await driver.pause(800);

    // ── PASSWORD ──────────────────────────────────────────────────────────
    await driver.waitUntil(
      async () => (await driver.$$(SEL_PASSWORD)).length > 0,
      { timeout: 15000, interval: 2000, timeoutMsg: "Password field did not appear" }
    );
  }

  get btnLogin() {
    return this.driver.$("~Login");
  }
  // get nextScreenElement() {
  //   return this.driver.$(
  //     '-android uiautomator:new UiSelector().description("Home")',
  //   );
  // }

  // private async waitForPostLoginLanding(): Promise<void> {
  //   const landingSelectors = [
  //     "~Home",
  //     'android=new UiSelector().description("Home")',
  //     '//android.view.View[@content-desc="Home"]',
  //     '//android.widget.BottomNavigationItemView[@content-desc="Home"]',
  //     // "~Book your travel",
  //     // 'android=new UiSelector().description("Book your travel")',
  //     // "~Home",
  //     // 'android=new UiSelector().description("Home")',
  //     // '//android.view.View[@content-desc="Book your travel"]',
  //     // '//android.view.View[@content-desc="Home"]',
  //   ];

  //   for (const selector of landingSelectors) {
  //     console.log(
  //       "11111111111111111111111111111111111111111111111111111111111111111111",
  //     );
  //     const element = await this.driver.$(selector);
  //     const exists = await element
  //       .waitForExist({ timeout: 10000 })
  //       .catch(() => false);

  //     if (exists) {
  //       console.log(`POST LOGIN LANDING ELEMENT FOUND WITH: ${selector}`);
  //       return;
  //     }
  //   }

  //   throw new Error(
  //     'Login succeeded, but neither "Book your travel" nor "Home" landing element was found.',
  //   );
  // }

  // public async login(data: TestsData, role: string = "COMPANY_ADMIN") {
  //   const user = fetchUser(data, role);
  //   if (!user) throw new Error(`User not found for role: ${role}`);

  //   console.log(`STARTING LOGIN WITH EMAIL: ${user.email}`);

  //   await this.driver.pause(2000);

  //   await this.inputEmail.waitForExist({ timeout: 30000 });
  //   console.log("EMAIL FIELD WILL BE CLICKED");
  //   await this.inputEmail.click();
  //   await this.inputEmail.setValue(user.email!);
  //   console.log("EMAIL SET");

  //   await this.inputPassword.waitForExist({ timeout: 30000 });
  //   await this.inputPassword.click();
  //   await this.inputPassword.setValue(user.password);
  //   console.log("PASSWORD SET");

  //   await this.driver.hideKeyboard();

  //   await this.btnLogin.waitForExist({ timeout: 10000 });
  //   await this.btnLogin.click();

  //   await this.waitForPostLoginLanding();
  //   console.log(" Login successful");
  // }
  // public async login(data: TestsData, role: string = "COMPANY_ADMIN") {
  //   const user = fetchUser(data, role);
  //   if (!user) throw new Error(`User not found for role: ${role}`);

  //   console.log(`STARTING LOGIN WITH EMAIL: ${user.email}`);

  //   await this.driver.pause(2000);

  //   await this.inputEmail.waitForExist({ timeout: 30000 });
  //   console.log("EMAIL FIELD WILL BE CLICKED");
  //   await this.inputEmail.click();
  //   await this.inputEmail.setValue(user.email!);
  //   console.log("EMAIL SET");

  //   await this.inputPassword.waitForExist({ timeout: 30000 });
  //   await this.inputPassword.click();
  //   await this.inputPassword.setValue(user.password);
  //   console.log("PASSWORD SET");

  //   await this.driver.hideKeyboard();

  //   await this.btnLogin.waitForExist({ timeout: 50000 });
  //   await this.btnLogin.click();
  //   await this.driver.pause(5000);
  //   console.log("ENTERING INTO THE DASHBOARD SCREEN");
  //   await this.nextScreenElement.waitForExist({ timeout: 100000 });
  //   console.log(" Login successful");
  // }

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
    const passwordField = await driver.$(SEL_PASSWORD);
    await passwordField.click();
    await driver.pause(500);
    await passwordField.clearValue();
    await passwordField.setValue(user.password);
    const pwdCheck = await passwordField.getAttribute("text");
    if (!pwdCheck || pwdCheck.length === 0) {
     await passwordField.click();
     await driver.pause(300);
     await passwordField.setValue(user.password);
    }

    throw new Error(
      "Home screen not found after login (tried accessibility id, android UiSelector, and XPath fallbacks).",
    await driver.pause(500);
    console.log("PASSWORD SET");

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

    // Login button — guarded waitUntil in case accessibility tree is still
    // rebuilding after the keyboard dismiss transition
    await driver.waitUntil(
      async () => {
        try {
          return (await driver.$$(SEL_LOGIN)).length > 0;
        } catch {
          await driver.pause(2000);
          return false;
        }
      },
      { timeout: 15000, interval: 2000, timeoutMsg: "Login button did not appear" }
    );
  }

  async testLogin() {
    const driver = this.driver;
    const loginBtn = await driver.$(SEL_LOGIN);
    await loginBtn.click();
    console.log("LOGIN BUTTON CLICKED");

    // 1. Enter Email
    console.log("\nSTEP 1: Entering email...");
    await this.inputEmail.waitForExist({ timeout: 80000 });
    await this.inputEmail.click();
    await this.inputEmail.clearValue();
    await this.inputEmail.setValue("admin.ibs@catalyca.com");
    console.log("✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓ Email entered");

    // 2. Enter Password
    console.log("\nSTEP 2: Entering password...");
    await this.inputPassword.waitForExist({ timeout: 80000 });
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
    await this.btnLogin.waitForExist({ timeout: 80000 });
    await this.btnLogin.click();
    console.log(
      "✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓ Login button clicked",
    );
    await driver.pause(6000);
    await this.waitForHomeScreen();
    console.log("DASHBOARD SCREEN DISPLAYED");
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
