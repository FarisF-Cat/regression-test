import logger from '@wdio/logger'
const log = logger('AddFlightHotelPage')

export class AddFlightHotelPage {
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

  async createFlightHotel(
    city: string,
    fromCode: string,
    toCode: string,
    allAirportCodes: string[],
  ) {
    const driver = this.driver;
    await driver.pause(5500);
 
    await driver.pause(3000);
 
    const flightIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Flight")',
    );
    await flightIconTap.waitForExist({ timeout: 60000 });
    await flightIconTap.click();
    log.info(" Clicked on Flight Icon");
 
    const flightBookingScreen = await driver.$(
      '-android uiautomator:new UiSelector().description("Flight Booking")',
    );
    await flightBookingScreen.waitForExist({ timeout: 20000 });
    log.info("Navigated to Flight Booking Screen");
 
    const roundtripRadioButton = await driver.$(
      '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(1)',
    );
 
    await roundtripRadioButton.waitForExist({ timeout: 5000 });
    await driver.pause(500);
    await roundtripRadioButton.click();
 
    log.info("SELECTING ROUNDTRIP JOURNEY TYPE  ");
    await this.selectAirportSector1("From", fromCode);
    log.info(`From airport selected: ${fromCode}`);
    await driver.pause(5000);
 
    await this.selectAirportSector1("To", toCode);
    log.info(
      `To airport selected: ${toCode}`,
    );
    await driver.pause(2000);
 
    let depDayFlight: number | null = null;
 
    try {
      log.info("Calling selectDepartureDate...");
      depDayFlight = await this.selectDepartureDate(driver);
      log.info("Departure date selected:", depDayFlight);
 
      const departureDatePreference = await driver.$("~Departure Preferences");
      await departureDatePreference.waitForExist({ timeout: 5000 });
      await driver.pause(2000);
 
      const departureDatePreferenceSelect = await driver.$(
        '//android.widget.Button[@content-desc="After 6PM"]',
      );
      await departureDatePreferenceSelect.waitForExist({ timeout: 10000 });
      await departureDatePreferenceSelect.click();
      log.info("Departure preference selected");
    } catch (e) {
      log.warn("Could not select departure date or preference:", e);
    }
 
    // --------------- SECTOR 2 --------------- //
    log.info("SELECTING AIRPORTS FOR SECTOR 2");
 
    const [sector2From, sector2To] = this.getTwoUniqueAirports(
      [fromCode, toCode],
      allAirportCodes,
    );
    log.info(`Sector 2 From: ${sector2From}, To: ${sector2To}`);
    log.info(`Sector 2 airports selected: ${sector2From} to ${sector2To}`);
    await driver.pause(2000);
    log.info("FROM AIRPORT SELECTED FOR SECTOR 2");
 
