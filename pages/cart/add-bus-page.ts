import logger from '@wdio/logger'
const log = logger('AddBusPage')

export class AddBusPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async busCreation(fromCode: string, toCode: string) {
    const driver = this.driver;
    log.info("bus creation started");

    const busIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Bus")',
    );
    await busIconTap.waitForDisplayed({ timeout: 50000 });
    await busIconTap.click();
    log.info(" clicked on bus  icon");

    const busBookingScreen = await driver.$(
      '//android.view.View[@content-desc="Bus Booking"]',
    );
    await busBookingScreen.waitForDisplayed({ timeout: 60000 });
    log.info("navigated to  bus booking screen");
    await driver.pause(5000);
    log.debug("bus booking screen found");
    await driver.pause(3000);

    const fromLocationSearchFeild = await driver.$("//android.widget.EditText");
    await fromLocationSearchFeild.waitForExist({ timeout: 40000 });
    log.debug("from location search field found");
    await fromLocationSearchFeild.click();
    log.debug("from location search field clicked");
    await driver.pause(3000);
    await this.selectBusLocation("From", fromCode);
    await driver.pause(2000);
    log.debug("from location selected");
    log.debug("from location selected");

    await driver.pause(2000);

    const toLocationSearchFeild = await driver.$("//android.widget.EditText");
    await toLocationSearchFeild.waitForExist({ timeout: 50000 });
    log.debug("to  location search field found");

    await toLocationSearchFeild.click();

    await this.selectBusLocation("To", toCode);
    await driver.pause(2000);

    log.debug("to location seleceted ");
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
    log.info("passenger count set");
    await driver.pause(2000);

    let depDay: number | null = null;
    log.info("calling selectdeparturedate..........");

    depDay = await this.selectDepartureBusDate(driver);
    log.info("departure date selected:", depDay);
    await driver.pause(2000);
    log.info("calling selectdeparturedate..........");
    await driver.pause(6000);

    const searchBusButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Buses"]',
    );
    await searchBusButton.waitForExist({ timeout: 40000 });
    log.debug("search bus button found going to be clicked");
    await searchBusButton.click();
    log.info("search bus button clicked");
    await driver.pause(2000);
  }

  private async selectBusLocation(type: "From" | "To", code: string) {
    const driver = this.driver;
    const label = type === "From" ? "From" : "To";

    const initialFieldLocator = `//android.view.View[contains(@content-desc, "${label}")]`;
    log.info(
      `attempting to find and click the "${label}" field on the main 'bus booking' screen...`,
   );
    const fieldOnMainScreen = await driver.$(initialFieldLocator);
    await fieldOnMainScreen.waitForExist({ timeout: 20000 });
    await fieldOnMainScreen.click();
    log.info(
      `successfully clicked the "${label}" field. navigating to 'choose stations' screen.`,
   );

    log.debug("finding the search input field using uiselector..");
    const searchFieldLocator =
      'android=new UiSelector().className("android.widget.EditText")';
    const searchField = await driver.$(searchFieldLocator);
    await searchField.waitForExist({ timeout: 20000 });

    const { x, y } = await searchField.getLocation();
    const { width, height } = await searchField.getSize();
    const tapX = Math.floor(x + width * 0.1);
    const tapY = Math.floor(y + height * 0.5);

    log.debug(`tapping on coordinates: (${tapX}, ${tapY}`);
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
    log.debug("tapped search input using coordinates successfully");

    log.debug(`typing "${code}" into the search field..`);
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

      log.debug(
        `tapping on first search result at (${resultTapX}, ${resultTapY})`,
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

      log.info(` successfully tapped the first result for "${code}"`);
    } else {
      log.error(` no bus options found for '${code}'`);
      throw new Error(`No bus options found for '${code}'.`);
    }

    await driver.pause(2000);
    log.debug(` location selection complete for "${type}" - "${code}"`);
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
      log.error(`error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }
}
