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

    await driver.pause(12000);
    // Attempt to restart the UiAutomator2 server if it crashed
    try {
      await driver.execute('mobile: shell', {
        command: 'am',
        args: ['instrument', '-w',
          'io.appium.uiautomator2.server.test/androidx.test.runner.AndroidJUnitRunner']
      });
    } catch {
      // Server may already be alive — continue
    }

    await driver.pause(3000);

    await driver.waitUntil(
      async () => {
        try {
          const els = await driver.$$(
            '-android uiautomator:new UiSelector().description("Flight")'
          );
          return els.length > 0;
        } catch {
          await driver.pause(3000);
          return false;
        }
      },
      { timeout: 60000, interval: 3000, timeoutMsg: "Flight icon did not appear on dashboard" }
    );
    log.info("flight icon visible — dashboard fully loaded");
    
    log.info(
      "11111111111111111111111111111111111111111111111111111flight hotel creation started",
   );
    log.info(
      "2222222222222222222222222222222222222222222222222222222222222222creating travel request for flight booking screen",
   );

    const flightIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Flight")',
    );
    await flightIconTap.waitForExist({ timeout: 60000 });
    await flightIconTap.click();
    log.info(" clicked on flight icon");

    const flightBookingScreen = await driver.$(
      '-android uiautomator:new UiSelector().description("Flight Booking")',
    );
    await flightBookingScreen.waitForExist({ timeout: 20000 });
    log.info("navigated to flight booking screen");

    // await onewayRadioButton.click();
    const roundtripRadioButton = await driver.$(
      '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(1)',
    );

    await roundtripRadioButton.waitForExist({ timeout: 5000 });
    await driver.pause(500);
    await roundtripRadioButton.click();

    log.info(
      "selecting roundtrip journey type  22222222222222222222222222222",
   );
    await this.selectAirportSector1("From", fromCode);
    log.info(`from airport selected: ${fromCode}`);
    await driver.pause(5000);
    log.info(
      "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111from airport selected for sector 1",
   );
    await this.selectAirportSector1("To", toCode);
    log.info(
      `22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222to airport selected: ${toCode}`,
   );
    await driver.pause(2000);

    let depDayFlight: number | null = null;

    try {
      log.info("calling selectdeparturedate..");
      depDayFlight = await this.selectDepartureDate(driver);
      log.info("departure date selected:", depDayFlight);

      const departureDatePreference = await driver.$("~Departure Preferences");
      await departureDatePreference.waitForExist({ timeout: 5000 });
      await driver.pause(2000);

      const departureDatePreferenceSelect = await driver.$(
        '//android.widget.Button[@content-desc="After 6PM"]',
      );
      await departureDatePreferenceSelect.waitForExist({ timeout: 10000 });
      await departureDatePreferenceSelect.click();
      log.info("departure preference selected");
    } catch (e) {
      log.warn("could not select departure date or preference:", );
    }

    // --------------- SECTOR 2 --------------- //
    log.info("selecting airports for sector ");

    const [sector2From, sector2To] = this.getTwoUniqueAirports(
      [fromCode, toCode],
      allAirportCodes,
    );
    log.info(`sector 2 from: ${sector2From}, to: ${sector2To}`);
    // await this.selectAirportSector2(fromCode, toCode, sector2From, sector2To);
    log.info(`sector 2 airports selected: ${sector2From} to ${sector2To}`);
    await driver.pause(2000);
    log.info("from airport selected for sector ");

    // ✅ Only call return date selection if depDay was set
    if (depDayFlight !== null) {
      log.info("return date selection");

      try {
        log.info("calling return date:", depDayFlight);
        await this.selectReturnDate(driver, depDayFlight);
        log.info(" return date selected: ", depDayFlight);
      } catch (e) {
        log.warn("not selecting return date :", );
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

      log.info("return preference selected");
    } else {
      log.warn(
        "skipping return date selection because departure date failed.",
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
      log.info(" cabin class selected: economy");
    } catch (e) {
      log.warn(" cabin class selection faile");
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
      log.info("passenger count set");
    } catch (e) {
      log.warn(" passenger count selection faile");
    }

    const searchButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Flights"]',
    );
    await searchButton.waitForExist({ timeout: 30000 });
    await searchButton.click();
    log.info(" searching flights..");
    await driver.pause(5000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        log.debug("travel policy deviation popup found");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 5000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        log.info("travel policy deviation popup yes button clicked");
      } else {
        log.debug("travel policy deviation popup not found ..");
      }
    } catch (e) {
      log.debug("travel policy deviation popup not found ..");
    }

    await driver.pause(5000);

    const searchResults = await driver.$(
      '//android.view.View[@content-desc="Great things take time! Searching the best flights for your needs"]',
    );
    const isLoading = await searchResults.isExisting();
    if (isLoading) {
      log.debug("loading message found, waiting for flights to load..");
      await driver.pause(10000); // or however long you want to wait
    } else {
      log.debug("loading message not found, continuing..");
    }

    try {
      log.info(" waiting before loading flight cards..");
      await driver.pause(2000);
      log.info("onward flight selection screen loading..");

      const onwardFlightSelection = await driver.$(
        '//android.view.View[@content-desc="Onward Flights"]',
      );

      try {
        await onwardFlightSelection.waitForExist({ timeout: 30000 });
      } catch (e) {
        const pageSource = await driver.getPageSource();
        log.error(
          "onward flight selection not found. current page source:",
       );
        log.error(pageSource);
        throw new Error("ONWARD FLIGHT SELECTION NOT FOUND");
      }

      log.debug("onward flight selection screen found");

      const onwardFlightText = await driver.$(
        '//android.widget.ImageView[contains(@content-desc, "Don\'t find what you are looking for")]',
      );
      const isOnwardFlightTextVisible = await onwardFlightText.isExisting();

      if (isOnwardFlightTextVisible) {
        log.info(
          "onward flight selection scrollig down .................................................................................................",
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
        log.info(
          "✅ scrolled further down to find the choose button    ???????????????????????????????????????????????????????????????????????????????????????//////////////////////////.",
       );
      }

      const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
      log.debug("first flight card found");
      await firstFlightCard.waitForExist({ timeout: 6000 });
      log.debug(" first flight card found  waiting for show fares option");
      const showFaresOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Show").instance(0)',
      );
      await showFaresOption.waitForDisplayed({ timeout: 5000 });

      await showFaresOption.waitForExist({ timeout: 2000 });
      await showFaresOption.click();
      log.info(" show fare  option clicked");

      const chooseButton = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Choose").instance(0)',
      );
      await chooseButton.waitForExist({ timeout: 15000 });
      await chooseButton.click();
      log.info(" onward flight chosen button clicked");
    } catch (err: any) {
      log.error(" error during flight selection:", err.message || err);
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

    log.info("return flight selection screen loading..");
    try {
      await driver.pause(2000);
      const returnTab = await driver.$(
        '//android.view.View[contains(@content-desc, "Return")]',
      );

      await returnTab.waitForExist({ timeout: 5000 });
      await returnTab.waitForDisplayed({ timeout: 5000 });
      await returnTab.waitForEnabled({ timeout: 5000 });
      log.debug("return tab found, clicking..............................");
    } catch (e) {
      throw new Error("ROUNDTRIP: RETURN TAB NOT FOUND — TEST FAILED");
    }
    log.info("return flight selection screen loaded");
    await driver.pause(2000);
    log.info(
      "return flight selection screen loaded, waiting for first flight card",
   );
    try {
      const firstReturnFlightCard = await driver.$(
        "(//android.widget.ImageView[@content-desc])[1]",
      );
      await firstReturnFlightCard.waitForExist({ timeout: 2000 });
      log.debug("first flight card found in return selection screen");
      const returnShowFaresOption = await driver.$(
        '//android.view.View[contains(@content-desc, "Show") and contains(@content-desc, "fares")]',
      );
      log.debug("return show fares option found");

      await returnShowFaresOption.waitForExist({ timeout: 2000 });
      await returnShowFaresOption.click();
      log.info(" show fare  option clicked");

      const returnChooseButton = await driver.$(
        '//android.widget.Button[@content-desc="Choose"]',
      );
      await returnChooseButton.waitForExist({ timeout: 15000 });
      await returnChooseButton.click();
      log.info(" return  flight chosen button clicked");
    } catch (err) {
      log.error("error during return flight selection :", err);
      throw err;
    }

    ////PROCEED BUTTON FOR RETURN AND ONLINE FLIGHT AFTER SELECTION
    log.info("proceed button for return and online flight after selection");
    const proceedButtonAfterFlightSelection = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await proceedButtonAfterFlightSelection.waitForExist({ timeout: 2000 });
    log.debug(
      "proceed button found after flight selection  is going to be clickefd ",
   );
    await proceedButtonAfterFlightSelection.click();

    await driver.pause(4000);
    // try {
    const chooseAnxillaryScreenOfRoundTrip = await driver.$(
      '//android.view.View[@content-desc="Choose Ancillaries"]',
    );
    const exists = await chooseAnxillaryScreenOfRoundTrip.isExisting();
    if (exists) {
      log.debug("choose anxillary screen of round trip found");
      await chooseAnxillaryScreenOfRoundTrip.waitForExist({
        timeout: 10000,
      });
    } else {
      log.warn("choose ancillaries screen not found, continuing..");
    }
    // }

    await driver.pause(2000);

    const summaryProceedBtn = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    if (await summaryProceedBtn.isExisting()) {
      log.debug("summary proceed button found, clicking to continue..");
      await summaryProceedBtn.click();
      await driver.pause(2000);

      // Wait for Choose Ancillaries screen

      const chooseAncillariesScreen = await driver.$(
        '//android.view.View[@content-desc="Choose Ancillaries"]',
      );
      if (await chooseAncillariesScreen.isExisting()) {
        log.info("choose ancillaries screen loaded");

        log.info("finding available seats by seat number pattern");
        // Click the "Choose seat" button and wait for the seat map to load
        const chooseSeat = await driver.$(
          '//android.view.View[@content-desc="Choose seat"]',
        );
        await chooseSeat.waitForExist({ timeout: 20000 });
        log.debug("choose seat button found, going to be clicked");
        await chooseSeat.click();
        log.info("choose seat clicked");

        // Wait for the seat map page to load
        const chooseSeatMapPage = await driver.$(
          '//android.view.View[@content-desc="Choose Seat Map"]',
        );
        await chooseSeatMapPage.waitForExist({ timeout: 20000 });
        log.debug("choose seat page found");
        await driver.pause(2000); // Wait for seat map to fully render

        // Now run your seat selection logic
        log.info("finding available seats by seat number pattern");
        const seatElements = await driver.$$(
          "//android.view.View[@content-desc]",
        );
        let found = false;
        for (const seat of seatElements) {
          const seatNumber = await seat.getAttribute("content-desc");
          if (/^[1-9][A-F]$/.test(seatNumber)) {
            try {
              log.info(`trying seat: ${seatNumber}`);
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
                log.info(`selected seat: ${seatNumber}`);
                break;
              } else {
                log.info(`seat ${seatNumber} not available (no popup)`);
                continue;
              }
            } catch (err) {
              log.error(`error selecting the seat ${seatNumber}:`, err);
              continue;
            }
          }
        }
        if (!found) {
          log.debug("no available seats found by seat number");
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
          log.info(
            '"done" button not present after seat selection, continuing...',
         );
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
            log.info("meal selected and exite");
          }
        } catch (e) {
          log.warn("meal selection skipped or not availabl");
        }

        // Now click the Proceed button on the Choose Ancillaries screen
        await driver.pause(2000);
        const ancillariesProceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );
        if (await ancillariesProceedBtn.isExisting()) {
          log.debug(
            "proceed button on choose ancillaries found, clicking...",
         );
          await ancillariesProceedBtn.click();
          await driver.pause(2000);
        }
      } else {
        log.debug("choose ancillaries screen not found, continuing..");
      }
    }
    // Now wait for the Create Travel Request screen
    await driver.pause(2000);
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]',
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    log.info(
      "proceed button clicked and create travel request screen loaded",
   );
    await driver.pause(4000);
    const createTravelRequestScreenProceedButton1 = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton1.waitForExist({
      timeout: 6000,
    });

    log.info("✅starting the hotel booking process..");
    await driver.pause(5000);
    // try {

    const hotelIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Hotel")',
    );
    await hotelIconTap.waitForExist({ timeout: 40000 });
    await hotelIconTap.click();
    log.info(" clicked on hotel  icon");

    const hotelBookingScreen = await driver.$(
      '-android uiautomator:new UiSelector().description("Hotel Booking")',
    );
    await hotelBookingScreen.waitForExist({ timeout: 30000 });
    log.info("navigated to  hotel booking screen");

    //        ***********LOCATION OF STAY*************************
    log.debug("clicking on location of sta");

    await driver
      .$(
        '//android.view.View[contains(@content-desc, "Choose Location of Stay")]',
      )
      .click();

    log.debug("clicked on location of stay 1111111111111111111");
    await driver.pause(4000);
    log.debug(
      "****************************clicking  on location of stay ************************",
   );
    const locationOfStay = await driver.$("//android.widget.EditText");
    await locationOfStay.waitForExist({ timeout: 4000 });
    log.debug("location of stay element found");
    await locationOfStay.click();

    log.debug(
      "location of stay clicked 222222222222222222222222222222222222222222 ",
   );

    await this.selectLocationOfStay(city);
    log.debug(
      "selected location of stay  333333331113131331311311313131313311313113: ",
      city,
   );

    await driver.pause(2000);
    const rows = await driver.$$(`//android.view.View[@content-desc]`);
    for (const el of rows) {
      const desc = await el.getAttribute("content-desc");
      log.info("suggestion row:", desc);
    }
    log.info(
      "clicked on suggestion list item 44444444444444444444444444444",
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
    log.info("passenger count set");
    await driver.pause(2000);
    let depDay: number | null = null;
    log.info("calling selectcheckindate..........");

    depDay = await this.selectCheckInDate(driver);
    log.info("departure date selected:", depDay);
    await driver.pause(2000);

    if (depDay !== null) {
      log.info("check out  date selection");

      try {
        log.info("calling check ou date:", depDay);
        await this.selectCheckOutDate(driver, depDay);
        log.info(" check out selected: ", depDay);
      } catch (e) {
        log.warn("not selecting check out date :", );
      }

      await driver.pause(2000);
    }

    const distance = await driver.$(
      '//android.widget.SeekBar[@content-desc="100%"]',
    );
    await distance.waitForExist({ timeout: 6000 });
    await distance.click();
    log.info("distance  set");

    await driver.pause(2500);

    const searchHotelButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Hotels"]',
    );
    await searchHotelButton.waitForExist({ timeout: 8000 });
    await searchHotelButton.click();
    log.info("distance  set");
    await driver.pause(5000);

    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        log.debug("travel policy deviation popup found");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 5000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        log.info("travel policy deviation popup yes button clicked");
      } else {
        log.debug("travel policy deviation popup not found ..");
      }
    } catch (e) {
      log.debug("travel policy deviation popup not found ..");
    }
    await driver.pause(4000);
    log.info("hotel searching screen loading started");

    const hotelSearchingScreenLoading = await driver.$(
      '//android.view.View[@content-desc="Great things take time! Searching the best hotels for your needs"]',
    );
    await hotelSearchingScreenLoading
      .waitForExist({ timeout: 15000 })
      .catch(() => {
        log.info(
          "??????????????????????????????????????????????????????????hotel searching loader  not vsisble ?????????????????????????????????????????????????????.",
       );
      });
    log.debug(
      "great things take time loading found  11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
   );
    await driver.pause(2500);
    log.info(
      "////////////////////////////////////////////////////////////////////////hotel searching result screen loading started/////////////////////////////////////////////////////////////////",
   );
    const hotelSearchingResultScreen = await driver.$(
      '//android.view.View[@clickable="true" and @content-desc]',
    );

    await hotelSearchingResultScreen.waitForDisplayed({ timeout: 80000 });
    log.info("✅ hotel search results displayed");

    log.debug(
      "great things take time loading found  11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
   );

    log.debug(
      "hotel searching result screen found 2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222",
   );
    await hotelSearchingResultScreen.click();
    log.info(
      "hotel searching result screen clicked 3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
   );
    await driver.pause(2000);

    const hotelSearchingResultScreenClicked = await driver.$(
      'android=new UiSelector().className("android.view.View").instance(11)',
    );

    await hotelSearchingResultScreenClicked.waitForExist({ timeout: 20000 });
    log.debug(
      "hotel searching result screen clicked found 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
   );

    const showRoomButton = await driver.$(
      '//android.widget.Button[@content-desc="Show Rooms"]',
    );

    await showRoomButton.waitForExist({ timeout: 20000 });
    log.debug(
      "hotel searching result screen clicked found 5555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555",
   );
    await showRoomButton.click();
    log.info(
      "show rooms button clicked  6666666666666666666666666666666666666666666666666666666666666666666666666666666666",
   );

    await driver.pause(4000);

    await driver.pause(4000);
    const bookNowScreen = await driver.$(
      '(//android.widget.Button[@content-desc="Book Now"])[1]',
    );
    log.debug("book now screen found ");

    await bookNowScreen.waitForExist({ timeout: 10000 });

    if (!(await bookNowScreen.isExisting())) {
      throw new Error("NO BOOK NOW BUTTONS FOUND ON THE SCREEN ❌");
    }

    await bookNowScreen.click();
    log.info("book now button clicked ");

    const createTravelRequestScreenBackButton = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    await createTravelRequestScreenBackButton.waitForExist({
      timeout: 20000,
    });

    await driver.pause(2000);
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 5000,
    });
    log.debug("create traveller screen proceed button found");
    await createTravelRequestScreenProceedButton.click();
    log.info("create traveller screen proceed button clicked");
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
