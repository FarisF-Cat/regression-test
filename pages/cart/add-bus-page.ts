export class AddBusPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async busCreation(fromCode: string, toCode: string) {
    const driver = this.driver;
    console.log("BUS CREATION STARTED");

    const busIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Bus")',
    );
    await busIconTap.waitForDisplayed({ timeout: 50000 });
    await busIconTap.click();
    console.log(" Clicked on BUS  Icon");

    const busBookingScreen = await driver.$(
      '//android.view.View[@content-desc="Bus Booking"]',
    );
    await busBookingScreen.waitForDisplayed({ timeout: 60000 });
    console.log("Navigated to  BUS Booking Screen");
    await driver.pause(5000);
    console.log("BUS BOOKING SCREEN FOUND");
    await driver.pause(3000);

    const fromLocationSearchFeild = await driver.$("//android.widget.EditText");
    await fromLocationSearchFeild.waitForExist({ timeout: 40000 });
    console.log("From Location Search Field Found ");
    await fromLocationSearchFeild.click();
    console.log("From Location Search Field Clicked ");
    await driver.pause(3000);
    await this.selectBusLocation("From", fromCode);
    await driver.pause(2000);
    console.log("From Location Selected ");
    console.log("From Location Selected");

    await driver.pause(2000);

    const toLocationSearchFeild = await driver.$("//android.widget.EditText");
    await toLocationSearchFeild.waitForExist({ timeout: 50000 });
    console.log("TO  Location Search Field Found ");

    await toLocationSearchFeild.click();

    await this.selectBusLocation("To", toCode);
    await driver.pause(2000);

    console.log("TO LOCATION SELECETED  ");
    await driver.pause(3000);

    const paxCount = await driver.$(
      '//android.view.View[contains(@content-desc, "No of Pax")]',
    );
    await paxCount.waitForExist({ timeout: 50000 });
    await paxCount.click();

    const doneButton = await driver.$(
      '//android.widget.Button[@content-desc="Done"]',
    );
    await doneButton.waitForExist({ timeout: 20000 });
    await doneButton.click();
    console.log("Passenger count set");
    await driver.pause(2000);

    let depDay: number | null = null;
    console.log("Calling SELECTDEPARTUREDATE...........");

    depDay = await this.selectDepartureBusDate(driver);
    console.log("Departure date selected:", depDay);
    await driver.pause(2000);
    console.log("Calling SELECTDEPARTUREDATE...........");
    await driver.pause(6000);

    const searchBusButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Buses"]',
    );
    await searchBusButton.waitForExist({ timeout: 40000 });
    console.log("Search Bus Button Found GOING TO BE CLICKED ");
    await searchBusButton.click();
    console.log("SEARCH BUS BUTTON CLICKED");
    await driver.pause(2000);
  }

  private async selectBusLocation(type: "From" | "To", code: string) {
    const driver = this.driver;
    const label = type === "From" ? "From" : "To";

    const initialFieldLocator = `//android.view.View[contains(@content-desc, "${label}")]`;
    console.log(
      `Attempting to find and click the "${label}" field on the main 'Bus Booking' screen...`,
    );
    const fieldOnMainScreen = await driver.$(initialFieldLocator);
    await fieldOnMainScreen.waitForExist({ timeout: 20000 });
    await fieldOnMainScreen.click();
    console.log(
      `Successfully clicked the "${label}" field. Navigating to 'Choose Stations' screen.`,
    );

    console.log("Finding the search input field using UiSelector...");
    const searchFieldLocator =
      'android=new UiSelector().className("android.widget.EditText")';
    const searchField = await driver.$(searchFieldLocator);
    await searchField.waitForExist({ timeout: 20000 });

    const { x, y } = await searchField.getLocation();
    const { width, height } = await searchField.getSize();
    const tapX = Math.floor(x + width * 0.1);
    const tapY = Math.floor(y + height * 0.5);

    console.log(`Tapping on coordinates: (${tapX}, ${tapY})`);
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: tapX, y: tapY },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 100 },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
    console.log("Tapped search input using coordinates successfully.");

    console.log(`Typing "${code}" into the search field...`);
    await searchField.addValue(code);
    await driver.pause(3000);

    const searchResultLocator = `//android.view.View[contains(@content-desc, "${code}")]`;
    const busOptions = await driver.$$(searchResultLocator);

    if ((await busOptions.length) > 0) {
      const firstResult = busOptions[0];
      const { x, y } = await firstResult.getLocation();
      const { width, height } = await firstResult.getSize();

      const resultTapX = Math.floor(x + width * 0.3);
      const resultTapY = Math.floor(y + height * 0.5);

      console.log(
        `Tapping on first search result at (${resultTapX}, ${resultTapY})`,
      );
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: resultTapX, y: resultTapY },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 100 },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();

      console.log(` Successfully tapped the first result for "${code}".`);
    } else {
      console.error(` No bus options found for '${code}'.`);
      throw new Error(`No bus options found for '${code}'.`);
    }

    await driver.pause(2000);
    console.log(` Location selection complete for "${type}" - "${code}".`);
  }

  /// FUNCTIONS THAT  ARE USED TO SELECT THE CHECK IN AND CHECK OUT DATES
  private async selectDepartureBusDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    const departureDate = await driver.$(
      '//android.view.View[contains(@content-desc, "Choose Departure Date")]',
    );

    await departureDate.waitForExist({ timeout: 2000 });
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
      console.error(`Error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }
}
