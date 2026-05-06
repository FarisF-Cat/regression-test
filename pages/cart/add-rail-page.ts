export class AddRailPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async railCreation(fromCode: string, toCode: string) {
    const driver = this.driver;
    await driver.pause(20000);
    console.log("RAIL CREATION STARTED");

    const railIconTap = await driver.$(
      '//android.widget.ImageView[@content-desc="Rail"]'
    );
    await railIconTap.waitForExist({ timeout: 20000 });
    await railIconTap.click();
    console.log(" Clicked on RAIL  Icon");
    const railBookingScreen = await driver.$(
      '//android.view.View[@content-desc="Rail Booking"]'
    );
    await railBookingScreen.waitForExist({ timeout: 30000 });
    console.log("Navigated to  RAIL Booking Screen");
    await driver.pause(5000);
    console.log("RAIL BOOKING SCREEN FOUND");
    await driver.pause(3000);
    await this.selectRailLocation("From", fromCode);
    console.log(`From RAIL LOCATION selected: ${fromCode}`);
    await driver.pause(2000);

    await this.selectRailLocation("To", toCode);
    console.log(`To RAIL LOCATION  selected: ${toCode}`);
    await driver.pause(2000);
    await driver.pause(3000);

    const paxCount = await driver.$(
      '//android.view.View[contains(@content-desc, "No of Pax")]'
    );
    await paxCount.waitForExist({ timeout: 50000 });
    await paxCount.click();

    const doneButton = await driver.$(
      '//android.widget.Button[@content-desc="Done"]'
    );
    await doneButton.waitForExist({ timeout: 20000 });
    await doneButton.click();
    console.log("Passenger count set");
    await driver.pause(2000);
    let depDay: number | null = null;
    console.log("Calling SELECTDEPARTUREDATE...........");

    depDay = await this.selectDepartureRailDate(driver);
    console.log("Departure date selected:", depDay);
    await driver.pause(2000);
    console.log("Calling SELECTDEPARTUREDATE...........");
    await driver.pause(6000);
    const journeyType = await driver.$(
      '//android.view.View[@content-desc="Journey Class"]'
    );
    await journeyType.waitForExist({ timeout: 50000 });
    await journeyType.click();

    const windowSize = await driver.getWindowRect();
    const startX = Math.floor(windowSize.width / 2);
    const startY = Math.floor(windowSize.height * 0.8);
    const endY = Math.floor(windowSize.height * 0.6);

    let isVisible = false;
    let scrollCount = 0;
    const maxScrolls = 5;

    while (!isVisible && scrollCount < maxScrolls) {
      const journeyTypeDropDown = await driver.$(
        '//android.widget.RadioButton[@content-desc="Second Seating"]'
      );

      if (await journeyTypeDropDown.isExisting()) {
        isVisible = true;
        await journeyTypeDropDown.click();
        break;
      }

      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 300, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
      await driver.pause(1000);
      scrollCount++;
    }

    if (!isVisible) {
      throw new Error("Second Seating option not found after scrolling.");
    }

    await driver.pause(2000);
    const quota = await driver.$('//android.view.View[@content-desc="Quota"]');
    await quota.waitForExist({ timeout: 20000 });
    await quota.click();
    const quotaDropDown = await driver.$(
      '//android.widget.RadioButton[@content-desc="General"]'
    );
    await quotaDropDown.waitForExist({ timeout: 20000 });
    await quotaDropDown.click();
    const departureDatePreference = await driver.$("~Departure Preferences");
    await departureDatePreference.waitForExist({ timeout: 5000 });
    await driver.pause(1000);

    const departureDatePreferenceSelect = await driver.$(
      '//android.widget.Button[@content-desc="After 6PM"]'
    );
    await departureDatePreferenceSelect.waitForExist({
      timeout: 10000,
    });
    await departureDatePreferenceSelect.click();
    await driver.pause(1000);
    const addRailButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Rail"]'
    );
    await addRailButton.waitForExist({
      timeout: 10000,
    });
    await addRailButton.click();
    await driver.pause(1000);
  }

  private async selectRailLocation(type: "From" | "To", code: string) {
    const driver = this.driver;
    const label = type === "From" ? "From" : "To";

    const field = await driver.$(
      `//android.view.View[contains(@content-desc, "${label}")]`
    );
    await field.waitForExist({ timeout: 20000 });
    await field.click();

    const searchField = await driver.$("//android.widget.EditText");
    await searchField.waitForExist({ timeout: 20000 });
    await searchField.click();
    await searchField.setValue(code);
    await driver.pause(1500); 

   

    const validLocationSelector =
      '//android.view.View[contains(@content-desc, "-")]';
    await driver.waitUntil(
      async () => {
        const elements = await driver.$$(validLocationSelector);
        return (await elements.length) > 0;
      },
      { timeout: 10000, timeoutMsg: "Location results not loaded in time" }
    );

    const results = await driver.$$(validLocationSelector);
    const firstResult = results[0];
    const desc = await firstResult.getAttribute("content-desc");
    console.log(` Trying to select: ${desc}`);

    try {
      await firstResult.waitForDisplayed({ timeout: 5000 });

      await firstResult.click();
      console.log(` Successfully clicked "${desc}"`);
    } catch (err) {
      console.warn(` Standard click failed, retrying via coordinates...`);

      try {
        const { x, y } = await firstResult.getLocation();
        const { width, height } = await firstResult.getSize();

        const tapX = Math.floor(x + width / 2);
        const tapY = Math.floor(y + height / 2);

        console.log(
          `👉 Tapping at COORDINATES  544545454545454545454: (${tapX}, ${tapY})`
        );

        await driver.touchAction({
          action: "tap",
          x: tapX,
          y: tapY,
        });

        await driver.releaseActions();
      } catch (error) {
        console.error(" Failed to tap on location result:", error);
      }
    }

    await driver.pause(2000);
    console.log(` VERIFYING THE SELECTED VALUE IN THE UI...`);

    const baseText = code.split("-")[0].trim().toLowerCase();
    const potentialMatches = await driver.$$(`//android.view.View`);

    let found = false;

    for (const el of potentialMatches) {
      try {
        const desc = await el.getAttribute("content-desc");
        if (desc && desc.toLowerCase().includes(baseText)) {
          const isVisible = await el.isDisplayed();
          if (isVisible) {
            found = true;
            break;
          }
        }
      } catch {}
    }

    if (!found) {
      throw new Error(
        ` Location "${code}" was clicked, BUT UI DID NOT REFLECT THE SELECTED VALUE.`
      );
    }

    console.log(`Location "${code}" was selected and reflected successfully.`);
  }

  private async selectDepartureRailDate(
    driver: WebdriverIO.Browser
  ): Promise<number> {
    const departureDate = await driver.$(
      '//android.view.View[contains(@content-desc, "Choose Departure Date")]'
    );

    await departureDate.waitForExist({ timeout: 2000 });
    await departureDate.click();

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]'
    );
    await nextMonthButton.click();

    const randomDate = Math.floor(Math.random() * 28) + 1;
    try {
      const dateElement = await driver.$(
        `//android.widget.Button[contains(@content-desc, "${randomDate}, ")]`
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