    // ✅ Only call return date selection if depDay was set
    if (depDayFlight !== null) {
      log.info("RETURN DATE SELECTION");
 
      try {
        log.info("CALLING RETURN DATE:", depDayFlight);
        await this.selectReturnDate(driver, depDayFlight);
        log.info(" RETURN DATE SELECTED: ", depDayFlight);
      } catch (e) {
        log.warn("NOT SELECTING RETURN DATE :", e);
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
 
      log.info("Return preference selected");
    } else {
      log.warn(
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
      log.info(" Cabin class selected: Economy");
    } catch (e) {
      log.warn(" Cabin class selection failed");
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
      log.info("Passenger count set");
    } catch (e) {
      log.warn(" Passenger count selection failed");
    }
 
    const searchButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Flights"]',
    );
    await searchButton.waitForExist({ timeout: 30000 });
    await searchButton.click();
    log.info(" Searching flights...");
    await driver.pause(5000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        log.info("TRAVEL POLICY DEVIATION POPUP FOUND");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 5000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        log.info("TRAVEL POLICY DEVIATION POPUP YES BUTTON CLICKED");
      } else {
        log.info("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
      }
    } catch (e) {
      log.info("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
    }
 
    await driver.pause(5000);
 
    const searchResults = await driver.$(
      '//android.view.View[@content-desc="Great things take time! Searching the best flights for your needs"]',
    );
    const isLoading = await searchResults.isExisting();
    if (isLoading) {
      log.info("Loading message found, waiting for flights to load...");
      await driver.pause(10000); // or however long you want to wait
    } else {
      log.info("Loading message not found, continuing...");
    }
 
    try {
      log.info(" Waiting before loading flight cards...");
      await driver.pause(2000);
      log.info("ONWARD FLIGHT SELECTION SCREEN LOADING...");
 
      const onwardFlightSelection = await driver.$(
        '//android.view.View[@content-desc="Onward Flights"]',
      );
 
      try {
        await onwardFlightSelection.waitForExist({ timeout: 30000 });
      } catch (e) {
        const pageSource = await driver.getPageSource();
        log.error(
          "ONWARD FLIGHT SELECTION NOT FOUND. Current page source:",
        );
        log.error(pageSource);
        throw new Error("ONWARD FLIGHT SELECTION NOT FOUND");
      }
 
      log.info("ONWARD FLIGHT SELECTION SCREEN FOUND ");
 
      const onwardFlightText = await driver.$(
        '//android.widget.ImageView[contains(@content-desc, "Don\'t find what you are looking for")]',
      );
      const isOnwardFlightTextVisible = await onwardFlightText.isExisting();
 
      if (isOnwardFlightTextVisible) {
        log.info(
          "ONWARD FLIGHT SELECTION SCROLLIG DOWN .................................................................................................",
        );
 
        // Scroll down to find the Choose button
 
        const { width, height } = await driver.getWindowSize();
        await driver.execute("mobile: swipeGesture", {
          left: width / 2,
          top: height * 0.9, // start near bottom
          width: 0,
          height: height * 0.7, // long swipe
          direction: "up", // IMPORTANT: scroll down
          percent: 0.95, // stronger swipe
        });
      }
 
      const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
      log.info("FIRST FLIGHT CARD FOUND");
      await firstFlightCard.waitForExist({ timeout: 6000 });
      log.info(" FIRST FLIGHT CARD FOUND  WAITING FOR SHOW FARES OPTION");
      const showFaresOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Show").instance(0)',
      );
      await showFaresOption.waitForDisplayed({ timeout: 5000 });
 
      await showFaresOption.waitForExist({ timeout: 2000 });
      await showFaresOption.click();
      log.info(" SHOW FARE  OPTION CLICKED");
 
      const chooseButton = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Choose").instance(0)',
      );
      await chooseButton.waitForExist({ timeout: 15000 });
      await chooseButton.click();
      log.info(" ONWARD FLIGHT CHOSEN BUTTON CLICKED ");
    } catch (err: any) {
      log.error(" ERROR DURING FLIGHT SELECTION:", err.message || err);
      throw err;
    }
 
    await driver.pause(2500);
 
    const { width, height } = await driver.getWindowSize();
 
    await driver.execute("mobile: swipeGesture", {
      left: width * 0.95,
      top: height * 0.2,
      width: width * 0.05,
      height: height * 0.1,
      direction: "right",
      percent: 0.3,
    });
 
    log.info("RETURN FLIGHT SELECTION SCREEN LOADING...");
    try {
      await driver.pause(2000);
      const returnTab = await driver.$(
        '//android.view.View[contains(@content-desc, "Return")]',
      );
 
      await returnTab.waitForExist({ timeout: 5000 });
      await returnTab.waitForDisplayed({ timeout: 5000 });
      await returnTab.waitForEnabled({ timeout: 5000 });
      log.info("RETURN TAB FOUND, CLICKING...............................");
    } catch (e) {
      throw new Error("ROUNDTRIP: RETURN TAB NOT FOUND — TEST FAILED");
    }
    log.info("RETURN FLIGHT SELECTION SCREEN LOADED");
    await driver.pause(2000);
    log.info(
      "RETURN FLIGHT SELECTION SCREEN LOADED, WAITING FOR FIRST FLIGHT CARD",
    );
    try {
      const firstReturnFlightCard = await driver.$(
        "(//android.widget.ImageView[@content-desc])[1]",
      );
      await firstReturnFlightCard.waitForExist({ timeout: 2000 });
      log.info("FIRST FLIGHT CARD FOUND IN RETURN SELECTION SCREEN");
      const returnShowFaresOption = await driver.$(
        '//android.view.View[contains(@content-desc, "Show") and contains(@content-desc, "fares")]',
      );
      log.info("RETURN SHOW FARES OPTION FOUND");
 
      await returnShowFaresOption.waitForExist({ timeout: 2000 });
      await returnShowFaresOption.click();
      log.info(" SHOW FARE  OPTION CLICKED");
 
      const returnChooseButton = await driver.$(
        '//android.widget.Button[@content-desc="Choose"]',
      );
      await returnChooseButton.waitForExist({ timeout: 15000 });
      await returnChooseButton.click();
      log.info(" RETURN  FLIGHT CHOSEN BUTTON CLICKED ");
    } catch (err) {
      log.error("ERROR DURING RETURN FLIGHT SELECTION :", err);
      throw err;
    }
 
