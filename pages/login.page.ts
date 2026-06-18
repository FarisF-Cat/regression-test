//// CODE UPDATED WITH THE WEBDRIVER IO CONFIGURATION IMPORT ISSUE , SYNTAX SAME AS THAT OF THE PLAYWRIGHT CODE
// import { fetchUser } from "../util/common/account-data";
// import { TestsData } from "./types/common/data-test";

import Page from "./page";

class LoginPage extends Page {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    super();
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
    }

    throw new Error(
      "Home screen not found after login (tried accessibility id, android UiSelector, and XPath fallbacks).",
    );
  }

  async testLogin() {
    const driver = this.driver;

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
  }
}

export default LoginPage;
