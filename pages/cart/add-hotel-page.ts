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
      console.log(`⏳ [probe] attempt ${i + 1}/${attempts}: ${selector}`);
      await this.driver.pause(intervalMs);
    }
    return null;
  }

  async selectLocationOfStay(city: string): Promise<void> {
    const driver = this.driver;

    const searchInput = await driver.$(
    const searchInput = await this.probeElement(
      'android=new UiSelector().className("android.widget.EditText")',
      10,
      1000,
    );
    await searchInput.waitForDisplayed({ timeout: 10_000 });
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
    } else if (await rows.length) {
    } else if (rows.length > 0) {
      await rows[0].click();
    } else {
      throw new Error(`No suggestion list appeared for "${city}".`);
    }

    await driver.pause(1_000);
    await driver.pause(1000);
  }

  async createHotel(city: string) {
    const driver = this.driver;
    await driver.pause(5500);
    console.log("HOTEL CREATION STARTED");
    await driver.pause(8000);
    const hotelIconTap = await driver.$(

    // Hotel icon
    const hotelIcon = await this.probeElement(
      'android=new UiSelector().descriptionContains("Hotel")',
      20,
      1000,
    );
    if (!hotelIcon) throw new Error("❌ Hotel icon not found");
    await hotelIcon.click();
    console.log("✅ Clicked on HOTEL Icon");

    await hotelIconTap.waitForExist({ timeout: 45000 });
    await hotelIconTap.click();
    console.log(" Clicked on HOTEL  Icon");

    const hotelBookingScreen = await driver.$(
    // Hotel Booking screen
    const hotelBookingScreen = await this.probeElement(
      '-android uiautomator:new UiSelector().description("Hotel Booking")',
      15,
      1000,
    );
    await hotelBookingScreen.waitForExist({ timeout: 30000 });
    console.log("Navigated to  HOTEL Booking Screen");
    if (!hotelBookingScreen) throw new Error("❌ Hotel Booking screen not found");
    console.log("✅ Navigated to Hotel Booking Screen");

    //        ***********LOCATION OF STAY*************************
    // Location of Stay
    console.log("CLICKING ON LOCATION OF STAY");

    await driver
      .$(
        '//android.view.View[contains(@content-desc, "Choose Location of Stay")]',
      )
      .click();

    console.log("CLICKED ON LOCATION OF STAY ");
    const locationField = await this.probeElement(
      '//android.view.View[contains(@content-desc, "Choose Location of Stay")]',
      10,
      1000,
    );
    if (!locationField) throw new Error("❌ Choose Location of Stay not found");
    await locationField.click();
    console.log("CLICKED ON LOCATION OF STAY");
    await driver.pause(4000);

    const locationOfStay = await driver.$("//android.widget.EditText");
    await locationOfStay.waitForExist({ timeout: 4000 });
    console.log("LOCATION OF STAY ELEMENT FOUND ");
    await locationOfStay.click();

    console.log("LOCATION OF STAY CLICKED  ");
    const locationInput = await this.probeElement(
      "//android.widget.EditText",
      10,
      1000,
    );
    if (!locationInput) throw new Error("❌ Location EditText not found");
    await locationInput.click();

    await this.selectLocationOfStay(city);
    console.log("SELECTED LOCATION OF STAY  : ", city);
    console.log("SELECTED LOCATION OF STAY:", city);

    await driver.pause(2000);
    const rows = await driver.$$(`//android.view.View[@content-desc]`);
    for (const el of rows) {
      const desc = await el.getAttribute("content-desc");
      console.log("Suggestion row:", desc);
    }
    console.log("CLICKED ON SUGGESTION LIST ITEM ");
    await driver.pause(2000);

    const paxCount = await driver.$(
      '//android.view.View[contains(@content-desc, "No of Pax")]',
    );
    await paxCount.waitForExist({ timeout: 3000 });
    await paxCount.click();

    const addPaxPopUp = await driver.$(
      '//android.view.View[@content-desc="Add Pax"]',
    );
    await addPaxPopUp.waitForExist({ timeout: 5500 });
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
            console.log("✅ Passenger count set");
          }
        } else {
          console.warn("⚠️ Add Pax popup did not appear, skipping Done click");
        }
      } else {
        console.warn("⚠️ No of Pax field not found, skipping");
      }
    } catch (e) {
      console.warn("⚠️ Passenger count selection failed:", e);
    }

    const doneButton = await driver.$(
      '//android.widget.Button[@content-desc="Done"]',
    );
    await doneButton.waitForExist({ timeout: 6000 });
    await doneButton.click();
    console.log("Passenger count set");
    await driver.pause(2000);
    let depDay: number | null = null;
    console.log("Calling SELECTCHECKINDATE...........");

    console.log("Calling SELECTCHECKINDATE...");
    depDay = await this.selectCheckInDate(driver);
    console.log("Departure date selected:", depDay);
    console.log("Check-in date selected:", depDay);
    await driver.pause(2000);

    if (depDay !== null) {
      console.log("CHECK OUT  DATE SELECTION");

      console.log("CHECK OUT DATE SELECTION");
      try {
        console.log("CALLING CHECK OU DATE:", depDay);
        await this.selectCheckOutDate(driver, depDay);
        console.log(" CHECK OUT SELECTED: ", depDay);
        console.log("✅ Check-out selected:", depDay);
      } catch (e) {
        console.warn("NOT SELECTING CHECK OUT DATE :", e);
        console.warn("⚠️ Check-out date selection failed:", e);
      }

      await driver.pause(2000);
    }

    const distance = await driver.$(
    // Distance seekbar
    const distance = await this.probeElement(
      '//android.widget.SeekBar[@content-desc="100%"]',
      10,
      1000,
    );
    await distance.waitForExist({ timeout: 6000 });
    await distance.click();
    console.log("DISTANCE  set");
    if (distance) {
      await distance.click();
      console.log("✅ Distance set");
    } else {
      console.warn("⚠️ Distance seekbar not found, skipping");
    }

    await driver.pause(2500);

    const searchHotelButton = await driver.$(
    // Search Hotels button
    const searchHotelButton = await this.probeElement(
      '//android.widget.Button[@content-desc="Search Hotels"]',
      15,
      1000,
    );
    await searchHotelButton.waitForExist({ timeout: 8000 });
    if (!searchHotelButton) throw new Error("❌ Search Hotels button not found");
    await searchHotelButton.click();
    console.log("DISTANCE  set");
    console.log("✅ Search Hotels clicked");
  }
  private async selectCheckInDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    await driver.pause(2000);

    const checkInDate = await driver.$(
    const checkInEls = await driver.$$(
      '//android.view.View[contains(@content-desc, "Check In")]',
    );

    await checkInDate.waitForExist({ timeout: 20000 });
    await checkInDate.click();
    if (checkInEls.length === 0) throw new Error("❌ Check In field not found");
    await checkInEls[0].click();

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
    );
    await nextMonthButton.click();

    const randomDate = Math.floor(Math.random() * 28) + 1;
    try {
      const checkInDateElement = await driver.$(
      const dateEls = await driver.$$(
        `//android.widget.Button[contains(@content-desc, "${randomDate}, ")]`,
      );
      await checkInDateElement.waitForExist({ timeout: 20000 });
      await checkInDateElement.click();
      if (dateEls.length > 0) {
        await dateEls[0].click();
      } else {
        console.warn(`⚠️ Date ${randomDate} not found on calendar`);
      }
    } catch (error) {
      console.error(`Error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }

  private async selectCheckOutDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    console.log("SELECTING RETURN DATE...");
    console.log("SELECTING CHECK OUT DATE...");

    const checkOutDate = await driver.$("~Check Out\nChoose Check Out");
    await checkOutDate.waitForExist({ timeout: 5000 });
    await checkOutDate.click();
    console.log("RETURN DATE ELEMENT CLICKED");
    const checkOutEls = await driver.$$("~Check Out\nChoose Check Out");
    if (checkOutEls.length === 0) throw new Error("❌ Check Out field not found");
    await checkOutEls[0].click();
    console.log("CHECK OUT DATE ELEMENT CLICKED");
    await driver.pause(2000);

    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;
    console.log(`Selected return day: ${returnDay}`);
    console.log(`Selected check-out day: ${returnDay}`);

    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
      const nextMonthEls = await driver.$$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      console.log("NEXT MONTH BUTTON FOUND");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      console.log("NEXT MONTH BUTTON CLICKED");

      await nextMonthButton.click();
      if (nextMonthEls.length > 0) {
        await nextMonthEls[0].click();
        console.log("✅ Next month clicked");
      }
      returnDay = Math.floor(Math.random() * 5) + 1;
    }
    console.log(`FINAL RETURN DATE: ${returnDay}`);
    const checkOutDateElement = await driver.$(

    console.log(`FINAL CHECK OUT DATE: ${returnDay}`);
    const checkOutDateEls = await driver.$$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    console.log("RETURN DATE ELEMENT FOUND FOR FINAL SELECTION");

    await checkOutDateElement.waitForExist({ timeout: 20000 });
    await checkOutDateElement.click();

    if (checkOutDateEls.length === 0) {
      throw new Error(`❌ Check-out date ${returnDay} not found on calendar`);
    }
    await checkOutDateEls[0].click();
    await driver.pause(2000);
  }
}
