import { fetchUser } from "../util/common/account-data";
import { TestsData } from "./types/common/data-test";
import Page from "./page";
import logger from '@wdio/logger'
const log = logger('LoginPage')


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

  // NO getter properties — getters re-execute driver.$() on every access,
  // producing a fresh findElement command each time they are read.
  // Instead, elements are resolved once per login() call and reused.

  public async login(data: TestsData, role: string = "COMPANY_ADMIN") {
    const driver = this.driver;
    const user = fetchUser(data, role);
    if (!user) throw new Error(`User not found for role: ${role}`);

    log.info(`starting login with email: ${user.email}`);

    // Initial settle — app may still be animating on first launch
    await driver.pause(3000);

    // ── EMAIL ─────────────────────────────────────────────────────────────
    // Wait for field to exist using controlled polling — waitForExist has a
    // hidden tight retry loop (~100ms) that hammers UiAutomator2
    await driver.waitUntil(
      async () => (await driver.$$(SEL_EMAIL)).length > 0,
      { timeout: 30000, interval: 2000, timeoutMsg: "Email field did not appear" }
    );

    // Resolve once — reuse the same element reference for click + setValue
    const emailField = await driver.$(SEL_EMAIL);
    log.debug("email field found");
    await emailField.click();
    await driver.pause(500);
    await emailField.clearValue();
    await emailField.setValue(user.email!);
    log.info("email set");

    // Brief pause between fields — keyboard/focus transition
    await driver.pause(800);

    // ── PASSWORD ──────────────────────────────────────────────────────────
    await driver.waitUntil(
      async () => (await driver.$$(SEL_PASSWORD)).length > 0,
      { timeout: 15000, interval: 2000, timeoutMsg: "Password field did not appear" }
    );

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

    await driver.pause(500);
    log.info("password set");

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

    const loginBtn = await driver.$(SEL_LOGIN);
    await loginBtn.click();
    log.info("login button clicked");

    // ── POST-LOGIN LANDING ───────────────────────────────────────────────
    await driver.pause(6000);
    log.info("entering into the dashboard screen");

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
      log.info("screenshot saved to login-failure-screen.pn");
      throw err;
    });

    log.info("login successfu");
  }
}

export default LoginPage;
