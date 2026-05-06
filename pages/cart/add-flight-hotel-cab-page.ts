import { AddCabPage } from "./add-cab-page";
import { TestsData } from "../../pages/types/common/data-test";
import { getRandomRoute } from "../../util/common/cities-util";
import { CabRequestSearchPage } from "./cab-request-page";

      // let cabData: TestsData;

export class AddFlightHotelCabPage {
  driver: WebdriverIO.Browser;
  cabData: TestsData;

  constructor(driver: WebdriverIO.Browser,cabData: TestsData) {
    this.driver = driver;
    this.cabData = cabData;

  }

    private getTwoUniqueAirports(
    exclude: string[],
    airports: string[]
  ): [string, string] {
    const filtered = airports.filter((a) => !exclude.includes(a));
    if (filtered.length < 2)
      throw new Error("Not enough unique airports for sector 2");
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  }
     async createFlightHotelCab(
         city: string,
    fromCode: string,
    toCode: string,
    allAirportCodes: string[]
    ) {
    const driver = this.driver;
    await driver.pause(5500);
    console.log("FLIGHT HOTEL CREATION STARTED");
    await driver.pause(2000);
    console.log("CREATING TRAVEL REQUEST FOR FLIGHT BOOKING SCREEN");

    const flightIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Flight")'
    );
    await flightIconTap.waitForExist({ timeout: 55000 });
    await flightIconTap.click();
    console.log(" Clicked on Flight Icon");

    const flightBookingScreen = await driver.$(
      '-android uiautomator:new UiSelector().description("Flight Booking")'
    );
    await flightBookingScreen.waitForExist({ timeout: 20000 });
    console.log("Navigated to Flight Booking Screen");

    // await onewayRadioButton.click();
    const roundtripRadioButton = await driver.$(
      '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(1)'
    );

    await roundtripRadioButton.waitForExist({ timeout: 5000 });
    await driver.pause(500);
    await roundtripRadioButton.click();

    console.log(
      "SELECTING ROUNDTRIP JOURNEY TYPE  22222222222222222222222222222"
    );
    await this.selectAirportSector1("From", fromCode);
    console.log(`From airport selected: ${fromCode}`);
    await driver.pause(2000);

    await this.selectAirportSector1("To", toCode);
    console.log(`To airport selected: ${toCode}`);
    await driver.pause(2000);

    let depDayFlight: number | null = null;

