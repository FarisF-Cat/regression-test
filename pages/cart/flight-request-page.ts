import logger from '@wdio/logger'
const log = logger('FlightRequestPage')

export class FlightRequestSearchPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async flightRequestSearchOneWay() {
    const driver = this.driver;
    log.info(" searching flights..");
    await driver.pause(2000);
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
    try {
      const searchResults = await driver.$(
        '//android.view.View[@content-desc="Great things take time! Searching the best flights for your needs"]',
      );
      const isVisible = await searchResults.waitForExist({
        timeout: 10000,
      });
      if (isVisible) {
        log.info("✅ search in progress message appeared");
      } else {
        log.info("⚠️ search progress message not visible");
      }
    } catch (err) {
      log.debug("⚠️ search progress message not found within timeout");
    }
    try {
      log.info(" waiting before loading flight cards..");
      await driver.pause(6000);

      const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
      await firstFlightCard.waitForExist({ timeout: 50000 });
      log.debug(" first flight card found");
      const showFaresOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Show").instance(0)',
      );
      await showFaresOption.waitForExist({ timeout: 20000 });
      await showFaresOption.click();

      const chooseButton = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Choose").instance(0)',
      );
      await chooseButton.waitForExist({ timeout: 20000 });
      await chooseButton.click();
      log.info(" flight chose");
    } catch (err: any) {
      log.error(" error during flight selection:", err.message || err);
      throw err;
    }

    await driver.pause(2000);

    // try {
    //   await driver.pause(1000);
    //   const chooseAnxillaryScreen = await driver.$("~Choose Ancillaries");
    //   await chooseAnxillaryScreen.waitForExist({ timeout: 20000 });
    //   await chooseAnxillaryScreen.click();

    //   const noAncillaryMsg = await driver.$(
    //     '//android.view.View[@content-desc="Ancillary selection not available for the selected flights"]',
    //   );
    //   if (await noAncillaryMsg.isExisting()) {
    //     log.debug(
    //       "anxillary selection not available for the selected flights",
    //     );
    //     const proceedBtn = await driver.$(
    //       '//android.widget.Button[@content-desc="Proceed"]',
    //     );
    //     if (await proceedBtn.isExisting()) {
    //       await proceedBtn.click();
    //       log.info("proceeded without anxillary selection");
    //     }
    //     Return;
    //   }

    //   log.info("finding available seats by seat number pattern");

    //   const chooseSeat = await driver.$(
    //     '//android.view.View[@content-desc="Choose Seat"]',
    //   );
    //   await chooseSeat.waitForExist({ timeout: 20000 });
    //   log.debug("choose seat button found, going to be clicked");
    //   await chooseSeat.click();
    //   log.info("choose seat clicked");

    //   const chooseSeatMapPage = await driver.$(
    //     '//android.view.View[@content-desc="Choose Seat Map"]',
    //   );
    //   await chooseSeatMapPage.waitForExist({ timeout: 20000 });
    //   log.debug("choose seat page found");
    //   await driver.pause(2000);
    //   log.info("finding available seats by seat number pattern");
    //   const seatElements = await driver.$$(
    //     "//android.view.View[@content-desc]",
    //   );
    //   let found = false;
    //   for (const seat of seatElements) {
    //     const seatNumber = await seat.getAttribute("content-desc");
    //     if (/^[1-9][A-F]$/.test(seatNumber)) {
    //       try {
    //         log.info(`trying seat: ${seatNumber}`);
    //         await seat.click();
    //         const seatDetailsPopup = await driver.$(
    //           '//android.view.View[starts-with(@content-desc, "Seat Details")]',
    //         );
    //         const popupAppeared = await seatDetailsPopup
    //           .waitForExist({ timeout: 2000 })
    //           .catch(() => false);
    //         if (popupAppeared) {
    //           const doneButton = await driver.$(
    //             '//android.widget.Button[@content-desc="Done"]',
    //           );
    //           await doneButton.waitForExist({ timeout: 3000 });
    //           await doneButton.click();
    //           found = true;
    //           log.info(`selected seat: ${seatNumber}`);
    //           break;
    //         } else {
    //           log.info(`seat ${seatNumber} not available (no popup).`);
    //           continue;
    //         }
    //       } catch (err) {
    //         log.error(`error selecting the seat ${seatNumber}:`, err);
    //         continue;
    //       }
    //     }
    //   }
    //   if (!found) {
    //     log.debug("no available seats found by seat number.");
    //   }
    //   await driver.pause(2000);
    //   const chooseSeatDonePopUp = await driver.$(
    //     '//android.widget.Button[@content-desc="Done"]',
    //   );

    //   await chooseSeatDonePopUp.waitForExist({ timeout: 2000 });
    //   await chooseSeatDonePopUp.click();
    //   const chooseSeatDoneButton = await driver.$(
    //     '//android.widget.Button[@content-desc="Done"]',
    //   );

    //   await chooseSeatDoneButton.waitForExist({ timeout: 2000 });
    //   await chooseSeatDoneButton.click();
    //   await driver.pause(1000);

    //   await driver.pause(1000);
    //   const chooseAnxillaryScreenAgain = await driver.$("~choose ancillaries");
    //   await chooseAnxillaryScreenAgain.waitForExist({ timeout: 20000 });
    //   await driver.pause(1000);
    //   log.info("choose anxillary screen loaded again");
    //   const chooseMeals = await driver.$(
    //     '//android.view.View[@content-desc="Choose Meal"]',
    //   );

    //   await chooseMeals.waitForExist({ timeout: 2000 });
    //   await chooseMeals.click();
    //   await driver.pause(1000);
    //   const chooseMealsPopUp = await driver.$(
    //     'android=new uiselector().descriptioncontains("choose meal")',
    //   );

    //   await chooseMealsPopUp.waitForExist({ timeout: 2000 });
    //   await chooseMealsPopUp.click();

    //   await driver.pause(2000);

    //   const allRadioButtons = await driver.$$("//android.widget.RadioButton");
    //   for (const rb of allRadioButtons) {
    //     const desc = await rb.getAttribute("content-desc");
    //     log.debug(
    //       "found android.widget.RadioButton with content-desc:",
    //       desc,
    //     );
    //   }
    //   log.info("meal selection screen loaded");

    //   const mealsSelection = await driver.$(
    //     '//android.widget.RadioButton[contains(@content-desc, "No Meal")]',
    //   );

    //   await mealsSelection.waitForExist({ timeout: 5000 });
    //   await mealsSelection.click();

    //   log.info(" meal selected ");
    //   await driver.pause(2000);
    //   const mealsSelectionChooseMealButton = await driver.$(
    //     '//android.widget.Button[@content-desc="Choose Meal"]',
    //   );

    //   await mealsSelectionChooseMealButton.waitForExist({ timeout: 5000 });
    //   await mealsSelectionChooseMealButton.click();
    //   log.info(" meal selected  button clicked");
    // } catch (e) {
    //   log.warn(" meal selection skipped");
    // }

    try {
      await driver.pause(1000);

      // ============================
      // CHECK ANCILLARY SCREEN
      // ============================
      const chooseAnxillaryScreen = await driver.$("~choose ancillaries");

      const screenExists = await chooseAnxillaryScreen
        .waitForExist({ timeout: 8000 })
        .catch(() => false);

      if (!screenExists) {
        log.info("no ancillary screen → trying to proceed");

        const proceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );

        const proceedExists = await proceedBtn
          .waitForExist({ timeout: 5000 })
          .catch(() => false);

        if (proceedExists) {
          await proceedBtn.click();
          log.info("proceeded without ancillary screen");
        }

        return;
      }

      log.info("choose ancillary screen loaded");

      // ============================
      // CHECK "no ancillary" MESSAGE
      // ============================
      // const noAncillaryMsg = await driver.$(
      //   '//android.view.View[contains(@content-desc,"Ancillary selection not available")]',
      // );

      // const isNoAncillary = await noAncillaryMsg
      //   .waitForExist({ timeout: 5000 })
      //   .catch(() => false);

      // if (isNoAncillary) {
      //   log.info("anxillary not available → clicking proceed");

      //   const proceedBtn = await driver.$(
      //     '//android.widget.Button[@content-desc="Proceed"]',
      //   );

      //   await proceedBtn.waitForExist({ timeout: 5000 });
      //   await proceedBtn.waitForDisplayed({ timeout: 5000 });

      //   await proceedBtn.click();

      //   log.info("proceeded without anxillary selection");

      //   return; // ✅ IMPORTANT
      // }

      const noAncillaryMsg = await driver.$(
        '//android.view.View[contains(@content-desc, "not available")]',
      );
      const isNoAncillary = await noAncillaryMsg.isExisting();
      if (!isNoAncillary) {
        const src = await driver.getPageSource();
        log.debug(`noAncillaryMsg not found (ancillaries likely available). Page source:\n${src}`);
      }
      
      if (isNoAncillary) {
        log.info("ancillary not available → clicking proceed");
        const proceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );
        await proceedBtn.waitForExist({ timeout: 5000 });
        await proceedBtn.waitForDisplayed({ timeout: 5000 });
        await proceedBtn.click();
        log.info("proceeded without anxillary selection");
        return; 
      }

      // ============================
      // SEAT SELECTION
      // ============================
      log.info("finding available seats by seat number pattern");

      const chooseSeat = await driver.$(
        '//android.view.View[contains(translate(@content-desc, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "choose seat")]',
      );
      const seatExists = await chooseSeat.isExisting();
      if (!seatExists) {
        const src = await driver.getPageSource();
        log.error(`chooseSeat not found. Page source:\n${src}`);
        return; // <-- stop here instead of clicking a nonexistent element
      }
      await chooseSeat.click();
      
      // const chooseSeat = await driver.$(
      //   '//android.view.View[@content-desc="Choose seat"]',
      // );

      // await chooseSeat.waitForExist({ timeout: 20000 });
      // await chooseSeat.click();

      const chooseSeatMapPage = await driver.$(
        '//android.view.View[@content-desc="Choose Seat Map"]',
      );

      await chooseSeatMapPage.waitForExist({ timeout: 20000 });

      await driver.pause(2000);

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
            }
          } catch (err) {
            log.info(`error selecting seat ${seatNumber}`);
          }
        }
      }

      if (!found) {
        log.debug("no available seats found");
      }

      await driver.pause(2000);

      // CLOSE SEAT MAP
      const doneButtons = await driver.$$(
        '//android.widget.Button[@content-desc="Done"]',
      );

      for (const btn of doneButtons) {
        if (await btn.isDisplayed()) {
          await btn.click();
          await driver.pause(500);
        }
      }

      // ============================
      // MEAL SELECTION
      // ============================
      try {
        log.info("checking for meal selection");

        const chooseMeals = await driver.$(
          '//android.view.View[@content-desc="Choose meal"]',
        );

        const mealExists = await chooseMeals
          .waitForExist({ timeout: 3000 })
          .catch(() => false);

        if (mealExists) {
          await chooseMeals.click();

          const mealsSelection = await driver.$(
            '//android.widget.RadioButton[contains(@content-desc,"No Meal")]',
          );

          await mealsSelection.waitForExist({ timeout: 5000 });
          await mealsSelection.click();

          const chooseMealBtn = await driver.$(
            '//android.widget.Button[@content-desc="Choose Meal"]',
          );

          if (await chooseMealBtn.isExisting()) {
            await chooseMealBtn.click();
          }

          log.info("meal selected");
        }
      } catch (e) {
        log.warn("meal selection skipped");
      }

      // ============================
      // FINAL PROCEED
      // ============================
      // const proceedBtn = await driver.$(
      //   '//android.widget.Button[@content-desc="Proceed"]',
      // );

      // const finalProceedExists = await proceedBtn
      //   .waitForExist({ timeout: 5000 })
      //   .catch(() => false);

      // if (finalProceedExists) {
      //   await proceedBtn.click();
      //   log.info("proceeded to traveller details screen");
      // } else {
      //   log.debug("proceed button not found at end");
      // }
      log.info("entering into proceed button ");
      await driver.pause(2000);
      const proceedBtn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedBtn.waitForDisplayed({ timeout: 3000 });
      await proceedBtn.click();
      log.info(" proceeded to traveller details screen");
    } catch (e) {
      log.warn("ancillary flow skipped due to error:", e);
    }
  }

  async flightRequestSearchRoundTrip() {
    const driver = this.driver;
    log.info(" searching flights...");
    await driver.pause(5000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 8000 })
        .catch(() => false);
      if (isPopupVisible) {
        log.debug("travel policy deviation popup found");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 8000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        log.info("travel policy deviation popup yes button clicked");
      } else {
        log.debug("travel policy deviation popup not found ...");
      }
    } catch (e) {
      log.debug("travel policy deviation popup not found ...");
    }

    await driver.pause(2000);
    const searchResults = await driver.$(
      '//android.view.View[@content-desc="Great things take time! Searching the best flights for your needs"]',
    );
    const isLoading = await searchResults.isExisting();
    if (isLoading) {
      log.debug("loading message found, waiting for flights to load...");
      await driver.pause(2000);
    } else {
      log.debug("loading message not found, continuing...");
    }

    try {
      log.info(" waiting before loading flight cards...");
      await driver.pause(2000);
      log.info("onward flight selection screen loading...");

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
        throw new Error("onward flight selection not found");
      }

      log.debug("onward flight selection screen found ");

      const onwardFlightText = await driver.$(
        '//android.widget.ImageView[contains(@content-desc, "don\'t find what you are looking for")]',
      );
      const isOnwardFlightTextVisible = await onwardFlightText.isExisting();

      if (isOnwardFlightTextVisible) {
        const { width, height } = await driver.getWindowSize();
        await driver.execute("mobile: swipeGesture", {
          left: width / 2,
          top: height * 0.85,
          width: width * 0.5,
          height: height * 0.3,
          direction: "down",
          percent: 0.85,
        });
      }

      const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
      log.debug("first flight card found");
      await firstFlightCard.waitForExist({ timeout: 6000 });
      log.debug(" first flight card found  waiting for show fares option");
      const showFaresOption = await driver.$(
        `-android uiautomator:new UiSelector().descriptionContains("Show").instance(0)`,
      );
      await showFaresOption.waitForDisplayed({ timeout: 5000 });

      await showFaresOption.waitForExist({ timeout: 2000 });
      await showFaresOption.click();
      log.info(" show fare  option clicked ");

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
      const chooseButtonSelector =
        '-android uiautomator:new UiSelector().descriptionContains("Choose").instance(0)';

      let chooseClicked = false;

      for (let i = 0; i < 4; i++) {
        const chooseButton = await driver.$(chooseButtonSelector);

        if (await chooseButton.isDisplayed()) {
          await chooseButton.click();
          log.info(" onward flight chosen button clicked ");
          chooseClicked = true;
          break;
        }

        log.info(`🔽 choose not visible, scrolling more (${i + 1})`);

        const { width, height } = await driver.getWindowSize();
        const startX = Math.floor(width / 2);
        const startY = Math.floor(height * 0.8);
        const endY = Math.floor(height * 0.55);

        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              { type: "pointerMove", duration: 0, x: startX, y: startY },
              { type: "pointerDown", button: 0 },
              { type: "pointerMove", duration: 500, x: startX, y: endY },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);

        await driver.releaseActions();
        await driver.pause(1000);
      }

      if (!chooseClicked) {
        throw new Error("❌ choose button not found after scrolling");
      }

      log.info(" onward flight chosen button clicked ");
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

    log.info("Return flight selection screen loading...");
    try {
      await driver.pause(2000);
      const ReturnTab = await driver.$(
        '//android.view.View[contains(@content-desc, "Return")]',
      );

      await ReturnTab.waitForExist({ timeout: 5000 });
      await ReturnTab.waitForDisplayed({ timeout: 5000 });
      await ReturnTab.waitForEnabled({ timeout: 5000 });
      log.debug("Return tab found, clicking...............................");
    } catch (e) {
      throw new Error("roundtrip: Return tab not found — test failed");
    }
    log.info("Return flight selection screen loaded");
    await driver.pause(2000);
    log.info(
      "Return flight selection screen loaded, waiting for first flight card",
    );
    try {
      const firstReturnFlightCard = await driver.$(
        "(//android.widget.ImageView[@content-desc])[1]",
      );
      await firstReturnFlightCard.waitForExist({ timeout: 2000 });
      log.debug("first flight card found in Return selection screen");
      const ReturnShowFaresOption = await driver.$(
        '//android.view.View[contains(@content-desc, "Show") and contains(@content-desc, "fares")]',
      );
      log.debug("Return show fares option found");

      await ReturnShowFaresOption.waitForExist({ timeout: 2000 });
      await ReturnShowFaresOption.click();
      log.info(" show fare  option clicked");
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

      const ReturnChooseButton = await driver.$(
        '//android.widget.Button[@content-desc="Choose"]',
      );
      await ReturnChooseButton.waitForExist({ timeout: 15000 });
      await ReturnChooseButton.click();
      log.info(" Return  flight chosen button clicked ");
    } catch (err) {
      log.error("error during Return flight selection :", err);
      throw err;
    }
    log.info("proceed button for Return and online flight after selection");
    const proceedButtonAfterFlightSelection = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await proceedButtonAfterFlightSelection.waitForExist({ timeout: 2000 });
    log.debug(
      "proceed button found after flight selection  is going to be clickefd ",
    );
    await proceedButtonAfterFlightSelection.click();

    await driver.pause(2000);
    // try {
    //   const chooseAnxillaryScreenOfRoundTrip = await driver.$(
    //     '//android.view.View[@content-desc="Choose Ancillaries"]',
    //   );
    //   const exists = await chooseAnxillaryScreenOfRoundTrip.isExisting();
    //   if (exists) {
    //     log.debug("choose anxillary screen of round trip found");
    //     await chooseAnxillaryScreenOfRoundTrip.waitForExist({
    //       timeout: 8000,
    //     });
    //   } else {
    //     log.warn("choose ancillaries screen not found, continuing...");
    //   }
    // } catch (e) {
    //   log.warn("choose ancillaries screen not found, continuing...");
    //   const pageSource = await driver.getPageSource();
    //   log.info("page source after proceed (exception):", pageSource);
    // }
    // await driver.pause(2000);

    // const summaryProceedBtn = await driver.$(
    //   '//android.widget.Button[@content-desc="Proceed"]',
    // );
    // if (await summaryProceedBtn.isExisting()) {
    //   log.debug("summary proceed button found, clicking to continue...");
    //   await summaryProceedBtn.click();
    //   await driver.pause(2000);

    //   const chooseAncillariesScreen = await driver.$(
    //     '//android.view.View[@content-desc="Choose Ancillaries"]',
    //   );
    //   if (await chooseAncillariesScreen.isExisting()) {
    //     log.info("choose ancillaries screen loaded");

    //     log.info("finding available seats by seat number pattern");

    //     const chooseSeat = await driver.$(
    //       '//android.view.View[@content-desc="Choose Seat"]',
    //     );
    //     await chooseSeat.waitForExist({ timeout: 20000 });
    //     log.debug("choose seat button found, going to be clicked");
    //     await chooseSeat.click();
    //     log.info("choose seat clicked");

    //     const chooseSeatMapPage = await driver.$(
    //       '//android.view.View[@content-desc="Choose Seat Map"]',
    //     );
    //     await chooseSeatMapPage.waitForExist({ timeout: 20000 });
    //     log.debug("choose seat page found");
    //     await driver.pause(2000);

    //     log.info("finding available seats by seat number pattern");
    //     const seatElements = await driver.$$(
    //       "//android.view.View[@content-desc]",
    //     );
    //     let found = false;
    //     for (const seat of seatElements) {
    //       const seatNumber = await seat.getAttribute("content-desc");
    //       if (/^[1-9][A-F]$/.test(seatNumber)) {
    //         try {
    //           log.info(`trying seat: ${seatNumber}`);
    //           await seat.click();
    //           const seatDetailsPopup = await driver.$(
    //             '//android.view.View[starts-with(@content-desc, "Seat Details")]',
    //           );
    //           const popupAppeared = await seatDetailsPopup
    //             .waitForExist({ timeout: 2000 })
    //             .catch(() => false);
    //           if (popupAppeared) {
    //             const doneButton = await driver.$(
    //               '//android.widget.Button[@content-desc="Done"]',
    //             );
    //             await doneButton.waitForExist({ timeout: 3000 });
    //             await doneButton.click();
    //             found = true;
    //             log.info(`selected seat: ${seatNumber}`);
    //             break;
    //           } else {
    //             log.info(`seat ${seatNumber} not available (no popup).`);
    //             continue;
    //           }
    //         } catch (err) {
    //           log.error(`error selecting the seat ${seatNumber}:`, err);
    //           continue;
    //         }
    //       }
    //     }
    //     if (!found) {
    //       log.debug("no available seats found by seat number.");
    //     }
    //     await driver.pause(2000);
    //     const doneButtonSelector =
    //       '//android.widget.Button[@content-desc="Done"]';
    //     const doneButton = await driver.$(doneButtonSelector);
    //     if (await doneButton.isExisting()) {
    //       await doneButton.click();
    //       await driver.pause(500);
    //       if (await doneButton.isExisting()) {
    //         await doneButton.click();
    //         await driver.pause(500);
    //       }
    //     } else {
    //       log.debug(
    //         '"done" button not present after seat selection, continuing...',
    //       );
    //     }
    //     await driver.pause(1000);

    //     try {
    //       const chooseMeals = await driver.$("~choose meal");
    //       if (await chooseMeals.isExisting()) {
    //         await chooseMeals.waitForExist({ timeout: 5000 });
    //         await chooseMeals.click();
    //         await driver.pause(1000);
    //         const mealsSelection = await driver.$(
    //           '//android.widget.RadioButton[contains(@content-desc, "No Meal")]',
    //         );

    //         await mealsSelection.waitForExist({ timeout: 5000 });
    //         await mealsSelection.click();

    //         const mealsSelectionBackButton = await driver.$(
    //           "android.widget.Button",
    //         );
    //         await mealsSelectionBackButton.waitForExist({ timeout: 3000 });
    //         await mealsSelectionBackButton.click();
    //         log.info("meal selected and exited");
    //       }
    //     } catch (e) {
    //       log.warn("meal selection skipped or not available");
    //     }
    //     await driver.pause(2000);
    //     const ancillariesProceedBtn = await driver.$(
    //       '//android.widget.Button[@content-desc="Proceed"]',
    //     );
    //     if (await ancillariesProceedBtn.isExisting()) {
    //       log.debug(
    //         "proceed button on choose ancillaries found, clicking...",
    //       );
    //       await ancillariesProceedBtn.click();
    //       await driver.pause(2000);
    //     }
    //   } else {
    //     log.debug("choose ancillaries screen not found, continuing...");
    //   }
    // }

    try {
      await driver.pause(1000);

      // CLICK SUMMARY PROCEED BUTTON
      const summaryProceedBtn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );

      if (await summaryProceedBtn.isExisting()) {
        log.debug("summary proceed button found, clicking...");
        await summaryProceedBtn.click();
        await driver.pause(2000);
      }

      // CHECK IF ANCILLARY SCREEN EXISTS
      const chooseAncillariesScreen = await driver.$(
        '//android.view.View[@content-desc="Choose Ancillaries"]',
      );

      const ancillaryScreenExists = await chooseAncillariesScreen
        .waitForExist({ timeout: 8000 })
        .catch(() => false);

      if (!ancillaryScreenExists) {
        log.debug("choose ancillaries screen not found, continuing...");
        return;
      }

      log.info("choose ancillaries screen loaded");

      // CHECK ANCILLARY NOT AVAILABLE MESSAGE
      const noAncillaryMsg = await driver.$(
        '//android.view.View[@content-desc="Ancillary selection not available for the\nselected flights"]',
      );
      if (await noAncillaryMsg.isExisting()) {
        log.info(
          "Ancillary selection not available for the selected flights",
        );

        const proceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );

        if (await proceedBtn.isExisting()) {
          await proceedBtn.click();
          log.info("proceeded without ancillary selection");
        }

        return;
      }

      // ============================
      // SEAT SELECTION
      // ============================

      log.info("finding available seats");

      const chooseSeat = await driver.$(
        '//android.view.View[@content-desc="Choose seat"]',
      );

      await chooseSeat.waitForExist({ timeout: 20000 });
      log.debug("choose seat button found");
      await chooseSeat.click();

      const chooseSeatMapPage = await driver.$(
        '//android.view.View[@content-desc="Choose Seat Map"]',
      );

      await chooseSeatMapPage.waitForExist({ timeout: 20000 });
      log.info("seat map page loaded");

      await driver.pause(2000);

      const seatElements = await driver.$$(
        "//android.view.View[@content-desc]",
      );

      let seatFound = false;

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

              seatFound = true;
              log.info(`selected seat: ${seatNumber}`);
              break;
            } else {
              log.info(`seat ${seatNumber} not available`);
            }
          } catch (err) {
            log.info(`error selecting seat ${seatNumber}`);
          }
        }
      }

      if (!seatFound) {
        log.debug("no available seats found");
      }

      await driver.pause(2000);

      // CLOSE SEAT MAP IF DONE BUTTON EXISTS
      const doneButton = await driver.$(
        '//android.widget.Button[@content-desc="Done"]',
      );

      if (await doneButton.isExisting()) {
        await doneButton.click();
        await driver.pause(500);

        if (await doneButton.isExisting()) {
          await doneButton.click();
        }
      }

      try {
        log.info("checking for meal selection");

        const chooseMeals = await driver.$(
          '//android.view.View[@content-desc="Choose meal"]',
        );

        if (await chooseMeals.isExisting()) {
          await chooseMeals.click();
          await driver.pause(1000);

          const mealsSelection = await driver.$(
            '//android.widget.RadioButton[contains(@content-desc,"No Meal")]',
          );

          await mealsSelection.waitForExist({ timeout: 5000 });
          await mealsSelection.click();

          log.info("meal selected");

          const chooseMealButton = await driver.$(
            '//android.widget.Button[@content-desc="Choose meal"]',
          );

          if (await chooseMealButton.isExisting()) {
            await chooseMealButton.click();
          }

          log.info("meal confirmed");
        }
      } catch (e) {
        log.warn("meal selection skipped or not available");
      }

      await driver.pause(2000);

      const ancillariesProceedBtn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );

      if (await ancillariesProceedBtn.isExisting()) {
        log.info("clicking final proceed button");
        await ancillariesProceedBtn.click();
      }
    } catch (e) {
      log.warn("ancillary handling skipped due to error:", e);
    }

    await driver.pause(2000);
  }
  async flightRequestSearchMulticity() {
    const driver = this.driver;
    log.info(" searching flights...");
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
        log.debug("travel policy deviation popup not found ...");
      }
    } catch (e) {
      log.debug("travel policy deviation popup not found ...");
    }

    // try {
    //   log.info(" waiting before loading flight cards...");
    //   await driver.pause(2000);

    //   const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
    //   await firstFlightCard.waitForExist({ timeout: 60000 });
    //   log.debug("first flight card found for first leg");

    //   await firstFlightCard.click();
    //   log.info(" first flight card clicked");
    //   log.debug(" first flight card found");
    //   await driver.pause(4000);
    //   log.debug(
    //     "               1111111111111111111111111111111111111111111111111first flight card found for first leg, waiting for show fares option",
    //   );
    //   const showFaresOption = await driver.$(
    //     '//*[contains(@content-desc,"show") or contains(@text,"show")]',
    //   );
    //   // await driver.$(
    //   //   '-android uiautomator:new uiselector().descriptioncontains("show").instance(0)'
    //   // );
    //   await showFaresOption.waitForExist({ timeout: 20000 });
    //   console.log(
    //     " 2222222222222222222222222222222222222222222222222222222show fare  option found for first leg, waiting to be clicked",
    //   );
    //   await showFaresOption.click();
    //   console.log(
    //     " 33333333333333333333333333333333333333333333333333333show fare  option clicked for first leg, waiting for choose button",
    //   );
    //   const chooseButton = await driver.$(
    //     '-android uiautomator:new uiselector().descriptioncontains("choose").instance(0)',
    //   );
    //   await chooseButton.waitForExist({ timeout: 20000 });
    //   await chooseButton.click();
    //   console.log(" flight chosen");
    // } catch (err: any) {
    //   console.error(" error during flight selection:", err.message || err);
    //   throw err;
    // }

    try {
      log.debug("waiting before loading flight cards...");
      await driver.pause(3000);

      // Wait for first flight card with probe loop
      let firstFlightCard: WebdriverIO.Element | undefined;
      for (let i = 0; i < 120; i++) {
        const cards = await driver.$$("(//android.widget.ImageView)[1]");
        if (cards.length > 0) {
          firstFlightCard = cards[0];
          break;
        }
        log.debug(`⏳ waiting for first flight card... attempt ${i + 1}`);
        await driver.pause(1000);
      }
      if (!firstFlightCard) throw new Error("❌ first flight card not found after 30s");
      log.debug("first flight card found for first leg");

      // Probe for Show Fares with scroll
      const showFaresSelector = '//*[contains(@content-desc, "Show") and contains(@content-desc, "fare")]';
      let showFaresFound = false;
      for (let i = 0; i < 8; i++) {
        const els = await driver.$$(showFaresSelector);
        if (els.length > 0) {
          log.debug("✅ show fares option found");
          await els[0].click();
          log.info("✅ show fares option clicked");
          showFaresFound = true;
          break;
        }
        log.debug(`🔽 show fares not visible, scrolling... attempt ${i + 1}`);
        const { width, height } = await driver.getWindowSize();
        await driver.performActions([{
          type: "pointer", id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: Math.floor(width / 2), y: Math.floor(height * 0.8) },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 600, x: Math.floor(width / 2), y: Math.floor(height * 0.3) },
            { type: "pointerUp", button: 0 },
          ],
        }]);
        await driver.releaseActions();
        await driver.pause(1000);
      }
      if (!showFaresFound) throw new Error("❌ show fares button not found after scrolling");

      // Wait for fares panel to expand, then probe for Choose
      await driver.pause(2000);
      const chooseSelector = '//*[contains(@content-desc, "Choose") and not(contains(@content-desc, "Choose departure"))]';
      let chooseClicked = false;
      for (let i = 0; i < 6; i++) {
        const els = await driver.$$(chooseSelector);
        if (els.length > 0) {
          await els[0].click();
          log.info("✅ flight chosen (first leg)");
          chooseClicked = true;
          break;
        }
        log.debug(`🔽 choose not visible, scrolling... attempt ${i + 1}`);
        const { width, height } = await driver.getWindowSize();
        await driver.performActions([{
          type: "pointer", id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: Math.floor(width / 2), y: Math.floor(height * 0.8) },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 500, x: Math.floor(width / 2), y: Math.floor(height * 0.5) },
            { type: "pointerUp", button: 0 },
          ],
        }]);
        await driver.releaseActions();
        await driver.pause(1000);
      }
      if (!chooseClicked) throw new Error("❌ choose button not found after scrolling");

    } catch (err: any) {
      log.error("error during flight selection:", err.message || err);
      throw err;
    }
    try {
      log.debug("waiting before loading second flight cards...");
      await driver.pause(6000);

      // Switch to Tab 2
      const ReturnTabEls = await driver.$$(`android=new UiSelector().descriptionContains("Tab 2 of 2")`);
      if (ReturnTabEls.length > 0) {
        await ReturnTabEls[0].click();
        log.info("✅ switched to tab 2 (second leg)");
      } else {
        log.warn("⚠️ tab 2 not found, may already be on second leg");
      }

      // Wait for first card
      let secondFlightCard: WebdriverIO.Element | undefined;
      for (let i = 0; i < 120; i++) {
        const cards = await driver.$$("(//android.widget.ImageView)[1]");
        if (cards.length > 0) { secondFlightCard = cards[0]; break; }
        log.debug(`⏳ waiting for second leg flight card... attempt ${i + 1}`);
        await driver.pause(1000);
      }
      if (!secondFlightCard) throw new Error("❌ second leg flight card not found");
      log.debug("✅ first card found for second leg");

      // Probe Show Fares with scroll
      const showFaresSelector2 = '//*[contains(@content-desc, "Show") and contains(@content-desc, "fare")]';
      let showFaresFound2 = false;
      for (let i = 0; i < 8; i++) {
        const els = await driver.$$(showFaresSelector2);
        if (els.length > 0) {
          await els[0].click();
          log.info("✅ second leg show fares clicked");
          showFaresFound2 = true;
          break;
        }
        log.debug(`🔽 second leg show fares not visible, scrolling... attempt ${i + 1}`);
        const { width, height } = await driver.getWindowSize();
        await driver.performActions([{
          type: "pointer", id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: Math.floor(width / 2), y: Math.floor(height * 0.8) },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 600, x: Math.floor(width / 2), y: Math.floor(height * 0.3) },
            { type: "pointerUp", button: 0 },
          ],
        }]);
        await driver.releaseActions();
        await driver.pause(1000);
      }
      if (!showFaresFound2) throw new Error("❌ second leg show fares not found after scrolling");

      await driver.pause(2000);
      const chooseSelector2 = '//*[contains(@content-desc, "Choose") and not(contains(@content-desc, "Choose Departure"))]';
      let chooseClicked2 = false;
      for (let i = 0; i < 6; i++) {
        const els = await driver.$$(chooseSelector2);
        if (els.length > 0) {
          await els[0].click();
          log.info("✅ second leg flight chosen");
          chooseClicked2 = true;
          break;
        }
        log.debug(`🔽 second leg choose not visible, scrolling... attempt ${i + 1}`);
        const { width, height } = await driver.getWindowSize();
        await driver.performActions([{
          type: "pointer", id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: Math.floor(width / 2), y: Math.floor(height * 0.8) },
            { type: "pointerDown", button: 0 },
            { type: "pointerMove", duration: 500, x: Math.floor(width / 2), y: Math.floor(height * 0.5) },
            { type: "pointerUp", button: 0 },
          ],
        }]);
        await driver.releaseActions();
        await driver.pause(1000);
      }
      if (!chooseClicked2) throw new Error("❌ second leg choose button not found after scrolling");

    } catch (err: any) {
      log.error("error during second leg flight selection:", err.message || err);
      throw err;
    }

    await driver.pause(2000);
    log.debug("waiting for the Return flight to be selected");
    await driver.pause(5000);
    log.debug("waiting for the ancillary selection screen to be loaded  ");

    const proceedBtnForChooseAncillarySelection = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );

    log.info("proceed button for choose ancillary");

    await proceedBtnForChooseAncillarySelection.scrollIntoView();
    await proceedBtnForChooseAncillarySelection.click();
    log.info("proceed button for choose ancillary selection clicked");
    await proceedBtnForChooseAncillarySelection.scrollIntoView();
    await proceedBtnForChooseAncillarySelection.click();
    log.info("proceed button for choose ancillary selection clicked");

    const chooseAncillaryScreen = await driver.$(
      '//android.view.View[@content-desc="Choose Ancillaries"]',
    );
    await chooseAncillaryScreen.waitForExist({ timeout: 10000 });
    log.info("choose ancillary screen present");
    if (await chooseAncillaryScreen.isExisting()) {
      log.info("choose ancillaries screen loaded");

      log.info("finding available seats by seat number pattern");

      const chooseSeat = await driver.$(
        '//android.view.View[@content-desc="Choose seat"]',
      );
      await chooseSeat.waitForExist({ timeout: 20000 });
      log.debug("choose seat button found, going to be clicked");
      await chooseSeat.click();
      log.info("choose seat clicked");

      const chooseSeatMapPage = await driver.$(
        '//android.view.View[@content-desc="Choose Seat Map"]',
      );
      await chooseSeatMapPage.waitForExist({ timeout: 20000 });
      log.debug("choose seat page found");
      await driver.pause(2000);

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
              log.info(`seat ${seatNumber} not available (no popup).`);
              continue;
            }
          } catch (err) {
            log.error(`error selecting the seat ${seatNumber}:`, err);
            continue;
          }
        }
      }
      if (!found) {
        log.debug("no available seats found by seat number.");
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
      const chooseMealsBtn = await driver.$(
        '(//android.view.View[@content-desc="Choose meal"])[1]',
      );
      await chooseMealsBtn.waitForExist({ timeout: 7000 });
      await chooseMealsBtn.click();
      log.info("choose meal onward clicked");

      const mealOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("No Meal")',
      );
      await mealOption.waitForExist({ timeout: 4000 });
      await mealOption.click();
      log.info("meal option selected");

      const chooseMealPopupBtn = await driver.$(
        '//android.widget.Button[@content-desc="Choose meal"]',
      );
      await chooseMealPopupBtn.waitForExist({ timeout: 6000 });
      await chooseMealPopupBtn.click();
      log.info("choose meal popup button clicked");

      const proceedBtn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedBtn.waitForExist({ timeout: 10000 });
      await proceedBtn.click();
      log.info("proceed button on choose ancillary screen clicked");

      const createTravelRequestScreen = await driver.$(
        '//android.view.View[@content-desc="Create Travel Request"]',
      );
      await createTravelRequestScreen.waitForExist({ timeout: 20000 });
      log.info("create travel request screen loaded");

      await driver.pause(2000);

      log.debug("travel request screen found");
    }
  }
}
