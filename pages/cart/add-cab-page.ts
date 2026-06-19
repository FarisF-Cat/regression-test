// import { IataUtil } from "../util/cab/iata-util";

import { IataUtil } from "../../pages/util/cab/iata-util";

// import { IataUtil } from "pages/util/cab/iata-util";

import { AirportCity } from "../../pages/types/common/airport-city-map";
// import { TestsData } from "../types/common/data-test";
import airportTransferData from "../testdata/airporttransfer.json";
export class AddCabPage {
  driver: WebdriverIO.Browser;
  selectedPickup: string = "";
  selectedPickupCity: string = ""; // ✅ new property for drop-off city
  airportData: AirportCity[] = airportTransferData;

  // IataUtil: IataUtil;
  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
    //  this.IataUtil = new IataUtil();
  }

  async cabCreationLocalCab(origin: string, cabJourneyType: string) {
    const driver = this.driver;
    //  try {
    await driver.pause(2000);
    console.log("CREATING TRAVEL REQUEST FOR FLIGHT BOOKING SCREEN");

    const cabIconTap = await driver.$(
      '//android.widget.ImageView[@content-desc="Cab"]',
    );
    await cabIconTap.waitForExist({ timeout: 55000 });
    await cabIconTap.click();
    console.log(" Clicked on CAB Icon");

    const cabBookingScreen = await driver.$(
      '//android.view.View[@content-desc="Cab Booking"]',
    );
    await cabBookingScreen.waitForExist({ timeout: 20000 });
    console.log("Navigated to CAB Booking Screen");
    await driver.pause(3000);

    const localRadioButton = await driver.$(
      '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(0)',
    );
    await localRadioButton.waitForExist({ timeout: 5000 });
    console.log("LOCAL CAB RADIO BUTTON FOUND");
    await driver.pause(500);

    await driver.pause(2000);
    if (cabJourneyType === "LOCALCAB") {
      console.log("SELECTING LOCAL CAB JOURNEY TYPE");

      await localRadioButton.click();

      console.log("LOCAL CAB RADIO BUTTON CLICKED");
      console.log("cabJourneyType:", cabJourneyType);
      await driver.pause(2000);
      console.log("CLICKED ON PICKUP");

      await this.selectCabPickupLocalCabLocation(origin);
      console.log("PICKUP LOCATION SELECTED");
      await driver.pause(2000);

      const departureDay = await this.selectLocalCabFromDate(driver);
      console.log(`DEPARTURE DATE SELECTED: ${departureDay}`);
      await driver.pause(2000);

      await this.selectLocalCabReturnDate(driver, departureDay);
      console.log("RETURN DATE SELECTED");
      // await this.selectLocalCabFromDate(driver);
      // await driver.pause(2000);
      // console.log("DEPARTURE DATE SELECTED");

      // await this.selectLocalCabReturnDate(driver, 1);
      // console.log("RETURN DATE SELECTED");
      const cabType = await driver.$(
        '//android.view.View[@content-desc="Cab Type"]',
      );
      await cabType.waitForExist({ timeout: 20000 });
      await cabType.click();

      const cabTypeDropDown = await driver.$(
        '//android.widget.RadioButton[@content-desc="Sedan Compact"]',
      );
      await cabTypeDropDown.waitForExist({ timeout: 20000 });
      await cabTypeDropDown.click();
      console.log("CAB TYPE SELECTED");
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
      const proceedButtonCabBooking = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabBooking.waitForExist({ timeout: 6000 });
      await proceedButtonCabBooking.click();
      console.log("PROCEED BUTTON CLICKED");
    }
    // } catch (err) {
    //   console.error(` FAILED TO SELECT ROUNDTRIP DATA `, err);
    //   throw err;
    // }
  }

  async cabCreationOutstation(origin: string, destination: string) {
    const driver = this.driver;
    try {
      await driver.pause(2000);
      console.log("CREATING TRAVEL REQUEST FOR FLIGHT BOOKING SCREEN");

      const cabIconTap = await driver.$(
        '//android.widget.ImageView[@content-desc="Cab"]',
      );
      await cabIconTap.waitForExist({ timeout: 55000 });
      await cabIconTap.click();
      console.log(" Clicked on CAB Icon");

      const cabBookingScreen = await driver.$(
        '//android.view.View[@content-desc="Cab Booking"]',
      );
      await cabBookingScreen.waitForExist({ timeout: 20000 });
      console.log("Navigated to CAB Booking Screen");
      await driver.pause(3000);
      const outStationCabRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(1)',
      );
      await outStationCabRadioButton.waitForExist({ timeout: 1000 });
      console.log("OUTSTATION CAB radio button found, clicking...");
      console.log(
        "SELECTING OUTSTATION JOURNEY TYPE  22222222222222222222222222222",
      );
      await outStationCabRadioButton.click();
      console.log("OUTSTATION CAB RADIO BUTTON CLICKED");
      await driver.pause(2000);
      await this.selectCabPickupLocation(origin);
      await driver.pause(3000);
      await this.selectCabDropoffLocation(destination, origin);
      console.log("CAB PICKUP LOCATION SELECTED");
      await driver.pause(3000);

      const departureDay = await this.selectCabDepartureDate(driver);
      await driver.pause(3000);
      await this.selectCabReturnDate(driver, departureDay);
      const tripType = await driver.$(
        '//android.view.View[@content-desc="Trip Type"]',
      );
      await tripType.waitForExist({ timeout: 5000 });
      await tripType.click();

      const tripTypeDropDown = await driver.$(
        '//android.widget.RadioButton[@content-desc="Oneway"]',
      );
      await tripTypeDropDown.waitForExist({ timeout: 5000 });
      await tripTypeDropDown.click();
      const cabType = await driver.$(
        '//android.view.View[@content-desc="Cab Type"]',
      );
      await cabType.waitForExist({ timeout: 5000 });
      await cabType.click();

      const cabTypeDropDown = await driver.$(
        '//android.widget.RadioButton[@content-desc="Sedan Compact"]',
      );
      await cabTypeDropDown.waitForExist({ timeout: 5000 });
      await cabTypeDropDown.click();
      await driver.pause(3000);
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
      const proceedButton = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButton.waitForExist({ timeout: 3000 });
      await proceedButton.click();
    } catch (err) {
      console.error(` FAILED TO NAVIGATE TO CAB BOOKING SCREEN `, err);
      throw err;
    }
  }

  async cabCreationAirportTransfer() {
    const driver = this.driver;

    const cabIconTap2 = await driver.$(
      '//android.widget.ImageView[@content-desc="Cab"]',
    );
    await cabIconTap2.waitForExist({ timeout: 55000 });
    await cabIconTap2.click();
    console.log(" Clicked on CAB Icon");

    const cabBookingScreen2 = await driver.$(
      '//android.view.View[@content-desc="Cab Booking"]',
    );
    await cabBookingScreen2.waitForExist({ timeout: 20000 });
    console.log("Navigated to CAB Booking Screen");
    await driver.pause(3000);

    const airportTransferRadioButton2 = await driver.$(
      '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(2)',
    );
    await airportTransferRadioButton2.waitForExist({ timeout: 5000 });
    console.log("AIPORT TRANSFER CAB RADIO BUTTON FOUND");
    await driver.pause(500);
    await airportTransferRadioButton2.click();
    console.log("Airport Transfer Radio Button Clicked");

    await driver.pause(2000);
    const tripType = await driver.$(
      '//android.view.View[@content-desc="Trip Type"]',
    );
    await tripType.waitForExist({ timeout: 5000 });
    console.log("TRIP TYPE FIELD FOUND");
    await driver.pause(500);
    await tripType.click();
    const tripTypeDropDown = await driver.$(
      '//android.widget.RadioButton[@content-desc="Airport Pickup"]',
    );
    await tripTypeDropDown.waitForExist({ timeout: 5000 });
    console.log("TRIP TYPE FIELD FOUND");
    await driver.pause(500);
    await tripTypeDropDown.click();
    console.log("TRIP TYPE SELECTED AS AIRPORT PICKUP");
    await driver.pause(2000);

    // ---------------- AIRPORT ----------------
    const airport = await driver.$(
      '//android.view.View[@content-desc="Airport"]',
    );
    await airport.waitForExist({ timeout: 5000 });
    console.log("AIRPORT FIELD FOUND");

    await driver.pause(500);
    await airport.click();
    console.log("AIRPORT FIELD CLICKED");

    // ✅ Select airport
    const airportDropDown = await driver.$("//android.widget.RadioButton[1]");
    await airportDropDown.waitForExist({ timeout: 5000 });
    console.log("AIRPORT DROPDOWN FOUND");

    // 🔥 Get airport text BEFORE clicking (important)
    const airportText = await airportDropDown.getAttribute("content-desc");
    console.log("🌍 SELECTED AIRPORT TEXT:", airportText);

    await airportDropDown.click();
    console.log("✅ AIRPORT SELECTED");

    // 🔥 Extract IATA (e.g., TRV, DEL, etc.)
    const iataMatch = airportText.match(/[A-Z]{3}/);
    const selectedIataCode = iataMatch ? iataMatch[0] : "";

    console.log("✈️ EXTRACTED IATA:", selectedIataCode);

    if (!selectedIataCode) {
      throw new Error(
        "❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXTIATA CODE NOT FOUND FROM AIRPORT TEXT",
      );
    }

    // 🔥 Convert IATA → City
    const airportData = airportTransferData; // your JSON

    const cityFromIata =
      IataUtil.getCityForIata(selectedIataCode, airportData) || "";

    console.log("🏙️ CITY FROM IATA:", cityFromIata);

    if (!cityFromIata) {
      throw new Error(
        `❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌ Unable to map IATA ${selectedIataCode}`,
      );
    }

    // ---------------- CAB TYPE ----------------
    await driver.pause(500);

    const cabType = await driver.$(
      '//android.view.View[@content-desc="Cab Type"]',
    );
    await cabType.waitForExist({ timeout: 5000 });
    console.log("CAB TYPE FIELD FOUND");

    await cabType.click();

    const cabTypeDropDown = await driver.$(
      '//android.widget.RadioButton[@content-desc="Sedan Compact"]',
    );
    await cabTypeDropDown.waitForExist({ timeout: 5000 });
    await cabTypeDropDown.click();
    console.log("CAB TYPE SELECTED");

    await driver.pause(2000);

    const cabBookingProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await cabBookingProceedButton.waitForExist({ timeout: 7000 });
    await cabBookingProceedButton.click();
    console.log("CAB BOOKING PROCEED CLICKED");

    // ---------------- PAX DETAILS ----------------
    const paxDetails = await driver.$(
      '//android.view.View[@content-desc="Pax Details"]',
    );
    await paxDetails.waitForExist({ timeout: 5000 });
    console.log("ENTERED PAX DETAILS SCREEN");

    await driver.pause(2000);

    // ---------------- DROP OFF ----------------
    try {
      console.log("STARTING DROP OFF SELECTION");

      const dropDownField = await driver.$(
        '//android.view.View[contains(@content-desc, "Drop-off Point") and contains(@content-desc, "Choose")]',
      );
      await dropDownField.waitForExist({ timeout: 8000 });
      await dropDownField.click();
      console.log("DROP OFF CLICKED");

      const dropdownListInput = await driver.$("//android.widget.EditText");
      await dropdownListInput.waitForDisplayed({ timeout: 20000 });
      await dropdownListInput.click();

      // 🔥 Use city derived from IATA
      const dropOffValue = cityFromIata;

      console.log("🔥 VALUE USED FOR DROP-OFF:", dropOffValue);

      if (!dropOffValue) {
        throw new Error("❌ Drop-off city value not available");
      }

      await dropdownListInput.setValue(dropOffValue);

      await driver.pause(1000);

      const suggestionLocator = `//android.view.View[contains(@content-desc, "${dropOffValue}")]`;

      await driver.waitUntil(
        async () => {
          const els = await driver.$$(suggestionLocator);
          return (await els.length) > 0;
        },
        {
          timeout: 15000,
          timeoutMsg: `❌ CITY SUGGESTION NOT FOUND: ${dropOffValue}`,
        },
      );

      const suggestions = await driver.$$(suggestionLocator);

      let selected = false;
      for (const el of suggestions) {
        const text = await el.getAttribute("content-desc");
        if (text && text.includes(dropOffValue)) {
          await el.click();
          console.log("✅ DROP OFF SELECTED:", text);
          selected = true;
          break;
        }
      }

      // fallback
      if (!selected && (await suggestions.length) > 0) {
        await suggestions[0].click();
        console.log("⚠️ FALLBACK: FIRST OPTION SELECTED");
      }
    } catch (error) {
      console.error("❌ DROP OFF ERROR:", error);
      throw error;
    }
    // ---------------- FINAL PROCEED ----------------

    const paxDetailsProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await paxDetailsProceedButton.waitForExist({ timeout: 7000 });
    await paxDetailsProceedButton.click();

    console.log("✅ PAX DETAILS PROCEED CLICKED");
  }

  private async selectCabPickupLocalCabLocation(code: string) {
    const driver = this.driver;
    const label = "Pickup";

    // STEP 1: Click the "Pickup" field on the main screen
    const pickupCode = await driver.$(
      `//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Choose Pickup")]`,
    );
    // const pickupCode = await driver.$(
    //   `//android.view.View[contains(@content-desc, "Pickup Choose Pickup")]`
    // );

    await pickupCode.waitForExist({ timeout: 20000 });
    await pickupCode.click();

    console.log(
      `CLICKED ON THE  "${label}" field.NAVIGATING TO THE LOCATION SCREEN.`,
    );

    // STEP 2: Tap on the search input field using coordinates
    console.log("Finding the search input field using UiSelector...");
    const searchFieldLocator =
      'android=new UiSelector().className("android.widget.EditText")';
    const searchField = await driver.$(searchFieldLocator);
    await searchField.waitForExist({ timeout: 20000 });

    const { x, y } = await searchField.getLocation();
    const { width, height } = await searchField.getSize();
    const tapX = Math.floor(x + width * 0.1); // 10% from left
    const tapY = Math.floor(y + height * 0.5); // Center vertically

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

    // STEP 3: Type the pickup code
    console.log(`Typing "${code}" into the search field...`);
    await searchField.addValue(code);
    await driver.pause(3000); // wait for results to appear

    // STEP 4: Tap the first result using coordinates
    const searchResultLocator = `//android.view.View[contains(@content-desc, "${code}")]`;
    const locationOptions = await driver.$$(searchResultLocator);

    if ((await locationOptions.length) > 0) {
      const firstResult = locationOptions[0];
      const { x, y } = await firstResult.getLocation();
      const { width, height } = await firstResult.getSize();

      const resultTapX = Math.floor(x + width * 0.3); // 30% from left
      const resultTapY = Math.floor(y + height * 0.5); // vertically centered

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

      console.log(
        `Successfully tapped the first result for pickup location "${code}".`,
      );
    } else {
      console.error(`No pickup options found for '${code}'.`);
      throw new Error(`No pickup options found for '${code}'.`);
    }

    await driver.pause(2000);
    console.log(`Pickup location selection complete for "${code}".`);
  }

  private async selectLocalCabFromDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    const pickupDate = await driver.$(
      `//android.view.View[contains(@content-desc, "From Date") and contains(@content-desc, "Choose From Date")]`,
    );

    await pickupDate.waitForExist({ timeout: 20000 });
    await pickupDate.click();

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
  private async selectLocalCabReturnDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    console.log("SELECTING RETURN DATE...");
    const returnDate = await driver.$(
      `//android.view.View[contains(@content-desc, "Return Date") and contains(@content-desc, "Choose Return Date")]`,
    );

    await returnDate.waitForExist({ timeout: 5000 });
    await returnDate.click();
    console.log("RETURN DATE ELEMENT CLICKED");
    await driver.pause(2000);

    // Ensure the return day is always after the departure day
    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;

    // If returnDay > 28, go to the next month and reset returnDay
    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      console.log("NEXT MONTH BUTTON FOUND");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      console.log("NEXT MONTH BUTTON CLICKED");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1; // Pick 1-5 of the next month
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
  private async selectCabPickupLocation(code: string) {
    const driver = this.driver;
    const label = "Pickup";

    // STEP 1: Click the "Pickup" field on the main screen

    const pickupCode = await driver.$(
      '//android.view.View[contains(@content-desc, "Pickup Point") and contains(@content-desc, "Choose Pickup Point")]',
    );

    await pickupCode.waitForExist({ timeout: 20000 });
    await pickupCode.click();

    console.log(
      `CLICKED ON THE  "${label}" field.NAVIGATING TO THE LOCATION SCREEN.`,
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
    const locationOptions = await driver.$$(searchResultLocator);

    if ((await locationOptions.length) > 0) {
      const firstResult = locationOptions[0];
      const { x, y } = await firstResult.getLocation();
      const { width, height } = await firstResult.getSize();

      const resultTapX = Math.floor(x + width * 0.3); // 30% from left
      const resultTapY = Math.floor(y + height * 0.5); // vertically centered

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

      console.log(
        `Successfully tapped the first result for pickup location "${code}".`,
      );
    } else {
      console.error(`No pickup options found for '${code}'.`);
      throw new Error(`No pickup options found for '${code}'.`);
    }

    this.selectedPickup = code;
    console.log("SELECTED PICKUP SET FOR DROPOFF:", this.selectedPickup);

    await driver.pause(2000);
    console.log(`Pickup location selection complete for "${code}".`);
  }

  private async selectCabDropoffLocation(code: string, excludeCode: string) {
    const driver = this.driver;
    const label = "Drop";

    // STEP 1: Click the "Drop" field on the main screen
    const dropFieldLocator = `//android.view.View[contains(@content-desc, "Drop")]`;
    console.log(`ATTEMPTING TO CLICK AND FIND THE  "${label}" field...`);
    const dropField = await driver.$(dropFieldLocator);
    await dropField.waitForExist({ timeout: 20000 });
    await dropField.click();
    console.log(
      `CLICKED ON THE  "${label}" field. NAVIGATING TO THE LOCATION SCREEN.`,
    );

    // STEP 2: Tap on the search input field using coordinates
    console.log("Finding the drop search input field using UiSelector...");
    const searchFieldLocator =
      'android=new UiSelector().className("android.widget.EditText")';
    const searchField = await driver.$(searchFieldLocator);
    await searchField.waitForExist({ timeout: 20000 });

    const { x, y } = await searchField.getLocation();
    const { width, height } = await searchField.getSize();
    const tapX = Math.floor(x + width * 0.1); // 10% from left
    const tapY = Math.floor(y + height * 0.5); // Center vertically

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

    // STEP 3: Type the drop code
    console.log(`Typing "${code}" into the drop search field...`);
    await searchField.addValue(code);
    await driver.pause(3000); // wait for results to appear

    // STEP 4: Tap the first valid result (not the same as pickup)
    const searchResultLocator = `//android.view.View[contains(@content-desc, "${code}")]`;
    const locationOptions = await driver.$$(searchResultLocator);

    if ((await locationOptions.length) > 0) {
      for (const option of locationOptions) {
        const desc = await option.getAttribute("content-desc");
        if (desc && !desc.includes(excludeCode)) {
          const { x, y } = await option.getLocation();
          const { width, height } = await option.getSize();

          const resultTapX = Math.floor(x + width * 0.3);
          const resultTapY = Math.floor(y + height * 0.5);

          console.log(
            `Tapping on drop-off location "${desc}" at (${resultTapX}, ${resultTapY})`,
          );
          await driver.performActions([
            {
              type: "pointer",
              id: "finger1",
              parameters: { pointerType: "touch" },
              actions: [
                {
                  type: "pointerMove",
                  duration: 0,
                  x: resultTapX,
                  y: resultTapY,
                },
                { type: "pointerDown", button: 0 },
                { type: "pause", duration: 100 },
                { type: "pointerUp", button: 0 },
              ],
            },
          ]);
          await driver.releaseActions();
          console.log(`Successfully selected drop-off location "${desc}".`);
          break;
        }
      }
    } else {
      console.error(`No drop-off options found for '${code}'.`);
      throw new Error(`No drop-off options found for '${code}'.`);
    }

    await driver.pause(2000);
    console.log(`Drop-off location selection complete for "${code}".`);
  }

  private async selectCabDepartureDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    const pickupDate = await driver.$(
      `//android.view.View[contains(@content-desc, "Pickup Date")]`,
    );

    await pickupDate.waitForExist({ timeout: 20000 });
    await pickupDate.click();

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

  private async selectCabReturnDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    console.log("SELECTING RETURN DATE...");

    const returnDate = await driver.$(
      `//android.view.View[contains(@content-desc, "Drop-off Date")]`,
    );
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
}