    try {
      console.log("Calling selectDepartureDate...");
      depDayFlight = await this.selectDepartureDate(driver);
      console.log("Departure date selected:", depDayFlight);

      const departureDatePreference = await driver.$("~Departure Preferences");
      await departureDatePreference.waitForExist({ timeout: 5000 });
      await driver.pause(2000);

      const departureDatePreferenceSelect = await driver.$(
        '//android.widget.Button[@content-desc="After 6PM"]'
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
      allAirportCodes
    );
    console.log(`Sector 2 From: ${sector2From}, To: ${sector2To}`);
    // await this.selectAirportSector2(fromCode, toCode, sector2From, sector2To);
    console.log(`Sector 2 airports selected: ${sector2From} to ${sector2To}`);
    await driver.pause(2000);
    console.log("FROM AIRPORT SELECTED FOR SECTOR 2");

    // ✅ Only call return date selection if depDay was set
    if (depDayFlight !== null) {
      console.log("RETURN DATE SELECTION");

      try {
        console.log("CALLING RETURN DATE:", depDayFlight);
        await this.selectReturnDate(driver, depDayFlight);
        console.log(" RETURN DATE SELECTED: ", depDayFlight);
      } catch (e) {
        console.warn("NOT SELECTING RETURN DATE :", e);
      }

      const returnDatePreference = await driver.$("~Return Preferences");
      await returnDatePreference.waitForExist({ timeout: 5000 });
      await driver.pause(2000);

      const returnDatePreferenceSelect = await driver.$(
        '(//android.widget.Button[@content-desc="6AM - Noon"])[2]'
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
        "Skipping return date selection because departure date failed."
      );
    }

    try {
      const cabinClass = await driver.$(
        '//android.view.View[contains(@content-desc, "Cabin Class")]'
      );
      await cabinClass.waitForExist({ timeout: 5000 });
      await cabinClass.click();
      const dropdownOption = await driver.$(
        '//android.widget.RadioButton[@content-desc="Economy"]'
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
        '//android.view.View[contains(@content-desc, "No of Pax")]'
      );
      await paxCount.waitForExist({ timeout: 3000 });
      await paxCount.click();

      const addPaxPopUp = await driver.$(
        '//android.view.View[@content-desc="Add Pax"]'
      );
      await addPaxPopUp.waitForExist({ timeout: 5500 });

      const doneButton = await driver.$(
        '//android.widget.Button[@content-desc="Done"]'
      );
      await doneButton.waitForExist({ timeout: 6000 });
      await doneButton.click();
      console.log("Passenger count set");
    } catch (e) {
      console.warn(" Passenger count selection failed");
    }

    const searchButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Flights"]'
    );
    await searchButton.waitForExist({ timeout: 30000 });
    await searchButton.click();
    console.log(" Searching flights...");
    await driver.pause(5000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]'
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        console.log("TRAVEL POLICY DEVIATION POPUP FOUND");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]'
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 5000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        console.log("TRAVEL POLICY DEVIATION POPUP YES BUTTON CLICKED");
      } else {
        console.log("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
      }
    } catch (e) {
      console.log("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
    }

    await driver.pause(5000);

    const searchResults = await driver.$(
      '//android.view.View[@content-desc="Great things take time! Searching the best flights for your needs"]'
    );
    const isLoading = await searchResults.isExisting();
    if (isLoading) {
      console.log("Loading message found, waiting for flights to load...");
      await driver.pause(10000); // or however long you want to wait
    } else {
      console.log("Loading message not found, continuing...");
    }

    try {
      console.log(" Waiting before loading flight cards...");
      await driver.pause(2000);
      console.log("ONWARD FLIGHT SELECTION SCREEN LOADING...");

      const onwardFlightSelection = await driver.$(
        '//android.view.View[@content-desc="Onward Flights"]'
      );

      try {
        await onwardFlightSelection.waitForExist({ timeout: 30000 });
      } catch (e) {
        const pageSource = await driver.getPageSource();
        console.error(
          "ONWARD FLIGHT SELECTION NOT FOUND. Current page source:"
        );
        console.error(pageSource);
        throw new Error("ONWARD FLIGHT SELECTION NOT FOUND");
      }

      console.log("ONWARD FLIGHT SELECTION SCREEN FOUND ");

      const onwardFlightText = await driver.$(
        '//android.widget.ImageView[contains(@content-desc, "Don\'t find what you are looking for")]'
      );
      const isOnwardFlightTextVisible = await onwardFlightText.isExisting();

      if (isOnwardFlightTextVisible) {
        console.log(
          "ONWARD FLIGHT SELECTION SCROLLIG DOWN ................................................................................................."
        );

        // Scroll down to find the Choose button

        const { width, height } = await driver.getWindowSize();
        await driver.execute("mobile: swipeGesture", {
  left: width / 2,
  top: height * 0.9,        // start near bottom
  width: 0,
  height: height * 0.7,     // long swipe
  direction: "up",          // IMPORTANT: scroll down
  percent: 0.95,            // stronger swipe
});

        // await driver.execute("mobile: swipeGesture", {
        //   left: width / 2,
        //   top: height * 0.85, // start slightly lower (closer to bottom)
        //   width: width * 0.5,
        //   height: height * 0.3, // extend swipe distance
        //   direction: "down",
        //   percent: 0.85, // make swipe stronger
        // });

        console.log(
          "✅ Scrolled further down to find the Choose button    ???????????????????????????????????????????????????????????????????????????????????????//////////////////////////."
        );
      }

      const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
      console.log("FIRST FLIGHT CARD FOUND");
      await firstFlightCard.waitForExist({ timeout: 6000 });
      console.log(" FIRST FLIGHT CARD FOUND  WAITING FOR SHOW FARES OPTION");
      const showFaresOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Show").instance(0)'
      );
      await showFaresOption.waitForDisplayed({ timeout: 5000 });

      await showFaresOption.waitForExist({ timeout: 2000 });
      await showFaresOption.click();
      console.log(" SHOW FARE  OPTION CLICKED");

      const chooseButton = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Choose").instance(0)'
      );
      await chooseButton.waitForExist({ timeout: 15000 });
      await chooseButton.click();
      console.log(" ONWARD FLIGHT CHOSEN BUTTON CLICKED ");
    } catch (err: any) {
      console.error(" ERROR DURING FLIGHT SELECTION:", err.message || err);
      throw err;
    }

    // ...existing code...

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

    console.log("RETURN FLIGHT SELECTION SCREEN LOADING...");
    try {
      await driver.pause(2000);
      const returnTab = await driver.$(
        '//android.view.View[contains(@content-desc, "Return")]'
      );

      await returnTab.waitForExist({ timeout: 5000 });
      await returnTab.waitForDisplayed({ timeout: 5000 });
      await returnTab.waitForEnabled({ timeout: 5000 });
      console.log("RETURN TAB FOUND, CLICKING...............................");
    } catch (e) {
      throw new Error("ROUNDTRIP: RETURN TAB NOT FOUND — TEST FAILED");
    }
    console.log("RETURN FLIGHT SELECTION SCREEN LOADED");
    await driver.pause(2000);
    console.log(
      "RETURN FLIGHT SELECTION SCREEN LOADED, WAITING FOR FIRST FLIGHT CARD"
    );
    try {
      const firstReturnFlightCard = await driver.$(
        "(//android.widget.ImageView[@content-desc])[1]"
      );
      await firstReturnFlightCard.waitForExist({ timeout: 2000 });
      console.log("FIRST FLIGHT CARD FOUND IN RETURN SELECTION SCREEN");
      const returnShowFaresOption = await driver.$(
        '//android.view.View[contains(@content-desc, "Show") and contains(@content-desc, "fares")]'
      );
      console.log("RETURN SHOW FARES OPTION FOUND");

      await returnShowFaresOption.waitForExist({ timeout: 2000 });
      await returnShowFaresOption.click();
      console.log(" SHOW FARE  OPTION CLICKED");

      const returnChooseButton = await driver.$(
        '//android.widget.Button[@content-desc="Choose"]'
      );
      await returnChooseButton.waitForExist({ timeout: 15000 });
      await returnChooseButton.click();
      console.log(" RETURN  FLIGHT CHOSEN BUTTON CLICKED ");
    } catch (err) {
      console.error("ERROR DURING RETURN FLIGHT SELECTION :", err);
      throw err;
    }

    ////PROCEED BUTTON FOR RETURN AND ONLINE FLIGHT AFTER SELECTION
    console.log("PROCEED BUTTON FOR RETURN AND ONLINE FLIGHT AFTER SELECTION");
    const proceedButtonAfterFlightSelection = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await proceedButtonAfterFlightSelection.waitForExist({ timeout: 2000 });
    console.log(
      "PROCEED BUTTON FOUND AFTER FLIGHT SELECTION  IS GOING TO BE CLICKEFD "
    );
    await proceedButtonAfterFlightSelection.click();

    await driver.pause(4000);
    // try {
    const chooseAnxillaryScreenOfRoundTrip = await driver.$(
      '//android.view.View[@content-desc="Choose Ancillaries"]'
    );
    const exists = await chooseAnxillaryScreenOfRoundTrip.isExisting();
    if (exists) {
      console.log("CHOOSE ANXILLARY SCREEN OF ROUND TRIP FOUND");
      await chooseAnxillaryScreenOfRoundTrip.waitForExist({
        timeout: 10000,
      });
      // ...rest of your meal selection code...
    } else {
      console.warn("Choose Ancillaries screen not found, continuing...");
    }
    // }

    await driver.pause(2000);

    const summaryProceedBtn = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    if (await summaryProceedBtn.isExisting()) {
      console.log("Summary Proceed button found, clicking to continue...");
      await summaryProceedBtn.click();
      await driver.pause(2000);

      // Wait for Choose Ancillaries screen

      const chooseAncillariesScreen = await driver.$(
        '//android.view.View[@content-desc="Choose Ancillaries"]'
      );
      if (await chooseAncillariesScreen.isExisting()) {
        console.log("Choose Ancillaries screen loaded");

        // Optionally select meals or other ancillaries

        console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");

        // ...existing code...

        // Click the "Choose seat" button and wait for the seat map to load
        const chooseSeat = await driver.$(
          '//android.view.View[@content-desc="Choose seat"]'
        );
        await chooseSeat.waitForExist({ timeout: 20000 });
        console.log("CHOOSE SEAT Button Found, GOING TO BE CLICKED");
        await chooseSeat.click();
        console.log("CHOOSE SEAT CLICKED");

        // Wait for the seat map page to load
        const chooseSeatMapPage = await driver.$(
          '//android.view.View[@content-desc="Choose Seat Map"]'
        );
        await chooseSeatMapPage.waitForExist({ timeout: 20000 });
        console.log("CHOOSE SEAT PAGE FOUND");
        await driver.pause(2000); // Wait for seat map to fully render

        // Now run your seat selection logic
        console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");
        const seatElements = await driver.$$(
          "//android.view.View[@content-desc]"
        );
        let found = false;
        for (const seat of seatElements) {
          const seatNumber = await seat.getAttribute("content-desc");
          if (/^[1-9][A-F]$/.test(seatNumber)) {
            try {
              console.log(`TRYING SEAT: ${seatNumber}`);
              await seat.click();
              const seatDetailsPopup = await driver.$(
                '//android.view.View[starts-with(@content-desc, "Seat Details")]'
              );
              const popupAppeared = await seatDetailsPopup
                .waitForExist({ timeout: 2000 })
                .catch(() => false);
              if (popupAppeared) {
                const doneButton = await driver.$(
                  '//android.widget.Button[@content-desc="Done"]'
                );
                await doneButton.waitForExist({ timeout: 3000 });
                await doneButton.click();
                found = true;
                console.log(`SELECTED SEAT: ${seatNumber}`);
                break;
              } else {
                console.log(`Seat ${seatNumber} not available (no popup).`);
                continue;
              }
            } catch (err) {
              console.error(`ERROR SELECTING THE SEAT ${seatNumber}:`, err);
              continue;
            }
          }
        }
        if (!found) {
          console.log("NO AVAILABLE SEATS FOUND BY SEAT NUMBER.");
        }
        await driver.pause(2000);
        // ...existing code after seat selection...
        const doneButtonSelector =
          '//android.widget.Button[@content-desc="Done"]';
        const doneButton = await driver.$(doneButtonSelector);
        if (await doneButton.isExisting()) {
          await doneButton.click();
          await driver.pause(500); // Give UI time to update
          // Try again in case a second "Done" is needed (some flows show it twice)
          if (await doneButton.isExisting()) {
            await doneButton.click();
            await driver.pause(500);
          }
        } else {
          console.log(
            '"Done" button not present after seat selection, continuing...'
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
              '//android.widget.RadioButton[contains(@content-desc, "No Meal")]'
            );

            await mealsSelection.waitForExist({ timeout: 5000 });
            await mealsSelection.click();

            const mealsSelectionBackButton = await driver.$(
              "android.widget.Button"
            );
            await mealsSelectionBackButton.waitForExist({ timeout: 3000 });
            await mealsSelectionBackButton.click();
            console.log("Meal selected and exited");
          }
        } catch (e) {
          console.warn("Meal selection skipped or not available");
        }

        // Now click the Proceed button on the Choose Ancillaries screen
        await driver.pause(2000);
        const ancillariesProceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]'
        );
        if (await ancillariesProceedBtn.isExisting()) {
          console.log(
            "Proceed button on Choose Ancillaries found, clicking..."
          );
          await ancillariesProceedBtn.click();
          await driver.pause(2000);
        }
      } else {
        console.log("Choose Ancillaries screen not found, continuing...");
      }
    }
 // Now wait for the Create Travel Request screen
    await driver.pause(2000);
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]'
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    console.log(
      "PROCEED BUTTON CLICKED AND CREATE TRAVEL REQUEST SCREEN LOADED"
    );
    await driver.pause(4000);
    const createTravelRequestScreenProceedButton1 = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await createTravelRequestScreenProceedButton1.waitForExist({
      timeout: 6000,
    });
    // console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    // await createTravelRequestScreenProceedButton.click();
    // console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");

    //     }
    //      catch (error) {
    //   console.error("❌ ERROROROROROROROROROROROROROROROORORORO:", error);
    //   throw error; // optional, if you want the test to fail
    // }
    console.log("✅STARTING THE HOTEL BOOKING PROCESS...");
    await driver.pause(5000);
    // try {

    const hotelIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Hotel")'
    );
    await hotelIconTap.waitForExist({ timeout: 40000 });
    await hotelIconTap.click();
    console.log(" Clicked on HOTEL  Icon");

    const hotelBookingScreen = await driver.$(
      '-android uiautomator:new UiSelector().description("Hotel Booking")'
    );
    await hotelBookingScreen.waitForExist({ timeout: 30000 });
    console.log("Navigated to  HOTEL Booking Screen");

    //        ***********LOCATION OF STAY*************************
    console.log("CLICKING ON LOCATION OF STAY");

    await driver
      .$(
        '//android.view.View[contains(@content-desc, "Choose Location of Stay")]'
      )
      .click();

    console.log("CLICKED ON LOCATION OF STAY 11111111111111111111");
    await driver.pause(4000);
    console.log(
      "****************************CLICKing  ON LOCATION OF STAY ************************"
    );
    const locationOfStay = await driver.$("//android.widget.EditText");
    await locationOfStay.waitForExist({ timeout: 4000 });
    console.log("LOCATION OF STAY ELEMENT FOUND ");
    await locationOfStay.click();

    console.log(
      "LOCATION OF STAY CLICKED 222222222222222222222222222222222222222222 "
    );

    await this.selectLocationOfStay(city);
    console.log(
      "SELECTED LOCATION OF STAY  333333331113131331311311313131313311313113: ",
      city
    );

    await driver.pause(2000);
    const rows = await driver.$$(`//android.view.View[@content-desc]`);
    for (const el of rows) {
      const desc = await el.getAttribute("content-desc");
      console.log("Suggestion row:", desc);
    }
    console.log(
      "CLICKED ON SUGGESTION LIST ITEM 44444444444444444444444444444"
    );
    await driver.pause(2000);

    const paxCount = await driver.$(
      '//android.view.View[contains(@content-desc, "No of Pax")]'
    );
    await paxCount.waitForExist({ timeout: 3000 });
    await paxCount.click();

    const addPaxPopUp = await driver.$(
      '//android.view.View[@content-desc="Add Pax"]'
    );
    await addPaxPopUp.waitForExist({ timeout: 5500 });

    const doneButton = await driver.$(
      '//android.widget.Button[@content-desc="Done"]'
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
      '//android.widget.SeekBar[@content-desc="100%"]'
    );
    await distance.waitForExist({ timeout: 6000 });
    await distance.click();
    console.log("DISTANCE  set");

    await driver.pause(2500);

    const searchHotelButton = await driver.$(
      '//android.widget.Button[@content-desc="Search Hotels"]'
    );
    await searchHotelButton.waitForExist({ timeout: 8000 });
    await searchHotelButton.click();
    console.log("DISTANCE  set");
    await driver.pause(5000);

    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]'
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        console.log("TRAVEL POLICY DEVIATION POPUP FOUND");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]'
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 5000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        console.log("TRAVEL POLICY DEVIATION POPUP YES BUTTON CLICKED");
      } else {
        console.log("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
      }
    } catch (e) {
      console.log("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
    }
    await driver.pause(4000);
    console.log("HOTEL SEARCHING SCREEN LOADING STARTED");

    const hotelSearchingScreenLoading = await driver.$(
      '//android.view.View[@content-desc="Great things take time! Searching the best hotels for your needs"]'
    );
    await hotelSearchingScreenLoading
      .waitForExist({ timeout: 15000 })
      .catch(() => {
        console.log(
          "??????????????????????????????????????????????????????????HOTEL SEARCHING LOADER  NOT VSISBLE ?????????????????????????????????????????????????????."
        );
      });
    // await hotelSearchingScreenLoading.waitForExist({ timeout: 7000 });
    console.log(
      "GREAT THINGS TAKE TIME LOADING FOUND  11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
    );
    await driver.pause(2500);
    console.log(
      "////////////////////////////////////////////////////////////////////////HOTEL SEARCHING RESULT SCREEN LOADING STARTED/////////////////////////////////////////////////////////////////"
    );
    const hotelSearchingResultScreen = await driver.$(
      '//android.view.View[@clickable="true" and @content-desc]'
    );

    await hotelSearchingResultScreen.waitForDisplayed({ timeout: 80000 });
    console.log("✅ Hotel search results displayed.");

    console.log(
      "GREAT THINGS TAKE TIME LOADING FOUND  11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
    );

    // await hotelSearchingResultScreen.waitForExist({ timeout: 20000 });
    console.log(
      "HOTEL SEARCHING RESULT SCREEN FOUND 2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222"
    );
    await hotelSearchingResultScreen.click();
    console.log(
      "HOTEL SEARCHING RESULT SCREEN CLICKED 3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333"
    );
    await driver.pause(2000);

    const hotelSearchingResultScreenClicked = await driver.$(
      'android=new UiSelector().className("android.view.View").instance(11)'
    );

    await hotelSearchingResultScreenClicked.waitForExist({ timeout: 20000 });
    console.log(
      "HOTEL SEARCHING RESULT SCREEN CLICKED FOUND 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444"
    );

    const showRoomButton = await driver.$(
      '//android.widget.Button[@content-desc="Show Rooms"]'
    );

    await showRoomButton.waitForExist({ timeout: 20000 });
    console.log(
      "HOTEL SEARCHING RESULT SCREEN CLICKED FOUND 5555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555"
    );
    await showRoomButton.click();
    console.log(
      "SHOW ROOMS BUTTON CLICKED  6666666666666666666666666666666666666666666666666666666666666666666666666666666666"
    );

    await driver.pause(4000);

    await driver.pause(4000);
    const bookNowScreen = await driver.$(
      '(//android.widget.Button[@content-desc="Book Now"])[1]'
    );
    console.log("BOOK NOW SCREEN FOUND 🟢");

    await bookNowScreen.waitForExist({ timeout: 10000 });

    if (!(await bookNowScreen.isExisting())) {
      throw new Error("NO BOOK NOW BUTTONS FOUND ON THE SCREEN ❌");
    }

    await bookNowScreen.click();
    console.log("BOOK NOW BUTTON CLICKED ✅");

    const createTravelRequestScreenBackButton = await driver.$(
      '//android.widget.Button[@content-desc="Back"]'
    );
    await createTravelRequestScreenBackButton.waitForExist({
      timeout: 20000,
    });

    await driver.pause(2000);
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 5000,
    });
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    // await createTravelRequestScreenProceedButton.click();
    console.log("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");
