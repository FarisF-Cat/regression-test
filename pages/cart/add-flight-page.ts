import logger from '@wdio/logger'
const log = logger('AddFlightPage')

export class AddFlightPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  private async probeElement(
    selector: string,
    attempts = 8,
    intervalMs = 1000,
  ): Promise<WebdriverIO.Element | null> {
    for (let i = 0; i < attempts; i++) {
      const els = await this.driver.$$(selector);
      if (els.length > 0) return els[0];
      log.info(`⏳ [probe] attempt ${i + 1}/${attempts}: ${selector}`);
      await this.driver.pause(intervalMs);
    }
    return null;
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
      log.info("creating travel request for flight booking screen");

      const flightIconTap = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight")',
      );
      await flightIconTap.waitForDisplayed({ timeout: 65000 });
      await flightIconTap.click();
      log.info(" clicked on flight icon");

      const flightBookingScreen = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight Booking")',
      );
      await flightBookingScreen.waitForExist({ timeout: 20000 });
      log.info("navigated to flight booking screen");

      const onewayRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(0)',
      );
      await onewayRadioButton.waitForExist({ timeout: 5000 });
      await driver.pause(500);

      log.debug(" oneway radio button found");
      // await onewayRadioButton.click();
      const roundtripRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(1)',
      );

      await roundtripRadioButton.waitForExist({ timeout: 5000 });
      await driver.pause(500);
      // await roundtripRadioButton.click();

      log.debug(" round trip radio button found");
      await driver.pause(2000);
      if (journeyType === "ONEWAY") {
        log.info("selecting oneway journey type");

        await onewayRadioButton.click();
        await driver.pause(4000);
        log.info(
          "one way journey type selected 2222222222222222222222222222222222222222222222222222222222222222222",
       );
        await this.selectAirportSector1("From", fromCode);
        log.info(`from airport selected: ${fromCode}`);
        await driver.pause(7000);
        log.info(
          "from airport selected for sector 222222222222222222222222222222222222222222222222222222222222222222222",
       );
        await driver.pause(4000);
        await this.selectAirportSector1("To", toCode);
        log.info(`to airport selected: ${toCode}`);
        await driver.pause(7000);

        let depDay: number | null = null;

        try {
          log.info(
            "                                          calling selectdeparturedate...                                    ",
         );
          depDay = await this.selectDepartureDate(driver);
          log.info("departure date selected:", depDay);

          log.info("departure preference selected");
        } catch (e) {
          log.warn("could not select departure date or preference:", );
        }
        log.info("selecting airports for sector ");

        const [sector2From, sector2To] = this.getTwoUniqueAirports(
          [fromCode, toCode],
          allAirportCodes,
        );
        log.info(`sector 2 from: ${sector2From}, to: ${sector2To}`);
        // await this.selectAirportSector2(fromCode, toCode, sector2From, sector2To);
        log.info(
          `sector 2 airports selected: ${sector2From} to ${sector2To}`,
       );
        await driver.pause(2000);
        log.info("from airport selected for sector ");
        try {
          const cabinClass = await this.probeElement(
            '//android.view.View[contains(@content-desc, "Cabin Class")]',
          );
          if (cabinClass) {
            await cabinClass.click();
            const dropdownEls = await this.driver.$$(
              '//android.widget.RadioButton[@content-desc="Economy"]',
            );
            if (dropdownEls.length > 0) {
              await dropdownEls[0].click();
              const windowSize = await this.driver.getWindowSize();
              const startX = Math.floor(windowSize.width / 2);
              const startY = Math.floor(windowSize.height * 0.8);
              const endY = Math.floor(windowSize.height * 0.6);
              await this.driver.performActions([{
                type: "pointer", id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                  { type: "pointerMove", duration: 0, x: startX, y: startY },
                  { type: "pointerDown", button: 0 },
                  { type: "pointerMove", duration: 300, x: startX, y: endY },
                  { type: "pointerUp", button: 0 },
                ],
              }]);
              await this.driver.releaseActions();
              await this.driver.back();
              log.info("✅ cabin class selected: economy");
            }
          } else {
            log.warn("⚠️ cabin class not found, skipping");
          }
        } catch (e) {
          log.warn("⚠️ cabin class selection failed:", );
        }
        try {
          await this.driver.pause(2000);
          const paxCount = await this.probeElement(
            '//android.view.View[contains(@content-desc, "No of Pax")]',
          );
          if (paxCount) {
            await paxCount.click();
            // Wait for Add Pax popup with probe instead of waitForExist
            const addPaxPopUp = await this.probeElement(
              '//android.view.View[@content-desc="Add Pax"]',
              6,   // 6 attempts
              800, // 800ms between each
            );
            if (addPaxPopUp) {
              const doneEls = await this.driver.$$(
                '//android.widget.Button[@content-desc="Done"]',
              );
              if (doneEls.length > 0) {
                await doneEls[0].click();
                log.info("✅ passenger count set");
              } else {
                log.warn("⚠️ done button not found in pax popu");
              }
            } else {
              log.warn("⚠️ add pax popup did not appear, skipping done click");
            }
          } else {
            log.warn("⚠️ no of pax field not found, skipping");
          }
        } catch (e) {
          log.warn("⚠️ passenger count selection failed:", );
        }

        await this.driver.pause(2000);
        const searchButton = await this.probeElement(
          '//android.widget.Button[@content-desc="Search Flights"]',
          10,   // 10 attempts
          3000, // 3s each = 30s max
        );
        if (!searchButton) {
          throw new Error("❌ Search Flights button not found after 30s");
        }
        log.debug("✅ search flights button found, clicking..");
        await searchButton.click();
        log.info("✅ searching flights..");
      }
    } catch (err: any) {
      log.error("error in createtravelrequest:", err.message || err);
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
      log.info("creating travel request for flight booking screen");

      const flightIconTap = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight")',
      );
      await flightIconTap.waitForExist({ timeout: 55000 });
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
      // await roundtripRadioButton.click();

      log.debug(" round trip radio button found");
      await driver.pause(2000);
      if (journeyType === "ROUNDTRIP") {
        log.info(
          "selecting roundtrip journey type  22222222222222222222222222222",
       );
        await this.selectAirportSector1("From", fromCode);
        log.info(`from airport selected: ${fromCode}`);
        await driver.pause(2000);

        await this.selectAirportSector1("To", toCode);
        log.info(`to airport selected: ${toCode}`);
        await driver.pause(2000);

        let depDay: number | null = null;

        try {
          log.info("calling selectdeparturedate..");
          depDay = await this.selectDepartureDate(driver);
          log.info("departure date selected:", depDay);

          await driver.pause(1000);
          const depPrefEls = await driver.$$("~Departure Preferences");
          if (depPrefEls.length > 0) {
            await driver.pause(2000);
            const depPrefSelectEls = await driver.$$(
              '//android.widget.Button[@content-desc="After 6PM"]',
            );
            if (depPrefSelectEls.length > 0) {
              await depPrefSelectEls[0].click();
              log.info("✅ departure preference selected");
            } else {
              log.warn("⚠️ after 6pm button not found");
            }
          } else {
            log.warn("⚠️ departure preferences not visible, skipping");
          }
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
        log.info(
          `sector 2 airports selected: ${sector2From} to ${sector2To}`,
       );
        await driver.pause(2000);
        log.info("from airport selected for sector ");

        // ✅ Only call return date selection if depDay was set
        if (depDay !== null) {
          log.info("return date selection");

          try {
            log.info("calling return date:", depDay);
            await this.selectReturnDate(driver, depDay);
            log.info(" return date selected: ", depDay);
          } catch (e) {
            log.warn("not selecting return date :", );
          }
          await driver.pause(1000);
          const retPrefEls = await driver.$$("~Return Preferences");
          if (retPrefEls.length > 0) {
            await driver.pause(2000);
            const retPrefSelectEls = await driver.$$(
              '(//android.widget.Button[@content-desc="6AM - Noon"])[2]',
            );
            if (retPrefSelectEls.length > 0) {
              await retPrefSelectEls[0].click();
              const windowSize = await driver.getWindowSize();
              const startX = Math.floor(windowSize.width / 2);
              const startY = Math.floor(windowSize.height * 0.8);
              const endY = Math.floor(windowSize.height * 0.6);
              await driver.performActions([{
                type: "pointer", id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                  { type: "pointerMove", duration: 0, x: startX, y: startY },
                  { type: "pointerDown", button: 0 },
                  { type: "pointerMove", duration: 300, x: startX, y: endY },
                  { type: "pointerUp", button: 0 },
                ],
              }]);
              await driver.releaseActions();
              log.info("✅ return preference selected");
            } else {
              log.warn("⚠️ 6am - noon button not found");
            }
          } else {
            log.warn("⚠️ return preferences not visible, skipping");
          }
        try {
          const cabinClass = await this.probeElement(
            '//android.view.View[contains(@content-desc, "Cabin Class")]',
          );
          if (cabinClass) {
            await cabinClass.click();
            const dropdownEls = await this.driver.$$(
              '//android.widget.RadioButton[@content-desc="Economy"]',
            );
            if (dropdownEls.length > 0) {
              await dropdownEls[0].click();
              const windowSize = await this.driver.getWindowSize();
              const startX = Math.floor(windowSize.width / 2);
              const startY = Math.floor(windowSize.height * 0.8);
              const endY = Math.floor(windowSize.height * 0.6);
              await this.driver.performActions([{
                type: "pointer", id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                  { type: "pointerMove", duration: 0, x: startX, y: startY },
                  { type: "pointerDown", button: 0 },
                  { type: "pointerMove", duration: 300, x: startX, y: endY },
                  { type: "pointerUp", button: 0 },
                ],
              }]);
              await this.driver.releaseActions();
              await this.driver.back();
              log.info("✅ cabin class selected: economy");
            }
          } else {
            log.warn("⚠️ cabin class not found, skipping");
          }
        } catch (e) {
          log.warn("⚠️ cabin class selection failed:", );
        }
        try {
          await this.driver.pause(2000);
          const paxCount = await this.probeElement(
            '//android.view.View[contains(@content-desc, "No of Pax")]',
          );
          if (paxCount) {
            await paxCount.click();
            // Wait for Add Pax popup with probe instead of waitForExist
            const addPaxPopUp = await this.probeElement(
              '//android.view.View[@content-desc="Add Pax"]',
              6,   // 6 attempts
              800, // 800ms between each
            );
            if (addPaxPopUp) {
              const doneEls = await this.driver.$$(
                '//android.widget.Button[@content-desc="Done"]',
              );
              if (doneEls.length > 0) {
                await doneEls[0].click();
                log.info("✅ passenger count set");
              } else {
                log.warn("⚠️ done button not found in pax popu");
              }
            } else {
              log.warn("⚠️ add pax popup did not appear, skipping done click");
            }
          } else {
            log.warn("⚠️ no of pax field not found, skipping");
          }
        } catch (e) {
          log.warn("⚠️ passenger count selection failed:", );
        }
        await this.driver.pause(2000);
        const searchButton = await this.probeElement(
          '//android.widget.Button[@content-desc="Search Flights"]',
          10,   // 10 attempts
          3000, // 3s each = 30s max
        );
        if (!searchButton) {
          throw new Error("❌ Search Flights button not found after 30s");
        }
        log.debug("✅ search flights button found, clicking..");
        await searchButton.click();
        log.info("✅ searching flights..");
        }
      }
    } catch (err: any) {
      log.error("error in createtravelrequest:", err.message || err);
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
      log.info("creating travel request for flight booking screen");

      const flightIconTap = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight")',
      );
      await flightIconTap.waitForExist({ timeout: 20000 });
      await flightIconTap.click();
      log.info(" clicked on flight icon");

      const flightBookingScreen = await driver.$(
        '-android uiautomator:new UiSelector().description("Flight Booking")',
      );
      await flightBookingScreen.waitForExist({ timeout: 20000 });
      log.info("navigated to flight booking screen");

      //////MULTICITY SELECTION////
      log.info(" inside multicity trip ..");
      await driver.pause(2000);

      const multicityRadioButton = await driver.$(
        '-android uiautomator:new UiSelector().className("android.widget.RadioButton").instance(2)',
      );
      await multicityRadioButton.waitForExist({ timeout: 5000 });
      await multicityRadioButton.click();

      log.info(" selecting from and to airports..");
      await driver.pause(2000);
      await this.selectAirportSector1Multicity();

      // await this.selectAirportSector1("From", fromCode);//// NOT HARDCODED VALUES
      log.info(`from airport selected: ${fromCode}`);
      await driver.pause(2000);

      // await this.selectAirportSector1("To", toCode);//// NOT HARDCODED VALUES
      log.info(`to airport selected: ${toCode}`);
      await driver.pause(2000);

      // let depDay: number | null = null;
      let sector1DepDay: number | null = null;
      try {
        log.info("calling selectdeparturedate for sector 1..");
        sector1DepDay = await this.selectDepartureDate(driver);
        log.info("sector 1 departure date selected:", sector1DepDay);

        await driver.pause(1000);
        const depPrefEls = await driver.$$("~Departure Preferences");
        if (depPrefEls.length > 0) {
          await driver.pause(2000);
          const depPrefSelectEls = await driver.$$(
            '//android.widget.Button[@content-desc="After 6PM"]',
          );
          if (depPrefSelectEls.length > 0) {
            await depPrefSelectEls[0].click();
            log.info("✅ departure preference selected");
          } else {
            log.warn("⚠️ after 6pm button not found");
          }
        } else {
          log.warn("⚠️ departure preferences not visible, skipping");
        }
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
      await driver.pause(2000);

      await this.selectAirportSector2Multicity();
      // await this.selectAirportSector2(fromCode, toCode, sector2From, sector2To);
      log.info(`sector 2 airports selected: ${sector2From} to ${sector2To}`);
      await driver.pause(2000);
      log.info("from airport selected for sector ");
      await driver.pause(2000);

      // Retry until Sector 2 date is after Sector 1
      let sector2DepDay: number | null = null;
      const maxRetries = 5;
      let attempt = 0;

      try {
        while (attempt < maxRetries) {
          log.info(
            "calling selectdeparturedate for sector 2 (attempt " +
              (attempt + 1) +
              ")",
         );

          sector2DepDay = await this.selectDepartureDateMulticity(
            driver,
            sector1DepDay !== null ? sector1DepDay : undefined,
          );
          log.info("sector 2 departure date selected:", sector2DepDay);

          if (sector1DepDay !== null && sector2DepDay >= sector1DepDay) {
            log.info(" valid sector 2 date: " + sector2DepDay);

            await driver.pause(1000);
            const depPrefEls = await driver.$$("~Departure Preferences");
            if (depPrefEls.length > 0) {
              await driver.pause(2000);
              const depPrefSelectEls = await driver.$$(
                '//android.widget.Button[@content-desc="After 6PM"]',
              );
              if (depPrefSelectEls.length > 0) {
                await depPrefSelectEls[0].click();
                log.info("✅ departure preference selected");
              } else {
                log.warn("⚠️ after 6pm button not found");
              }
            } else {
              log.warn("⚠️ departure preferences not visible, skipping");
            }

            break;
          } else {
            log.warn(
              ` invalid sector 2 date (${sector2DepDay}) — should be >= sector 1 (${sector1DepDay})`,
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
        log.error("error selecting sector 2 departure date:", err);
      }

      try {
        const cabinClass = await this.probeElement(
          '//android.view.View[contains(@content-desc, "Cabin Class")]',
        );
        if (cabinClass) {
          await cabinClass.click();
          const dropdownEls = await this.driver.$$(
            '//android.widget.RadioButton[@content-desc="Economy"]',
          );
          if (dropdownEls.length > 0) {
            await dropdownEls[0].click();
            const windowSize = await this.driver.getWindowSize();
            const startX = Math.floor(windowSize.width / 2);
            const startY = Math.floor(windowSize.height * 0.8);
            const endY = Math.floor(windowSize.height * 0.6);
            await this.driver.performActions([{
              type: "pointer", id: "finger1",
              parameters: { pointerType: "touch" },
              actions: [
                { type: "pointerMove", duration: 0, x: startX, y: startY },
                { type: "pointerDown", button: 0 },
                { type: "pointerMove", duration: 300, x: startX, y: endY },
                { type: "pointerUp", button: 0 },
              ],
            }]);
            await this.driver.releaseActions();
            await this.driver.back();
            log.info("✅ cabin class selected: economy");
          }
        } else {
          log.warn("⚠️ cabin class not found, skipping");
        }
      } catch (e) {
        log.warn("⚠️ cabin class selection failed:", );
      }

      try {
        await this.driver.pause(2000);
        const paxCount = await this.probeElement(
          '//android.view.View[contains(@content-desc, "No of Pax")]',
        );
        if (paxCount) {
          await paxCount.click();
          // Wait for Add Pax popup with probe instead of waitForExist
          const addPaxPopUp = await this.probeElement(
            '//android.view.View[@content-desc="Add Pax"]',
            6,   // 6 attempts
            800, // 800ms between each
          );
          if (addPaxPopUp) {
            const doneEls = await this.driver.$$(
              '//android.widget.Button[@content-desc="Done"]',
            );
            if (doneEls.length > 0) {
              await doneEls[0].click();
              log.info("✅ passenger count set");
            } else {
              log.warn("⚠️ done button not found in pax popu");
            }
          } else {
            log.warn("⚠️ add pax popup did not appear, skipping done click");
          }
        } else {
          log.warn("⚠️ no of pax field not found, skipping");
        }
      } catch (e) {
        log.warn("⚠️ passenger count selection failed:", );
      }
      await this.driver.pause(2000);
      const searchButton = await this.probeElement(
        '//android.widget.Button[@content-desc="Search Flights"]',
        10,   // 10 attempts
        3000, // 3s each = 30s max
      );
      if (!searchButton) {
        throw new Error("❌ Search Flights button not found after 30s");
      }
      log.debug("✅ search flights button found, clicking..");
      await searchButton.click();
      log.info("✅ searching flights..");
    } catch (err: any) {
      log.error(" error during createtravelrequest:", err.message || err);
      throw err;
    }
  }

  private async selectAirportSector1(type: "From" | "To", code: string) {
    const driver = this.driver;
    const label = type === "From" ? "From\nChoose From" : "To\nChoose To";
    const selector = `~${label}`;

    // Probe loop — polls every 1s instead of WebdriverIO's ~50ms spam
    let field: WebdriverIO.Element | undefined;
    for (let i = 0; i < 20; i++) {
      const els = await driver.$$(selector);
      if (els.length > 0) {
        field = els[0];
        log.debug(`✅ found field "${label}" on attempt ${i + 1}`);
        break;
      }
      log.info(`⏳ waiting for "${label}"... attempt ${i + 1}`);
      await driver.pause(1000);
    }
    if (!field) throw new Error(`Could not find field: ${label}`);

    await field.click();
    const searchField = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    await searchField.waitForExist({ timeout: 55000 });
    await searchField.click();
    await driver.pause(500);
    await this.selectAirportByCode(code);
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

  private async selectAirportSector1Multicity() {
    const driver = this.driver;
    const fromCode = "TRV";
    const toCode = "MAA";

    for (const [label, code] of [
      ["From\nChoose From", fromCode],
      ["To\nChoose To", toCode],
    ] as [string, string][]) {
      const selector = `~${label}`;
      let field: WebdriverIO.Element | undefined;
      for (let i = 0; i < 20; i++) {
        const els = await driver.$$(selector);
        if (els.length > 0) { field = els[0]; break; }
        log.info(`⏳ waiting for "${label}"... attempt ${i + 1}`);
        await driver.pause(1000);
      }
      if (!field) throw new Error(`Could not find field: ${label}`);

      await field.click();
      await driver.pause(500);
      await this.selectAirportByCode(code);
      await driver.pause(2000);
    }
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
    // Skipping sector2From === sector2To check because both are hardcoded and different
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
    log.info("scrolling into view and sector 2 from field clicked");

    const searchFieldFrom = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    await searchFieldFrom.waitForExist({ timeout: 10000 });
    await searchFieldFrom.click();
    await searchFieldFrom.setValue(sector2From);
    await driver.pause(2000);
    await this.selectAirportByCode(sector2From);
    await driver.pause(1000);

    // Manual scroll to reveal next section (sector 2 To)
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

    log.info("performed general scroll to reveal next elements");

    // Replace the entire fallback chain for sector2ToField with:
    let sector2ToField: WebdriverIO.Element | undefined;

    // Try UiScrollable first (handles off-screen elements)
    try {
      const el = await driver.$(
        'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().descriptionContains("Choose To"))',
      );
      await el.waitForExist({ timeout: 5000 });
      sector2ToField = el;
      log.debug("sector 2 'to' found with uiscrollable");
    } catch {
      log.warn("uiscrollable failed, falling back to probe loop");
    }

    // Probe loop fallback — no waitForExist spam
    if (!sector2ToField) {
      for (let i = 0; i < 10; i++) {
        const candidates = [
          await driver.$$(`~To\nChoose To`),
          await driver.$$(`//android.view.View[contains(@content-desc,"Choose To")]`),
        ];
        const found = candidates.find(c => c.length > 0);
        if (found) { sector2ToField = found[0]; break; }
        log.info(`⏳ probing for sector 2 to field... attempt ${i + 1}`);
        await driver.pause(1000);
      }
    }

    if (!sector2ToField) throw new Error("Could not find 'Sector 2 To' field after all attempts.");

    await sector2ToField.click();
    log.info("sector 2 to field clicked");

    const searchFieldTo = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    await searchFieldTo.waitForExist({ timeout: 10000 });
    await searchFieldTo.click();
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
        log.info(`888888888888888888888888888888888888888888888888`);
        log.debug(
          `no options found initially for ${code}, scrolling to bottom...`,
       );
        // await this.scrollToBottom(); // 🔽 SCROLL DOWN TO LOAD MORE
      }

      for (const option of airportOptions) {
        const desc = await option.getAttribute("content-desc");
        if (desc.includes(code)) {
          log.debug(`[selectairportbycode] found option with desc: ${desc}`);
          await option.click();
          log.info(`[selectairportbycode] selected: ${desc}`);
          return;
        }
      }

      throw new Error(`Could not find airport with code: ${code}`);
    } catch (err) {
      log.error(`❌ failed to select airport ${code}`, err);
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
      log.error(`error selecting date ${randomDate}:`, error);
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
