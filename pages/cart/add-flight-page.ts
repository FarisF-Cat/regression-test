export class AddFlightPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  private getTwoUniqueAirports(
    exclude: string[],
    airports: string[],
  ): [string, string] {
    const filtered = airports.filter((a) => !exclude.includes(a));
    if (filtered.length < 2)
      throw new Error("Not enough unique airports for sector 2");
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  }

  async createTravelRequestAddFlightPageOneWay(
    fromCode: string,
    toCode: string,
    allAirportCodes: string[],
    journeyType: string,
  ) {
    const driver = this.driver;

    try {
      await driver.pause(2000);
      console.log("CREATING TRAVEL REQUEST FOR FLIGHT BOOKING SCREEN");

      const flightIconTap = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight")',
      );
      await flightIconTap.waitForDisplayed({ timeout: 65000 });
      await flightIconTap.click();
      console.log(" Clicked on Flight Icon");

      const flightBookingScreen = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight Booking")',
      );
      await flightBookingScreen.waitForExist({ timeout: 20000 });
      console.log("Navigated to Flight Booking Screen");

      const onewayRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(0)',
      );
      await onewayRadioButton.waitForExist({ timeout: 5000 });
      await driver.pause(500);

      console.log(" ONEWAY RADIO BUTTON FOUND");
      // await onewayRadioButton.click();
      const roundtripRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(1)',
      );

      await roundtripRadioButton.waitForExist({ timeout: 5000 });
      await driver.pause(500);
      // await roundtripRadioButton.click();

      console.log(" ROUND TRIP RADIO BUTTON FOUND");
      await driver.pause(2000);
      if (journeyType === "ONEWAY") {
        console.log("SELECTING ONEWAY JOURNEY TYPE");

        await onewayRadioButton.click();
        await driver.pause(4000);
        console.log(
          "ONE WAY JOURNEY TYPE SELECTED 2222222222222222222222222222222222222222222222222222222222222222222",
        );
        await this.selectAirportSector1("From", fromCode);
        console.log(`From airport selected: ${fromCode}`);
        await driver.pause(7000);
        console.log(
          "FROM AIRPORT SELECTED FOR SECTOR 222222222222222222222222222222222222222222222222222222222222222222222",
        );
        await driver.pause(4000);
        await this.selectAirportSector1("To", toCode);
        console.log(`To airport selected: ${toCode}`);
        await driver.pause(7000);

        let depDay: number | null = null;

        try {
          depDay = await this.selectDepartureDate(driver);
          console.log("Departure date selected:", depDay);

          console.log("Departure preference selected");
        } catch (e) {
          console.warn("Could not select departure date or preference:", e);
        }
        console.log("SELECTING AIRPORTS FOR SECTOR 2");

        const [sector2From, sector2To] = this.getTwoUniqueAirports(
          [fromCode, toCode],
          allAirportCodes,
        );
        console.log(`Sector 2 From: ${sector2From}, To: ${sector2To}`);
        // await this.selectAirportSector2(fromCode, toCode, sector2From, sector2To);
        console.log(
          `Sector 2 airports selected: ${sector2From} to ${sector2To}`,
        );
        await driver.pause(2000);
        console.log("FROM AIRPORT SELECTED FOR SECTOR 2");
        try {
          const cabinClass = await driver.$(
            '//android.view.View[contains(@content-desc, "Cabin Class")]',
          );
          await cabinClass.waitForExist({ timeout: 5000 });
          await cabinClass.click();
          const dropdownOption = await driver.$(
            '//android.widget.RadioButton[@content-desc="Economy"]',
          );
          await dropdownOption.waitForExist({ timeout: 5000 });
          await dropdownOption.click();

          const windowSize = await driver.getWindowSize();
          const startX = Math.floor(windowSize.width / 2);
          const startY = Math.floor(windowSize.height * 0.8);
          const endY = Math.floor(windowSize.height * 0.6);

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

          await driver.back();
          console.log(" Cabin class selected: Economy");
        } catch (e) {
          console.warn(" Cabin class selection failed");
        }
        try {
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
        } catch (e) {
          console.warn(" Passenger count selection failed");
        }

        const searchButton = await driver.$(
          '//android.widget.Button[@content-desc="Search Flights"]',
        );
        await searchButton.waitForExist({ timeout: 5500 });
        await searchButton.click();
        console.log(" Searching flights...");
        await driver.pause(2000);
      }
    } catch (err: any) {
      console.error("Error in createTravelRequest:", err.message || err);
      throw err;
    }
  }

  async createTravelRequestAddFlightPageRoundTrip(
    fromCode: string,
    toCode: string,
    allAirportCodes: string[],
    journeyType: string,
  ) {
    const driver = this.driver;
    try {
      await driver.pause(2000);
      console.log("CREATING TRAVEL REQUEST FOR FLIGHT BOOKING SCREEN");

      const flightIconTap = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight")',
      );
      await flightIconTap.waitForExist({ timeout: 55000 });
      await flightIconTap.click();
      console.log(" Clicked on Flight Icon");

      const flightBookingScreen = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight Booking")',
      );
      await flightBookingScreen.waitForExist({ timeout: 20000 });
      console.log("Navigated to Flight Booking Screen");

      // await onewayRadioButton.click();
      const roundtripRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(1)',
      );

      await roundtripRadioButton.waitForExist({ timeout: 5000 });
      await driver.pause(500);
      // await roundtripRadioButton.click();

      console.log(" ROUND TRIP RADIO BUTTON FOUND");
      await driver.pause(2000);
      if (journeyType === "ROUNDTRIP") {
        console.log(
          "SELECTING ROUNDTRIP JOURNEY TYPE  22222222222222222222222222222",
        );
        await this.selectAirportSector1("From", fromCode);
        console.log(`From airport selected: ${fromCode}`);
        await driver.pause(2000);

        await this.selectAirportSector1("To", toCode);
        console.log(`To airport selected: ${toCode}`);
        await driver.pause(2000);

        let depDay: number | null = null;

        try {
          console.log("Calling selectDepartureDate...");
          depDay = await this.selectDepartureDate(driver);
          console.log("Departure date selected:", depDay);

          const departureDatePreference = await driver.$(
            "~Departure Preferences",
          );
          await departureDatePreference.waitForExist({ timeout: 5000 });
          await driver.pause(2000);

          const departureDatePreferenceSelect = await driver.$(
            '//android.widget.Button[@content-desc="After 6PM"]',
          );
          await departureDatePreferenceSelect.waitForExist({ timeout: 10000 });
          await departureDatePreferenceSelect.click();
          console.log("Departure preference selected");
        } catch (e) {
          console.warn("Could not select departure date or preference:", e);
        }

        // --------------- SECTOR 2 --------------- //
        console.log("SELECTING AIRPORTS FOR SECTOR 2");

        const [sector2From, sector2To] = this.getTwoUniqueAirports(
          [fromCode, toCode],
          allAirportCodes,
        );
        console.log(`Sector 2 From: ${sector2From}, To: ${sector2To}`);
        // await this.selectAirportSector2(fromCode, toCode, sector2From, sector2To);
        console.log(
          `Sector 2 airports selected: ${sector2From} to ${sector2To}`,
        );
        await driver.pause(2000);
        console.log("FROM AIRPORT SELECTED FOR SECTOR 2");

        // ✅ Only call return date selection if depDay was set
        if (depDay !== null) {
          console.log("RETURN DATE SELECTION");

          try {
            console.log("CALLING RETURN DATE:", depDay);
            await this.selectReturnDate(driver, depDay);
            console.log(" RETURN DATE SELECTED: ", depDay);
          } catch (e) {
            console.warn("NOT SELECTING RETURN DATE :", e);
          }
          const returnDatePreference = await driver.$("~Return Preferences");
          await returnDatePreference.waitForExist({ timeout: 5000 });
          await driver.pause(2000);

          const returnDatePreferenceSelect = await driver.$(
            '(//android.widget.Button[@content-desc="6AM - Noon"])[2]',
          );
          await returnDatePreferenceSelect.waitForExist({ timeout: 10000 });
          await returnDatePreferenceSelect.click();

          const windowSize = await driver.getWindowSize();
          const startX = Math.floor(windowSize.width / 2);
          const startY = Math.floor(windowSize.height * 0.8);
          const endY = Math.floor(windowSize.height * 0.6);

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

          console.log("Return preference selected");
        } else {
          console.warn(
            "Skipping return date selection because departure date failed.",
          );
        }
        try {
          const cabinClass = await driver.$(
            '//android.view.View[contains(@content-desc, "Cabin Class")]',
          );
          await cabinClass.waitForExist({ timeout: 5000 });
          await cabinClass.click();
          const dropdownOption = await driver.$(
            '//android.widget.RadioButton[@content-desc="Economy"]',
          );
          await dropdownOption.waitForExist({ timeout: 5000 });
          await dropdownOption.click();

          const windowSize = await driver.getWindowSize();
          const startX = Math.floor(windowSize.width / 2);
          const startY = Math.floor(windowSize.height * 0.8);
          const endY = Math.floor(windowSize.height * 0.6);

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

          await driver.back();
          console.log(" Cabin class selected: Economy");
        } catch (e) {
          console.warn(" Cabin class selection failed");
        }
        try {
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
        } catch (e) {
          console.warn(" Passenger count selection failed");
        }
        const searchButton = await driver.$(
          '//android.widget.Button[@content-desc="Search Flights"]',
        );
        await searchButton.waitForExist({ timeout: 30000 });
        await searchButton.click();
        console.log(" Searching flights...");
        await driver.pause(5000);
      }
    } catch (err: any) {
      console.error("Error in createTravelRequest:", err.message || err);
      throw err;
    }
  }

  async createTravelRequestAddFlightPageMultiCity(
    fromCode: string,
    toCode: string,
    allAirportCodes: string[],
  ) {
    const driver = this.driver;
    try {
      await driver.pause(2000);
      console.log("CREATING TRAVEL REQUEST FOR FLIGHT BOOKING SCREEN");

      const flightIconTap = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight")',
      );
      await flightIconTap.waitForExist({ timeout: 20000 });
      await flightIconTap.click();
      console.log(" Clicked on Flight Icon");

      const flightBookingScreen = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight Booking")',
      );
      await flightBookingScreen.waitForExist({ timeout: 20000 });
      console.log("Navigated to Flight Booking Screen");

      //////MULTICITY SELECTION////
      console.log(" INSIDE MULTICITY TRIP ...");
      await driver.pause(2000);

      const multicityRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(2)',
      );
      await multicityRadioButton.waitForExist({ timeout: 5000 });
      await multicityRadioButton.click();

      console.log(" Selecting From and To Airports...");
      await driver.pause(2000);
      await this.selectAirportSector1Multicity();

      // await this.selectAirportSector1("From", fromCode);//// NOT HARDCODED VALUES
      console.log(`From airport selected: ${fromCode}`);
      await driver.pause(2000);

      // await this.selectAirportSector1("To", toCode);//// NOT HARDCODED VALUES
      console.log(`To airport selected: ${toCode}`);
      await driver.pause(2000);

      // let depDay: number | null = null;
      let sector1DepDay: number | null = null;
      try {
        console.log("Calling selectDepartureDate for Sector 1...");
        sector1DepDay = await this.selectDepartureDate(driver);
        console.log("Sector 1 Departure date selected:", sector1DepDay);

        const departureDatePreference = await driver.$(
          "~Departure Preferences",
        );
        await departureDatePreference.waitForExist({ timeout: 5000 });
        await driver.pause(2000);

        const departureDatePreferenceSelect = await driver.$(
          '//android.widget.Button[@content-desc="After 6PM"]',
        );
        await departureDatePreferenceSelect.waitForExist({ timeout: 10000 });
        await departureDatePreferenceSelect.click();
        console.log("Departure preference selected");
      } catch (e) {
        console.warn("Could not select departure date or preference:", e);
      }

      // --------------- SECTOR 2 --------------- //
      console.log("SELECTING AIRPORTS FOR SECTOR 2");

      const [sector2From, sector2To] = this.getTwoUniqueAirports(
        [fromCode, toCode],
        allAirportCodes,
      );
      console.log(`Sector 2 From: ${sector2From}, To: ${sector2To}`);
      await driver.pause(2000);

      await this.selectAirportSector2Multicity();
      console.log(`Sector 2 airports selected: ${sector2From} to ${sector2To}`);
      await driver.pause(2000);
      console.log("FROM AIRPORT SELECTED FOR SECTOR 2");
      await driver.pause(2000);

      // Retry until Sector 2 date is after Sector 1
      let sector2DepDay: number | null = null;
      const maxRetries = 5;
      let attempt = 0;

      try {
        while (attempt < maxRetries) {
          console.log(
            "Calling selectDepartureDate for Sector 2 (attempt " +
              (attempt + 1) +
              ")",
          );

          sector2DepDay = await this.selectDepartureDateMulticity(
            driver,
            sector1DepDay !== null ? sector1DepDay : undefined,
          );
          console.log("Sector 2 Departure Date Selected:", sector2DepDay);

          if (sector1DepDay !== null && sector2DepDay >= sector1DepDay) {
            console.log(" Valid Sector 2 Date: " + sector2DepDay);

            const departureDatePreference = await driver.$(
              "~Departure Preferences",
            );
            await departureDatePreference.waitForExist({ timeout: 5000 });
            await driver.pause(1000);

            const departureDatePreferenceSelect = await driver.$(
              '//android.widget.Button[@content-desc="After 6PM"]',
            );
            await departureDatePreferenceSelect.waitForExist({
              timeout: 10000,
            });
            await departureDatePreferenceSelect.click();
            await driver.pause(1000);

            break;
          } else {
            console.warn(
              ` Invalid Sector 2 Date (${sector2DepDay}) — should be >= Sector 1 (${sector1DepDay})`,
            );
            attempt++;

            const backButton = await driver.$(
              '//android.widget.Button[@content-desc="Navigate up"]',
            );
            if (await backButton.isDisplayed()) {
              await backButton.click();
              await driver.pause(1000);
            }
          }
        }

        if (attempt === maxRetries) {
          throw new Error(
            "F Failed to select valid Sector 2 date after multiple attempts.",
          );
        }
      } catch (err) {
        console.error("Error selecting Sector 2 departure date:", err);
      }

      try {
        const cabinClass = await driver.$(
          '//android.view.View[contains(@content-desc, "Cabin Class")]',
        );
        await cabinClass.waitForExist({ timeout: 5000 });
        await cabinClass.click();
        const dropdownOption = await driver.$(
          '//android.widget.RadioButton[@content-desc="Economy"]',
        );
        await dropdownOption.waitForExist({ timeout: 5000 });
        await dropdownOption.click();
        const windowSize = await driver.getWindowSize();
        const startX = Math.floor(windowSize.width / 2);
        const startY = Math.floor(windowSize.height * 0.8);
        const endY = Math.floor(windowSize.height * 0.6);

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
        await driver.back();
        console.log(" Cabin class selected: Economy");
      } catch (e) {
        console.warn(" Cabin class selection failed");
      }

      try {
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
      } catch (e) {
        console.warn(" Passenger count selection failed");
      }
      await driver.pause(2000);
      const searchButton = await driver.$(
        '//android.widget.Button[@content-desc="Search Flights"]',
      );
      await searchButton.waitForExist({ timeout: 5000 });
      console.log(
        "11111111111111111111111111111111111111111111111111111111111111111111111111Search button found, clicking to search flights...",
      );
      await searchButton.click();
    } catch (err: any) {
      console.error(" Error during createTravelRequest:", err.message || err);
      throw err;
    }
  }

  private async selectAirportSector1(type: "From" | "To", code: string) {
    const driver = this.driver;
    const label = type === "From" ? "From\nChoose From" : "To\nChoose To";
    const field = await driver.$(`~${label}`);
    await field.waitForDisplayed({ timeout: 60000 }); // ✅ CHNAGE TO RUN IN HEADLESS MODE

    // await field.waitForExist({ timeout: 55000 });
    await field.click();
    const searchField = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );

    await searchField.waitForExist({ timeout: 55000 });
    await searchField.click();
    await driver.pause(500);
    await searchField.addValue(code);

    const option = await driver.$(
      `android=new UiSelector().descriptionStartsWith("${code} ")`,
    );
    await option.waitForExist({ timeout: 20000 });
    await option.click();
    console.log(`${type} airport selected from picker: ${code}`);
    await driver.pause(2000);
  }
  private async selectDepartureDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    const departureDate = await driver.$(
      '//android.view.View[@content-desc="Departure Date\nChoose Departure Date"]',
    );
    await departureDate.waitForExist({ timeout: 20000 });
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

  private async selectReturnDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    console.log("SELECTING RETURN DATE...");

    const returnDate = await driver.$("~Return Date\nChoose Return Date");
    await returnDate.waitForExist({ timeout: 5000 });
    await returnDate.click();
    console.log("RETURN DATE ELEMENT CLICKED");
    await driver.pause(2000);

    // Choose a return day at least 1 day after departure
    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;
    console.log(`Selected return day: ${returnDay}`);

    // If returnDay > 28, go to next month and reset returnDay
    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      console.log("NEXT MONTH BUTTON FOUND");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      console.log("NEXT MONTH BUTTON CLICKED");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1; // pick 1-5 of next month
    }
    console.log(`FINAL RETURN DATE: ${returnDay}`);
    const returnDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    console.log("RETURN DATE ELEMENT FOUND FOR FINAL SELECTION");

    await returnDateElement.waitForExist({ timeout: 20000 });
    await returnDateElement.click();

    await driver.pause(2000);
  }

  private async selectAirportSector1Multicity() {
    const driver = this.driver;

    // Hardcoded airport codes instead of reading from JSON
    const fromCode = "TRV"; // This was originally from JSON
    const toCode = "MAA"; // This was originally from JSON

    // Select "From"
    const fromLabel = "From\nChoose From";
    const fromField = await driver.$(`~${fromLabel}`);
    await fromField.waitForExist({ timeout: 20000 });
    await fromField.click();
    const searchFieldFrom = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    await searchFieldFrom.waitForExist({ timeout: 20000 });
    await searchFieldFrom.click();
    await driver.pause(500);
    await searchFieldFrom.addValue(fromCode);
    await driver.pause(3000);

    const fromOptions = await driver.$$(`//android.view.View[@content-desc]`);
    if ((await fromOptions.length) > 1) {
      await fromOptions[2].click();
    } else if ((await fromOptions.length) > 0) {
      await fromOptions[0].click();
    }
    await driver.pause(2000);

    // Select "To"
    const toLabel = "To\nChoose To";
    const toField = await driver.$(`~${toLabel}`);
    const toFound = await toField
      .waitForExist({ timeout: 20000 })
      .catch(() => false);
    if (!toFound) {
      const src = await driver.getPageSource();
      console.log(
        "\n===== PAGE SOURCE (SECTOR 1 'TO' MISSING) START =====\n" +
          src +
          "\n===== PAGE SOURCE (SECTOR 1 'TO' MISSING) END =====\n",
      );
      throw new Error(
        "Sector 1 'To' field (~To\\nChoose To) not found after selecting From.",
      );
    }
    await toField.click();
    const searchFieldTo = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    await searchFieldTo.waitForExist({ timeout: 20000 });
    await searchFieldTo.click();
    await driver.pause(500);
    await searchFieldTo.addValue(toCode);
    await driver.pause(3000);

    const toOptions = await driver.$$(`//android.view.View[@content-desc]`);
    if ((await toOptions.length) > 1) {
      await toOptions[2].click();
    } else if ((await toOptions.length) > 0) {
      await toOptions[0].click();
    }
    await driver.pause(2000);
  }

  private async selectAirportSector2Multicity() {
    const driver = this.driver;

    // Hardcoded airport codes instead of reading from JSON
    const sector1From = "TRV";
    const sector1To = "MAA";
    const sector2From = "DEL";
    const sector2To = "BLR";

    // Ensure uniqueness of sector 2 airports
    const allCodes = [sector1From, sector1To];
    if (allCodes.includes(sector2From) || allCodes.includes(sector2To)) {
      throw new Error(
        "Sector 2 airports must be unique and different from sector 1 airports.",
      );
    }

    // Scroll to and click Sector 2 "From" field
    const sector2FromField = await driver.$(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().descriptionContains("Choose From"))',
    );
    await sector2FromField.waitForExist({ timeout: 10000 });
    await sector2FromField.click();
    console.log("SCROLLING INTO VIEW AND SECTOR 2 FROM FIELD CLICKED");

    const searchFieldFrom = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    await searchFieldFrom.waitForExist({ timeout: 10000 });
    await searchFieldFrom.click();
    await searchFieldFrom.setValue(sector2From);
    await driver.pause(2000);
    await this.selectAirportByCode(sector2From);
    await driver.pause(1000);

    // Step 1: scroll the Sector 2 "To" field into view
    console.log("Scrolling Sector 2 'To' into view...");
    await driver.$(
      'android=new UiScrollable(new UiSelector().scrollable(true).instance(0)).setMaxSearchSwipes(10).scrollIntoView(new UiSelector().descriptionContains("Choose To"))',
    );
    await driver.pause(1000);

    const sector2ToField = await driver.$(
      'android=new UiSelector().descriptionContains("Choose To").clickable(true)',
    );
    await sector2ToField.waitForExist({ timeout: 20000 });

    await sector2ToField.click({ y: -70 });
    console.log("SECTOR 2 TO FIELD CLICKED");
    await driver.pause(3000);

    let searchFieldTo = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    if (!(await searchFieldTo.isExisting())) {
      console.log("Picker did not open, clicking To field again...");
      await sector2ToField.click({ y: -70 });
      await driver.pause(3000);
      searchFieldTo = await driver.$(
        'android=new UiSelector().className("android.widget.EditText")',
      );
    }

    await searchFieldTo.waitForExist({ timeout: 60000 });
    console.log(
      "2222222222222222222222222222222222222222222222222222222222222222222SEARCH FIELD FOR SECTOR 2 TO EXISTED",
    );
    await searchFieldTo.click();
    console.log(
      "3333333333333333333333333333333333333333333333333333333333333333333333333333 FIELD FOR SECTOR 2 TO CLICKED",
    );
    await searchFieldTo.setValue(sector2To);
    await driver.pause(2000);
    await this.selectAirportByCode(sector2To);
    await driver.pause(1000);
  }

  public async selectAirportByCode(code: string) {
    const driver = this.driver;

    try {
      const searchField = await driver.$(
        'android=new UiSelector().className("android.widget.EditText")',
      );
      await searchField.waitForExist({ timeout: 20000 });
      await searchField.click();
      await driver.pause(500);
      await searchField.clearValue();
      await searchField.addValue(code);
      await driver.pause(2000); // let suggestions load

      const airportOptions = await driver.$$(
        `//android.view.View[@content-desc]`,
      );
      if ((await airportOptions.length) === 0) {
        console.log(`8888888888888888888888888888888888888888888888888`);
        console.log(
          `No options found initially for ${code}, scrolling to bottom...`,
        );
        // await this.scrollToBottom(); // 🔽 SCROLL DOWN TO LOAD MORE
      }

      for (const option of airportOptions) {
        const desc = await option.getAttribute("content-desc");
        if (desc.includes(code)) {
          console.log(`[selectAirportByCode] FOUND OPTION WITH DESC: ${desc}`);
          await option.click();
          console.log(`[selectAirportByCode] Selected: ${desc}`);
          return;
        }
      }

      throw new Error(`Could not find airport with code: ${code}`);
    } catch (err) {
      console.error(`❌ Failed to select airport ${code}`, err);
      throw err;
    }
  }

  private async selectDepartureDateMulticity(
    driver: WebdriverIO.Browser,
    minDay: number = 1, // default to 1st if not passed
  ): Promise<number> {
    const departureDate = await driver.$(
      '//android.view.View[@content-desc="Departure Date\nChoose Departure Date"]',
    );
    await departureDate.waitForExist({ timeout: 20000 });
    await departureDate.click();

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
    );
    await nextMonthButton.click();

    // Generate a valid random day from minDay to 28
    const randomDate = Math.floor(Math.random() * (28 - minDay + 1)) + minDay;

    try {
      const dateElement = await driver.$(
        `//android.widget.Button[contains(@content-desc, "${randomDate}, ")]`,
      );
      await dateElement.waitForExist({ timeout: 20000 });
      await dateElement.click();
    } catch (error) {
      console.error(`Error selecting date ${randomDate}:`, error);
      throw error;
    }

    await driver.pause(2000);

    const windowSize = await driver.getWindowSize();
    const startX = Math.floor(windowSize.width / 2);
    const startY = Math.floor(windowSize.height * 0.8);
    const endY = Math.floor(windowSize.height * 0.6);

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

    return randomDate;
  }
}