const { origin, destination } = getRandomRoute(this.cabData);

    const addCab = new AddCabPage(this.driver);
    await addCab.cabCreationOutstation(origin, destination);
    
 const cabRequest = new CabRequestSearchPage(driver);
    await cabRequest.cabRequestOutstationCab();














    }
private async selectAirportSector1(type: "From" | "To", code: string) {
    const driver = this.driver;
    const label = type === "From" ? "From\nChoose From" : "To\nChoose To";
    const field = await driver.$(`~${label}`);
    await field.waitForExist({ timeout: 20000 });
    await field.click();
    const searchField = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")'
    );

    await searchField.waitForExist({ timeout: 20000 });
    await searchField.click();
    await driver.pause(500);
    await searchField.addValue(code);
    await driver.pause(3000);

    const airportOptions = await driver.$$(
      `//android.view.View[@content-desc]`
    );
    if ((await airportOptions.length) > 1) {
      await airportOptions[2].click();
    } else if ((await airportOptions.length) > 0) {
      await airportOptions[0].click();
    }
    await driver.pause(2000);
  }

  private async selectDepartureDate(
    driver: WebdriverIO.Browser
  ): Promise<number> {
    const departureDate = await driver.$(
      '//android.view.View[@content-desc="Departure Date\nChoose Departure Date"]'
    );
    await departureDate.waitForExist({ timeout: 20000 });
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
  
  private async selectReturnDate(
    driver: WebdriverIO.Browser,
    departureDay: number
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
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]'
      );
      console.log("NEXT MONTH BUTTON FOUND");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      console.log("NEXT MONTH BUTTON CLICKED");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1; // pick 1-5 of next month
    }
    console.log(`FINAL RETURN DATE: ${returnDay}`);
    const returnDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`
    );
    console.log("RETURN DATE ELEMENT FOUND FOR FINAL SELECTION");

    await returnDateElement.waitForExist({ timeout: 20000 });
    await returnDateElement.click();

    await driver.pause(2000);
  }
 async selectLocationOfStay(city: string): Promise<void> {
    const driver = this.driver;

    const searchInput = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")'
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
    driver: WebdriverIO.Browser
  ): Promise<number> {
    await driver.pause(2000);

    const checkInDate = await driver.$(
      '//android.view.View[contains(@content-desc, "Check In")]'
    );

    await checkInDate.waitForExist({ timeout: 20000 });
    await checkInDate.click();

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]'
    );
    await nextMonthButton.click();

    const randomDate = Math.floor(Math.random() * 28) + 1;
    try {
      const checkInDateElement = await driver.$(
        `//android.widget.Button[contains(@content-desc, "${randomDate}, ")]`
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
    departureDay: number
  ) {
    console.log("SELECTING RETURN DATE...");

    const checkOutDate = await driver.$("~Check Out\nChoose Check Out");
    await checkOutDate.waitForExist({ timeout: 5000 });
    await checkOutDate.click();
    console.log("RETURN DATE ELEMENT CLICKED");
    await driver.pause(2000);

    // Choose a return day at least 1 day after departure
    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;
    console.log(`Selected return day: ${returnDay}`);

    // If returnDay > 28, go to next month and reset returnDay
    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]'
      );
      console.log("NEXT MONTH BUTTON FOUND");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      console.log("NEXT MONTH BUTTON CLICKED");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1; // pick 1-5 of next month
    }
    console.log(`FINAL RETURN DATE: ${returnDay}`);
    const checkOutDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`
    );
    console.log("RETURN DATE ELEMENT FOUND FOR FINAL SELECTION");

    await checkOutDateElement.waitForExist({ timeout: 20000 });
    await checkOutDateElement.click();

    await driver.pause(2000);
  }
  async scrollUntilVisible(selector: string, maxSwipes = 8) {
    const driver = this.driver;
    const { height, width } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.9);
    const endY = Math.floor(height * 0.05);

    for (let swipe = 1; swipe <= maxSwipes; swipe++) {
      if (await driver.$(selector).isDisplayed()) {
        console.log(`✅ Found element after ${swipe - 1} swipe(s)`);
        return true;
      }

      console.log(`🔄 Swipe #${swipe}`);
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 100 },
            { type: "pointerMove", duration: 1200, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
      await driver.pause(500);
    }

    console.warn(`⚠️ Element not found after ${maxSwipes} swipes`);
    return false;
  }
}