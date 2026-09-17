import Page from "../page";

import logger from "@wdio/logger";
const log = logger("RequestSummaryPage");

export class RequestSummaryPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async viewTravelRequestSummaryForFlight() {
    const driver = this.driver;
    await driver.pause(3000);
    log.info("1view travel request summary for flight function called");
    const createTravelRequestScreen = await this.probeElement(
      "~Create Travel Request",
      10,
      1000,
    );
    if (!createTravelRequestScreen)
      throw new Error("❌ 'Create Travel Request' screen not found");
    log.info("create traveller screen");

    await driver.pause(2000);

    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton.waitForDisplayed({
      timeout: 5000,
    });

    if (!createTravelRequestScreenProceedButton)
      throw new Error(
        "❌ 'Proceed' button not found on Create Travel Request screen",
      );
    log.debug("create traveller screen proceed button found");
    await createTravelRequestScreenProceedButton.click();
    log.info("create traveller screen proceed button clicked");

    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForDisplayed({ timeout: 5000 });
    if (!travellerDetailScreen)
      throw new Error("❌ 'Traveller Details' screen not found");
    log.info("entered into  traveller details screen");
    await driver.pause(3000);

    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 6000 });

    if (!addTravellerDetailScreenButton)
      throw new Error("❌ 'Add Traveller Details' button not found");
    log.info("clicked on traveller details button");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    if (!additionalDetailsScreen)
      throw new Error("❌ Additional Details screen not found");
    log.info("went into   additional details screen");
    await driver.pause(2000);

    const purposeOfTravel = await driver.$(
      '//android.view.View[@content-desc="Purpose Of Travel "]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("purpose of travel field not found, skipping..");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("first purpose of travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("no purpose of travel options found in dropdown");
        }
      }
    } else {
      log.info("purpose of travel already filled:", fieldValue);
    }
    const additionalDetailsScreenProceedButon = await this.probeElement(
      '//android.widget.Button[@content-desc="Submit "]',
      10,
      1000,
    );
    if (!additionalDetailsScreenProceedButon)
      throw new Error(
        "❌ 'Submit' button not found in Additional Details screen",
      );
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();
    await driver.pause(3000);

    try {
      await driver.hideKeyboard();
    } catch {}
    const goHomeBtn = await driver.$(
      '//android.widget.Button[@content-desc="Go to Home"]',
    );

    if (await goHomeBtn.isExisting()) {
      log.info("ℹDelay screen detected — 'Go to Home' is visible");

      await goHomeBtn.waitForDisplayed({ timeout: 5000 });
      await goHomeBtn.click();

      log.info("🏠 Go to Home clicked — booking flow completed via delay path");
      return;
    }

    log.info("🔍 No 'Go to Home' button. Searching for 'Complete Booking'...");

    const { width, height } = await driver.getWindowRect();
    const startX = width / 2;
    const startY = height * 0.85;
    const endY = height * 0.35;

    let found = false;

    for (let i = 0; i < 6; i++) {
      const completeBookingBtns = await driver
        .$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        )
        .getElements();

      if ((await completeBookingBtns.length) > 0) {
        log.info("✅ Found 'Complete Booking' button");
        await completeBookingBtns[0].click();
        found = true;
        break;
      }

      log.info(`🟣 Scroll attempt ${i + 1}...`);
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 600, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
      await driver.pause(1500);
    }

    if (!found) {
      throw new Error(
        "❌ Neither 'Go to Home' nor 'Complete Booking' button found",
      );
    }

    log.info("📦 complete booking clicked");

    const popup = await driver.$(
      '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
    );

    if (!popup) throw new Error("❌ Booking confirmation popup did not appear");
    log.info("⚪ confirmation popup appeare");

    const confirmBtns = await driver
      .$$('//android.widget.Button[@content-desc="Yes"]')
      .getElements();
    if (confirmBtns.length === 0)
      throw new Error("❌ 'Yes' button not found in confirmation popup");
    await confirmBtns[0].click();

    log.info("✅ booking confirmed successfully");
    await driver.pause(20000);

    const backButtonRequestDetails = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );

    if (!backButtonRequestDetails)
      throw new Error("❌ Back button not found after booking confirmation");
    await backButtonRequestDetails.click();
    log.info(" back button clicked in request detail screen");
    await driver.pause(5000);
  }
  async viewTravelRequestSummaryForHotel() {
    const driver = this.driver;
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
    await driver.pause(2000);
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    log.info("entered into  traveller details screen");
    await driver.pause(3000);

    const windowSizeTravellerDetails = await driver.getWindowSize();
    const startsX = Math.floor(windowSizeTravellerDetails.width / 2);
    const startsY = Math.floor(windowSizeTravellerDetails.height * 0.8);
    const endsY = Math.floor(windowSizeTravellerDetails.height * 0.6);

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startsX, y: startsY },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration: 300, x: startsX, y: endsY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    log.info("scrolled to bottom of the page  passport feild");
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    log.info("checking for passport field presence ");
    if (await passportNumber.isExisting()) {
      log.debug("passport field found ");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
    } else {
      log.info("passport field not present ❌ — skipping inpu");
    }
    await driver.pause(2000);
    const windowSizePassportExpiry = await driver.getWindowSize();
    const startXPassportExpiry = Math.floor(windowSizePassportExpiry.width / 2);
    const startYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.8,
    );
    const endYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.3,
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
            x: startXPassportExpiry,
            y: startYPassportExpiry,
          },
          { type: "pointerDown", button: 0 },
          {
            type: "pointerMove",
            duration: 800,
            x: startXPassportExpiry,
            y: endYPassportExpiry,
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    const passportExpiryField = await driver.$(
      '//android.view.View[contains(@content-desc,"Passport Expiry")]',
    );

    if (await passportExpiryField.isExisting()) {
      log.debug("passport expiry field found ");

      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info("clicked on passport expiry field");

      log.info("going to call the passport expiry function  ..");
      await this.selectPassPortExpiryDate(driver);
    } else {
      log.debug("passport expiry feild not found  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    log.info("clicked on traveller details button");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    log.info("went into   additional details screen");
    await driver.pause(2000);
    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("purpose of travel field not found, skipping..");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("first purpose of travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("no purpose of travel options found in dropdown");
        }
      }
    }
    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();
    await driver.pause(6500);
    log.info("submit button clicked");

    try {
      await driver.hideKeyboard();
    } catch {}
    const goHomeBtn = await driver.$(
      '//android.widget.Button[@content-desc="Go to Home"]',
    );

    if (await goHomeBtn.isExisting()) {
      log.info("ℹdelay screen detected — 'Go to Home' is visible");

      await goHomeBtn.waitForDisplayed({ timeout: 5000 });
      await goHomeBtn.click();

      log.debug(
        "🏠 Go to Home clicked — booking flow completed via delay path",
      );
      return;
    }

    log.info("🔍 no 'Go to Home' button. searching for 'complete booking'...");

    const { width, height } = await driver.getWindowRect();
    const startX = width / 2;
    const startY = height * 0.85;
    const endY = height * 0.35;

    let found = false;

    for (let i = 0; i < 6; i++) {
      const completeBookingBtns = await driver
        .$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        )
        .getElements();

      if ((await completeBookingBtns.length) > 0) {
        log.debug("✅ found 'complete booking' button");
        await completeBookingBtns[0].click();
        found = true;
        break;
      }

      log.info(`🟣 scroll attempt ${i + 1}...`);
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 600, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
      await driver.pause(1500);
    }

    if (!found) {
      throw new Error(
        "❌ neither 'Go to Home' nor 'complete booking' button found",
      );
    }

    log.info("📦 complete booking clicked");

    const popupHotel = await driver.$(
      '//android.view.View[@content-desc="Your hotel is ready to be booked. Do you want to continue?"]',
    );

    await popupHotel.waitForExist({ timeout: 10000 });
    log.info("⚪ confirmation popup appeared");

    const confirmBtnHotel = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );
    await confirmBtnHotel.waitForExist({ timeout: 5000 });
    await confirmBtnHotel.click();

    log.info("✅ booking confirmed hotel successfully");
    await driver.pause(2000);

    const backButtonRequestDetails = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    await backButtonRequestDetails.waitForExist({ timeout: 5000 });
    await backButtonRequestDetails.click();
    log.info(" back button clicked in request detail screen ");
    await driver.pause(2000);
    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen.waitForExist({ timeout: 30000 });
    log.info("travel request screen loaded");
    await driver.pause(45000);
  }
  async viewTravelRequestSummaryForCab(
    cabType: "AIRPORT_TRANSFER" | "LOCAL" | "OUTSTATION",
  ) {
    const driver = this.driver;

    await driver.pause(3000);
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 5000,
    });
    log.info("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    await createTravelRequestScreenProceedButton.click();
    log.info("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");
    log.info("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 6000 });
    log.info("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(3000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 2000 });
    log.info("WENT INTO   ADDITIONAL DETAILS SCREEN ");
    await driver.pause(4000);
    log.info("GOING TO CHECK PURPOSE OF TRAVEL FIELD ");
    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("Purpose Of Travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    await driver.pause(2000);
    log.info("GOING TO CLICK SUBMIT BUTTON IN ADDITIONAL DETAILS SCREEN  ");
    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();
    await driver.pause(2500);
    log.info("SUBMIT BUTTON CLICKED");
    await driver.pause(2000);
    const goHomeBtn = await driver.$(
      '//android.widget.Button[@content-desc="Go to Home"]',
    );

    if (await goHomeBtn.isExisting()) {
      log.info("ℹ️ Delay screen detected — Go to Home is visible");

      await goHomeBtn.waitForDisplayed({ timeout: 5000 });
      await goHomeBtn.click();

      log.info("🏠 Go to Home clicked — ending cab booking flow");
      throw new Error("Booking redirected to Home screen – stopping cab flow");
    }
    let selectCab: WebdriverIO.Element | undefined;

    if (cabType === "AIRPORT_TRANSFER") {
      log.info("✈️ Airport Transfer → scrolling to find Select Cabs");

      const { width: width1, height: height1 } = await driver.getWindowRect();
      const startX1 = width1 / 2;
      const startY1 = height1 * 0.85;
      const endY1 = height1 * 0.35;

      let found = false;

      for (let i = 0; i < 6; i++) {
        const completeBookingBtns = await driver
          .$$(
            '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
          )
          .getElements();

        if ((await completeBookingBtns.length) > 0) {
          log.info("✅ Found 'Complete Booking' button");
          await completeBookingBtns[0].click();
          found = true;
          break;
        }

        log.info(`🟣 Scroll attempt ${i + 1}...`);
        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              { type: "pointerMove", duration: 0, x: startX1, y: startY1 },
              { type: "pointerDown", button: 0 },
              { type: "pointerMove", duration: 600, x: startX1, y: endY1 },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await driver.releaseActions();
        await driver.pause(1500);
      }

      if (!found) {
        throw new Error(
          "❌ Neither 'Go to Home' nor 'Complete Booking' button found",
        );
      }

      log.info("📦 Complete Booking clicked");

      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );

      await popup.waitForExist({ timeout: 10000 });
      log.info("⚪ Confirmation popup appeared");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();

      log.info("✅ Booking confirmed successfully");
      await driver.pause(20000);

      const { width, height } = await driver.getWindowRect();
      const startX = width / 2;
      const startY = height * 0.85;
      const endY = height * 0.35;

      for (let i = 0; i < 5; i++) {
        const selectCabBtns = await driver
          .$$('//android.view.View[@content-desc="Select Cabs"]')
          .getElements();

        if ((await selectCabBtns.length) > 0) {
          selectCab = selectCabBtns[0];
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
              { type: "pointerMove", duration: 600, x: startX, y: endY },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await driver.releaseActions();
        await driver.pause(1200);
      }

      if (!selectCab) {
        throw new Error("'Select Cabs' not found after scrolling");
      }
      await selectCab.waitForDisplayed({ timeout: 8000 });
      await selectCab.click();
      log.info("Select Cabs button clicked (Airport Transfer)");
    } else {
      selectCab = await driver
        .$('//android.view.View[@content-desc="Select Cabs"]')
        .getElement();
      await selectCab.waitForExist({ timeout: 8000 });
      await selectCab.waitForDisplayed({ timeout: 8000 });
      await selectCab.click();
    }

    const firstCabCard = await driver.$(
      '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
    );
    await firstCabCard.waitForExist({ timeout: 5000 });
    await firstCabCard.click();
    log.info("FIRST CAB CARD CLICKED");
    const proceedButtonCabSelecting = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await proceedButtonCabSelecting.waitForExist({ timeout: 5000 });
    await proceedButtonCabSelecting.click();
    log.info("PROCEED BUTTON CLICKED AFTER SELECTING CAB");

    await driver.pause(2000);

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen.waitForExist({ timeout: 30000 });
    log.info("TRAVEL REQUEST SCREEN LOADED");
  }

  async viewTravelRequestSummaryForBus() {
    const driver = this.driver;
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 5000,
    });
    log.debug("create traveller screen proceed button found");
    await createTravelRequestScreenProceedButton.click();
    log.info("create traveller screen proceed button clicked");
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    log.info("entered into  traveller details screen ");
    await driver.pause(3500);

    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 6000 });
    log.info("clicked on traveller details button");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    log.info("went into   additional details screen ");
    await driver.pause(2000);
    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("purpose of travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("first purpose of travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("no purpose of travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);
    log.info("searching for complete booking button...");
    await driver.pause(5000);
    await driver.pause(5000);
    log.info("searching for complete booking button...");
    const completeBookingBtn = await driver.$(
      '//android.widget.Button[@content-desc="Complete Booking"]',
    );

    const hasCompleteBtn = await completeBookingBtn
      .isExisting()
      .catch(() => false);

    if (hasCompleteBtn) {
      log.debug("complete booking button found — proceeding to click .");
      await completeBookingBtn
        .waitForExist({ timeout: 3000 })
        .catch(() => false);
      await completeBookingBtn.click();
      log.info(" complete booking button clicked ");
      await driver.pause(2000);

      const popup = await driver.$(
        '//android.view.View[@content-desc="Your bus is ready to be booked. Do you want to continue?"]',
      );
      const popupShown = await popup
        .waitForExist({ timeout: 8000 })
        .catch(() => false);
      if (popupShown) {
        log.info("⚪ popup appeared — confirming booking...");
        const confirmBtn = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await confirmBtn.waitForExist({ timeout: 5000 }).catch(() => false);
        await confirmBtn.click().catch(() => {});
        log.info("✅ booking confirmed.");
        await driver.pause(5000);
      } else {
        log.info(
          "popup did not appear after clicking complete booking — continuing flow.",
        );
      }
    } else {
      log.info(
        "complete booking button not present — skipping popup/confirmation flow.",
      );
    }

    const backButtonRequestDetails = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    const backExists = await backButtonRequestDetails
      .waitForExist({ timeout: 8000 })
      .catch(() => false);
    if (backExists) {
      await backButtonRequestDetails.click().catch(() => {});
      log.info(" back button clicked in request detail screen ");
      await driver.pause(5000);
    } else {
      log.debug("back button not found — continuing without clicking back.");
    }

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen
      .waitForExist({ timeout: 6000 })
      .catch(() => false);
    await driver.pause(2000);
    log.debug("travel request screen found");
  }
  async viewTravelRequestSummaryForTrain() {
    const driver = this.driver;
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    log.info("entered into  traveller details screen ");
    await driver.pause(3000);

    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    log.info("clicked on traveller details button");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    log.info("went into   additional details screen ");
    await driver.pause(2000);

    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("purpose of travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("first purpose of travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("no purpose of travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);
    const backButtonRequestDetails = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    const backExists = await backButtonRequestDetails
      .waitForExist({ timeout: 5000 })
      .catch(() => false);
    if (backExists) {
      await backButtonRequestDetails.click().catch(() => {});
      log.info(" back button clicked in request detail screen ");
      await driver.pause(5000);
    } else {
      log.debug("back button not found — continuing without clicking back.");
    }

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen
      .waitForExist({ timeout: 6000 })
      .catch(() => false);
    await driver.pause(2000);
    log.debug("travel request screen found");
  }

  async viewTravelRequestSummaryForFlightHotel() {
    const driver = this.driver;
    await driver.pause(2000);
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    log.info("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    await driver.pause(3000);

    const windowSizeTravellerDetails = await driver.getWindowSize();
    const startsX = Math.floor(windowSizeTravellerDetails.width / 2);
    const startsY = Math.floor(windowSizeTravellerDetails.height * 0.8);
    const endsY = Math.floor(windowSizeTravellerDetails.height * 0.6);

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startsX, y: startsY },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration: 300, x: startsX, y: endsY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    log.info("SCROLLED TO BOTTOM OF THE PAGE  passport feild ");
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    log.info("CHECKING FOR PASSPORT FIELD PRESENCE ");
    if (await passportNumber.isExisting()) {
      log.info("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      log.info("PASSPORT NUMBER ENTERED  ");
    } else {
      log.info("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
    }
    await driver.pause(2000);

    const windowSizePassportExpiry = await driver.getWindowSize();
    const startXPassportExpiry = Math.floor(windowSizePassportExpiry.width / 2);
    const startYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.8,
    ); // start lower
    const endYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.3,
    ); // move upward

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          {
            type: "pointerMove",
            duration: 0,
            x: startXPassportExpiry,
            y: startYPassportExpiry,
          },
          { type: "pointerDown", button: 0 },
          {
            type: "pointerMove",
            duration: 800,
            x: startXPassportExpiry,
            y: endYPassportExpiry,
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    const passportExpiryField = await driver.$(
      '//android.view.View[contains(@content-desc,"Passport Expiry")]',
    );

    if (await passportExpiryField.isExisting()) {
      log.info("Passport Expiry field found ✅");
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info("Clicked on Passport Expiry field ");

      log.info("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      log.info("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    log.info("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    log.info("WENT INTO   ADDITIONAL DETAILS SCREEN ");
    await driver.pause(2000);
    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("Purpose Of Travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    const { width: winWidth, height: winHeight } = await driver.getWindowRect();
    const startX = winWidth / 2;
    const startY = winHeight * 0.85;
    const endY = winHeight * 0.35;

    let found = false;

    for (let i = 0; i < 6; i++) {
      log.info("SEARCHING FOR COMPLETE BOOKING BUTTON...");
      const completeBookingBtns = await driver
        .$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        )
        .getElements();

      if ((await completeBookingBtns.length) > 0) {
        log.info("✅ COMPLETE BOOKING BUTTON FOUND ");
        const button = completeBookingBtns[0];

        await button.waitForDisplayed({ timeout: 6000 });
        await button.waitForEnabled({ timeout: 6000 });
        try {
          await (button as unknown as WebdriverIO.Element).click();
          log.info("🟢 'Complete Booking' clicked with element.click()");
        } catch (clickErr) {
          log.warn(
            "element.click() failed, falling back to coordinate tap:",
            clickErr,
          );

          const rect = await (button as any).getRect();
          const centerX = Math.floor(rect.x + rect.width / 2);
          const centerY = Math.floor(rect.y + rect.height / 2);

          await driver.execute("mobile: clickGesture", {
            x: centerX,
            y: centerY,
          });
          log.info("🟢 'Complete Booking' clicked with mobile: clickGesture");
        }
        log.info("🟢 COMPLETE BOOKING TAPPED SUCCESSFULLY ");
        found = true;
        break;
      }

      log.info(`🟣 Scroll attempt ${i + 1}...`);
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 600, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
      await driver.pause(2000);
    }

    if (!found) {
      throw new Error(
        "❌ FAILED TO FIND 'Complete Booking' button even after scrolling.",
      );
    }

    log.info(" COMPLETE BOOKING BUTTON CLICKED ");
    await driver.pause(5000);
    const popup = await driver.$(
      '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
    );

    await popup.waitForExist({ timeout: 8000 });
    log.info("⚪ Popup appeared — confirming booking  FLIGHTHOTEL...");
    await driver.pause(2000);
    const confirmBtn = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );
    await confirmBtn.waitForDisplayed({ timeout: 8000 });
    await confirmBtn.click();
    log.info("✅ Booking confirmed.");
    await driver.pause(8000);
  }

  async viewTravelRequestSummaryForFlightHotelCab() {
    const driver = this.driver;
    await driver.pause(2000);

    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 10000 });

    log.info("ENTERED INTO TRAVELLER DETAILS SCREEN");
    await driver.pause(3000);

    const travellerWindow = await driver.getWindowSize();

    const travellerStartX = Math.floor(travellerWindow.width / 2);
    const travellerStartY = Math.floor(travellerWindow.height * 0.8);
    const travellerEndY = Math.floor(travellerWindow.height * 0.6);

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          {
            type: "pointerMove",
            duration: 0,
            x: travellerStartX,
            y: travellerStartY,
          },
          {
            type: "pointerDown",
            button: 0,
          },
          {
            type: "pointerMove",
            duration: 300,
            x: travellerStartX,
            y: travellerEndY,
          },
          {
            type: "pointerUp",
            button: 0,
          },
        ],
      },
    ]);

    await driver.releaseActions();

    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    if (await passportNumber.isExisting()) {
      log.info("PASSPORT FIELD FOUND");

      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");

      log.info("PASSPORT NUMBER ENTERED");
    } else {
      log.info("PASSPORT FIELD NOT PRESENT - SKIPPING");
    }

    await driver.pause(2000);
    const passportWindow = await driver.getWindowSize();

    const passportStartX = Math.floor(passportWindow.width / 2);
    const passportStartY = Math.floor(passportWindow.height * 0.8);
    const passportEndY = Math.floor(passportWindow.height * 0.3);

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          {
            type: "pointerMove",
            duration: 0,
            x: passportStartX,
            y: passportStartY,
          },
          {
            type: "pointerDown",
            button: 0,
          },
          {
            type: "pointerMove",
            duration: 800,
            x: passportStartX,
            y: passportEndY,
          },
          {
            type: "pointerUp",
            button: 0,
          },
        ],
      },
    ]);

    await driver.releaseActions();

    const passportExpiryField = await driver.$(
      '//android.view.View[contains(@content-desc,"Passport Expiry")]',
    );

    if (await passportExpiryField.isExisting()) {
      log.info("PASSPORT EXPIRY FIELD FOUND");

      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();

      log.info("CALLING PASSPORT EXPIRY FUNCTION");

      await this.selectPassPortExpiryDate(driver);
    } else {
      log.info("PASSPORT EXPIRY FIELD NOT FOUND - SKIPPING");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );

    await addTravellerDetailScreenButton.waitForExist({
      timeout: 5500,
    });

    log.info("CLICKING ADD TRAVELLER DETAILS");

    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);
    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );

    await additionalDetailsScreen.waitForExist({
      timeout: 5000,
    });

    log.info("ENTERED ADDITIONAL DETAILS SCREEN");

    await driver.pause(2000);

    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";

    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("Purpose Of Travel field not found - skipping");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();

        if ((await options.length) > 0) {
          await options[0].click();

          log.info("FIRST PURPOSE OF TRAVEL OPTION SELECTED");

          await driver.pause(1000);
        } else {
          log.warn("NO PURPOSE OF TRAVEL OPTIONS FOUND");
        }
      }
    }

    const submitButton = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );

    await submitButton.waitForExist({
      timeout: 5500,
    });

    log.info("CLICKING SUBMIT");

    await driver.pause(2000);
    await submitButton.click();

    // Give the application time to transition
    await driver.pause(5000);
    const goToHomeButton = await driver.$(
      '//android.widget.Button[@content-desc="Go to Home"]',
    );

    const goToHomeExists = await goToHomeButton.isExisting().catch(() => false);

    if (goToHomeExists) {
      log.info("GO TO HOME FOUND - BOOKING FLOW ENDED");

      await goToHomeButton.waitForDisplayed({
        timeout: 5000,
      });

      await goToHomeButton.click();

      return;
    }
    log.info("SEARCHING FOR COMPLETE BOOKING");

    const { width: bookingWidth, height: bookingHeight } =
      await driver.getWindowRect();

    const bookingStartX = Math.floor(bookingWidth / 2);
    const bookingStartY = Math.floor(bookingHeight * 0.85);
    const bookingEndY = Math.floor(bookingHeight * 0.35);

    let bookingFound = false;

    for (let i = 0; i < 6; i++) {
      log.info(`🔍 COMPLETE BOOKING SEARCH - ATTEMPT ${i + 1}/6`);

      const completeBookingBtns = await driver
        .$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        )
        .getElements();

      if ((await completeBookingBtns.length) > 0) {
        log.info("COMPLETE BOOKING FOUND");

        const completeBookingBtn = completeBookingBtns[0];

        await completeBookingBtn.waitForDisplayed({
          timeout: 6000,
        });

        await completeBookingBtn.waitForEnabled({
          timeout: 6000,
        });

        try {
          await completeBookingBtn.click();

          log.info("COMPLETE BOOKING CLICKED");

          bookingFound = true;
          break;
        } catch (err) {
          log.warn(
            "COMPLETE BOOKING CLICK FAILED - WILL SCROLL AND RETRY",
            err,
          );
        }
      }

      log.info(`🟣 COMPLETE BOOKING SCROLL ATTEMPT ${i + 1}`);

      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            {
              type: "pointerMove",
              duration: 0,
              x: bookingStartX,
              y: bookingStartY,
            },
            {
              type: "pointerDown",
              button: 0,
            },
            {
              type: "pointerMove",
              duration: 600,
              x: bookingStartX,
              y: bookingEndY,
            },
            {
              type: "pointerUp",
              button: 0,
            },
          ],
        },
      ]);

      await driver.releaseActions();

      await driver.pause(2000);
    }

    if (!bookingFound) {
      throw new Error(
        "❌ Could not find Complete Booking button after 6 scroll attempts",
      );
    }
    await driver.pause(5000);

    const bookingPopup = await driver.$(
      '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
    );

    await bookingPopup.waitForExist({
      timeout: 10000,
    });

    log.info("FLIGHT BOOKING CONFIRMATION POPUP FOUND");

    const confirmButton = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );

    await confirmButton.waitForExist({
      timeout: 5000,
    });

    await confirmButton.click();
    log.info("YES CLICKED - FLIGHT BOOKING CONFIRMED");
    await driver.pause(8000);
    await driver.pause(5000);
    log.info("🔎 CHECKING CURRENT REQUEST DETAILS SCREEN");
    const requestId = await driver.$(
      '(//android.view.View[contains(@content-desc, "IBS/")])[1]',
    );

    await requestId.waitForExist({
      timeout: 10000,
    });

    log.info(
      `✅ REQUEST DETAILS SCREEN CONFIRMED: ${await requestId.getAttribute(
        "content-desc",
      )}`,
    );
    const backButton = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    await backButton.waitForExist({
      timeout: 10000,
    });
    await backButton.click();
    log.info("🔙 BACK TO TRAVEL REQUESTS");
    await driver.pause(5000);
    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );

    await travelRequestScreen.waitForExist({
      timeout: 30000,
    });

    log.info("✅ TRAVEL REQUESTS SCREEN LOADED");

    const firstCard = await driver.$(
      '(//android.view.View[contains(@content-desc, "IBS/")])[1]',
    );

    await firstCard.waitForExist({
      timeout: 10000,
    });

    await firstCard.click();

    log.info("✅ OPENED IBS REQUEST CARD");

    await driver.pause(5000);
    const cabSelector = '//android.view.View[@content-desc="Select Cabs"]';

    let selectCabFound = false;

    const { width: cabWidth, height: cabHeight } = await driver.getWindowRect();

    const cabStartX = Math.floor(cabWidth / 2);
    const cabStartY = Math.floor(cabHeight * 0.85);
    const cabEndY = Math.floor(cabHeight * 0.35);

    for (let i = 0; i < 8; i++) {
      log.info(`🚕 SELECT CABS SEARCH - ATTEMPT ${i + 1}/8`);

      const selectCabElements = await driver.$$(cabSelector).getElements();

      if ((await selectCabElements.length) > 0) {
        const candidate = selectCabElements[0];

        if (await candidate.isDisplayed()) {
          log.info("✅ SELECT CABS FOUND");

          await candidate.click();

          log.info("🚖 SELECT CABS CLICKED");

          selectCabFound = true;
          break;
        }
      }

      log.info(`🟣 SELECT CABS SCROLL ATTEMPT ${i + 1}`);

      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: {
            pointerType: "touch",
          },
          actions: [
            {
              type: "pointerMove",
              duration: 0,
              x: cabStartX,
              y: cabStartY,
            },
            {
              type: "pointerDown",
              button: 0,
            },
            {
              type: "pointerMove",
              duration: 600,
              x: cabStartX,
              y: cabEndY,
            },
            {
              type: "pointerUp",
              button: 0,
            },
          ],
        },
      ]);

      await driver.releaseActions();

      await driver.pause(1500);
    }

    if (!selectCabFound) {
      log.info("❌ SELECT CABS NOT FOUND AFTER REOPENING REQUEST");

      log.info("========== PAGE SOURCE ==========");

      log.info(await driver.getPageSource());

      log.info("========== END PAGE SOURCE ==========");

      throw new Error("❌ Select Cabs not found after reopening IBS request");
    }
    await driver.pause(2000);

    const firstCabCard = await driver.$(
      '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
    );

    await firstCabCard.waitForExist({
      timeout: 10000,
    });

    await firstCabCard.waitForDisplayed({
      timeout: 10000,
    });

    await firstCabCard.click();
    await driver.pause(2000);

    const proceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );

    await proceedButton.waitForExist({
      timeout: 10000,
    });

    await proceedButton.waitForDisplayed({
      timeout: 10000,
    });

    await proceedButton.click();

    log.info("✅ PROCEED CLICKED AFTER CAB SELECTION");

    await driver.pause(5000);
  }

  async viewTravelRequestSummaryForFlightHotelCabBus() {
    const driver = this.driver;
    await this.driver.pause(8000);

    const createTravelRequest = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]',
    );
    await createTravelRequest.waitForDisplayed({
      timeout: 10000,
    });
    log.info("✅ CREATE TRAVEL REQUEST SCREEN FOUND");
    // Proceed to Traveller Details
    const proceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await proceedButton.waitForDisplayed({
      timeout: 10000,
    });
    await proceedButton.waitForEnabled({
      timeout: 10000,
    });
    log.info("🟢 CLICKING PROCEED ON CREATE TRAVEL REQUEST");
    await proceedButton.click();
    log.info("✅ CREATE TRAVEL REQUEST PROCEED CLICKED");
    await driver.pause(3000);

    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForDisplayed({ timeout: 8000 });
    log.info("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    await driver.pause(8000);

    const windowSizeTravellerDetails = await driver.getWindowSize();
    const startsX = Math.floor(windowSizeTravellerDetails.width / 2);
    const startsY = Math.floor(windowSizeTravellerDetails.height * 0.8);
    const endsY = Math.floor(windowSizeTravellerDetails.height * 0.6);

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startsX, y: startsY },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration: 300, x: startsX, y: endsY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    log.info("SCROLLED TO BOTTOM OF THE PAGE  passport feild ");

    await driver.pause(4000);
    // Locate the Passport field

    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    log.info("CHECKING FOR PASSPORT FIELD PRESENCE ");
    if (await passportNumber.isExisting()) {
      log.info("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      log.info("PASSPORT NUMBER ENTERED ");
    } else {
      log.info("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
    }
    await driver.pause(2000);

    const windowSizePassportExpiry = await driver.getWindowSize();
    const startXPassportExpiry = Math.floor(windowSizePassportExpiry.width / 2);
    const startYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.8,
    ); // start lower
    const endYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.3,
    ); // move upward

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          {
            type: "pointerMove",
            duration: 0,
            x: startXPassportExpiry,
            y: startYPassportExpiry,
          },
          { type: "pointerDown", button: 0 },
          {
            type: "pointerMove",
            duration: 800,
            x: startXPassportExpiry,
            y: endYPassportExpiry,
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    const passportExpiryField = await driver.$(
      '//android.view.View[contains(@content-desc,"Passport Expiry")]',
    );

    if (await passportExpiryField.isExisting()) {
      log.info("Passport Expiry field found ✅");
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info("Clicked on Passport Expiry field ");

      // Here you can call your date picker function
      log.info("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      log.info("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    log.info("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    log.info("WENT INTO   ADDITIONAL DETAILS SCREEN ");
    await driver.pause(2000);
    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("Purpose Of Travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);

    try {
      log.info("🔎 Checking for 'Go to Home' button...");

      const goToHomeButton = await driver.$(
        '//android.widget.Button[@content-desc="Go to Home"]',
      );
      const isGoToHomeVisible = await goToHomeButton
        .isExisting()
        .catch(() => false);

      if (isGoToHomeVisible) {
        log.info(
          "✅ 'Go to Home' button found - navigating back to Travel Requests",
        );
        await goToHomeButton.click();
        log.info("🏠 Clicked 'Go to Home' button - ending flow here");
        return; // End the flow immediately
      }

      log.info(
        "❌ 'Go to Home' button not found - proceeding to Complete Booking flow...",
      );

      const { width: screenWidth, height: screenHeight } =
        await driver.getWindowRect();
      const startX = screenWidth / 2;
      const startY = screenHeight * 0.95;
      const endY = screenHeight * 0.2;

      let bookingFound = false;

      for (let i = 0; i < 15; i++) {
        log.info("🔍 Searching for 'Complete Booking' button...");
        const completeBookingBtns = await driver
          .$$(
            '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
          )
          .getElements();

        if ((await completeBookingBtns.length) > 0) {
          log.info("✅ Found 'Complete Booking' button!");
          try {
            await completeBookingBtns[0].click();
            bookingFound = true;
            break;
          } catch (err) {
            log.info(
              "⚠️ Failed to click 'Complete Booking', retrying after scroll...",
            );
          }
        }

        log.info(`🟣 Scroll attempt ${i + 1}...`);
        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              { type: "pointerMove", duration: 0, x: startX, y: startY },
              { type: "pointerDown", button: 0 },
              { type: "pointerMove", duration: 700, x: startX, y: endY },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await driver.releaseActions();
        await driver.pause(1500);
      }

      if (!bookingFound) {
        throw new Error(
          "❌ Could not find 'Complete Booking' button even after scrolling!",
        );
      }

      log.info("✅ COMPLETE BOOKING BUTTON CLICKED");
      await driver.pause(5000);

      // ----- POPUP CONFIRMATION -----
      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );
      await popup.waitForExist({ timeout: 8000 });
      log.info("⚪ Popup appeared — confirming booking...");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();
      log.info("✅ Booking confirmed.");
      await driver.pause(5000);

      // ----- SELECT CABS SECTION -----
      log.info("🚕 Starting cab selections...");
      log.info("🚕 Deep scrolling to locate 'Select Cabs'...");

      const { width: screenWidthLocalCab, height: screenHeightLocalCab } =
        await driver.getWindowRect();
      const startXLocalCab = screenWidthLocalCab / 2;
      const startYLocalCab = screenHeightLocalCab * 0.95;
      const endYLocalCab = screenHeightLocalCab * 0.05;

      let selectCabFound = false;

      for (let i = 0; i < 25; i++) {
        log.info(`🔄 Scroll attempt ${i + 1} to find 'Select Cabs'...`);
        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              {
                type: "pointerMove",
                duration: 0,
                x: startXLocalCab,
                y: startYLocalCab,
              },
              { type: "pointerDown", button: 0 },
              {
                type: "pointerMove",
                duration: 1500,
                x: startXLocalCab,
                y: endYLocalCab,
              },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await driver.releaseActions();
        await driver.pause(2500);

        const selectCab = await driver.$(
          '//android.view.View[@content-desc="Select Cabs"]',
        );
        if (await selectCab.isExisting()) {
          log.info("✅ 'Select Cabs' button FOUND!");
          await selectCab.waitForDisplayed({ timeout: 5000 });
          await driver.pause(1000);
          await selectCab.click();
          log.info("🚖 'Select Cabs' button CLICKED!");
          selectCabFound = true;
          break;
        }
      }

      if (!selectCabFound) {
        throw new Error(
          "❌ Could not locate 'Select Cabs' even after multiple scrolls!",
        );
      }

      await driver.pause(2000);
      const firstCabCard1 = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard1.waitForExist({ timeout: 10000 });
      await firstCabCard1.click();
      log.info("🚗 First Cab Card CLICKED");

      await driver.pause(2000);

      const proceedButtonCabSelecting1 = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting1.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting1.click();
      log.info("✅ Proceed button clicked after cab selection");

      await driver.pause(2000);
      log.info("📝 Clicking on Outstation cab...");
      await driver.pause(9000);
      const travelRequestScreen = await driver.$(
        '//android.view.View[@content-desc="Travel Requests"]',
      );
      await travelRequestScreen.waitForExist({ timeout: 30000 });
      log.info("✅ TRAVEL REQUEST SCREEN LOADED");

      await driver.pause(45000);

      const firstCard = await driver.$(
        '(//android.view.View[contains(@content-desc, "IBS/")])[1]',
      );
      await firstCard.waitForExist({ timeout: 5000 });
      await firstCard.click();
      log.info("✅ CLICKED ON THE FIRST CARD IN MY REQUESTS TAB");

      const cabSelector = '//android.view.View[@content-desc="Select Cabs"]';
      const found = await this.scrollUntilVisible(cabSelector);
      if (!found) throw new Error("❌ 'Select Cabs' not found after scrolling");

      await driver.$(cabSelector).click();
      log.info("✅ CLICKED 'Select Cabs'");
      await driver.pause(2000);

      const firstCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard.waitForExist({ timeout: 5000 });
      await firstCabCard.click();
      log.info("✅ FIRST CAB CARD CLICKED");

      const proceedButtonCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting.click();
      log.info("✅ PROCEED BUTTON CLICKED AFTER SELECTING CAB");

      // ----- SUCCESS VALIDATION -----
      const successMessageSelector =
        '//android.view.View[@content-desc="Travel Requests"]';
      const isSuccessVisible = await driver
        .$(successMessageSelector)
        .waitForExist({
          timeout: 10000,
          timeoutMsg: "SCRIPT HAS NOT RUN SUCCESSFULLY ",
        });

      if (isSuccessVisible) {
        log.info("🎉 SCRIPT WAS SUCCESSFULLY EXECUTED");
      } else {
        throw new Error("❌ SCRIPT WAS NOT SUCCESSFULLY EXECUTED");
      }

      // ----- RETURN BACK BUTTON -----
      const backButtonRequestDetails = await driver.$(
        '//android.widget.Button[@content-desc="Back"]',
      );
      await backButtonRequestDetails.waitForExist({ timeout: 5000 });
      await backButtonRequestDetails.click();
      log.info("🔙 BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN");
    } catch (err) {
      log.error("🚨 FAILED TO EXECUTE ROUNDTRIP FLOW:", err);
      throw err;
    }
  }

  async viewTravelRequestSummaryForFlightHotelAirportCabBus() {
    const driver = this.driver;
    await this.driver.pause(2000);

    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    log.info("entered into  traveller details screen ");
    await driver.pause(3000);

    const windowSizeTravellerDetails = await driver.getWindowSize();
    const startsX = Math.floor(windowSizeTravellerDetails.width / 2);
    const startsY = Math.floor(windowSizeTravellerDetails.height * 0.8);
    const endsY = Math.floor(windowSizeTravellerDetails.height * 0.6);

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startsX, y: startsY },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration: 300, x: startsX, y: endsY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    log.info("scrolled to bottom of the page  passport feild ");
    const passportNumber = await driver.$(
      '//android.widget.edittext[@hint="Passport No"]',
    );

    log.info("checking for passport field presence  ");
    if (await passportNumber.isExisting()) {
      log.debug("passport field found ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      log.info("passport number entered ");
    } else {
      log.info("passport field not present ❌ — skipping input");
    }
    await driver.pause(2000);

    const windowSizePassportExpiry = await driver.getWindowSize();
    const startXPassportExpiry = Math.floor(windowSizePassportExpiry.width / 2);
    const startYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.8,
    ); // start lower
    const endYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.3,
    ); // move upward

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          {
            type: "pointerMove",
            duration: 0,
            x: startXPassportExpiry,
            y: startYPassportExpiry,
          },
          { type: "pointerDown", button: 0 },
          {
            type: "pointerMove",
            duration: 800,
            x: startXPassportExpiry,
            y: endYPassportExpiry,
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    const passportExpiryField = await driver.$(
      '//android.view.View[contains(@content-desc,"Passport Expiry")]',
    );

    if (await passportExpiryField.isExisting()) {
      log.debug("passport expiry field found ✅");

      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info("clicked on passport expiry field ");

      // here you can call your date picker function
      log.info("going to call the passport expiry function  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      log.debug("passport expiry feild not found  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    log.info("clicked on traveller details button");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    log.info("went into   additional details screen ");
    await driver.pause(2000);
    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("purpose of travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("first purpose of travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("no purpose of travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);

    try {
      log.info("🔎 checking for 'Go to Home' button...");

      const goToHomeButton = await driver.$(
        '//android.widget.Button[@content-desc="Go to Home"]',
      );
      const isGoToHomeVisible = await goToHomeButton
        .isExisting()
        .catch(() => false);

      if (isGoToHomeVisible) {
        log.debug(
          "✅ 'Go to Home' button found - navigating back to travel requests",
        );
        await goToHomeButton.click();
        log.info("🏠 clicked 'Go to Home' button - ending flow here");
        return; // end the flow immediately
      }

      log.debug(
        "❌ 'Go to Home' button not found - proceeding to complete booking flow...",
      );

      // ----- complete booking section -----
      const { width: screenWidth, height: screenHeight } =
        await driver.getWindowRect();
      const startX = screenWidth / 2;
      const startY = screenHeight * 0.95;
      const endY = screenHeight * 0.2;

      let bookingFound = false;

      for (let i = 0; i < 15; i++) {
        log.info("🔍 searching for 'complete booking' button...");
        const completeBookingBtns = await driver
          .$$(
            '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
          )
          .getElements();

        if ((await completeBookingBtns.length) > 0) {
          log.debug("✅ found 'complete booking' button!");
          try {
            await completeBookingBtns[0].click();
            bookingFound = true;
            break;
          } catch (err) {
            log.info(
              "⚠️ failed to click 'complete booking', retrying after scroll...",
            );
          }
        }

        log.info(`🟣 scroll attempt ${i + 1}...`);
        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              { type: "pointerMove", duration: 0, x: startX, y: startY },
              { type: "pointerDown", button: 0 },
              { type: "pointerMove", duration: 700, x: startX, y: endY },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await driver.releaseActions();
        await driver.pause(1500);
      }

      if (!bookingFound) {
        throw new Error(
          "❌ Could not find 'complete booking' button even after scrolling!",
        );
      }

      log.info("✅ complete booking button clicked");
      await driver.pause(5000);

      // ----- popup confirmation -----
      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );
      await popup.waitForExist({ timeout: 8000 });
      log.info("⚪ popup appeared — confirming booking...");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();
      log.info("✅ booking confirmed.");
      await driver.waitUntil(
        async () => {
          return (await driver.getPageSource()).includes("Select Cabs");
        },
        {
          timeout: 30000,
          interval: 1000,
          timeoutMsg: "Cab section never appeared",
        },
      );

      // ----- select cabs section -----
      log.info("🚕 starting cab selections...");
      log.info("🚕 deep scrolling to locate 'select cabs'...");
      await driver.pause(8000);
      const { width: screenWidthLocalCab, height: screenHeightLocalCab } =
        await driver.getWindowRect();
      const startXLocalCab = screenWidthLocalCab / 2;
      const startYLocalCab = screenHeightLocalCab * 0.8;
      const endYLocalCab = screenHeightLocalCab * 0.2;

      let selectCabFound = false;

      for (let i = 0; i < 25; i++) {
        log.info(`🔄 scroll attempt ${i + 1} to find 'select cabs'...`);
        const selectCab = await driver.$(
          '//android.view.View[contains(@content-desc,"Select Cab")]',
        );

        if (await selectCab.isExisting()) {
          log.info("✅ Select Cabs found.");
          await selectCab.click();
          log.info("🚖 'select cabs' button clicked!");
          selectCabFound = true;
          break;
        }

        log.info("Scrolling...");

        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              {
                type: "pointerMove",
                duration: 0,
                x: startXLocalCab,
                y: startYLocalCab,
              },
              { type: "pointerDown", button: 0 },
              {
                type: "pointerMove",
                duration: 1500,
                x: startXLocalCab,
                y: endYLocalCab,
              },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await driver.releaseActions();
        await driver.pause(4500);
      }

      if (!selectCabFound) {
        throw new Error(
          "❌ Could not locate 'select cabs' even after multiple scrolls!",
        );
      }

      await driver.pause(2000);

      // ----- cab card selection -----
      const firstCabCard1 = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard1.waitForExist({ timeout: 10000 });
      await firstCabCard1.click();
      log.info("🚗 first cab card clicked");

      await driver.pause(2000);

      const proceedButtonCabSelecting1 = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting1.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting1.click();
      log.info("✅ proceed button clicked after cab selection");

      await driver.pause(2000);
      log.info("📝 clicking on outstation cab...");
      await driver.pause(9000);

      // ----- return to travel requests -----
      const travelRequestScreen = await driver.$(
        '//android.view.View[@content-desc="Travel Requests"]',
      );
      await travelRequestScreen.waitForExist({ timeout: 30000 });
      log.info("✅ travel request screen loaded");

      await driver.pause(45000);

      const firstCard = await driver.$(
        '(//android.view.View[contains(@content-desc, "IBS/")])[1]',
      );
      await firstCard.waitForExist({ timeout: 5000 });
      await firstCard.click();
      log.info("✅ clicked on the first card in my requests tab");

      const cabSelector = '//android.view.View[@content-desc="Select Cabs"]';
      const found = await this.scrollUntilVisible(cabSelector);
      if (!found) throw new Error("❌ 'select cabs' not found after scrolling");

      await driver.$(cabSelector).click();
      log.info("✅ clicked 'select cabs'");
      await driver.pause(2000);

      const firstCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard.waitForExist({ timeout: 5000 });
      await firstCabCard.click();
      log.info("✅ first cab card clicked");

      const proceedButtonCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting.click();
      log.info("✅ proceed button clicked after selecting cab");

      // ----- success validation -----
      const successMessageSelector =
        '//android.view.View[@content-desc="Travel Requests"]';
      const isSuccessVisible = await driver
        .$(successMessageSelector)
        .waitForExist({
          timeout: 10000,
          timeoutMsg: "SCRIPT HAS NOT RUN SUCCESSFULLY ",
        });

      if (isSuccessVisible) {
        log.info("🎉 script was successfully executed");
      } else {
        throw new Error("❌ SCRIPT WAS NOT SUCCESSFULLY EXECUTED");
      }

      // ----- return back button -----
      const backButtonRequestDetails = await driver.$(
        '//android.widget.Button[@content-desc="Back"]',
      );
      await backButtonRequestDetails.waitForExist({ timeout: 5000 });
      await backButtonRequestDetails.click();
      log.info("🔙 back button clicked in request detail screen");
    } catch (err) {
      log.error("🚨 failed to execute roundtrip flow:", err);
      throw err;
    }
  }

  async viewTravelRequestSummaryForFlighMulticitytHotelAirportCabBusRail() {
    const driver = this.driver;
    await driver.pause(2000);
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    log.info("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    await driver.pause(3000);

    const windowSizeTravellerDetails = await driver.getWindowSize();
    const startsX = Math.floor(windowSizeTravellerDetails.width / 2);
    const startsY = Math.floor(windowSizeTravellerDetails.height * 0.8);
    const endsY = Math.floor(windowSizeTravellerDetails.height * 0.6);

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startsX, y: startsY },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration: 300, x: startsX, y: endsY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    log.info("SCROLLED TO BOTTOM OF THE PAGE  passport feild ");
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    log.info("CHECKING FOR PASSPORT FIELD PRESENCE  ");
    if (await passportNumber.isExisting()) {
      log.info("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      log.info("PASSPORT NUMBER ENTERED  ");
    } else {
      log.info("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
    }
    await driver.pause(2000);

    const windowSizePassportExpiry = await driver.getWindowSize();
    const startXPassportExpiry = Math.floor(windowSizePassportExpiry.width / 2);
    const startYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.8,
    ); // start lower
    const endYPassportExpiry = Math.floor(
      windowSizePassportExpiry.height * 0.3,
    ); // move upward

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          {
            type: "pointerMove",
            duration: 0,
            x: startXPassportExpiry,
            y: startYPassportExpiry,
          },
          { type: "pointerDown", button: 0 },
          {
            type: "pointerMove",
            duration: 800,
            x: startXPassportExpiry,
            y: endYPassportExpiry,
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();

    const passportExpiryField = await driver.$(
      '//android.view.View[contains(@content-desc,"Passport Expiry")]',
    );

    if (await passportExpiryField.isExisting()) {
      log.info("Passport Expiry field found ✅");

      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info("Clicked on Passport Expiry field");

      log.info("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      log.info("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    log.info("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    log.info("WENT INTO   ADDITIONAL DETAILS SCREEN ");
    await driver.pause(2000);
    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = (await purposeOfTravel.getAttribute("content-desc")) ?? "";
    } catch (e) {
      log.warn("Purpose Of Travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver
          .$$("//android.widget.RadioButton")
          .getElements();
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);

    try {
      log.info("🔎 Checking for 'Go to Home' button...");

      const goToHomeButton = await driver.$(
        '//android.widget.Button[@content-desc="Go to Home"]',
      );
      const isGoToHomeVisible = await goToHomeButton
        .isExisting()
        .catch(() => false);

      if (isGoToHomeVisible) {
        log.info(
          "✅ 'Go to Home' button found - navigating back to Travel Requests",
        );
        await goToHomeButton.click();
        log.info("🏠 Clicked 'Go to Home' button - ending flow here");
        return; // End the flow immediately
      }

      log.info(
        "❌ 'Go to Home' button not found - proceeding to Complete Booking flow...",
      );

      const { width: screenWidth, height: screenHeight } =
        await driver.getWindowRect();
      const startX = screenWidth / 2;
      const startY = screenHeight * 0.95;
      const endY = screenHeight * 0.2;

      let bookingFound = false;

      for (let i = 0; i < 15; i++) {
        log.info("🔍 Searching for 'Complete Booking' button...");
        const completeBookingBtns = await driver
          .$$(
            '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
          )
          .getElements();

        if ((await completeBookingBtns.length) > 0) {
          log.info("✅ Found 'Complete Booking' button!");
          try {
            await completeBookingBtns[0].click();
            bookingFound = true;
            break;
          } catch (err) {
            log.info(
              "⚠️ Failed to click 'Complete Booking', retrying after scroll...",
            );
          }
        }

        log.info(`🟣 Scroll attempt ${i + 1}...`);
        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              { type: "pointerMove", duration: 0, x: startX, y: startY },
              { type: "pointerDown", button: 0 },
              { type: "pointerMove", duration: 700, x: startX, y: endY },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await driver.releaseActions();
        await driver.pause(1500);
      }

      if (!bookingFound) {
        throw new Error(
          "❌ Could not find 'Complete Booking' button even after scrolling!",
        );
      }

      log.info("✅ COMPLETE BOOKING BUTTON CLICKED");
      await driver.pause(5000);
      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );
      await popup.waitForExist({ timeout: 8000 });
      log.info("⚪ Popup appeared — confirming booking...");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();
      log.info("✅ Booking confirmed.");
      await driver.pause(5000);

      // ----- SELECT CABS SECTION -----
      log.info("🚕 Starting cab selections...");
      const selectCabSelector =
        '//android.view.View[@content-desc="Select Cabs"]';
      log.info("🚕 Starting long scrolls to find 'Select Cabs'...");

      const foundSelectCab = await this.scrollDownUntilVisible(
        selectCabSelector,
        2,
      );

      if (!foundSelectCab) {
        throw new Error("❌ 'Select Cabs' not found after long scrolls");
      }
      log.info("🚕 Starting long scrolls to find 'Select Cabs'...");

      const selectCab = await driver.$(selectCabSelector);
      await selectCab.waitForDisplayed({ timeout: 5000 });
      await selectCab.click();

      log.info("✅ 'Select Cabs' clicked successfully");

      await driver.pause(2000);

      // ----- CAB CARD SELECTION -----
      const firstCabCard1 = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard1.waitForExist({ timeout: 10000 });
      await firstCabCard1.click();
      log.info("🚗 First Cab Card CLICKED");

      await driver.pause(2000);

      const proceedButtonCabSelecting1 = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting1.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting1.click();
      log.info("✅ Proceed button clicked after cab selection");

      await driver.pause(2000);
      log.info("📝 Clicking on Outstation cab...");
      await driver.pause(9000);

      // ----- RETURN TO TRAVEL REQUESTS -----
      const travelRequestScreen = await driver.$(
        '//android.view.View[@content-desc="Travel Requests"]',
      );
      await travelRequestScreen.waitForExist({ timeout: 30000 });
      log.info("✅ TRAVEL REQUEST SCREEN LOADED");

      await driver.pause(45000);

      const firstCard = await driver.$(
        '(//android.view.View[contains(@content-desc, "IBS/")])[1]',
      );
      await firstCard.waitForExist({ timeout: 5000 });
      await firstCard.click();
      log.info("✅ CLICKED ON THE FIRST CARD IN MY REQUESTS TAB");

      const cabSelector = '//android.view.View[@content-desc="Select Cabs"]';
      const found = await this.scrollUntilVisible(cabSelector);
      if (!found) throw new Error("❌ 'Select Cabs' not found after scrolling");

      await driver.$(cabSelector).click();
      log.info("✅ CLICKED 'Select Cabs'");
      await driver.pause(2000);

      const firstCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard.waitForExist({ timeout: 5000 });
      await firstCabCard.click();
      log.info("✅ FIRST CAB CARD CLICKED");

      const proceedButtonCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting.click();
      log.info("✅ PROCEED BUTTON CLICKED AFTER SELECTING CAB");

      // ----- SUCCESS VALIDATION -----
      const successMessageSelector =
        '//android.view.View[@content-desc="Travel Requests"]';
      const isSuccessVisible = await driver
        .$(successMessageSelector)
        .waitForExist({
          timeout: 10000,
          timeoutMsg: "SCRIPT HAS NOT RUN SUCCESSFULLY ",
        });

      if (isSuccessVisible) {
        log.info("🎉 SCRIPT WAS SUCCESSFULLY EXECUTED");
      } else {
        throw new Error("❌ SCRIPT WAS NOT SUCCESSFULLY EXECUTED");
      }

      // ----- RETURN BACK BUTTON -----
      const backButtonRequestDetails = await driver.$(
        '//android.widget.Button[@content-desc="Back"]',
      );
      await backButtonRequestDetails.waitForExist({ timeout: 5000 });
      await backButtonRequestDetails.click();
      log.info("🔙 BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN");
    } catch (err) {
      log.error("🚨 FAILED TO EXECUTE ROUNDTRIP FLOW:", err);
      throw err;
    }
  }

  async scrollDownUntilVisible(selector: string, maxSwipes = 3) {
    const { width, height } = await this.driver.getWindowRect();

    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.9); // start very low
    const endY = Math.floor(height * 0.1); // swipe very high (long swipe)

    for (let i = 0; i < maxSwipes; i++) {
      log.info(`⬇️ Long scroll attempt ${i + 1}`);

      const element = await this.driver.$(selector);
      if (await element.isExisting()) {
        log.info("✅ Element found without further scrolling");
        return true;
      }

      await this.driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 1200, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);

      await this.driver.releaseActions();
      await this.driver.pause(2000);
    }

    return false;
  }

  private async selectPassPortExpiryDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    const passportExpiryDate = await driver.$(
      `//*[contains(@text,"Passport Expiry") or contains(@content-desc,"Passport Expiry")]`,
    );
    await passportExpiryDate.waitForExist({ timeout: 20000 });
    await passportExpiryDate.click();
    log.info("✅ Clicked Passport Expiry field");

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]//android.widget.Button[2]',
    );
    await nextMonthButton.waitForExist({ timeout: 5000 });
    await nextMonthButton.click();
    log.info(" Moved to next month");

    const randomDate = Math.floor(Math.random() * 28) + 1;
    log.info(`Trying to select date: ${randomDate}`);

    try {
      const dateElement = await driver.$(
        `//android.widget.Button[contains(@content-desc,"${randomDate}")]`,
      );
      await dateElement.waitForExist({ timeout: 10000 });
      await dateElement.click();
      log.info(` Selected date: ${randomDate}`);
    } catch (error) {
      log.error(` Error selecting date ${randomDate}:`, error);
    }

    await driver.pause(1500);
    return randomDate;
  }
}