    ////PROCEED BUTTON FOR RETURN AND ONLINE FLIGHT AFTER SELECTION
    log.info("PROCEED BUTTON FOR RETURN AND ONLINE FLIGHT AFTER SELECTION");
    const proceedButtonAfterFlightSelection = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await proceedButtonAfterFlightSelection.waitForExist({ timeout: 2000 });
    log.info(
      "PROCEED BUTTON FOUND AFTER FLIGHT SELECTION  IS GOING TO BE CLICKEFD ",
    );
    await proceedButtonAfterFlightSelection.click();
 
    await driver.pause(4000);
    // try {
    const chooseAnxillaryScreenOfRoundTrip = await driver.$(
      '//android.view.View[@content-desc="Choose Ancillaries"]',
    );
    const exists = await chooseAnxillaryScreenOfRoundTrip.isExisting();
    if (exists) {
      log.info("CHOOSE ANXILLARY SCREEN OF ROUND TRIP FOUND");
      await chooseAnxillaryScreenOfRoundTrip.waitForExist({
        timeout: 10000,
      });
    } else {
      log.warn("Choose Ancillaries screen not found, continuing...");
    }
    // }
 
    await driver.pause(2000);
 
    const summaryProceedBtn = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    if (await summaryProceedBtn.isExisting()) {
      log.info("Summary Proceed button found, clicking to continue...");
      await summaryProceedBtn.click();
      await driver.pause(8000);
 
      // Wait for Choose Ancillaries screen
 
      const chooseAncillariesScreen = await driver.$(
        '//android.view.View[@content-desc="Choose Ancillaries"]',
      );
      if (await chooseAncillariesScreen.isExisting()) {
        log.info("Choose Ancillaries screen loaded");
 
        // Click the "Choose seat" button and wait for the seat map to load
        const chooseSeat = await driver.$(
          '//android.view.View[@content-desc="Choose seat"]',
        );
        await chooseSeat.waitForExist({ timeout: 20000 });
        log.info("CHOOSE SEAT Button Found, GOING TO BE CLICKED");
        await chooseSeat.click();
        log.info("CHOOSE SEAT CLICKED");
 
        // Wait for the seat map page to load
        const chooseSeatMapPage = await driver.$(
          '//android.view.View[@content-desc="Choose Seat Map"]',
        );
        await chooseSeatMapPage.waitForExist({ timeout: 20000 });
        log.info("CHOOSE SEAT PAGE FOUND");
        await driver.pause(2000); // Wait for seat map to fully render
 
        // Now run your seat selection logic
        log.info("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");
        const seatElements = await driver.$$(
          "//android.view.View[@content-desc]",
        );
        let found = false;
        for (const seat of seatElements) {
          const seatNumber = await seat.getAttribute("content-desc");
          if (/^[1-9][A-F]$/.test(seatNumber)) {
            try {
              log.info(`TRYING SEAT: ${seatNumber}`);
              await seat.click();
              const seatDetailsPopup = await driver.$(
                '//android.view.View[starts-with(@content-desc, "Seat Details")]',
              );
              const popupAppeared = await seatDetailsPopup
                .waitForExist({ timeout: 2000 })
                .catch(() => false);
              if (popupAppeared) {
                const doneButton = await driver.$(
                  '//android.widget.Button[@content-desc="Done"]',
                );
                await doneButton.waitForExist({ timeout: 3000 });
                await doneButton.click();
                found = true;
                log.info(`SELECTED SEAT: ${seatNumber}`);
                break;
              } else {
                log.info(`Seat ${seatNumber} not available (no popup).`);
                continue;
              }
            } catch (err) {
              log.error(`ERROR SELECTING THE SEAT ${seatNumber}:`, err);
              continue;
            }
          }
        }
        if (!found) {
          log.info("NO AVAILABLE SEATS FOUND BY SEAT NUMBER.");
        }
        await driver.pause(2000);
        const doneButtonSelector =
          '//android.widget.Button[@content-desc="Done"]';
        const doneButton = await driver.$(doneButtonSelector);
        if (await doneButton.isExisting()) {
          await doneButton.click();
          await driver.pause(500);
          if (await doneButton.isExisting()) {
            await doneButton.click();
            await driver.pause(500);
          }
        } else {
        }
 
        await driver.pause(1000);
 
        try {
          const chooseMeals = await driver.$("~Choose meal");
          if (await chooseMeals.isExisting()) {
            await chooseMeals.waitForExist({ timeout: 5000 });
            await chooseMeals.click();
            await driver.pause(1000);
            const mealsSelection = await driver.$(
              '//android.widget.RadioButton[contains(@content-desc, "No Meal")]',
            );
 
            await mealsSelection.waitForExist({ timeout: 5000 });
            await mealsSelection.click();
 
            const mealsSelectionBackButton = await driver.$(
              "android.widget.Button",
            );
            await mealsSelectionBackButton.waitForExist({ timeout: 3000 });
            await mealsSelectionBackButton.click();
            log.info("Meal selected and exited");
          }
        } catch (e) {
          log.warn("Meal selection skipped or not available");
        }
 
        // Now click the Proceed button on the Choose Ancillaries screen
        await driver.pause(2000);
        const ancillariesProceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );
        if (await ancillariesProceedBtn.isExisting()) {
          log.info(
            "Proceed button on Choose Ancillaries found, clicking...",
          );
          await ancillariesProceedBtn.click();
          await driver.pause(4000);
        }
      } else {
        log.info("Choose Ancillaries screen not found, continuing...");
      }
    }
    // Now wait for the Create Travel Request screen
    await driver.pause(2000);
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]',
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000, interval:3000 });
    log.info(
      "PROCEED BUTTON CLICKED AND CREATE TRAVEL REQUEST SCREEN LOADED",
    );
    await driver.pause(4000);
    const createTravelRequestScreenProceedButton1 = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton1.waitForExist({
      timeout: 6000,
    });
 
    log.info("✅STARTING THE HOTEL BOOKING PROCESS...");
    await driver.pause(5000);
    // try {
 
    const hotelIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Hotel")',
    );
    await hotelIconTap.waitForExist({ timeout: 40000 });
    await hotelIconTap.click();
    log.info(" Clicked on HOTEL  Icon");
 
    const hotelBookingScreen = await driver.$(
      '-android uiautomator:new UiSelector().description("Hotel Booking")',
    );
    await hotelBookingScreen.waitForExist({ timeout: 30000 });
    log.info("Navigated to  HOTEL Booking Screen");
 
    //        ***********LOCATION OF STAY*************************
    log.info("CLICKING ON LOCATION OF STAY");
 
    await driver
      .$(
        '//android.view.View[contains(@content-desc, "Choose Location of Stay")]',
      )
      .click();
 
    log.info("CLICKED ON LOCATION OF STAY 11111111111111111111");
    await driver.pause(4000);
    log.info(
      "****************************CLICKing  ON LOCATION OF STAY ************************",
    );
    const locationOfStay = await driver.$("//android.widget.EditText");
    await locationOfStay.waitForExist({ timeout: 4000 });
    log.info("LOCATION OF STAY ELEMENT FOUND ");
    await locationOfStay.click();
 
    await this.selectLocationOfStay(city);
    log.info(
      "SELECTED LOCATION OF STAY  333333331113131331311311313131313311313113: ",
      city,
    );
 
    await driver.pause(2000);
    const rows = await driver.$$(`//android.view.View[@content-desc]`);
    for (const el of rows) {
      const desc = await el.getAttribute("content-desc");
      log.info("Suggestion row:", desc);
    }
    log.info(
      "CLICKED ON SUGGESTION LIST ITEM 44444444444444444444444444444",
    );
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
    log.info("Passenger count set");
    await driver.pause(2000);
    let depDay: number | null = null;
    log.info("Calling SELECTCHECKINDATE...........");
 
    depDay = await this.selectCheckInDate(driver);
    log.info("Departure date selected:", depDay);
    await driver.pause(2000);
 
    if (depDay !== null) {
      log.info("CHECK OUT  DATE SELECTION");
 
      try {
        log.info("CALLING CHECK OU DATE:", depDay);
        await this.selectCheckOutDate(driver, depDay);
        log.info(" CHECK OUT SELECTED: ", depDay);
      } catch (e) {
        log.warn("NOT SELECTING CHECK OUT DATE :", e);
      }
 
      await driver.pause(2000);
    }
 
    const distance = await driver.$(
      '//android.widget.SeekBar[@content-desc="100%"]',
    );
    await distance.waitForExist({ timeout: 6000 });
    await distance.click();
    log.info("DISTANCE  set");
 
    await driver.pause(2500);
 
    const searchHotelButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Hotels"]',
    );
    await searchHotelButton.waitForExist({ timeout: 8000 });
    await searchHotelButton.click();
    log.info("DISTANCE  set");
    await driver.pause(5000);
 
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        log.info("TRAVEL POLICY DEVIATION POPUP FOUND");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 5000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        log.info("TRAVEL POLICY DEVIATION POPUP YES BUTTON CLICKED");
      } else {
        log.info("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
      }
    } catch (e) {
      log.info("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
    }
    await driver.pause(4000);
    log.info("HOTEL SEARCHING SCREEN LOADING STARTED");
 
    const hotelSearchingScreenLoading = await driver.$(
      '//android.view.View[@content-desc="Great things take time! Searching the best hotels for your needs"]',
    );
    await hotelSearchingScreenLoading
      .waitForExist({ timeout: 150000 })
      .catch(() => {
        log.info(
          "??????????????????????????????????????????????????????????HOTEL SEARCHING LOADER  NOT VSISBLE ?????????????????????????????????????????????????????.",
        );
      });
 
    await driver.pause(2500);
    log.info(
      " HOTEL SEARCHING RESULT SCREEN LOADING STARTED ",
    );
    const hotelSearchingResultScreen = await driver.$(
      '//android.view.View[@clickable="true" and @content-desc]',
    );
 
    await hotelSearchingResultScreen.waitForDisplayed({ timeout: 150000 });
    log.info("✅ Hotel search results displayed.");
 
    await hotelSearchingResultScreen.click();
    log.info(
      "HOTEL SEARCHING RESULT SCREEN CLICKED 3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
    );
    await driver.pause(2000);
 
    const hotelSearchingResultScreenClicked = await driver.$(
      'android=new UiSelector().className("android.view.View").instance(11)',
    );
 
    await hotelSearchingResultScreenClicked.waitForExist({ timeout: 150000 });
    log.info(
      "HOTEL SEARCHING RESULT SCREEN CLICKED FOUND 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );
 
    const showRoomButton = await driver.$(
      '//android.widget.Button[@content-desc="Show Rooms"]',
    );
 
    await showRoomButton.waitForExist({ timeout: 150000 });
 
    await showRoomButton.click();
    log.info(
      "SHOW ROOMS BUTTON CLICKED  6666666666666666666666666666666666666666666666666666666666666666666666666666666666",
    );
 
    await driver.pause(4000);
 
    await driver.pause(4000);
    const bookNowScreen = await driver.$(
      '(//android.widget.Button[@content-desc="Book Now"])[1]',
    );
    log.info("BOOK NOW SCREEN FOUND 🟢");
 
    await bookNowScreen.waitForExist({ timeout: 150000 });
 
    if (!(await bookNowScreen.isExisting())) {
      throw new Error("NO BOOK NOW BUTTONS FOUND ON THE SCREEN ❌");
    }
 
    await bookNowScreen.click();
    log.info("BOOK NOW BUTTON CLICKED ✅");
 
    const createTravelRequestScreenBackButton = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    await createTravelRequestScreenBackButton.waitForExist({
      timeout: 150000,
    });
 
    await driver.pause(2000);
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 150000,
    });
    log.info("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    await createTravelRequestScreenProceedButton.click();
  }

  private async selectAirportSector1(type: "From" | "To", code: string) {
    const driver = this.driver;

    const field = await driver.$(
      `android=new UiSelector().descriptionContains("${type}")`,
    );

    await driver.pause(4000);

    await field.waitForDisplayed({ timeout: 50000 });

    await field.click();

    const searchField = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    await searchField.waitForDisplayed({ timeout: 50000 });
    await searchField.click();
    await driver.pause(500);
    await searchField.setValue(code);
    await driver.pause(3000);

    const airportOptions = await driver.$$(
      "//android.view.View[@content-desc]",
    );
    await driver.pause(2000);
    if ((await airportOptions.length) > 1) {
      log.debug(
        `multiple airport options found, selecting the third: ${await airportOptions[2].getAttribute("content-desc")}`,
     );
      await airportOptions[2].click();
    } else if ((await airportOptions.length) > 0) {
      log.debug(
        `only one airport option found, selecting it: ${await airportOptions[0].getAttribute("content-desc")}`,
     );
      await airportOptions[0].click();
    }

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
      log.error(`error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }

  private async selectReturnDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    log.info("selecting return date..");

    const returnDate = await driver.$("~Return Date\nChoose Return Date");
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
      log.error(`error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }

  private async selectCheckOutDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    log.info("selecting return date..");

    const checkOutDate = await driver.$("~Check Out\nChoose Check Out");
    await checkOutDate.waitForExist({ timeout: 5000 });
    await checkOutDate.click();
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
    const checkOutDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    log.debug("return date element found for final selection");

    await checkOutDateElement.waitForExist({ timeout: 20000 });
    await checkOutDateElement.click();

    await driver.pause(2000);
  }
}
