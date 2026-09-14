import logger from "@wdio/logger";

const log = logger("Page");

/**
 * Shared behaviour for every page object.
 *
 * The helpers below were previously re-implemented in individual page objects;
 * they live here so there is a single definition of each.
 */
export default class Page {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  /**
   * `driver.$$` resolved to a real array.
   *
   * In WebdriverIO v9 `$$` returns a ChainablePromiseArray whose `.length` is
   * itself a `Promise<number>`, so `(await driver.$$(sel)).length > 0` is
   * always false. `getElements()` is what actually yields a countable array.
   */
  protected async findAll(selector: string): Promise<WebdriverIO.ElementArray> {
    return this.driver.$$(selector).getElements();
  }

  /**
   * Poll for an element, returning `null` if it never turns up.
   */
  protected async probeElement(
    selector: string,
    attempts = 10,
    intervalMs = 1000,
  ): Promise<WebdriverIO.Element | null> {
    for (let i = 0; i < attempts; i++) {
      const els = await this.findAll(selector);
      if (els.length > 0) return els[0];
      log.info(`⏳ [probe] attempt ${i + 1}/${attempts}: ${selector}`);
      await this.driver.pause(intervalMs);
    }
    return null;
  }

  /**
   * Poll for a *displayed* element, throwing if it never turns up.
   */
  protected async probeVisibleElement(
    selector: string,
    attempts = 25,
    intervalMs = 1000,
  ): Promise<WebdriverIO.Element> {
    for (let i = 0; i < attempts; i++) {
      const els = await this.findAll(selector);
      if (els.length > 0) {
        const isDisplayed = await els[0].isDisplayed().catch(() => false);
        if (isDisplayed) return els[0];
      }
      await this.driver.pause(intervalMs);
    }
    throw new Error(`Element not found after ${attempts} attempts: ${selector}`);
  }

  /**
   * Swipe up until `selector` is displayed, or give up after `maxSwipes`.
   */
  protected async scrollUntilVisible(selector: string, maxSwipes = 8) {
    const driver = this.driver;
    const { height, width } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.9);
    const endY = Math.floor(height * 0.05);

    for (let swipe = 1; swipe <= maxSwipes; swipe++) {
      if (await driver.$(selector).isDisplayed()) {
        log.debug(`✅ found element after ${swipe - 1} swipe(s)`);
        return true;
      }

      log.info(`🔄 swipe #${swipe}`);
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 100 },
            { type: "pointerMove", duration: 1200, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
      await driver.pause(500);
    }

    log.warn(`⚠️ element not found after ${maxSwipes} swipes`);
    return false;
  }

  /**
   * Type a city into the location search box and pick the matching suggestion.
   */
  public async selectLocationOfStay(city: string): Promise<void> {
    const driver = this.driver;

    const searchInput = await this.probeElement(
      'android=new UiSelector().className("android.widget.EditText")',
      10,
      1000,
    );
    if (!searchInput) throw new Error("Location search input not found");
    await searchInput.clearValue();
    await searchInput.setValue(city);

    await driver.pause(2_000);

    const rows = await this.findAll(`//android.view.View[@content-desc]`);

    let match: WebdriverIO.Element | undefined;
    for (const el of rows) {
      const desc = (await el.getAttribute("content-desc")) ?? "";
      if (desc.toLowerCase().includes(city.toLowerCase())) {
        match = el;
        break;
      }
    }

    if (match) {
      await match.click();
    } else if (rows.length > 0) {
      await rows[0].click();
    } else {
      throw new Error(`No suggestion list appeared for "${city}".`);
    }

    await driver.pause(1_000);
  }

  /**
   * Open a date field's calendar, move to next month and pick a random day.
   * Returns the day that was chosen.
   *
   * `triggerSelector` is the date field to open — it is the only thing that
   * varied between the bus, rail and cab copies of this logic.
   */
  protected async selectDateFromCalendar(
    driver: WebdriverIO.Browser,
    triggerSelector: string,
    timeout = 2000,
  ): Promise<number> {
    const departureDate = await driver.$(triggerSelector);

    await departureDate.waitForExist({ timeout });
    await departureDate.click();

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
    );
    await nextMonthButton.click();

    const randomDate = Math.floor(Math.random() * 28) + 1;
    try {
      const dateElement = await driver.$(
        `//android.widget.Button[contains(@content-desc, "${randomDate}, ")]`,
      );
      await dateElement.waitForExist({ timeout: 20000 });
      await dateElement.click();
    } catch (error) {
      log.error(`error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }

  /**
   * Open the return-date calendar and pick a day after `departureDay`,
   * rolling into next month when needed.
   */
  protected async selectReturnDateAfter(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    log.info("SELECTING RETURN DATE...");

    const returnDate = await driver.$("~Return Date\nChoose Return Date");
    await returnDate.waitForExist({ timeout: 5000 });
    await returnDate.click();
    log.info("RETURN DATE ELEMENT CLICKED");
    await driver.pause(2000);

    // Choose a return day at least 1 day after departure
    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;
    log.info(`Selected return day: ${returnDay}`);

    // If returnDay > 28, go to next month and reset returnDay
    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      log.info("NEXT MONTH BUTTON FOUND");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      log.info("NEXT MONTH BUTTON CLICKED");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1; // pick 1-5 of next month
    }
    log.info(`FINAL RETURN DATE: ${returnDay}`);
    const returnDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    log.info("RETURN DATE ELEMENT FOUND FOR FINAL SELECTION");

    await returnDateElement.waitForExist({ timeout: 20000 });
    await returnDateElement.click();

    await driver.pause(2000);
  }
}
