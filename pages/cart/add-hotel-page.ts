export class AddHotelPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async selectLocationOfStay(city: string): Promise<void> {
    const driver = this.driver;

    const searchInput = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    await searchInput.waitForDisplayed({ timeout: 10_000 });
    await searchInput.clearValue();
    await searchInput.setValue(city);

    await driver.pause(2_000);

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
      await rows[0].click();
    } else {
      throw new Error(`No suggestion list appeared for "${city}".`);
    }

    await driver.pause(1_000);
  }

  async createHotel(city: string) {
    const driver = this.driver;
    await driver.pause(5500);
    console.log("HOTEL CREATION STARTED");
    await driver.pause(8000);
    const hotelIconTap = await driver.$(
      'android=new UiSelector().descriptionContains("Hotel")',
    );

    await hotelIconTap.waitForExist({ timeout: 45000 });
    await hotelIconTap.click();
    console.log(" Clicked on HOTEL  Icon");

    const hotelBookingScreen = await driver.$(
      '-android uiautomator:new UiSelector().description("Hotel Booking")',
    );
    await hotelBookingScreen.waitForExist({ timeout: 30000 });
    console.log("Navigated to  HOTEL Booking Screen");

    //        ***********LOCATION OF STAY*************************
    console.log("CLICKING ON LOCATION OF STAY");

    await driver
      .$(
        '//android.view.View[contains(@content-desc, "Choose Location of Stay")]',
      )
      .click();

    console.log("CLICKED ON LOCATION OF STAY ");
    await driver.pause(4000);

    const locationOfStay = await driver.$("//android.widget.EditText");
    await locationOfStay.waitForExist({ timeout: 4000 });
    console.log("LOCATION OF STAY ELEMENT FOUND ");
    await locationOfStay.click();

    console.log("LOCATION OF STAY CLICKED  ");

    await this.selectLocationOfStay(city);
    console.log("SELECTED LOCATION OF STAY  : ", city);

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

    const doneButton = await driver.$(
      '//android.widget.Button[@content-desc="Done"]',
    );
    await doneButton.waitForExist({ timeout: 6000 });
    await doneButton.click();
    console.log("Passenger count set");
    await driver.pause(2000);
    let depDay: number | null = null;
    console.log("Calling SELECTCHECKINDATE...........");

    depDay = await this.selectCheckInDate(driver);
    console.log("Departure date selected:", depDay);
    await driver.pause(2000);

    if (depDay !== null) {
      console.log("CHECK OUT  DATE SELECTION");

      try {
        console.log("CALLING CHECK OU DATE:", depDay);
        await this.selectCheckOutDate(driver, depDay);
        console.log(" CHECK OUT SELECTED: ", depDay);
      } catch (e) {
        console.warn("NOT SELECTING CHECK OUT DATE :", e);
      }

      await driver.pause(2000);
    }

    const distance = await driver.$(
      '//android.widget.SeekBar[@content-desc="100%"]',
    );
    await distance.waitForExist({ timeout: 6000 });
    await distance.click();
    console.log("DISTANCE  set");

    await driver.pause(2500);

    const searchHotelButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Hotels"]',
    );
    await searchHotelButton.waitForExist({ timeout: 8000 });
    await searchHotelButton.click();
    console.log("DISTANCE  set");
  }
  private async selectCheckInDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    await driver.pause(2000);

    const checkInDate = await driver.$(
      '//android.view.View[contains(@content-desc, "Check In")]',
    );

    await checkInDate.waitForExist({ timeout: 20000 });
    await checkInDate.click();

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
    );
    await nextMonthButton.click();

    const randomDate = Math.floor(Math.random() * 28) + 1;
    try {
      const checkInDateElement = await driver.$(
        `//android.widget.Button[contains(@content-desc, "${randomDate}, ")]`,
      );
      await checkInDateElement.waitForExist({ timeout: 20000 });
      await checkInDateElement.click();
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

    const checkOutDate = await driver.$("~Check Out\nChoose Check Out");
    await checkOutDate.waitForExist({ timeout: 5000 });
    await checkOutDate.click();
    console.log("RETURN DATE ELEMENT CLICKED");
    await driver.pause(2000);

    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;
    console.log(`Selected return day: ${returnDay}`);

    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      console.log("NEXT MONTH BUTTON FOUND");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      console.log("NEXT MONTH BUTTON CLICKED");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1;
    }
    console.log(`FINAL RETURN DATE: ${returnDay}`);
    const checkOutDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    console.log("RETURN DATE ELEMENT FOUND FOR FINAL SELECTION");

    await checkOutDateElement.waitForExist({ timeout: 20000 });
    await checkOutDateElement.click();

    await driver.pause(2000);
  }
}
