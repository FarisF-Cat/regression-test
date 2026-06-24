import logger from '@wdio/logger'
const log = logger('AddHotelPage')

export class AddHotelPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  private async probeElement(
    selector: string,
    attempts = 10,
    intervalMs = 3000,
  ): Promise<WebdriverIO.Element | null> {
    for (let i = 0; i < attempts; i++) {
      const els = await this.driver.$$(selector);
      if (els.length > 0) return els[0];
      log.info(`⏳ [probe] attempt ${i + 1}/${attempts}: ${selector}`);
      await this.driver.pause(intervalMs);
    }
    return null;
  }

  async selectLocationOfStay(city: string): Promise<void> {
    const driver = this.driver;

    const searchInput = await this.probeElement(
      'android=new UiSelector().className("android.widget.EditText")',
      10,
      1000,
    );
    if (!searchInput) throw new Error("❌ Location search input not found");
    await searchInput.clearValue();
    await searchInput.setValue(city);
    await driver.pause(2000);

    const rows = await driver.$$(`//android.view.View[@content-desc]`);
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
    await driver.pause(1000);
  }

  async createHotel(city: string) {
    const driver = this.driver;
    await driver.pause(5500);
    log.info("hotel creation started");
    await driver.pause(8000);

    const hotelIcon = await this.probeElement(
      'android=new UiSelector().descriptionContains("Hotel")',
      20,
      1000,
    );
    if (!hotelIcon) throw new Error("❌ Hotel icon not found");
    await hotelIcon.click();
    log.info("✅ clicked on hotel icon");

    // Hotel Booking screen
    const hotelBookingScreen = await this.probeElement(
      '-android uiautomator:new UiSelector().description("Hotel Booking")',
      15,
      1000,
    );
    if (!hotelBookingScreen) throw new Error("❌ Hotel Booking screen not found");
    log.info("✅ navigated to hotel booking screen");

    // Location of Stay
    log.debug("clicking on location of sta");
    const locationField = await this.probeElement(
      '//android.view.View[contains(@content-desc, "Choose Location of Stay")]',
      10,
      1000,
    );
    if (!locationField) throw new Error("❌ Choose Location of Stay not found");
    await locationField.click();
    log.debug("clicked on location of sta");
    await driver.pause(4000);

    const locationInput = await this.probeElement(
      "//android.widget.EditText",
      10,
      1000,
    );
    if (!locationInput) throw new Error("❌ Location EditText not found");
    await locationInput.click();

    await this.selectLocationOfStay(city);
    log.debug("selected location of stay:", city);

    await driver.pause(2000);
    const rows = await driver.$$(`//android.view.View[@content-desc]`);
    for (const el of rows) {
      const desc = await el.getAttribute("content-desc");
      log.info("suggestion row:", desc);
    }
    await driver.pause(2000);

    // Pax Count
    try {
      const paxCount = await this.probeElement(
        '//android.view.View[contains(@content-desc, "No of Pax")]',
      );
      if (paxCount) {
        await paxCount.click();
        const addPaxPopUp = await this.probeElement(
          '//android.view.View[@content-desc="Add Pax"]',
          6,
          800,
        );
        if (addPaxPopUp) {
          const doneEls = await driver.$$(
            '//android.widget.Button[@content-desc="Done"]',
          );
          if (doneEls.length > 0) {
            await doneEls[0].click();
            log.info("✅ passenger count set");
          }
        } else {
          log.warn("⚠️ add pax popup did not appear, skipping done click");
        }
      } else {
        log.warn("⚠️ no of pax field not found, skipping");
      }
    } catch (e) {
      log.warn("⚠️ passenger count selection failed:", );
    }

    await driver.pause(2000);
    let depDay: number | null = null;
    log.info("calling selectcheckindate..");
    depDay = await this.selectCheckInDate(driver);
    log.info("check-in date selected:", depDay);
    await driver.pause(2000);

    if (depDay !== null) {
      log.info("check out date selection");
      try {
        await this.selectCheckOutDate(driver, depDay);
        log.info("✅ check-out selected:", depDay);
      } catch (e) {
        log.warn("⚠️ check-out date selection failed:", );
      }
      await driver.pause(2000);
    }

    const distance = await this.probeElement(
      '//android.widget.SeekBar[@content-desc="100%"]',
      10,
      1000,
    );
    if (distance) {
      await distance.click();
      log.info("✅ distance set");
    } else {
      log.warn("⚠️ distance seekbar not found, skipping");
    }

    await driver.pause(2500);

    // Search Hotels button
    const searchHotelButton = await this.probeElement(
      '//android.widget.Button[@content-desc="Search Hotels"]',
      15,
      1000,
    );
    if (!searchHotelButton) throw new Error("❌ Search Hotels button not found");
    await searchHotelButton.click();
    log.info("✅ search hotels clicked");
  }

  private async selectCheckInDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    await driver.pause(2000);

    const checkInEls = await driver.$$(
      '//android.view.View[contains(@content-desc, "Check In")]',
    );
    if (checkInEls.length === 0) throw new Error("❌ Check In field not found");
    await checkInEls[0].click();

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
    );
    await nextMonthButton.click();

    const randomDate = Math.floor(Math.random() * 28) + 1;
    try {
      const dateEls = await driver.$$(
        `//android.widget.Button[contains(@content-desc, "${randomDate}, ")]`,
      );
      if (dateEls.length > 0) {
        await dateEls[0].click();
      } else {
        log.warn(`⚠️ date ${randomDate} not found on calenda`);
      }
    } catch (error) {
      log.error(`error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }

  private async selectCheckOutDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    log.info("selecting check out date..");

    const checkOutEls = await driver.$$("~Check Out\nChoose Check Out");
    if (checkOutEls.length === 0) throw new Error("❌ Check Out field not found");
    await checkOutEls[0].click();
    log.info("check out date element clicked");
    await driver.pause(2000);

    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;
    log.info(`selected check-out day: ${returnDay}`);

    if (returnDay > 28) {
      const nextMonthEls = await driver.$$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      if (nextMonthEls.length > 0) {
        await nextMonthEls[0].click();
        log.info("✅ next month clicked");
      }
      returnDay = Math.floor(Math.random() * 5) + 1;
    }

    log.info(`final check out date: ${returnDay}`);
    const checkOutDateEls = await driver.$$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    if (checkOutDateEls.length === 0) {
      throw new Error(`❌ Check-out date ${returnDay} not found on calendar`);
    }
    await checkOutDateEls[0].click();
    await driver.pause(2000);
  }
}
