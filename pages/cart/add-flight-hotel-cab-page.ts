import { getTwoUniqueAirports } from "../../util/common/airport-util";
import { AddCabPage } from "./add-cab-page";
import { CabRequestSearchPage } from "./cab-request-page";
import { RequestSummaryPage } from "./request-summary-page";
import Page from "../page";
import logger from "@wdio/logger";
const log = logger("AddFlightHotelCabPage");

export class AddFlightHotelCabPage extends Page {

  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async createFlightHotelCab(
    city: string,
    fromCode: string,
    toCode: string,
    allAirportCodes: string[],
  ) {
    const driver = this.driver;
    await driver.pause(5500);
    log.info("FLIGHT HOTEL CREATION STARTED");
    await driver.pause(2000);
    log.info("CREATING TRAVEL REQUEST FOR FLIGHT BOOKING SCREEN");

    const flightIconTap = await driver.$(
      '-android uiautomator:new UiSelector().description("Flight")',
    );
    await flightIconTap.waitForExist({ timeout: 55000 });
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

    log.info(
      "SELECTING ROUNDTRIP JOURNEY TYPE  22222222222222222222222222222",
    );
    await driver.pause(4000);
    await this.selectAirportSector1("From", fromCode);
    log.info(`From airport selected: ${fromCode}`);
    await driver.pause(5000);
    log.info(" SELECTING AIRPORTS TO  SECTOR 1");
    await this.selectAirportSector1("To", toCode);
    log.info(`To airport selected: ${toCode}`);
    await driver.pause(5000);

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

    const [sector2From, sector2To] = getTwoUniqueAirports(
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
        await this.selectReturnDateAfter(driver, depDayFlight);
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
    await driver.pause(4000);
    const isLoading = await searchResults.isExisting();
    if (isLoading) {
      log.info("Loading message found, waiting for flights to load...");
      await driver.pause(10000); // or however long you want to wait
    } else {
      log.info("Loading message not found, continuing...");
    }

    try {
      log.info(" Waiting before loading flight cards...");
      await driver.pause(10000);
      log.info("ONWARD FLIGHT SELECTION SCREEN LOADING...");

      const onwardFlightSelection = await driver.$(
        '//android.view.View[@content-desc="Onward Flights"]',
      );

      try {
        await onwardFlightSelection.waitForDisplayed({ timeout: 30000 });
      } catch (e) {
        const pageSource = await driver.getPageSource();
        log.error(
          "ONWARD FLIGHT SELECTION NOT FOUND. Current page source:",
        );
        log.error(pageSource);
        throw new Error("ONWARD FLIGHT SELECTION NOT FOUND");
      }

      log.info("ONWARD FLIGHT SELECTION SCREEN FOUND ");
      await driver.pause(10000);
      const noResultsBanner = await driver.$(
        '//*[contains(@content-desc, "Don\'t find what you are looking for")]',
      );
      const isNoResultsBannerVisible = await noResultsBanner
        .isDisplayed()
        .catch(() => false);

      if (isNoResultsBannerVisible) {
        log.info(
          "No-results banner visible — scrolling down to find flight cards...",
        );
        const { width, height } = await driver.getWindowSize();
        await driver.execute("mobile: swipeGesture", {
          left: width / 2,
          top: height * 0.9,
          width: 0,
          height: height * 0.7,
          direction: "up",
          percent: 0.95,
        });
        log.info("Scrolled down to find flight cards.");
      } else {
        log.info(
          "No banner — flight cards should be visible, proceeding...",
        );
      }

      const firstFlightCard = await driver.$(
        "(//android.widget.ImageView[@content-desc])[1]",
      );
      log.info("FIRST FLIGHT CARD FOUND");
      await firstFlightCard.waitForDisplayed({ timeout: 6000 });
      log.info(" FIRST FLIGHT CARD FOUND  WAITING FOR SHOW FARES OPTION");

      const showFaresOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Show").instance(0)',
      );
      await showFaresOption.click();
      const source = await driver.getPageSource();
      log.info(source);
      log.info("SHOW FARE OPTION CLICKED");

      // Scroll down a bit — the Choose button is likely below the expanded fare panel
      await driver.pause(1500);
      const { width, height } = await driver.getWindowSize();
      await driver.execute("mobile: swipeGesture", {
        left: width / 2,
        top: height * 0.75,
        width: 0,
        height: height * 0.4,
        direction: "up",
        percent: 0.7,
      });
      await driver.pause(1000);

      // Try xpath with content-desc Button first, fallback to descriptionContains
      let chooseButton;
      try {
        chooseButton = await driver.$(
          '//android.widget.Button[@content-desc="Choose"]',
        );
        await chooseButton.waitForExist({ timeout: 8000 });
      } catch {
        // fallback: maybe it's a View, not a Button
        chooseButton = await driver.$(
          '//*[contains(@content-desc, "Choose") and not(contains(@content-desc, "Choose Departure"))]',
        );
        await chooseButton.waitForExist({ timeout: 8000 });
      }
      await chooseButton.click();
      log.info("ONWARD FLIGHT CHOSEN BUTTON CLICKED");
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
      await firstReturnFlightCard.waitForExist({ timeout: 5000 });

      log.info("FIRST FLIGHT CARD FOUND IN RETURN SELECTION SCREEN");
      await driver.pause(1000);

      let returnShowFaresFound = false;
      for (let i = 0; i < 5; i++) {
        // Check for no-results state first
        const noFlights = await driver.$$(
          '//*[@content-desc="No flights matching the given search"]',
        ).getElements();
        if (noFlights.length > 0) {
          log.info("No return flights found — clicking Convert as Offline");
          const offlineBtn = await driver.$(
            '//android.widget.Button[@content-desc="Convert as Offline"]',
          );
          await offlineBtn.waitForExist({ timeout: 5000 });
          await offlineBtn.click();
          log.info("CONVERT AS OFFLINE CLICKED ✅");
          returnShowFaresFound = true; // treat as handled
          break;
        }

        const fareButtons = await driver.$$(
          '//*[contains(@content-desc, "Show") and contains(@content-desc, "fare")]',
        ).getElements();
        if (fareButtons.length > 0) {
          log.info(`RETURN SHOW FARES FOUND after ${i} scroll(s) ✅`);
          await fareButtons[0].click();
          returnShowFaresFound = true;
          break;
        }
        await driver.execute("mobile: swipeGesture", {
          left: 540,
          top: 1800,
          width: 0,
          height: 1200,
          direction: "up",
          percent: 0.85,
        });
        await driver.pause(1000);
      }

      const tookOfflinePath =
        returnShowFaresFound &&
        (
          await driver.$$(
            '//*[@content-desc="No flights matching the given search"]',
          ).getElements()
        ).length > 0;

      if (!returnShowFaresFound) {
        const src = await driver.getPageSource();
        const visible = [...src.matchAll(/content-desc="([^"]{3,50})"/g)]
          .map((m) => m[1])
          .filter((v, i, a) => a.indexOf(v) === i)
          .slice(0, 25);
        log.error(
          "RETURN SHOW FARES NOT FOUND. Screen:",
          JSON.stringify(visible, null, 2),
        );
        throw new Error("Return flight Show Fares not found ❌");
      }

      // If fares found (not offline), do the Choose step
      if (!tookOfflinePath) {
        const { width, height } = await driver.getWindowSize();
        await driver.execute("mobile: swipeGesture", {
          left: width / 2,
          top: height * 0.75,
          width: 0,
          height: height * 0.4,
          direction: "up",
          percent: 0.7,
        });
        await driver.pause(1000);
        const returnChooseButton = await driver.$(
          '//android.widget.Button[@content-desc="Choose"]',
        );
        await returnChooseButton.waitForExist({ timeout: 15000 });
        await returnChooseButton.click();
        log.info("RETURN FLIGHT CHOSEN BUTTON CLICKED ✅");
      }

      // Always Proceed
      const proceedAfterReturn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedAfterReturn.waitForExist({ timeout: 8000 });
      await proceedAfterReturn.click();
      log.info("PROCEED AFTER RETURN FLIGHT CLICKED ✅");
    } catch (err) {
      log.error("ERROR DURING RETURN FLIGHT SELECTION:", err);
      throw err;
    }

    await driver.pause(4000);

    const chooseAnxillaryScreenOfRoundTrip = await driver.$(
      '//android.view.View[@content-desc="Choose Ancillaries"]',
    );

    const exists = await chooseAnxillaryScreenOfRoundTrip.isExisting();

    if (exists) {
      log.info("CHOOSE ANCILLARY SCREEN OF ROUND TRIP FOUND");

      await chooseAnxillaryScreenOfRoundTrip.waitForExist({
        timeout: 10000,
      });
    } else {
      log.warn("Choose Ancillaries screen not found initially");
    }

    await driver.pause(2000);

    // ==========================================
    // CLICK FIRST PROCEED BUTTON
    // ==========================================

    const summaryProceedBtn = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );

