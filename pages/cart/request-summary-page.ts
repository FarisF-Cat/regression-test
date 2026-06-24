export class RequestSummaryPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async viewTravelRequestSummaryForFlight() {
    const driver = this.driver;
    await driver.pause(3000);
    console.log(
      "11111111111111111111111111111111111111111111111111111111111111111VIEW TRAVEL REQUEST SUMMARY FOR FLIGHT FUNCTION CALLED",
    );
    const createTravelRequestScreen = await this.probeElement("~Create Travel Request", 10, 1000);
    if (!createTravelRequestScreen) throw new Error("❌ 'Create Travel Request' screen not found");
    console.log("CREATE TRAVELLER SCREEN ");

    await driver.pause(2000);

    const createTravelRequestScreenProceedButton = await this.probeElement(
      '//android.widget.Button[@content-desc="Proceed"]', 10, 1000
    );
    if (!createTravelRequestScreenProceedButton) throw new Error("❌ 'Proceed' button not found on Create Travel Request screen");
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    await createTravelRequestScreenProceedButton.click();
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");

    const travellerDetailScreen = await this.probeElement("~Traveller Details", 10, 1000);
    if (!travellerDetailScreen) throw new Error("❌ 'Traveller Details' screen not found");
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    await driver.pause(3000);

    const addTravellerDetailScreenButton = await this.probeElement(
      '//android.widget.Button[@content-desc="Add Traveller Details"]', 10, 1000
    );
    if (!addTravellerDetailScreenButton) throw new Error("❌ 'Add Traveller Details' button not found");
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await this.probeElement(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
      8, 1000
    );
    if (!additionalDetailsScreen) throw new Error("❌ Additional Details screen not found");
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
    await driver.pause(2000);

    const purposeOfTravel = await driver.$(
      '//android.view.View[@content-desc="Purpose Of Travel "]',
    );

    const label = "Purpose Of Travel";
    let fieldValue = "";
    try {
      fieldValue = await purposeOfTravel.getAttribute("content-desc");
    } catch (e) {
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    } else {
      console.log("Purpose Of Travel already filled:", fieldValue);
    }
    const additionalDetailsScreenProceedButon = await this.probeElement(
      '//android.widget.Button[@content-desc="Submit "]', 10, 1000
    );
    if (!additionalDetailsScreenProceedButon) throw new Error("❌ 'Submit' button not found in Additional Details screen");
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();
    await driver.pause(3000);

    // Check for Go to Home (direct booking path)
    const goHomeBtns = await driver.$$('//android.widget.Button[@content-desc="Go to Home"]');
    if (goHomeBtns.length > 0) {
      console.log("ℹ️ 'Go to Home' found — direct booking path");
      await goHomeBtns[0].click();
      console.log("🏠 Go to Home clicked — booking flow completed via direct path");
      return;
    }

    console.log("🔍 No 'Go to Home' button. Searching for 'Complete Booking' or 'Quote Received'...");

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
        console.log("✅ 'Quote Received' / 'Pending' screen detected — TRAVELLER approval-queue flow complete");
        return;
      }

      const completeBookingBtns = await driver.$$(
        '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
      );
      if (completeBookingBtns.length > 0) {
        console.log("✅ Found 'Complete Booking' button");
        await completeBookingBtns[0].click();
        found = true;
        break;
      }

      console.log(`🟣 Scroll attempt ${i + 1}...`);
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

    console.log("📦 Complete Booking clicked");

    const popup = await this.probeElement(
      '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      10, 1000
    );
    if (!popup) throw new Error("❌ Booking confirmation popup did not appear");
    console.log("⚪ Confirmation popup appeared");

    const confirmBtns = await driver.$$('//android.widget.Button[@content-desc="Yes"]');
    if (confirmBtns.length === 0) throw new Error("❌ 'Yes' button not found in confirmation popup");
    await confirmBtns[0].click();

    console.log("✅ Booking confirmed successfully");
    await driver.pause(20000);

    const backButtonRequestDetails = await this.probeElement(
      '//android.widget.Button[@content-desc="Back"]', 15, 1000
    );
    if (!backButtonRequestDetails) throw new Error("❌ Back button not found after booking confirmation");
    await backButtonRequestDetails.click();
    console.log(" BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN ");
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
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    await createTravelRequestScreenProceedButton.click();
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");
    await driver.pause(2000);
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
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

    console.log("SCROLLED TO BOTTOM OF THE PAGE  passport feild ");
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    console.log("CHECKING FOR PASSPORT FIELD PRESENCE  ");
    if (await passportNumber.isExisting()) {
      console.log("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
    } else {
      console.log("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
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
      console.log("Passport Expiry field found ✅");

      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      console.log("Clicked on Passport Expiry field ");

      console.log("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      console.log("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }
    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();
    await driver.pause(6500);
    console.log(
      "1111111111111111111111111111111111111111111111111SUBMIT BUTTON CLICKED",
    );
    // const completeBookingHotel = await driver.$(
    //   '//android.widget.Button[@content-desc="Complete Booking"]',
    // );
    // await completeBookingHotel.waitForExist({ timeout: 5000 });
    // await completeBookingHotel.click();
    // console.log(
    //   " 222222222222222222222222222222222222BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN ",
    // );
    // await driver.pause(3000);

    try {
      await driver.hideKeyboard();
    } catch {}
    const goHomeBtn = await driver.$(
      '//android.widget.Button[@content-desc="Go to Home"]',
    );

    if (await goHomeBtn.isExisting()) {
      console.log("ℹDelay screen detected — 'Go to Home' is visible");

      await goHomeBtn.waitForDisplayed({ timeout: 5000 });
      await goHomeBtn.click();

      console.log(
        "🏠 Go to Home clicked — booking flow completed via delay path",
      );
      return;
    }

    console.log(
      "🔍 No 'Go to Home' button. Searching for 'Complete Booking'...",
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
        console.log("✅ Found 'Complete Booking' button");
        await completeBookingBtns[0].click();
        found = true;
        break;
      }

      console.log(`🟣 Scroll attempt ${i + 1}...`);
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

    console.log("📦 Complete Booking clicked");

    const popupHotel = await driver.$(
      '//android.view.View[@content-desc="Your hotel is ready to be booked. Do you want to continue?"]',
    );

    await popupHotel.waitForExist({ timeout: 10000 });
    console.log("⚪ Confirmation popup appeared");

    const confirmBtnHotel = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );
    await confirmBtnHotel.waitForExist({ timeout: 5000 });
    await confirmBtnHotel.click();

    console.log("✅ Booking confirmed hotel successfully");
    await driver.pause(2000);

    const backButtonRequestDetails = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    await backButtonRequestDetails.waitForExist({ timeout: 5000 });
    await backButtonRequestDetails.click();
    console.log(" BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN ");
    await driver.pause(2000);
    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen.waitForExist({ timeout: 30000 });
    console.log("TRAVEL REQUEST SCREEN LOADED");
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
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    await createTravelRequestScreenProceedButton.click();
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 6000 });
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(3000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 2000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
    await driver.pause(4000);
    console.log(
      "GOING TO CHECK PURPOSE OF TRAVEL FIELD  ............................................................",
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    // const purposeOfTravel = await driver.$(
    //   '//android.view.View[contains(@content-desc,"Purpose Of Travel")]',
    // );

    // await purposeOfTravel.waitForDisplayed({ timeout: 5000 });

    // const fieldValue = await purposeOfTravel.getAttribute("content-desc");

    // if (fieldValue.includes("Purpose Of Travel")) {
    //   await driver.execute("mobile: clickGesture", {
    //     elementId: purposeOfTravel.elementId,
    //   });

    //   await driver.pause(1000);

    //   const options = await driver.$$("//android.widget.RadioButton");

    //   if ((await options.length) > 0) {
    //     await options[0].click();
    //     console.log("First Purpose Of Travel option selected");
    //   } else {
    //     console.warn("No Purpose Of Travel options found");
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
    //   console.warn("Purpose Of Travel field not found, skipping...");
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
    //       console.log("First Purpose Of Travel option selected");
    //       await driver.pause(1000);
    //     } else {
    //       console.warn("No Purpose Of Travel options found in dropdown!");
    //     }
    //   }
    // }
    await driver.pause(2000);
    console.log(
      "GOING TO CLICK SUBMIT BUTTON IN ADDITIONAL DETAILS SCREEN  ............................................................",
    );
    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();
    await driver.pause(2500);
    console.log("SUBMIT BUTTON CLICKED");
    await driver.pause(2000);
    const goHomeBtn = await driver.$(
      '//android.widget.Button[@content-desc="Go to Home"]',
    );

    if (await goHomeBtn.isExisting()) {
      console.log("ℹ️ Delay screen detected — Go to Home is visible");

      await goHomeBtn.waitForDisplayed({ timeout: 5000 });
      await goHomeBtn.click();

      console.log("🏠 Go to Home clicked — ending cab booking flow");
      throw new Error("Booking redirected to Home screen – stopping cab flow");
    }
    let selectCab;

    if (cabType === "AIRPORT_TRANSFER") {
      console.log("✈️ Airport Transfer → scrolling to find Select Cabs");

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
          console.log("✅ Found 'Complete Booking' button");
          await completeBookingBtns[0].click();
          found = true;
          break;
        }

        console.log(`🟣 Scroll attempt ${i + 1}...`);
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

      console.log("📦 Complete Booking clicked");

      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );

      await popup.waitForExist({ timeout: 10000 });
      console.log("⚪ Confirmation popup appeared");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();

      console.log("✅ Booking confirmed successfully");
      await driver.pause(20000);

      const { width, height } = await driver.getWindowRect();
      const startX = width / 2;
      const startY = height * 0.85;
      const endY = height * 0.35;

      for (let i = 0; i < 5; i++) {
        const selectCabBtns = await driver.$$(
          '//android.view.View[@content-desc="Select Cabs"]',
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
      //   throw new Error("Select Cabs not found after scrolling");
      // }
      await selectCab.waitForDisplayed({ timeout: 8000 });
      await selectCab.click();
      console.log("Select Cabs button clicked (Airport Transfer)");
    } else {
      // selectCab = await driver.$(
      //   '//android.view.View[@content-desc="Select Cabs"]',
      // );
      // await selectCab.waitForExist({ timeout: 8000 });
      // await selectCab.waitForDisplayed({ timeout: 8000 });
      // await selectCab.click();
    }

    const firstCabCard = await driver.$(
      '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
    );
    await firstCabCard.waitForExist({ timeout: 5000 });
    await firstCabCard.click();
    console.log("FIRST CAB CARD CLICKED");
    const proceedButtonCabSelecting = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await proceedButtonCabSelecting.waitForExist({ timeout: 5000 });
    await proceedButtonCabSelecting.click();
    console.log("PROCEED BUTTON CLICKED AFTER SELECTING CAB");

    await driver.pause(2000);

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen.waitForExist({ timeout: 30000 });
    console.log("TRAVEL REQUEST SCREEN LOADED");
  }

  async viewTravelRequestSummaryForBus() {
    const driver = this.driver;
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 5000,
    });
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    await createTravelRequestScreenProceedButton.click();
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    await driver.pause(3500);

    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 6000 });
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);
    console.log("SEARCHING FOR COMPLETE BOOKING BUTTON...");
    await driver.pause(5000);
    await driver.pause(5000);
    console.log("SEARCHING FOR COMPLETE BOOKING BUTTON...");
    const completeBookingBtn = await driver.$(
      '//android.widget.Button[@content-desc="Complete Booking"]',
    );

    const hasCompleteBtn = await completeBookingBtn
      .isExisting()
      .catch(() => false);

    if (hasCompleteBtn) {
      console.log("Complete Booking button found — proceeding to click .");
      await completeBookingBtn
        .waitForExist({ timeout: 3000 })
        .catch(() => false);
      await completeBookingBtn.click();
      console.log(" COMPLETE BOOKING BUTTON CLICKED ");
      await driver.pause(2000);

      const popup = await driver.$(
        '//android.view.View[@content-desc="Your bus is ready to be booked. Do you want to continue?"]',
      );
      const popupShown = await popup
        .waitForExist({ timeout: 8000 })
        .catch(() => false);
      if (popupShown) {
        console.log("⚪ Popup appeared — confirming booking...");
        const confirmBtn = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await confirmBtn.waitForExist({ timeout: 5000 }).catch(() => false);
        await confirmBtn.click().catch(() => {});
        console.log("✅ Booking confirmed.");
        await driver.pause(5000);
      } else {
        console.log(
          "Popup did not appear after clicking Complete Booking — continuing flow.",
        );
      }
    } else {
      console.log(
        "Complete Booking button not present — skipping popup/confirmation flow.",
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
      console.log(" BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN ");
      await driver.pause(5000);
    } else {
      console.log("Back button not found — continuing without clicking Back.");
    }

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen
      .waitForExist({ timeout: 6000 })
      .catch(() => false);
    await driver.pause(2000);
    console.log("TRAVEL REQUEST SCREEN FOUND");
  }
  async viewTravelRequestSummaryForTrain() {
    const driver = this.driver;
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    await driver.pause(3000);

    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
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
      console.log(" BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN ");
      await driver.pause(5000);
    } else {
      console.log("Back button not found — continuing without clicking Back.");
    }

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen
      .waitForExist({ timeout: 6000 })
      .catch(() => false);
    await driver.pause(2000);
    console.log("TRAVEL REQUEST SCREEN FOUND");
  }
  async viewTravelRequestSummaryForFlightHotel() {
    const driver = this.driver;
    await driver.pause(2000);
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
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

    console.log(
      "SCROLLED TO BOTTOM OF THE PAGE  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    // Locate the Passport field

    // const passportNumber = await driver.$('//android.widget.EditText[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    console.log(
      "CHECKING FOR PASSPORT FIELD PRESENCE  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      console.log("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      console.log(
        "PASSPORT NUMBER ENTERED  //////////////////////////////////////////////////////////////////////////",
      );
    } else {
      console.log("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
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
      console.log("Passport Expiry field found ✅");

      // Scroll down a bit more before interacting (if needed)

      // Now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      console.log(
        "Clicked on Passport Expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

      // Here you can call your date picker function
      console.log("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      console.log("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    const { width: winWidth, height: winHeight } = await driver.getWindowRect();
    const startX = winWidth / 2;
    const startY = winHeight * 0.85;
    const endY = winHeight * 0.35;

    let found = false;

    for (let i = 0; i < 6; i++) {
      // try to find the button in the current view
      console.log("SEARCHING FOR COMPLETE BOOKING BUTTON...");
      const completeBookingBtns = await driver.$$(
        '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
      );

      // if ((await completeBookingBtns.length) > 0) {
      //   console.log("✅ Found 'Complete Booking' button!");
      //   await completeBookingBtns[0].click();

      //   found = true;
      //   break;
      // }
      if ((await completeBookingBtns.length) > 0) {
        console.log(
          "✅ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1COMPLETE BOOKING BUTTON FOUND !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111!",
        );
        const button = completeBookingBtns[0];

        await button.waitForDisplayed({ timeout: 6000 });
        await button.waitForEnabled({ timeout: 6000 });

        // Use WebdriverIO's touch action instead of getRect
        try {
          // Preferred: normal click
          await (button as unknown as WebdriverIO.Element).click();
          console.log("🟢 'Complete Booking' clicked with element.click()");
        } catch (clickErr) {
          console.warn(
            "element.click() failed, falling back to coordinate tap:",
            clickErr,
          );

          // Fallback: use mobile: clickGesture with element rect (cast to any to satisfy TS)
          const rect = await (button as any).getRect();
          const centerX = Math.floor(rect.x + rect.width / 2);
          const centerY = Math.floor(rect.y + rect.height / 2);

          await driver.execute("mobile: clickGesture", {
            x: centerX,
            y: centerY,
            // optional: adjust duration if needed
            // duration: 50
          });
          console.log(
            "🟢 'Complete Booking' clicked with mobile: clickGesture",
          );
        }
        console.log(
          "🟢 '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!COMPLETE BOOKING TAPPED SUCCESSFULLY  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111!",
        );
        found = true;
        break;
      }

      console.log(`🟣 Scroll attempt ${i + 1}...`);
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

    console.log(" COMPLETE BOOKING BUTTON CLICKED ");
    await driver.pause(5000);
    const popup = await driver.$(
      '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
    );

    await popup.waitForExist({ timeout: 8000 });
    console.log("⚪ Popup appeared — confirming booking  FLIGHTHOTEL...");
    await driver.pause(2000);
    const confirmBtn = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );
    await confirmBtn.waitForDisplayed({ timeout: 8000 });
    await confirmBtn.click();
    console.log("✅ Booking confirmed.");
    await driver.pause(8000);

    // const backButtonRequestDetails = await driver.$(
    //   '//android.widget.Button[@content-desc="Back"]',
    // );
    // await backButtonRequestDetails.waitForDisplayed({ timeout: 5000 });

    // // await backButtonRequestDetails.waitForExist({ timeout: 5000 });
    // await backButtonRequestDetails.click();
    // console.log(" BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN ");
  }

  async viewTravelRequestSummaryForFlightHotelCab() {
    const driver = this.driver;
    await driver.pause(2000);
    let travellerDetailsFound = false;
    for (let i = 0; i < 20; i++) {
        await driver.pause(500);
        const els = await driver.$$("~Traveller Details");
        if (els.length > 0) {
            travellerDetailsFound = true;
            break;
        }
    }
    if (!travellerDetailsFound) throw new Error("Traveller Details screen not found after 10s");
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");

    await driver.pause(3000);

    console.log(
      "SCROLLED TO BOTTOM OF THE PAGE  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );
    // const passportNumber = await driver.$('//android.widget.EditText[@content-desc="Passport No"]');
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

    console.log(
      "SCROLLED TO BOTTOM OF THE PAGE  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    // Locate the Passport field

    // const passportNumber = await driver.$('//android.widget.EditText[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    console.log(
      "CHECKING FOR PASSPORT FIELD PRESENCE  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      console.log("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      console.log(
        "PASSPORT NUMBER ENTERED  //////////////////////////////////////////////////////////////////////////",
      );
    } else {
      console.log("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
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
      console.log("Passport Expiry field found ✅");

      // Scroll down a bit more before interacting (if needed)

      // Now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      console.log(
        "Clicked on Passport Expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

      // Here you can call your date picker function
      console.log("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      console.log("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenSubmitButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenSubmitButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenSubmitButon.click();

    console.log("Waiting for all loading screens to clear...");
    let cleanCount = 0;
    for (let i = 0; i < 60; i++) {
        await driver.pause(1000);
        const loading1 = await driver.$$('//android.view.View[@content-desc="Please wait until your request is processed."]');
        const loading2 = await driver.$$('//android.view.View[contains(@content-desc,"Loading travel request")]');
        if (loading1.length === 0 && loading2.length === 0) {
            cleanCount++;
            console.log(`Clean check ${cleanCount}/2 at ${i + 1}s`);
            if (cleanCount >= 2) {
                console.log("Loading fully cleared.");
                break;
            }
        } else {
            cleanCount = 0; // reset if loading reappears
            console.log(`Still loading... (${i + 1}s)`);
        }
    }

    await driver.pause(1000);
    console.log("CHECKING FOR 'Go to Home' BUTTON...");

    // First check for "Go to Home" button
    const goToHomeButton = await driver.$(
      '//android.widget.Button[@content-desc="Go to Home"]',
    );
    const isGoToHomeVisible = await goToHomeButton
      .isExisting()
      .catch(() => false);

    if (isGoToHomeVisible) {
      console.log(
        "✅ 'Go to Home' button found - navigating back to Travel Requests",
      );

      // Click Go to Home
      await goToHomeButton.click();
      console.log("Clicked Go to Home button");

      // Wait for and click on Travel Requests

      return; // End the flow here
    } else {
      console.log(
        "'Go to Home' button not found - proceeding to check for Complete Booking",
      );

      // Continue with Complete Booking flow
      const { width: screenWidth, height: screenHeight } =
        await driver.getWindowRect();
      const startX = screenWidth / 2;
      const startY = screenHeight * 0.95;
      const endY = screenHeight * 0.2;

      let bookingFound = false;

      for (let i = 0; i < 9; i++) {
        console.log(
          ".........................................................................SEARCHING FOR COMPLETE BOOKING BUTTON....",
        );
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

        if ((await completeBookingBtns.length) > 0) {
          console.log("✅ Found 'Complete Booking' button!");
          try {
            await completeBookingBtns[0].click();
            bookingFound = true;
            break;
          } catch (err) {
            console.log(
              "1111111111111111111111111111111111111111111111111111111111111111Failed to click Complete Booking, will retry after scroll",
            );
          }
        }

        // Check again for Go to Home in case it appears during scrolling
        const isGoToHomeNowVisible = await goToHomeButton
          .isExisting()
          .catch(() => false);
        if (isGoToHomeNowVisible) {
          console.log(
            "✅ ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅GGO TO HOME BUTTON APPEAR AFTER SCROLLING - NAVIGATING BACK TO TRAVEL REQUESTS✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅",
          );
          await goToHomeButton.click();

          // const travelRequestsButton = await driver.$('//android.view.View[@content-desc="Travel Requests"]');
          // await travelRequestsButton.waitForExist({ timeout: 5000 });
          // await travelRequestsButton.click();
          console.log("CLICKED ON  GO TO HOME BUTTON  ");

          return;
          // End the flow
        }

        console.log(`🟣 Scroll attempt ${i + 1}...`);
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
          "❌///////////////////////////////////////// COULD NOT FIND WHAT ARE YOU DOING 'Complete Booking' BUTTON EVEN AFTER SCROLLING.//////////////////////////////////////",
        );
      }
      console.log(" COMPLETE BOOKING BUTTON CLICKED ");
      await driver.pause(5000);
      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );

      await popup.waitForExist({ timeout: 8000 });
      console.log("⚪ Popup appeared — confirming booking...");
      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();
      console.log("✅ Booking confirmed.");
      await driver.pause(5000);

      console.log("✅ COMPLETE BOOKING BUTTON CLICKED");
      await driver.pause(5000);
      console.log("🚕 Starting cab selections...");

      console.log("🚕 Starting Deep Scroll to Locate 'Select Cabs'...");

      const { width: screenWidthLocalCab, height: screenHeightLocalCab } =
        await driver.getWindowRect();
      const startXLocalCab = screenWidthLocalCab / 2;
      const startYLocalCab = screenHeightLocalCab * 0.95; // start even lower
      const endYLocalCab = screenHeightLocalCab * 0.05; // end even higher

      let selectCabFound = false;

      for (let i = 0; i < 2; i++) {
        // up to 25 full swipes
        console.log(`🔄 Scroll attempt ${i + 1} to find 'Select Cabs'...`);
        console.log(
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
          console.log(
            "✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ 'Select Cabs' button FOUND!",
          );
          await selectCab.waitForDisplayed({ timeout: 5000 });
          await driver.pause(1000);
          await selectCab.click();
          console.log(
            "🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖 'Select Cabs' button CLICKED!🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖🚖",
          );
          selectCabFound = true;
          break;
        }
      }

      // Stop if not found
      if (!selectCabFound) {
        throw new Error(
          "❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌ Could not locate 'Select Cabs' even after multiple scrolls!",
        );
      }

      await driver.pause(2000);

      // --- CAB CARD SELECTION ---
      const firstCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard.waitForExist({ timeout: 10000 });
      await firstCabCard.click();
      console.log(
        "🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗s First Cab Card CLICKED",
      );

      await driver.pause(2000);

      // --- PROCEED BUTTON ---
      const proceedButtonCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting.click();
      console.log(
        "✅🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕 PROCEED BUTTON CLICKED AFTER CAB SELECTION 🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕✅",
      );

      await driver.pause(2000);

      console.log(
        "📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝CLICKING ON THE OUTSTATION CAB ",
      );

      const travellerCard = await driver.$(
        `//android.view.View[contains(@content-desc, "IBS/")]`,
      );

      await travellerCard.waitForExist({ timeout: 10000 });
      await travellerCard.click();
      console.log(
        "✅📝📝 Traveller request card clicked, navigating to Request Detail screen",
      );
      await driver.pause(2000); // wait for screen transition

      console.log(
        "🚖 Scrolling to find 'Select Cabs' for Outstation Cab in Request Detail...",
      );

      const { width: screenWidthReq, height: screenHeightReq } =
        await driver.getWindowRect();
      const startXReq = screenWidthReq / 2;
      const startYReq = screenHeightReq * 0.95;
      const endYReq = screenHeightReq * 0.05;

      let selectOutstationFound = false;

      for (let i = 0; i < 30; i++) {
        // more scrolls for deep screen
        console.log(
          `🔄 Scroll attempt ${i + 1} to find 'Select Cabs' for Outstation Cab`,
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
        await driver.pause(2000); // allow UI to settle

        const selectOutstationCab = await driver.$(
          '//android.view.View[@content-desc="Select Cabs"]',
        );

        if (await selectOutstationCab.isExisting()) {
          console.log(
            "✅ 'Select Cabs' for Outstation Cab FOUND on Request Detail screen",
          );
          await selectOutstationCab.waitForDisplayed({ timeout: 5000 });
          await selectOutstationCab.click();
          selectOutstationFound = true;
          break;
        }
      }

      if (!selectOutstationFound) {
        throw new Error(
          "❌ Could not locate 'Select Cabs' for Outstation Cab in Request Detail screen!",
        );
      }

      await driver.pause(2000);

      // --- CAB CARD SELECTION ---
      const firstOutstationCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstOutstationCabCard.waitForExist({ timeout: 10000 });
      await firstOutstationCabCard.click();
      console.log(
        "🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗s First Cab Card CLICKED",
      );

      await driver.pause(2000);

      // --- PROCEED BUTTON ---
      const proceedButtonOutstationCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonOutstationCabSelecting.waitForExist({
        timeout: 10000,
      });
      await proceedButtonOutstationCabSelecting.click();

      console.log("✅ ALL CAB OPTIONS SELECTED SUCCESSFULLY!");
    }
  }
  async viewTravelRequestSummaryForFlightHotelCabBus() {
    const driver = this.driver;
    await this.driver.pause(8000);
    console.log(
      "=============================== STARTING FLIGHT + HOTEL + CAB + BUS FLOW TEST ===============================",
    );
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForDisplayed({ timeout: 8000 });
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
    await driver.pause(8000);
    console.log(
      "=============================== STARTED SCROLLING TO PASSPORT FIELD  ===============================",
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

    console.log(
      "SCROLLED TO BOTTOM OF THE PAGE  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    await driver.pause(4000);
    // Locate the Passport field

    // const passportNumber = await driver.$('//android.widget.EditText[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    console.log(
      "CHECKING FOR PASSPORT FIELD PRESENCE  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      console.log("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      console.log(
        "PASSPORT NUMBER ENTERED  //////////////////////////////////////////////////////////////////////////",
      );
    } else {
      console.log("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
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
      console.log("Passport Expiry field found ✅");

      // Scroll down a bit more before interacting (if needed)

      // Now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      console.log(
        "Clicked on Passport Expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

      // Here you can call your date picker function
      console.log("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      console.log("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);

    try {
      console.log("🔎 Checking for 'Go to Home' button...");

      const goToHomeButton = await driver.$(
        '//android.widget.Button[@content-desc="Go to Home"]',
      );
      const isGoToHomeVisible = await goToHomeButton
        .isExisting()
        .catch(() => false);

      if (isGoToHomeVisible) {
        console.log(
          "✅ 'Go to Home' button found - navigating back to Travel Requests",
        );
        await goToHomeButton.click();
        console.log("🏠 Clicked 'Go to Home' button - ending flow here");
        return; // End the flow immediately
      }

      console.log(
        "❌ 'Go to Home' button not found - proceeding to Complete Booking flow...",
      );

      // ----- COMPLETE BOOKING SECTION -----
      const { width: screenWidth, height: screenHeight } =
        await driver.getWindowRect();
      const startX = screenWidth / 2;
      const startY = screenHeight * 0.95;
      const endY = screenHeight * 0.2;

      let bookingFound = false;

      for (let i = 0; i < 15; i++) {
        console.log("🔍 Searching for 'Complete Booking' button...");
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

        if ((await completeBookingBtns.length) > 0) {
          console.log("✅ Found 'Complete Booking' button!");
          try {
            await completeBookingBtns[0].click();
            bookingFound = true;
            break;
          } catch (err) {
            console.log(
              "⚠️ Failed to click 'Complete Booking', retrying after scroll...",
            );
          }
        }

        console.log(`🟣 Scroll attempt ${i + 1}...`);
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

      console.log("✅ COMPLETE BOOKING BUTTON CLICKED");
      await driver.pause(5000);

      // ----- POPUP CONFIRMATION -----
      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );
      await popup.waitForExist({ timeout: 8000 });
      console.log("⚪ Popup appeared — confirming booking...");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();
      console.log("✅ Booking confirmed.");
      await driver.pause(5000);

      // ----- SELECT CABS SECTION -----
      console.log("🚕 Starting cab selections...");
      console.log("🚕 Deep scrolling to locate 'Select Cabs'...");

      const { width: screenWidthLocalCab, height: screenHeightLocalCab } =
        await driver.getWindowRect();
      const startXLocalCab = screenWidthLocalCab / 2;
      const startYLocalCab = screenHeightLocalCab * 0.95;
      const endYLocalCab = screenHeightLocalCab * 0.05;

      let selectCabFound = false;

      for (let i = 0; i < 25; i++) {
        console.log(`🔄 Scroll attempt ${i + 1} to find 'Select Cabs'...`);
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
          console.log("✅ 'Select Cabs' button FOUND!");
          await selectCab.waitForDisplayed({ timeout: 5000 });
          await driver.pause(1000);
          await selectCab.click();
          console.log("🚖 'Select Cabs' button CLICKED!");
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

      // ----- CAB CARD SELECTION -----
      const firstCabCard1 = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard1.waitForExist({ timeout: 10000 });
      await firstCabCard1.click();
      console.log("🚗 First Cab Card CLICKED");

      await driver.pause(2000);

      const proceedButtonCabSelecting1 = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting1.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting1.click();
      console.log("✅ Proceed button clicked after cab selection");

      await driver.pause(2000);
      console.log("📝 Clicking on Outstation cab...");
      await driver.pause(9000);

      // ----- RETURN TO TRAVEL REQUESTS -----
      const travelRequestScreen = await driver.$(
        '//android.view.View[@content-desc="Travel Requests"]',
      );
      await travelRequestScreen.waitForExist({ timeout: 30000 });
      console.log("✅ TRAVEL REQUEST SCREEN LOADED");

      await driver.pause(45000);

      const firstCard = await driver.$(
        '(//android.view.View[contains(@content-desc, "IBS/")])[1]',
      );
      await firstCard.waitForExist({ timeout: 5000 });
      await firstCard.click();
      console.log("✅ CLICKED ON THE FIRST CARD IN MY REQUESTS TAB");

      const cabSelector = '//android.view.View[@content-desc="Select Cabs"]';
      const found = await this.scrollUntilVisible(cabSelector);
      if (!found) throw new Error("❌ 'Select Cabs' not found after scrolling");

      await driver.$(cabSelector).click();
      console.log("✅ CLICKED 'Select Cabs'");
      await driver.pause(2000);

      const firstCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard.waitForExist({ timeout: 5000 });
      await firstCabCard.click();
      console.log("✅ FIRST CAB CARD CLICKED");

      const proceedButtonCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting.click();
      console.log("✅ PROCEED BUTTON CLICKED AFTER SELECTING CAB");

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
        console.log("🎉 SCRIPT WAS SUCCESSFULLY EXECUTED");
      } else {
        throw new Error("❌ SCRIPT WAS NOT SUCCESSFULLY EXECUTED");
      }

      // ----- RETURN BACK BUTTON -----
      const backButtonRequestDetails = await driver.$(
        '//android.widget.Button[@content-desc="Back"]',
      );
      await backButtonRequestDetails.waitForExist({ timeout: 5000 });
      await backButtonRequestDetails.click();
      console.log("🔙 BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN");
    } catch (err) {
      console.error("🚨 FAILED TO EXECUTE ROUNDTRIP FLOW:", err);
      throw err;
    }
  }

  async viewTravelRequestSummaryForFlightHotelAirportCabBus() {
    const driver = this.driver;
    await this.driver.pause(2000);

    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
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

    console.log(
      "SCROLLED TO BOTTOM OF THE PAGE  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    // Locate the Passport field

    // const passportNumber = await driver.$('//android.widget.EditText[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    console.log(
      "CHECKING FOR PASSPORT FIELD PRESENCE  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      console.log("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      console.log(
        "PASSPORT NUMBER ENTERED  //////////////////////////////////////////////////////////////////////////",
      );
    } else {
      console.log("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
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
      console.log("Passport Expiry field found ✅");

      // Scroll down a bit more before interacting (if needed)

      // Now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      console.log(
        "Clicked on Passport Expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

      // Here you can call your date picker function
      console.log("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      console.log("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);

    try {
      console.log("🔎 Checking for 'Go to Home' button...");

      const goToHomeButton = await driver.$(
        '//android.widget.Button[@content-desc="Go to Home"]',
      );
      const isGoToHomeVisible = await goToHomeButton
        .isExisting()
        .catch(() => false);

      if (isGoToHomeVisible) {
        console.log(
          "✅ 'Go to Home' button found - navigating back to Travel Requests",
        );
        await goToHomeButton.click();
        console.log("🏠 Clicked 'Go to Home' button - ending flow here");
        return; // End the flow immediately
      }

      console.log(
        "❌ 'Go to Home' button not found - proceeding to Complete Booking flow...",
      );

      // ----- COMPLETE BOOKING SECTION -----
      const { width: screenWidth, height: screenHeight } =
        await driver.getWindowRect();
      const startX = screenWidth / 2;
      const startY = screenHeight * 0.95;
      const endY = screenHeight * 0.2;

      let bookingFound = false;

      for (let i = 0; i < 15; i++) {
        console.log("🔍 Searching for 'Complete Booking' button...");
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

        if ((await completeBookingBtns.length) > 0) {
          console.log("✅ Found 'Complete Booking' button!");
          try {
            await completeBookingBtns[0].click();
            bookingFound = true;
            break;
          } catch (err) {
            console.log(
              "⚠️ Failed to click 'Complete Booking', retrying after scroll...",
            );
          }
        }

        console.log(`🟣 Scroll attempt ${i + 1}...`);
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

      console.log("✅ COMPLETE BOOKING BUTTON CLICKED");
      await driver.pause(5000);

      // ----- POPUP CONFIRMATION -----
      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );
      await popup.waitForExist({ timeout: 8000 });
      console.log("⚪ Popup appeared — confirming booking...");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();
      console.log("✅ Booking confirmed.");
      await driver.pause(5000);

      // ----- SELECT CABS SECTION -----
      console.log("🚕 Starting cab selections...");
      console.log("🚕 Deep scrolling to locate 'Select Cabs'...");

      const { width: screenWidthLocalCab, height: screenHeightLocalCab } =
        await driver.getWindowRect();
      const startXLocalCab = screenWidthLocalCab / 2;
      const startYLocalCab = screenHeightLocalCab * 0.95;
      const endYLocalCab = screenHeightLocalCab * 0.05;

      let selectCabFound = false;

      for (let i = 0; i < 25; i++) {
        console.log(`🔄 Scroll attempt ${i + 1} to find 'Select Cabs'...`);
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
          console.log("✅ 'Select Cabs' button FOUND!");
          await selectCab.waitForDisplayed({ timeout: 5000 });
          await driver.pause(1000);
          await selectCab.click();
          console.log("🚖 'Select Cabs' button CLICKED!");
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

      // ----- CAB CARD SELECTION -----
      const firstCabCard1 = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard1.waitForExist({ timeout: 10000 });
      await firstCabCard1.click();
      console.log("🚗 First Cab Card CLICKED");

      await driver.pause(2000);

      const proceedButtonCabSelecting1 = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting1.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting1.click();
      console.log("✅ Proceed button clicked after cab selection");

      await driver.pause(2000);
      console.log("📝 Clicking on Outstation cab...");
      await driver.pause(9000);

      // ----- RETURN TO TRAVEL REQUESTS -----
      const travelRequestScreen = await driver.$(
        '//android.view.View[@content-desc="Travel Requests"]',
      );
      await travelRequestScreen.waitForExist({ timeout: 30000 });
      console.log("✅ TRAVEL REQUEST SCREEN LOADED");

      await driver.pause(45000);

      const firstCard = await driver.$(
        '(//android.view.View[contains(@content-desc, "IBS/")])[1]',
      );
      await firstCard.waitForExist({ timeout: 5000 });
      await firstCard.click();
      console.log("✅ CLICKED ON THE FIRST CARD IN MY REQUESTS TAB");

      const cabSelector = '//android.view.View[@content-desc="Select Cabs"]';
      const found = await this.scrollUntilVisible(cabSelector);
      if (!found) throw new Error("❌ 'Select Cabs' not found after scrolling");

      await driver.$(cabSelector).click();
      console.log("✅ CLICKED 'Select Cabs'");
      await driver.pause(2000);

      const firstCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard.waitForExist({ timeout: 5000 });
      await firstCabCard.click();
      console.log("✅ FIRST CAB CARD CLICKED");

      const proceedButtonCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting.click();
      console.log("✅ PROCEED BUTTON CLICKED AFTER SELECTING CAB");

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
        console.log("🎉 SCRIPT WAS SUCCESSFULLY EXECUTED");
      } else {
        throw new Error("❌ SCRIPT WAS NOT SUCCESSFULLY EXECUTED");
      }

      // ----- RETURN BACK BUTTON -----
      const backButtonRequestDetails = await driver.$(
        '//android.widget.Button[@content-desc="Back"]',
      );
      await backButtonRequestDetails.waitForExist({ timeout: 5000 });
      await backButtonRequestDetails.click();
      console.log("🔙 BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN");
    } catch (err) {
      console.error("🚨 FAILED TO EXECUTE ROUNDTRIP FLOW:", err);
      throw err;
    }
  }

  async viewTravelRequestSummaryForFlighMulticitytHotelAirportCabBusRail() {
    const driver = this.driver;
    await driver.pause(2000);
    const travellerDetailScreen = await driver.$("~Traveller Details");
    await travellerDetailScreen.waitForExist({ timeout: 5000 });
    console.log("ENTERED INTO  TRAVELLER DETAILS SCREEN ");
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

    console.log(
      "SCROLLED TO BOTTOM OF THE PAGE  passport feild 444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444",
    );

    // Locate the Passport field

    // const passportNumber = await driver.$('//android.widget.EditText[@content-desc="Passport No"]');
    const passportNumber = await driver.$(
      '//android.widget.EditText[@hint="Passport No"]',
    );

    console.log(
      "CHECKING FOR PASSPORT FIELD PRESENCE  5555555555555555555555555555555555555555555555555555555555555555555555555",
    );
    if (await passportNumber.isExisting()) {
      console.log("PASSPORT FIELD FOUND ✅");
      await passportNumber.click();
      await passportNumber.setValue("C748TJ1K2");
      console.log(
        "PASSPORT NUMBER ENTERED  //////////////////////////////////////////////////////////////////////////",
      );
    } else {
      console.log("PASSPORT FIELD NOT PRESENT ❌ — Skipping input");
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
      console.log("Passport Expiry field found ✅");

      // Scroll down a bit more before interacting (if needed)

      // Now click/select expiry date
      await passportExpiryField.waitForExist({ timeout: 5000 });
      await passportExpiryField.click();
      console.log(
        "Clicked on Passport Expiry field 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );

      // Here you can call your date picker function
      console.log("GOING TO CALL THE PASSPORT EXPIRY FUNCTION  ...");
      await this.selectPassPortExpiryDate(driver);
    } else {
      console.log("PASSPORT EXPIRY FEILD NOT FOUND  ❌ — skipping");
    }
    const addTravellerDetailScreenButton = await driver.$(
      '//android.widget.Button[@content-desc="Add Traveller Details"]',
    );
    await addTravellerDetailScreenButton.waitForExist({ timeout: 5000 });
    console.log("CLICKED ON TRAVELLER DETAILS BUTTON");
    await addTravellerDetailScreenButton.click();
    await driver.pause(2000);

    const additionalDetailsScreen = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]',
    );
    await additionalDetailsScreen.waitForExist({ timeout: 5000 });
    console.log("WENT INTO   ADDITIONAL DETAILS SCREEN ");
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
      console.warn("Purpose Of Travel field not found, skipping...");
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
          console.log("First Purpose Of Travel option selected");
          await driver.pause(1000);
        } else {
          console.warn("No Purpose Of Travel options found in dropdown!");
        }
      }
    }

    const additionalDetailsScreenProceedButon = await driver.$(
      '//android.widget.Button[@content-desc="Submit "]',
    );
    await additionalDetailsScreenProceedButon.waitForExist({
      timeout: 5500,
    });
    console.log("SUBMIT BUTTON CLICKED  IN ADDITIONAL DETAILS SCREEN");
    await driver.pause(2000);
    await additionalDetailsScreenProceedButon.click();

    await driver.pause(2000);

    try {
      console.log("🔎 Checking for 'Go to Home' button...");

      const goToHomeButton = await driver.$(
        '//android.widget.Button[@content-desc="Go to Home"]',
      );
      const isGoToHomeVisible = await goToHomeButton
        .isExisting()
        .catch(() => false);

      if (isGoToHomeVisible) {
        console.log(
          "✅ 'Go to Home' button found - navigating back to Travel Requests",
        );
        await goToHomeButton.click();
        console.log("🏠 Clicked 'Go to Home' button - ending flow here");
        return; // End the flow immediately
      }

      console.log(
        "❌ 'Go to Home' button not found - proceeding to Complete Booking flow...",
      );

      // ----- COMPLETE BOOKING SECTION -----
      const { width: screenWidth, height: screenHeight } =
        await driver.getWindowRect();
      const startX = screenWidth / 2;
      const startY = screenHeight * 0.95;
      const endY = screenHeight * 0.2;

      let bookingFound = false;

      for (let i = 0; i < 15; i++) {
        console.log("🔍 Searching for 'Complete Booking' button...");
        const completeBookingBtns = await driver.$$(
          '//android.widget.Button[contains(@content-desc,"Complete Booking")]',
        );

        if ((await completeBookingBtns.length) > 0) {
          console.log("✅ Found 'Complete Booking' button!");
          try {
            await completeBookingBtns[0].click();
            bookingFound = true;
            break;
          } catch (err) {
            console.log(
              "⚠️ Failed to click 'Complete Booking', retrying after scroll...",
            );
          }
        }

        console.log(`🟣 Scroll attempt ${i + 1}...`);
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

      console.log("✅ COMPLETE BOOKING BUTTON CLICKED");
      await driver.pause(5000);

      // ----- POPUP CONFIRMATION -----
      const popup = await driver.$(
        '//android.view.View[@content-desc="Your flight is ready to be booked. Do you want to continue?"]',
      );
      await popup.waitForExist({ timeout: 8000 });
      console.log("⚪ Popup appeared — confirming booking...");

      const confirmBtn = await driver.$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      await confirmBtn.waitForExist({ timeout: 5000 });
      await confirmBtn.click();
      console.log("✅ Booking confirmed.");
      await driver.pause(5000);

      // ----- SELECT CABS SECTION -----
      console.log("🚕 Starting cab selections...");
      console.log("🚕 Deep scrolling to locate 'Select Cabs'...");

      // const { width: screenWidthLocalCab, height: screenHeightLocalCab } = await driver.getWindowRect();
      // const startXLocalCab = screenWidthLocalCab / 2;
      // const startYLocalCab = screenHeightLocalCab * 0.95;
      // const endYLocalCab = screenHeightLocalCab * 0.05;

      // let selectCabFound = false;

      // for (let i = 0; i < 2; i++) {
      //   console.log(`🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄 Scroll attempt ${i + 1} to find 'Select Cabs'...🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄`);
      //   await driver.performActions([
      //     {
      //       type: "pointer",
      //       id: "finger1",
      //       parameters: { pointerType: "touch" },
      //       actions: [
      //         { type: "pointerMove", duration: 0, x: startXLocalCab, y: startYLocalCab },
      //         { type: "pointerDown", button: 0 },
      //         { type: "pointerMove", duration: 1500, x: startXLocalCab, y: endYLocalCab },
      //         { type: "pointerUp", button: 0 },
      //       ],
      //     },
      //   ]);
      //   await driver.releaseActions();
      //   await driver.pause(2500);

      //   const selectCab = await driver.$('//android.view.View[@content-desc="Select Cabs"]');
      //   if (await selectCab.isExisting()) {
      //     console.log("✅ 'Select Cabs' button FOUND!");
      //     await selectCab.waitForDisplayed({ timeout: 5000 });
      //     await driver.pause(1000);
      //     await selectCab.click();
      //     console.log("🚖 'Select Cabs' button CLICKED!");
      //     selectCabFound = true;
      //     break;
      //   }
      // }
      console.log("🚕 Looking for 'Select Cabs' with controlled long swipe...");

      const selectCabSelector =
        '//android.view.View[@content-desc="Select Cabs"]';
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      const foundSelectCab = await this.scrollDownUntilVisible(
        selectCabSelector,
        2, // ONLY 2 long swipes
      );

      if (!foundSelectCab) {
        throw new Error("❌ 'Select Cabs' not found after long scrolls");
      }
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");
      console.log("🚕 Starting long scrolls to find 'Select Cabs'...");

      const selectCab = await driver.$(selectCabSelector);
      await selectCab.waitForDisplayed({ timeout: 5000 });
      await selectCab.click();

      console.log("✅ 'Select Cabs' clicked successfully");

      // if (!selectCabFound) {
      //   throw new Error("❌ Could not locate 'Select Cabs' even after multiple scrolls!");
      // }

      await driver.pause(2000);

      // ----- CAB CARD SELECTION -----
      const firstCabCard1 = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard1.waitForExist({ timeout: 10000 });
      await firstCabCard1.click();
      console.log("🚗 First Cab Card CLICKED");

      await driver.pause(2000);

      const proceedButtonCabSelecting1 = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting1.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting1.click();
      console.log("✅ Proceed button clicked after cab selection");

      await driver.pause(2000);
      console.log("📝 Clicking on Outstation cab...");
      await driver.pause(9000);

      // ----- RETURN TO TRAVEL REQUESTS -----
      const travelRequestScreen = await driver.$(
        '//android.view.View[@content-desc="Travel Requests"]',
      );
      await travelRequestScreen.waitForExist({ timeout: 30000 });
      console.log("✅ TRAVEL REQUEST SCREEN LOADED");

      await driver.pause(45000);

      const firstCard = await driver.$(
        '(//android.view.View[contains(@content-desc, "IBS/")])[1]',
      );
      await firstCard.waitForExist({ timeout: 5000 });
      await firstCard.click();
      console.log("✅ CLICKED ON THE FIRST CARD IN MY REQUESTS TAB");

      const cabSelector = '//android.view.View[@content-desc="Select Cabs"]';
      const found = await this.scrollUntilVisible(cabSelector);
      if (!found) throw new Error("❌ 'Select Cabs' not found after scrolling");

      await driver.$(cabSelector).click();
      console.log("✅ CLICKED 'Select Cabs'");
      await driver.pause(2000);

      const firstCabCard = await driver.$(
        '//android.view.View[contains(@content-desc, "Pickup") and contains(@content-desc, "Estimated Price")][1]',
      );
      await firstCabCard.waitForExist({ timeout: 5000 });
      await firstCabCard.click();
      console.log("✅ FIRST CAB CARD CLICKED");

      const proceedButtonCabSelecting = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedButtonCabSelecting.waitForExist({ timeout: 10000 });
      await proceedButtonCabSelecting.click();
      console.log("✅ PROCEED BUTTON CLICKED AFTER SELECTING CAB");

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
        console.log("🎉 SCRIPT WAS SUCCESSFULLY EXECUTED");
      } else {
        throw new Error("❌ SCRIPT WAS NOT SUCCESSFULLY EXECUTED");
      }

      // ----- RETURN BACK BUTTON -----
      const backButtonRequestDetails = await driver.$(
        '//android.widget.Button[@content-desc="Back"]',
      );
      await backButtonRequestDetails.waitForExist({ timeout: 5000 });
      await backButtonRequestDetails.click();
      console.log("🔙 BACK BUTTON CLICKED IN REQUEST DETAIL SCREEN");
    } catch (err) {
      console.error("🚨 FAILED TO EXECUTE ROUNDTRIP FLOW:", err);
      throw err;
    }
  }

  async scrollDownUntilVisible(selector, maxSwipes = 3) {
    const { width, height } = await this.driver.getWindowRect();

    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.9); // start very low
    const endY = Math.floor(height * 0.1); // swipe very high (long swipe)

    for (let i = 0; i < maxSwipes; i++) {
      console.log(`⬇️ Long scroll attempt ${i + 1}`);

      const element = await this.driver.$(selector);
      if (await element.isExisting()) {
        console.log("✅ Element found without further scrolling");
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
  private async selectPassPortExpiryDate(
    driver: WebdriverIO.Browser,
  ): Promise<number> {
    const passportExpiryDate = await driver.$(
      `//*[contains(@text,"Passport Expiry") or contains(@content-desc,"Passport Expiry")]`,
    );
    await passportExpiryDate.waitForExist({ timeout: 20000 });
    await passportExpiryDate.click();
    console.log("✅ Clicked Passport Expiry field");

    const nextMonthButton = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]//android.widget.Button[2]',
    );
    await nextMonthButton.waitForExist({ timeout: 5000 });
    await nextMonthButton.click();
    console.log(" Moved to next month");

    const randomDate = Math.floor(Math.random() * 28) + 1;
    console.log(`Trying to select date: ${randomDate}`);

    try {
      const dateElement = await driver.$(
        `//android.widget.Button[contains(@content-desc,"${randomDate}")]`,
      );
      await dateElement.waitForExist({ timeout: 10000 });
      await dateElement.click();
      console.log(` Selected date: ${randomDate}`);
    } catch (error) {
      console.error(` Error selecting date ${randomDate}:`, error);
    }

    await driver.pause(1500);
    return randomDate;
  }

  private async probeElement(
    selector: string,
    attempts = 10,
    intervalMs = 1000,
  ): Promise<WebdriverIO.Element | null> {
    for (let i = 0; i < attempts; i++) {
      const els = await this.driver.$$(selector);
      if (els.length > 0) return els[0];
      console.log(`⏳ [probe] attempt ${i + 1}/${attempts}: ${selector}`);
      await this.driver.pause(intervalMs);
    }
    return null;
  }
}
