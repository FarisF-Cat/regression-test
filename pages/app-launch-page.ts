import logger from "@wdio/logger";
import Page from "./page";

const log = logger("AppLaunchPage");

/**
 * Getting the app from a cold launch to a usable login screen.
 *
 * The selectors below used to be written inline in the `before()` hook of
 * several specs; they belong to the app, not to the tests.
 */
export class AppLaunchPage extends Page {
  private static readonly ANR_WAIT_BUTTON = "#aerr_wait";

  private static readonly LOGIN_INPUT_FIELD =
    'android=new UiSelector().className("android.widget.EditText")';

  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  /**
   * Android's "app isn't responding" dialog sometimes appears on launch.
   * Dismisses it when present and reports whether it was there; absence is
   * normal and is not an error.
   */
  async dismissAnrPopupIfPresent(timeout = 3000): Promise<boolean> {
    try {
      await this.driver.waitUntil(
        async () =>
          (await this.findAll(AppLaunchPage.ANR_WAIT_BUTTON)).length > 0,
        { timeout, interval: 1000 },
      );
      await this.driver.$(AppLaunchPage.ANR_WAIT_BUTTON).click();
      log.info("anr popup dismissed");
      return true;
    } catch {
      // Not present — continue normally
      return false;
    }
  }

  /**
   * Wait until the login screen has rendered both of its input fields.
   */
  async waitForLoginScreen(timeout = 30000): Promise<void> {
    log.info("waiting for app to stabilize..");
    await this.driver.waitUntil(
      async () => {
        await this.driver.pause(3000);
        const fields = await this.findAll(AppLaunchPage.LOGIN_INPUT_FIELD);
        return fields.length >= 2;
      },
      {
        timeout,
        interval: 3000,
        timeoutMsg: "Login screen did not load properly",
      },
    );
  }
}
