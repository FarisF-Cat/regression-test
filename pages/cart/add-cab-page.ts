// import { IataUtil } from "../util/cab/iata-util";

import { IataUtil } from "../../pages/util/cab/iata-util";

// import { IataUtil } from "pages/util/cab/iata-util";

import { AirportCity } from "../../pages/types/common/airport-city-map";
// import { TestsData } from "../types/common/data-test";
import airportTransferData from "../../testdata/airporttransfer.json";
import logger from '@wdio/logger'
const log = logger('AddCabPage')

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
    log.info("creating travel request for flight booking screen");

    const cabIconTap = await driver.$(
      '//android.widget.ImageView[@content-desc="Cab"]',
    );
    await cabIconTap.waitForExist({ timeout: 55000 });
    await cabIconTap.click();
    log.info(" clicked on cab icon");

    const cabBookingScreen = await driver.$(
      '//android.view.View[@content-desc="Cab Booking"]',
    );
    await cabBookingScreen.waitForExist({ timeout: 20000 });
    log.info("navigated to cab booking screen");
    await driver.pause(3000);

    const localRadioButton = await driver.$(
      '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(0)',
    );
    await localRadioButton.waitForExist({ timeout: 5000 });
    log.debug("local cab radio button found");
    await driver.pause(500);

    await driver.pause(2000);
    if (cabJourneyType === "LOCALCAB") {
      log.info("selecting local cab journey type");

      await localRadioButton.click();

      log.info("local cab radio button clicked");
      log.info("cabjourneytype:", cabJourneyType);
      await driver.pause(2000);
      log.info("clicked on pickup");

      await this.selectCabPickupLocalCabLocation(origin);
      log.debug("pickup location selected");
      await driver.pause(2000);

      const departureDay = await this.selectLocalCabFromDate(driver);
      log.info(`departure date selected: ${departureDay}`);
      await driver.pause(2000);

      await this.selectLocalCabReturnDate(driver, departureDay);
      log.info("return date selected");
      // await this.selectLocalCabFromDate(driver);
      // await driver.pause(2000);
      // log.info("departure date selected");

      // await this.selectLocalCabReturnDate(driver, 1);
      // log.info("return date selected");
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
      log.info("cab type selected");
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
      log.info("passenger count set");
      await driver.pause(2000);
      const proceedButtonCabBooking = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabBooking.waitForExist({ timeout: 6000 });
      await proceedButtonCabBooking.click();
      log.info("proceed button clicked");
    }
    // } catch (err) {
    //   log.error(` failed to select roundtrip data `, err);
    //   throw err;
    // }
  }

  async cabCreationOutstation(origin: string, destination: string) {
    const driver = this.driver;
    try {
      await driver.pause(2000);
      log.info("creating travel request for flight booking screen");

      const cabIconTap = await driver.$(
        '//android.widget.ImageView[@content-desc="Cab"]',
      );
      await cabIconTap.waitForExist({ timeout: 55000 });
      await cabIconTap.click();
      log.info(" clicked on cab icon");

      const cabBookingScreen = await driver.$(
        '//android.view.View[@content-desc="Cab Booking"]',
      );
      await cabBookingScreen.waitForExist({ timeout: 20000 });
      log.info("navigated to cab booking screen");
      await driver.pause(3000);
      const outStationCabRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(1)',
      );
      await outStationCabRadioButton.waitForExist({ timeout: 1000 });
      log.debug("outstation cab radio button found, clicking..");
      log.info(
        "selecting outstation journey type  22222222222222222222222222222",
     );
      await outStationCabRadioButton.click();
      log.info("outstation cab radio button clicked");
      await driver.pause(2000);
      await this.selectCabPickupLocation(origin);
      await driver.pause(3000);
      await this.selectCabDropoffLocation(destination, origin);
      log.debug("cab pickup location selected");
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
      log.info("passenger count set");
      const proceedButton = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButton.waitForExist({ timeout: 3000 });
      await proceedButton.click();
    } catch (err) {
      log.error(` failed to navigate to cab booking screen `, err);
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
    log.info(" clicked on cab icon");

    const cabBookingScreen2 = await driver.$(
      '//android.view.View[@content-desc="Cab Booking"]',
    );
    await cabBookingScreen2.waitForExist({ timeout: 20000 });
    log.info("navigated to cab booking screen");
    await driver.pause(3000);

    const airportTransferRadioButton2 = await driver.$(
      '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(2)',
    );
    await airportTransferRadioButton2.waitForExist({ timeout: 5000 });
    log.debug("aiport transfer cab radio button found");
    await driver.pause(500);
    await airportTransferRadioButton2.click();
    log.info("airport transfer radio button clicked");

    await driver.pause(2000);
    const tripType = await driver.$(
      '//android.view.View[@content-desc="Trip Type"]',
    );
    await tripType.waitForExist({ timeout: 5000 });
    log.debug("trip type field found");
    await driver.pause(500);
    await tripType.click();
    const tripTypeDropDown = await driver.$(
      '//android.widget.RadioButton[@content-desc="Airport Pickup"]',
    );
    await tripTypeDropDown.waitForExist({ timeout: 5000 });
    log.debug("trip type field found");
    await driver.pause(500);
    await tripTypeDropDown.click();
    log.info("trip type selected as airport pickup");
    await driver.pause(2000);

    // ---------------- AIRPORT ----------------
    const airport = await driver.$(
      '//android.view.View[@content-desc="Airport"]',
    );
    await airport.waitForExist({ timeout: 5000 });
    log.debug("airport field found");

    await driver.pause(500);
    await airport.click();
    log.info("airport field clicked");

    // ✅ Select airport
    const airportDropDown = await driver.$("//android.widget.RadioButton[1]");
    await airportDropDown.waitForExist({ timeout: 5000 });
    log.debug("airport dropdown found");

    // 🔥 Get airport text BEFORE clicking (important)
    const airportText = await airportDropDown.getAttribute("content-desc");
    log.info("🌍 selected airport text:", airportText);

    await airportDropDown.click();
    log.info("✅ airport selected");

    // 🔥 Extract IATA (e.g., TRV, DEL, etc.)
    const iataMatch = airportText.match(/[A-Z]{3}/);
    const selectedIataCode = iataMatch ? iataMatch[0] : "";

    log.info("✈️ extracted iata:", selectedIataCode);

    if (!selectedIataCode) {
      throw new Error(
        "❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌❌ ❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXT❌ IATA CODE NOT FOUND FROM AIRPORT TEXTIATA CODE NOT FOUND FROM AIRPORT TEXT",
      );
    }

    // 🔥 Convert IATA → City
    const airportData = airportTransferData; // your JSON

    const cityFromIata =
      IataUtil.getCityForIata(selectedIataCode, airportData) || "";

    log.info("🏙️ city from iata:", cityFromIata);

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
    log.debug("cab type field found");

    await cabType.click();

    const cabTypeDropDown = await driver.$(
      '//android.widget.RadioButton[@content-desc="Sedan Compact"]',
    );
    await cabTypeDropDown.waitForExist({ timeout: 5000 });
    await cabTypeDropDown.click();
    log.info("cab type selected");

    await driver.pause(2000);

    const cabBookingProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await cabBookingProceedButton.waitForExist({ timeout: 7000 });
    await cabBookingProceedButton.click();
    log.info("cab booking proceed clicked");

    // ---------------- PAX DETAILS ----------------
    const paxDetails = await driver.$(
      '//android.view.View[@content-desc="Pax Details"]',
    );
    await paxDetails.waitForExist({ timeout: 5000 });
    log.info("entered pax details screen");

    await driver.pause(2000);

    // ---------------- DROP OFF ----------------
    try {
      log.info("starting drop off selection");

      const dropDownField = await driver.$(
        '//android.view.View[contains(@content-desc, "Drop-off Point") and contains(@content-desc, "Choose")]',
      );
      await dropDownField.waitForExist({ timeout: 8000 });
      await dropDownField.click();
      log.info("drop off clicked");

      const dropdownListInput = await driver.$("//android.widget.EditText");
      await dropdownListInput.waitForDisplayed({ timeout: 20000 });
      await dropdownListInput.click();

      // 🔥 Use city derived from IATA
      const dropOffValue = cityFromIata;

      log.info("🔥 value used for drop-off:", dropOffValue);

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
          log.info("✅ drop off selected:", text);
          selected = true;
          break;
        }
      }

      // fallback
      if (!selected && (await suggestions.length) > 0) {
        await suggestions[0].click();
        log.info("⚠️ fallback: first option selected");
      }
    } catch (error) {
      log.error("❌ drop off error:", error);
      throw error;
    }
    // ---------------- FINAL PROCEED ----------------

    const paxDetailsProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await paxDetailsProceedButton.waitForExist({ timeout: 7000 });
    await paxDetailsProceedButton.click();

    log.info("✅ pax details proceed clicked");
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

    log.debug(
      `clicked on the  "${label}" field.navigating to the location screen.`,
   );

    // STEP 2: Tap on the search input field using coordinates
    log.debug("finding the search input field using uiselector..");
    const searchFieldLocator =
      'android=new UiSelector().className("android.widget.EditText")';
    const searchField = await driver.$(searchFieldLocator);
    await searchField.waitForExist({ timeout: 20000 });

    const { x, y } = await searchField.getLocation();
    const { width, height } = await searchField.getSize();
    const tapX = Math.floor(x + width * 0.1); // 10% from left
    const tapY = Math.floor(y + height * 0.5); // Center vertically

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

    // STEP 3: Type the pickup code
    log.debug(`typing "${code}" into the search field..`);
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

      log.debug(
        `successfully tapped the first result for pickup location "${code}".`,
     );
    } else {
      log.error(`no pickup options found for '${code}'`);
      throw new Error(`No pickup options found for '${code}'.`);
    }

    await driver.pause(2000);
    log.debug(`pickup location selection complete for "${code}"`);
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
      log.error(`error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }
  private async selectLocalCabReturnDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    log.info("selecting return date..");
    const returnDate = await driver.$(
      `//android.view.View[contains(@content-desc, "Return Date") and contains(@content-desc, "Choose Return Date")]`,
    );

    await returnDate.waitForExist({ timeout: 5000 });
    await returnDate.click();
    log.info("return date element clicked");
    await driver.pause(2000);

    // Ensure the return day is always after the departure day
    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;

    // If returnDay > 28, go to the next month and reset returnDay
    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      log.debug("next month button found");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      log.info("next month button clicked");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1; // Pick 1-5 of the next month
    }

    log.info(`final return date: ${returnDay}`);
    const returnDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    log.debug("return date element found for final selection");

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

    log.debug(
      `clicked on the  "${label}" field.navigating to the location screen.`,
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
    const locationOptions = await driver.$$(searchResultLocator);

    if ((await locationOptions.length) > 0) {
      const firstResult = locationOptions[0];
      const { x, y } = await firstResult.getLocation();
      const { width, height } = await firstResult.getSize();

      const resultTapX = Math.floor(x + width * 0.3); // 30% from left
      const resultTapY = Math.floor(y + height * 0.5); // vertically centered

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

      log.debug(
        `successfully tapped the first result for pickup location "${code}".`,
     );
    } else {
      log.error(`no pickup options found for '${code}'`);
      throw new Error(`No pickup options found for '${code}'.`);
    }

    this.selectedPickup = code;
    log.info("selected pickup set for dropoff:", this.selectedPicku);

    await driver.pause(2000);
    log.debug(`pickup location selection complete for "${code}"`);
  }

  private async selectCabDropoffLocation(code: string, excludeCode: string) {
    const driver = this.driver;
    const label = "Drop";

    // STEP 1: Click the "Drop" field on the main screen
    const dropFieldLocator = `//android.view.View[contains(@content-desc, "Drop")]`;
    log.info(`attempting to click and find the  "${label}" field..`);
    const dropField = await driver.$(dropFieldLocator);
    await dropField.waitForExist({ timeout: 20000 });
    await dropField.click();
    log.debug(
      `clicked on the  "${label}" field. navigating to the location screen.`,
   );

    // STEP 2: Tap on the search input field using coordinates
    log.debug("finding the drop search input field using uiselector..");
    const searchFieldLocator =
      'android=new UiSelector().className("android.widget.EditText")';
    const searchField = await driver.$(searchFieldLocator);
    await searchField.waitForExist({ timeout: 20000 });

    const { x, y } = await searchField.getLocation();
    const { width, height } = await searchField.getSize();
    const tapX = Math.floor(x + width * 0.1); // 10% from left
    const tapY = Math.floor(y + height * 0.5); // Center vertically

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

    // STEP 3: Type the drop code
    log.debug(`typing "${code}" into the drop search field..`);
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

          log.debug(
            `tapping on drop-off location "${desc}" at (${resultTapX}, ${resultTapY})`,
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
          log.debug(`successfully selected drop-off location "${desc}"`);
          break;
        }
      }
    } else {
      log.error(`no drop-off options found for '${code}'`);
      throw new Error(`No drop-off options found for '${code}'.`);
    }

    await driver.pause(2000);
    log.debug(`drop-off location selection complete for "${code}"`);
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
      log.error(`error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }

  private async selectCabReturnDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    log.info("selecting return date..");

    const returnDate = await driver.$(
      `//android.view.View[contains(@content-desc, "Drop-off Date")]`,
    );
    await returnDate.waitForExist({ timeout: 5000 });
    await returnDate.click();
    log.info("return date element clicked");
    await driver.pause(2000);

    // Choose a return day at least 1 day after departure
    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;
    log.info(`selected return day: ${returnDay}`);

    // If returnDay > 28, go to next month and reset returnDay
    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      log.debug("next month button found");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      log.info("next month button clicked");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1; // pick 1-5 of next month
    }
    log.info(`final return date: ${returnDay}`);
    const returnDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    log.debug("return date element found for final selection");

    await returnDateElement.waitForExist({ timeout: 20000 });
    await returnDateElement.click();

    await driver.pause(2000);
  }
}