    if (await summaryProceedBtn.isExisting()) {
      log.info("Summary Proceed button found, clicking to continue...");

      await summaryProceedBtn.click();

      await driver.pause(3000);
    } else {
      log.info("Summary Proceed button not found");
    }

    // ==========================================
    // CHECK ANCILLARY SCREEN AFTER PROCEED
    // ==========================================

    const chooseAncillariesScreen = await driver.$(
      '//android.view.View[@content-desc="Choose Ancillaries"]',
    );

    if (await chooseAncillariesScreen.isExisting()) {
      log.info("Choose Ancillaries screen loaded");

      // ==========================================
      // CHECK WHETHER ANCILLARY AVAILABLE
      // ==========================================

      const ancillaryNotAvailableMessage = await driver.$(
        '//android.view.View[contains(@content-desc,"Ancillary selection not available")]',
      );

      if (await ancillaryNotAvailableMessage.isExisting()) {
        log.info("ANCILLARY SELECTION NOT AVAILABLE FOR THIS FLIGHT");

        // CLICK PROCEED DIRECTLY
        const ancillariesProceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );

        if (await ancillariesProceedBtn.isExisting()) {
          log.info("Proceed button found on no-ancillary screen");

          await ancillariesProceedBtn.click();

          log.info("Clicked Proceed and continuing further...");

          await driver.pause(3000);
        }
      } else {
        log.info("ANCILLARY OPTIONS AVAILABLE - CONTINUING SEAT SELECTION");

        // ==========================================
        // SEAT SELECTION
        // ==========================================

        log.info("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");

        const chooseSeat = await driver.$(
          '//android.view.View[@content-desc="Choose seat"]',
        );

        if (await chooseSeat.isExisting()) {
          await chooseSeat.waitForExist({
            timeout: 20000,
          });

          log.info("CHOOSE SEAT Button Found, GOING TO BE CLICKED");

          await chooseSeat.click();

          log.info("CHOOSE SEAT CLICKED");

          // Wait for seat map page
          const chooseSeatMapPage = await driver.$(
            '//android.view.View[@content-desc="Choose Seat Map"]',
          );

          await chooseSeatMapPage.waitForExist({
            timeout: 20000,
          });

          log.info("CHOOSE SEAT PAGE FOUND");

          await driver.pause(2000);

          // ==========================================
          // FIND AVAILABLE SEATS
          // ==========================================

          const seatElements = await driver.$$(
            "//android.view.View[@content-desc]",
          ).getElements();

          let found = false;

          for (const seat of seatElements) {
            const seatNumber = (await seat.getAttribute("content-desc")) ?? "";

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

                  await doneButton.waitForExist({
                    timeout: 3000,
                  });

                  await doneButton.click();

                  found = true;

                  log.info(`SELECTED SEAT: ${seatNumber}`);

                  break;
                } else {
                  log.info(`Seat ${seatNumber} not available (no popup).`);
                }
              } catch (err) {
                log.error(`ERROR SELECTING THE SEAT ${seatNumber}:`, err);
              }
            }
          }

          if (!found) {
            log.info("NO AVAILABLE SEATS FOUND BY SEAT NUMBER.");
          }

          await driver.pause(2000);

          // ==========================================
          // EXTRA DONE BUTTON
          // ==========================================

          const doneButtonSelector =
            '//android.widget.Button[@content-desc="Done"]';

          const doneButton = await driver.$(doneButtonSelector);

          if (await doneButton.isExisting()) {
            await doneButton.click();

            await driver.pause(500);

            // Sometimes Done appears twice
            if (await doneButton.isExisting()) {
              await doneButton.click();

              await driver.pause(500);
            }
          } else {
            log.info('"Done" button not present after seat selection');
          }
        } else {
          log.info("Choose Seat option not available");
        }

        // ==========================================
        // MEAL SELECTION
        // ==========================================

        await driver.pause(1000);

        try {
          const chooseMeals = await driver.$("~Choose meal");

          if (await chooseMeals.isExisting()) {
            await chooseMeals.waitForExist({
              timeout: 5000,
            });

            await chooseMeals.click();

            await driver.pause(1000);

            const mealsSelection = await driver.$(
              '//android.widget.RadioButton[contains(@content-desc, "No Meal")]',
            );

            await mealsSelection.waitForExist({
              timeout: 5000,
            });

            await mealsSelection.click();

            const mealsSelectionBackButton = await driver.$(
              "android.widget.Button",
            );

            await mealsSelectionBackButton.waitForExist({
              timeout: 3000,
            });

            await mealsSelectionBackButton.click();

            log.info("Meal selected and exited");
          }
        } catch (e) {
          log.warn("Meal selection skipped or not available");
        }

        // ==========================================
        // FINAL ANCILLARY PROCEED BUTTON
        // ==========================================

        await driver.pause(5000);

        const ancillariesProceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );

        if (await ancillariesProceedBtn.isDisplayed()) {
          await ancillariesProceedBtn.click();

          await driver.pause(3000);
        }
      }
    } else {
      log.info("Choose Ancillaries screen not found, continuing...");
    }

    // ==========================================
    // CREATE TRAVEL REQUEST SCREEN
    // ==========================================

    await driver.pause(2000);

    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]',
    );

    await createTravelRequestScreen.waitForExist({
      timeout: 30000,
    });

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
    log.info("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    await createTravelRequestScreenProceedButton.click();
  }

  private async selectAirportSector1(type: "From" | "To", code: string) {
    const driver = this.driver;
    await driver.pause(4000);
    const locator =
      type === "From"
        ? '//android.view.View[@content-desc="From\nChoose From"]'
        : '//android.view.View[contains(@content-desc,"To")]';
    await driver.pause(3000);

    const field = await driver.$(locator);

    const source = await driver.getPageSource();
    log.info(source);

    const exists = await field
      .waitForDisplayed({
        timeout: 5000,
      })
      .catch(() => false);

    if (!exists) {
      throw new Error(`Airport field not found. Type=${type}`);
    }

    await field.click();

    const searchField = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );

    await searchField.waitForDisplayed({ timeout: 5000, interval: 1000 });

    await searchField.click();

    await driver.pause(500);

    await searchField.setValue(code);

    await driver.pause(3000);

    const airportOptions = await driver.$$(
      "//android.view.View[@content-desc]",
    ).getElements();

    if ((await airportOptions.length) > 1) {
      await airportOptions[2].click();
    } else if ((await airportOptions.length) > 0) {
      await airportOptions[0].click();
    }

    try {
      await driver.hideKeyboard();
    } catch (e) {}

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
      log.error(`Error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
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
      log.error(`Error selecting date ${randomDate}:`, error);
    }

    await driver.pause(2000);
    return randomDate;
  }

  private async selectCheckOutDate(
    driver: WebdriverIO.Browser,
    departureDay: number,
  ) {
    log.info("SELECTING RETURN DATE...");

    const checkOutDate = await driver.$("~Check Out\nChoose Check Out");
    await checkOutDate.waitForExist({ timeout: 5000 });
    await checkOutDate.click();
    log.info("RETURN DATE ELEMENT CLICKED");
    await driver.pause(2000);

    // Choose a return day at least 1 day after departure
    let returnDay =
      departureDay + Math.floor(Math.random() * (28 - departureDay)) + 1;
    log.info(`Selected return day: ${returnDay}`);

    // If returnDay > 28, go to next month and reset returnDay
    if (returnDay > 28) {
      const nextMonthButton = await driver.$(
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.widget.Button[2]',
      );
      log.info("NEXT MONTH BUTTON FOUND");
      await nextMonthButton.waitForExist({ timeout: 20000 });
      log.info("NEXT MONTH BUTTON CLICKED");

      await nextMonthButton.click();
      returnDay = Math.floor(Math.random() * 5) + 1; // pick 1-5 of next month
    }
    log.info(`FINAL RETURN DATE: ${returnDay}`);
    const checkOutDateElement = await driver.$(
      `//android.widget.Button[contains(@content-desc, "${returnDay}, ")]`,
    );
    log.info("RETURN DATE ELEMENT FOUND FOR FINAL SELECTION");

    await checkOutDateElement.waitForExist({ timeout: 20000 });
    await checkOutDateElement.click();

    await driver.pause(2000);
  }
}
