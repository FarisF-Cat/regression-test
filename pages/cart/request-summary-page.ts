import logger from '@wdio/logger'
const log = logger('RequestSummaryPage')

export class RequestSummaryPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async viewTravelRequestSummaryForFlight() {
    const driver = this.driver;
    await driver.pause(3000);
    log.info(
      "11111111111111111111111111111111111111111111111111111111111111111view travel request summary for flight function called",
   );
    const createTravelRequestScreen = await this.probeElement("~Create Travel Request", 10, 1000);
    if (!createTravelRequestScreen) throw new Error("❌ 'Create Travel Request' screen not found");
    log.info("create traveller screen");

    await driver.pause(2000);

    const createTravelRequestScreenProceedButton = await this.probeElement(
      '//android.widget.Button[]', 10, 1000
    );
    if (!createTravelRequestScreenProceedButton) throw new Error("❌ 'Proceed' button not found on Create Travel Request screen");
    log.debug("create traveller screen proceed button found");
    await createTravelRequestScreenProceedButton.click();
    log.info("create traveller screen proceed button clicked");

    const travellerDetailScreen = await this.probeElement("~Traveller Details", 10, 1000);
    if (!travellerDetailScreen) throw new Error("❌ 'Traveller Details' screen not found");
    log.info("entered into  traveller details screen");
    await driver.pause(3000);

    const addTravellerDetailScreenButton = await this.probeElement(
      '//android.widget.Button[@content-desc="Add Traveller Details"]', 10, 1000
    );
    if (!addTravellerDetailScreenButton) throw new Error("❌ 'Add Traveller Details' button not found");
    log.info("clicked on traveller details button");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    if (!additionalDetailsScreen) throw new Error("❌ Additional Details screen not found");
    log.info("went into   additional details screen");
    await driver.pause(2000);

    const purposeOfTravel = await driver.$(
      '//android.view.View[@content-desc="Purpose Of Travel "]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
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

        const options = await driver.$$("//android.widget.RadioButton");
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
    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',10,1000
    );
    if (!additionalDetailsScreenProceedButon) throw new Error("❌ 'Submit' button not found in Additional Details screen");
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();
    await driver.pause(3000);

    // Check for Go to Home (direct booking path)
    const goHomeBtns = await driver.$$('//android.widget.Button[@content-desc="Go to Home"]');
    if (goHomeBtns.length > 0) {
      log.debug("ℹ️ 'Go to Home' found — direct booking pat");
      await goHomeBtns[0].click();
      log.debug("🏠 Go to Home clicked — booking flow completed via direct pat");
      return;
    }

    log.info("🔍 no 'Go to Home' button. searching for 'complete booking' or 'quote received'..");

    const { width, height } = await driver.getWindowRect();
    const startX = width / 2;
    const startY = height * 0.85;
    const endY = height * 0.35;

    let found = false;

    for (let i = 0; i < 8; i++) {
      // Check for Quote Received — approval-queue terminal state (TRAVELLER role)
      const quoteReceivedEls = await driver.$$(
        '//*[contains(@content-desc,"Quote Received") or contains(@content-desc,"Pending")]',
      );
      if (quoteReceivedEls.length > 0) {
        log.info("✅ 'quote received' / 'pending' screen detected — traveller approval-queue flow complet");
        return;
      }

      const completeBookingBtns = await driver.$$(
        '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
      );
      if (completeBookingBtns.length > 0) {
        log.debug("✅ found 'complete booking' button");
        await completeBookingBtns[0].click();
        found = true;
        break;
      }

      log.info(`🟣 scroll attempt ${i + 1}..`);
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
        "❌ Neither 'Go to Home', 'Complete Booking', nor 'Quote Received' found after scrolling",
      );
    }

    log.info("📦 complete booking clicked");

    const popup = await driver.$(
      '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
    );
    
    if (!popup) throw new Error("❌ Booking confirmation popup did not appear");
    log.info("⚪ confirmation popup appeare");

    const confirmBtns = await driver.$$('//android.widget.Button[@content-desc="Yes"]');
    if (confirmBtns.length === 0) throw new Error("❌ 'Yes' button not found in confirmation popup");
    await confirmBtns[0].click();

    log.info("✅ booking confirmed successfully");
    await driver.pause(20000);

    const backButtonRequestDetails = await this.probeElement(
      '//android.widget.Button[@content-desc="Back"]', 15, 1000
    );
    if (!backButtonRequestDetails) throw new Error("❌ Back button not found after booking confirmation");
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
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
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

        const options = await driver.$$("//android.widget.RadioButton");
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
    log.info(
      "1111111111111111111111111111111111111111111111111submit button clicked",
   );
    // const completeBookingHotel = await driver.$(
    //   '//android.widget.Button[@content-desc="Complete Booking"]',
    // );
    // await completeBookingHotel.waitForExist({ timeout: 5000 });
    // await completeBookingHotel.click();
    // log.debug(
    //   " 222222222222222222222222222222222222back button clicked in request detail screen ",
    // );
    // await driver.pause(3000);

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

    log.info(
      "🔍 no 'Go to Home' button. searching for 'complete booking'...",
    );

    const { width, height } = await driver.getWindowRect();
    const startX = width / 2;
    const startY = height * 0.85;
    const endY = height * 0.35;

    let found = false;

    for (let i = 0; i < 6; i++) {
      const completeBookingBtns = await driver.$$(
        '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
      );

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
    cabType: "airport_transfer" | "local" | "outstation",
  ) {
    const driver = this.driver;

    await driver.pause(3000);
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 5000,
    });
    log.debug("create traveller screen proceed button found");
    await createTravelRequestScreenProceedButton.click();
    log.info("create traveller screen proceed button clicked");
    log.info("entered into  traveller details screen ");
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 6000 });
    log.info("clicked on traveller details button");
    await addTravellerDetailScreenButton.click();
    await driver.pause(3000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 2000 });
    log.info("went into   additional details screen ");
    await driver.pause(4000);
    log.info(
      "going to check purpose of travel field  ............................................................",
    );
    const purposeOfTravel = await driver.$(
      '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      await purposeOfTravel.waitForExist({ timeout: 5000 });
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
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

        const options = await driver.$$("//android.widget.RadioButton");
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("first purpose of travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("no purpose of travel options found in dropdown!");
        }
      }
    }

    // const purposeOfTravel = await driver.$(
    //   '//android.view.View[contains(@content-desc,"Purpose Of Travel")]',
    // );

    // await purposeOfTravel.waitForDisplayed({ timeout: 5000 });

    // const fieldValue = await purposeOfTravel.getAttribute("content-desc");

    // if (fieldValue.includes("Purpose Of Travel")) {
    //   await driver.execute("mobile: clickgesture", {
    //     elementId: purposeOfTravel.elementId,
    //   });

    //   await driver.pause(1000);

    //   const options = await driver.$$("//android.widget.RadioButton");

    //   if ((await options.length) > 0) {
    //     await options[0].click();
    //     log.info("first purpose of travel option selected");
    //   } else {
    //     log.warn("no purpose of travel options found");
    //   }
    // }
    // const purposeOfTravel = await driver.$(
    //   '//android.view.View[contains(@content-desc, "Purpose Of Travel")]',
    // );

    // const label = "Purpose Of Travel";
    // let fieldValue = "";
    // try {
    //   await purposeOfTravel.waitForExist({ timeout: 5000 });
    //   fieldValue = await purposeOfTravel.getAttribute("content-desc");
    // } catch (e) {
    //   log.warn("purpose of travel field not found, skipping...");
    // }

    // if (
    //   !fieldValue ||
    //   fieldValue.trim() === label ||
    //   fieldValue.trim() === label + ":" ||
    //   fieldValue.trim() === label + " "
    // ) {
    //   if (
    //     (await purposeOfTravel.isDisplayed()) &&
    //     (await purposeOfTravel.isEnabled())
    //   ) {
    //     await purposeOfTravel.click();
    //     await driver.pause(1000);

    //     const options = await driver.$$("//android.widget.RadioButton");
    //     if ((await options.length) > 0) {
    //       await options[0].click();
    //       log.info("first purpose of travel option selected");
    //       await driver.pause(1000);
    //     } else {
    //       log.warn("no purpose of travel options found in dropdown!");
    //     }
    //   }
    // }
    await driver.pause(2000);
    log.info(
      "going to click submit button in additional details screen  ............................................................",
    );
    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();
    await driver.pause(2500);
    log.info("submit button clicked");
    await driver.pause(2000);
    const goHomeBtn = await driver.$(
      '//android.widget.Button[@content-desc="Go to Home"]',
    );

    if (await goHomeBtn.isExisting()) {
      log.info("ℹ️ delay screen detected — Go to Home is visible");

      await goHomeBtn.waitForDisplayed({ timeout: 5000 });
      await goHomeBtn.click();

      log.info("🏠 Go to Home clicked — ending cab booking flow");
      throw new Error("booking redirected to home screen – stopping cab flow");
    }
    let selectCab;

    if (cabType === "airport_transfer") {
      log.info("✈️ airport transfer → scrolling to find select cabs");

      const { width: width1, height: height1 } = await driver.getWindowRect();
      const startX1 = width1 / 2;
      const startY1 = height1 * 0.85;
      const endY1 = height1 * 0.35;

      let found = false;

      for (let i = 0; i < 6; i++) {
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

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
          "❌ neither 'Go to Home' nor 'complete booking' button found",
        );
      }

      log.info("📦 complete booking clicked");

      const popup = await driver.$(
        '//android.view.View[@content-desc="your flight is ready to be booked. do you want to continue?"]',
      );

      await popup.waitForExist({ timeout: 10000 });
      log.info("⚪ confirmation popup appeared");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();

      log.info("✅ booking confirmed successfully");
      await driver.pause(20000);

      const { width, height } = await driver.getWindowRect();
      const startX = width / 2;
      const startY = height * 0.85;
      const endY = height * 0.35;

      for (let i = 0; i < 5; i++) {
        const selectCabBtns = await driver.$$(
          '//android.view.View[@content-desc="select cabs"]',
        );

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
      ///COMMNETED BECUASE THE SELECT CABS BUTTON IS NOT APPEARING IN THE SCREEN
      //   throw new Error("select cabs not found after scrolling");
      // }
      await selectCab.waitForDisplayed({ timeout: 8000 });
      await selectCab.click();
      log.info("select cabs button clicked (airport transfer)");
    } else {
      selectCab = await driver.$(
        '//android.view.View[@content-desc="Select Cabs"]',
      );
      await selectCab.waitForExist({ timeout: 8000 });
      await selectCab.waitForDisplayed({ timeout: 8000 });
      await selectCab.click();
    }

    const firstCabCard = await driver.$(
      '//android.view.View[contains(@content-desc, "pickup") and contains(@content-desc, "estimated price")][1]',
    );
    await firstCabCard.waitForExist({ timeout: 5000 });
    await firstCabCard.click();
    log.info("first cab card clicked");
    const proceedButtonCabSelecting = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await proceedButtonCabSelecting.waitForExist({ timeout: 5000 });
    await proceedButtonCabSelecting.click();
    log.info("proceed button clicked after selecting cab");

    await driver.pause(2000);

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen.waitForExist({ timeout: 30000 });
    log.info("travel request screen loaded");
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
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
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

        const options = await driver.$$("//android.widget.RadioButton");
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
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
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

        const options = await driver.$$("//android.widget.RadioButton");
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

    log.info(
      "scrolled to bottom of the page  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    // Locate the Passport field

    // const passportNumber = await driver.$('//android.widget.edittext[@content-desc="passport no"]');
    const passportNumber = await driver.$(
      '//android.widget.edittext[@hint="passport no"]',
    );

    log.info(
      "checking for passport field presence  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      log.debug("passport field found ✅");
      await passportNumber.click();
      await passportNumber.setValue("c748tj1k2");
      log.info(
        "passport number entered  //////////////////////////////////////////////////////////////////////////",
      );
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
      '//android.view.View[contains(@content-desc,"passport expiry")]',
    );

    if (await passportExpiryField.isExisting()) {
      log.debug("passport expiry field found ✅");

      // Scroll down a bit more before interacting (if needed)

      // Now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info(
        "clicked on passport expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

      // Here you can call your date picker function
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
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
    } catch (e) {
      log.warn("purpose of travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      // Field is empty or just the label, so select from dropdown
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver.$$("//android.widget.RadioButton");
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

    const { width: winWidth, height: winHeight } = await driver.getWindowRect();
    const startX = winWidth / 2;
    const startY = winHeight * 0.85;
    const endY = winHeight * 0.35;

    let found = false;

    for (let i = 0; i < 6; i++) {
      // try to find the button in the current view
      log.info("searching for complete booking button...");
      const completeBookingBtns = await driver.$$(
        '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
      );

      // if ((await completeBookingBtns.length) > 0) {
      //   log.debug("✅ found 'complete booking' button!");
      //   await completeBookingBtns[0].click();

      //   found = true;
      //   break;
      // }
      if ((await completeBookingBtns.length) > 0) {
        log.debug(
          "✅ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1complete booking button found !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111!",
        );
        const button = completeBookingBtns[0];

        await button.waitForDisplayed({ timeout: 6000 });
        await button.waitForEnabled({ timeout: 6000 });

        // Use WebdriverIO's touch action instead of getrect
        try {
          // preferred: normal click
          await (button as unknown as WebdriverIO.Element).click();
          log.info("🟢 'complete booking' clicked with element.click()");
        } catch (clickErr) {
          log.warn(
            "element.click() failed, falling back to coordinate tap:",
            clickErr,
          );

          // fallback: use mobile: clickgesture with element rect (cast to any to satisfy ts)
          const rect = await (button as any).getRect();
          const centerX = Math.floor(rect.x + rect.width / 2);
          const centerY = Math.floor(rect.y + rect.height / 2);

          await driver.execute("mobile: clickgesture", {
            x: centerX,
            y: centerY,
            // optional: adjust duration if needed
            // duration: 50
          });
          log.info(
            "🟢 'complete booking' clicked with mobile: clickgesture",
          );
        }
        log.info(
          "🟢 '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!complete booking tapped successfully  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111!",
        );
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
      await driver.pause(2000);
    }

    if (!found) {
      throw new Error(
        "❌ FAILED TO FIND 'complete booking' button even after scrolling.",
      );
    }

    log.info(" complete booking button clicked ");
    await driver.pause(5000);
    const popup = await driver.$(
      '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
    );

    await popup.waitForExist({ timeout: 8000 });
    log.info("⚪ popup appeared — confirming booking  flighthotel...");
    await driver.pause(2000);
    const confirmBtn = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );
    await confirmBtn.waitForDisplayed({ timeout: 8000 });
    await confirmBtn.click();
    log.info("✅ booking confirmed.");
    await driver.pause(8000);

    // const backbuttonrequestdetails = await driver.$(
    //   '//android.widget.Button[@content-desc="Back"]',
    // );
    // await backbuttonrequestdetails.waitfordisplayed({ timeout: 5000 });

    // // await backbuttonrequestdetails.waitforexist({ timeout: 5000 });
    // await backbuttonrequestdetails.click();
    // log.info(" back button clicked in request detail screen ");
  }

  async viewTravelRequestSummaryForFlightHotelCab() {
    const driver = this.driver;
    await driver.pause(2000);
    let travellerdetailsfound = false;
    for (let i = 0; i < 20; i++) {
        await driver.pause(500);
        const els = await driver.$$("~Traveller Details");
        if (els.length > 0) {
            travellerdetailsfound = true;
            break;
        }
    }
    if (!travellerdetailsfound) throw new Error("Traveller Details screen not found after 10s");
    log.info("entered into  traveller details screen ");

    await driver.pause(3000);

    log.info(
      "scrolled to bottom of the page  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );
    // const passportnumber = await driver.$('//android.widget.edittext[@content-desc="Passport No"]');
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

    log.info(
      "scrolled to bottom of the page  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    // locate the passport field

    // const passportnumber = await driver.$('//android.widget.edittext[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.edittext[@hint="Passport No"]',
    );

    log.info(
      "checking for passport field presence  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      log.debug("passport field found ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      log.info(
        "passport number entered  //////////////////////////////////////////////////////////////////////////",
      );
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

      // scroll down a bit more before interacting (if needed)

      // now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info(
        "clicked on passport expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

      // here you can call your date picker function
      log.info("going to call the passport expiry function  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      log.debug("passport expiry feild not found  ❌ — skipping");
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

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
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
    } catch (e) {
      log.warn("purpose of travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      // field is empty or just the label, so select from dropdown
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver.$$("//android.widget.RadioButton");
        if ((await options.length) > 0) {
          await options[0].click();
          log.info("first purpose of travel option selected");
          await driver.pause(1000);
        } else {
          log.warn("no purpose of travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenSubmitButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenSubmitButon.waitForExist({
      timeout: 5500,
    });
    log.info("submit button clicked  in additional details screen");
    await driver.pause(2000);
    await additionalDetailsScreenSubmitButon.click();

    log.info("waiting for all loading screens to clear...");
    let cleancount = 0;
    for (let i = 0; i < 60; i++) {
        await driver.pause(1000);
        const loading1 = await driver.$$('//android.view.View[@content-desc="Please wait until your request is processed."]');
        const loading2 = await driver.$$('//android.view.View[contains(@content-desc,"Loading travel request")]');
        if (loading1.length === 0 && loading2.length === 0) {
            cleancount++;
            log.info(`clean check ${cleancount}/2 at ${i + 1}s`);
            if (cleancount >= 2) {
                log.info("loading fully cleared.");
                break;
            }
        } else {
            cleancount = 0; // reset if loading reappears
            log.info(`still loading... (${i + 1}s)`);
        }
    }

    await driver.pause(1000);
    log.info("checking for 'Go to Home' button...");

    // first check for "Go to Home" button
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

      // click Go to Home
      await goToHomeButton.click();
      log.info("clicked Go to Home button");

      // wait for and click on travel requests

      return; // end the flow here
    } else {
      log.debug(
        "'Go to Home' button not found - proceeding to check for complete booking",
      );

      // continue with complete booking flow
      const { width: screenWidth, height: screenHeight } =
        await driver.getWindowRect();
      const startX = screenWidth / 2;
      const startY = screenHeight * 0.95;
      const endY = screenHeight * 0.2;

      let bookingFound = false;

      for (let i = 0; i < 9; i++) {
        log.info(
          ".........................................................................searching for complete booking button....",
        );
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

        if ((await completeBookingBtns.length) > 0) {
          log.debug("✅ found 'complete booking' button!");
          try {
            await completeBookingBtns[0].click();
            bookingFound = true;
            break;
          } catch (err) {
            log.info(
              "1111111111111111111111111111111111111111111111111111111111111111failed to click complete booking, will retry after scroll",
            );
          }
        }

        // check again for Go to Home in case it appears during scrolling
        const isGoToHomeNowVisible = await goToHomeButton
          .isExisting()
          .catch(() => false);
        if (isGoToHomeNowVisible) {
          log.info(
            "✅ ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅gGo to Home button appear after scrolling - navigating back to travel requests✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅",
          );
          await goToHomeButton.click();

          // const travelrequestsbutton = await driver.$('//android.view.View[@content-desc="Travel Requests"]');
          // await travelrequestsbutton.waitforexist({ timeout: 5000 });
          // await travelrequestsbutton.click();
          log.info("clicked on  Go to Home button  ");

          return;
          // end the flow
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
          "❌///////////////////////////////////////// COULD NOT FIND WHAT ARE YOU DOING 'complete booking' BUTTON EVEN AFTER SCROLLING.//////////////////////////////////////",
        );
      }
      log.info(" complete booking button clicked ");
      await driver.pause(5000);
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
      await driver.pause(5000);

      log.info("✅ complete booking button clicked");
      await driver.pause(5000);
      log.info("🚕 starting cab selections...");

      log.info("🚕 starting deep scroll to locate 'select cabs'...");

      const { width: screenWidthLocalCab, height: screenHeightLocalCab } =
        await driver.getWindowRect();
      const startXLocalCab = screenWidthLocalCab / 2;
      const startYLocalCab = screenHeightLocalCab * 0.95; // start even lower
      const endYLocalCab = screenHeightLocalCab * 0.05; // end even higher

      let selectCabFound = false;

      for (let i = 0; i < 2; i++) {
        // up to 25 full swipes
        log.info(`🔄 scroll attempt ${i + 1} to find 'select cabs'...`);
        log.info(
          "🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄",
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
                x: startXLocalCab,
                y: startYLocalCab,
              },
              { type: "pointerDown", button: 0 },
              {
                type: "pointerMove",
                duration: 1500,
                x: startXLocalCab,
                y: endYLocalCab,
              }, // slower, deeper swipe
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);

        await driver.releaseActions();
        await driver.pause(2500); // allow content to load after scroll

        const selectCab = await driver.$(
          '//android.view.View[@content-desc="Select Cabs"]',
        );
        if (await selectCab.isExisting()) {
          log.debug(
            "✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ 'select cabs' button found!",
          );
          await selectCab.waitForDisplayed({ timeout: 5000 });
          await driver.pause(1000);
          await selectCab.click();
          log.info(
            "🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖 'select cabs' button clicked!🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖",
          );
          selectCabFound = true;
          break;
        }
      }

      // stop if not found
      if (!selectCabFound) {
        throw new Error(
          "❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌ Could not locate 'select cabs' even after multiple scrolls!",
        );
      }

      await driver.pause(2000);

      // --- cab card selection ---
      const firstCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard.waitForExist({ timeout: 10000 });
      await firstCabCard.click();
      log.info(
        "🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗s first cab card clicked",
      );

      await driver.pause(2000);

      // --- proceed button ---
      const proceedButtonCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting.click();
      log.info(
        "✅🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕 proceed button clicked after cab selection 🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕✅",
      );

      await driver.pause(2000);

      log.info(
        "📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝clicking on the outstation cab ",
      );

      const travellerCard = await driver.$(
        `//android.view.View[contains(@content-desc, "IBS/")]`,
      );

      await travellerCard.waitForExist({ timeout: 10000 });
      await travellerCard.click();
      log.info(
        "✅📝📝 traveller request card clicked, navigating to request detail screen",
      );
      await driver.pause(2000); // wait for screen transition

      log.info(
        "🚖 scrolling to find 'select cabs' for outstation cab in request detail...",
      );

      const { width: screenWidthReq, height: screenHeightReq } =
        await driver.getWindowRect();
      const startXReq = screenWidthReq / 2;
      const startYReq = screenHeightReq * 0.95;
      const endYReq = screenHeightReq * 0.05;

      let selectOutstationFound = false;

      for (let i = 0; i < 30; i++) {
        // more scrolls for deep screen
        log.info(
          `🔄 scroll attempt ${i + 1} to find 'select cabs' for outstation cab`,
        );

        await driver.performActions([
          {
            type: "pointer",
            id: "fingerReqDetail",
            parameters: { pointerType: "touch" },
            actions: [
              { type: "pointerMove", duration: 0, x: startXReq, y: startYReq },
              { type: "pointerDown", button: 0 },
              { type: "pointerMove", duration: 1500, x: startXReq, y: endYReq },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);

        await driver.releaseActions();
        await driver.pause(2000); // allow ui to settle

        const selectOutstationCab = await driver.$(
          '//android.view.View[@content-desc="Select Cabs"]',
        );

        if (await selectOutstationCab.isExisting()) {
          log.debug(
            "✅ 'select cabs' for outstation cab found on request detail screen",
          );
          await selectOutstationCab.waitForDisplayed({ timeout: 5000 });
          await selectOutstationCab.click();
          selectOutstationFound = true;
          break;
        }
      }

      if (!selectOutstationFound) {
        throw new Error(
          "❌ Could not locate 'select cabs' for Outstation Cab in Request Detail screen!",
        );
      }

      await driver.pause(2000);

      // --- cab card selection ---
      const firstOutstationCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstOutstationCabCard.waitForExist({ timeout: 10000 });
      await firstOutstationCabCard.click();
      log.info(
        "🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗s first cab card clicked",
      );

      await driver.pause(2000);

      // --- proceed button ---
      const proceedButtonOutstationCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonOutstationCabSelecting.waitForExist({
        timeout: 10000,
      });
      await proceedButtonOutstationCabSelecting.click();

      log.info("✅ all cab options selected successfully!");
    }
  }
  async viewTravelRequestSummaryForFlightHotelCabBus() {
    const driver = this.driver;
    await this.driver.pause(8000);
    log.info(
      "=============================== starting flight + hotel + cab + bus flow test ===============================",
    );
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForDisplayed({ timeout: 8000 });
    log.info("entered into  traveller details screen ");
    await driver.pause(8000);
    log.info(
      "=============================== started scrolling to passport field  ===============================",
    );
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

    log.info(
      "scrolled to bottom of the page  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    await driver.pause(4000);
    // locate the passport field

    // const passportnumber = await driver.$('//android.widget.edittext[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.edittext[@hint="Passport No"]',
    );

    log.info(
      "checking for passport field presence  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      log.debug("passport field found ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      log.info(
        "passport number entered  //////////////////////////////////////////////////////////////////////////",
      );
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

      // scroll down a bit more before interacting (if needed)

      // now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info(
        "clicked on passport expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

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
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
    } catch (e) {
      log.warn("purpose of travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      // field is empty or just the label, so select from dropdown
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver.$$("//android.widget.RadioButton");
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
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

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
      await driver.pause(5000);

      // ----- select cabs section -----
      log.info("🚕 starting cab selections...");
      log.info("🚕 deep scrolling to locate 'select cabs'...");

      const { width: screenWidthLocalCab, height: screenHeightLocalCab } =
        await driver.getWindowRect();
      const startXLocalCab = screenWidthLocalCab / 2;
      const startYLocalCab = screenHeightLocalCab * 0.95;
      const endYLocalCab = screenHeightLocalCab * 0.05;

      let selectCabFound = false;

      for (let i = 0; i < 25; i++) {
        log.info(`🔄 scroll attempt ${i + 1} to find 'select cabs'...`);
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
          log.debug("✅ 'select cabs' button found!");
          await selectCab.waitForDisplayed({ timeout: 5000 });
          await driver.pause(1000);
          await selectCab.click();
          log.info("🚖 'select cabs' button clicked!");
          selectCabFound = true;
          break;
        }
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

    log.info(
      "scrolled to bottom of the page  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    // locate the passport field

    // const passportnumber = await driver.$('//android.widget.edittext[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.edittext[@hint="Passport No"]',
    );

    log.info(
      "checking for passport field presence  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      log.debug("passport field found ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      log.info(
        "passport number entered  //////////////////////////////////////////////////////////////////////////",
      );
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

      // scroll down a bit more before interacting (if needed)

      // now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info(
        "clicked on passport expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

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
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
    } catch (e) {
      log.warn("purpose of travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      // field is empty or just the label, so select from dropdown
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver.$$("//android.widget.RadioButton");
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
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

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
      await driver.pause(5000);

      // ----- select cabs section -----
      log.info("🚕 starting cab selections...");
      log.info("🚕 deep scrolling to locate 'select cabs'...");

      const { width: screenWidthLocalCab, height: screenHeightLocalCab } =
        await driver.getWindowRect();
      const startXLocalCab = screenWidthLocalCab / 2;
      const startYLocalCab = screenHeightLocalCab * 0.95;
      const endYLocalCab = screenHeightLocalCab * 0.05;

      let selectCabFound = false;

      for (let i = 0; i < 25; i++) {
        log.info(`🔄 scroll attempt ${i + 1} to find 'select cabs'...`);
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
          log.debug("✅ 'select cabs' button found!");
          await selectCab.waitForDisplayed({ timeout: 5000 });
          await driver.pause(1000);
          await selectCab.click();
          log.info("🚖 'select cabs' button clicked!");
          selectCabFound = true;
          break;
        }
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

    log.info(
      "scrolled to bottom of the page  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    // locate the passport field

    // const passportnumber = await driver.$('//android.widget.edittext[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.edittext[@hint="Passport No"]',
    );

    log.info(
      "checking for passport field presence  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      log.debug("passport field found ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      log.info(
        "passport number entered  //////////////////////////////////////////////////////////////////////////",
      );
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

      // scroll down a bit more before interacting (if needed)

      // now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      log.info(
        "clicked on passport expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

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
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
    } catch (e) {
      log.warn("purpose of travel field not found, skipping...");
    }

    if (
      !fieldValue ||
      fieldValue.trim() === label ||
      fieldValue.trim() === label + ":" ||
      fieldValue.trim() === label + " "
    ) {
      // field is empty or just the label, so select from dropdown
      if (
        (await purposeOfTravel.isDisplayed()) &&
        (await purposeOfTravel.isEnabled())
      ) {
        await purposeOfTravel.click();
        await driver.pause(1000);

        const options = await driver.$$("//android.widget.RadioButton");
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
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

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
      await driver.pause(5000);

      // ----- select cabs section -----
      log.info("🚕 starting cab selections...");
      log.info("🚕 deep scrolling to locate 'select cabs'...");

      // const { width: screenwidthlocalcab, height: screenheightlocalcab } = await driver.getwindowrect();
      // const startxlocalcab = screenwidthlocalcab / 2;
      // const startylocalcab = screenheightlocalcab * 0.95;
      // const endylocalcab = screenheightlocalcab * 0.05;

      // let selectcabfound = false;

      // for (let i = 0; i < 2; i++) {
      //   log.info(`🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄 scroll attempt ${i + 1} to find 'select cabs'...🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄`);
      //   await driver.performactions([
      //     {
      //       type: "pointer",
      //       id: "finger1",
      //       parameters: { pointertype: "touch" },
      //       actions: [
      //         { type: "pointerMove", duration: 0, x: startxlocalcab, y: startylocalcab },
      //         { type: "pointerDown", button: 0 },
      //         { type: "pointerMove", duration: 1500, x: startxlocalcab, y: endylocalcab },
      //         { type: "pointerUp", button: 0 },
      //       ],
      //     },
      //   ]);
      //   await driver.releaseactions();
      //   await driver.pause(2500);

      //   const selectcab = await driver.$('//android.view.View[@content-desc="Select Cabs"]');
      //   if (await selectcab.isexisting()) {
      //     log.debug("✅ 'select cabs' button found!");
      //     await selectcab.waitfordisplayed({ timeout: 5000 });
      //     await driver.pause(1000);
      //     await selectcab.click();
      //     log.info("🚖 'select cabs' button clicked!");
      //     selectcabfound = true;
      //     break;
      //   }
      // }
      log.info("🚕 looking for 'select cabs' with controlled long swipe...");

      const selectCabSelector =
        '//android.view.View[@content-desc="Select Cabs"]';
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      const foundSelectCab = await this.scrollDownUntilVisible(
        selectCabSelector,
        2, // only 2 long swipes
      );

      if (!foundSelectCab) {
        throw new Error("❌ 'select cabs' not found after long scrolls");
      }
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");
      log.info("🚕 starting long scrolls to find 'select cabs'...");

      const selectCab = await driver.$(selectCabSelector);
      await selectCab.waitForDisplayed({ timeout: 5000 });
      await selectCab.click();

      log.info("✅ 'select cabs' clicked successfully");

      // if (!selectcabfound) {
      //   throw new error("❌ Could not locate 'select cabs' even after multiple scrolls!");
      // }

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

  async scrollDownUntilVisible(selector, maxSwipes = 3) {
    const { width, height } = await this.driver.getWindowRect();

    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.9); // start very low
    const endY = Math.floor(height * 0.1); // swipe very high (long swipe)

    for (let i = 0; i < maxSwipes; i++) {
      log.info(`⬇️ long scroll attempt ${i + 1}`);

      const element = await this.driver.$(selector);
      if (await element.isExisting()) {
        log.debug("✅ element found without further scrolling");
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

  async scrollUntilVisible(selector: string, maxSwipes = 8) {
    const driver = this.driver;
    const { height, width } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.9);
    const endY = Math.floor(height * 0.05);

    for (let swipe = 1; swipe <= maxSwipes; swipe++) {
      if (await driver.$(selector).isDisplayed()) {
        log.debug(`✅ found element after ${swipe - 1} swipe(s)`);
        return true;
      }

      log.info(`🔄 swipe #${swipe}`);
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

    log.warn(`⚠️ element not found after ${maxSwipes} swipes`);
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
    log.info("✅ clicked passport expiry field");

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]//android.widget.Button[2]',
    );
    await nextMonthButton.waitForExist({ timeout: 5000 });
    await nextMonthButton.click();
    log.info(" moved to next month");

    const randomDate = Math.floor(Math.random() * 28) + 1;
    log.info(`trying to select date: ${randomDate}`);

    try {
      const dateElement = await driver.$(
        `//android.widget.Button[contains(@content-desc,"${randomDate}")]`,
      );
      await dateElement.waitForExist({ timeout: 10000 });
      await dateElement.click();
      log.info(` selected date: ${randomDate}`);
    } catch (error) {
      log.error(` error selecting date ${randomDate}:`, error);
    }

    await driver.pause(1500);
    return randomDate;
  }

  private async probeElement(
    selector: string,
    attempts = 10,
    intervalms = 1000,
  ): Promise<WebdriverIO.Element | null> {
    for (let i = 0; i < attempts; i++) {
      const els = await this.driver.$$(selector);
      if (els.length > 0) return els[0];
      log.info(`⏳ [probe] attempt ${i + 1}/${attempts}: ${selector}`);
      await this.driver.pause(intervalms);
    }
    return null;
  }
}
