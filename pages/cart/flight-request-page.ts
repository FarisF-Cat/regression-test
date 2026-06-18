export class FlightRequestSearchPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async flightRequestSearchOneWay() {
    const driver = this.driver;
    console.log(" Searching flights...");
    await driver.pause(2000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        console.log("TRAVEL POLICY DEVIATION POPUP FOUND");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
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
    try {
      const searchResults = await driver.$(
        '//android.view.View[@content-desc="Great things take time! Searching the best flights for your needs"]',
      );
      const isVisible = await searchResults.waitForExist({
        timeout: 10000,
      });
      if (isVisible) {
        console.log("✅ Search in progress message appeared.");
      } else {
        console.log("⚠️ Search progress message not visible.");
      }
    } catch (err) {
      console.log("⚠️ Search progress message not found within timeout.");
    }
    try {
      console.log(" Waiting before loading flight cards...");
      await driver.pause(6000);

      const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
      await firstFlightCard.waitForExist({ timeout: 50000 });
      console.log(" First flight card found");
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
      console.log(" Flight chosen");
    } catch (err: any) {
      console.error(" Error during flight selection:", err.message || err);
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
    //     console.log(
    //       "ANXILLARY SELECTION NOT AVAILABLE FOR THE SELECTED FLIGHTS",
    //     );
    //     const proceedBtn = await driver.$(
    //       '//android.widget.Button[@content-desc="Proceed"]',
    //     );
    //     if (await proceedBtn.isExisting()) {
    //       await proceedBtn.click();
    //       console.log("PROCEEDED WITHOUT ANXILLARY SELECTION");
    //     }
    //     return;
    //   }

    //   console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");

    //   const chooseSeat = await driver.$(
    //     '//android.view.View[@content-desc="Choose seat"]',
    //   );
    //   await chooseSeat.waitForExist({ timeout: 20000 });
    //   console.log("CHOOSE SEAT Button Found, GOING TO BE CLICKED");
    //   await chooseSeat.click();
    //   console.log("CHOOSE SEAT CLICKED");

    //   const chooseSeatMapPage = await driver.$(
    //     '//android.view.View[@content-desc="Choose Seat Map"]',
    //   );
    //   await chooseSeatMapPage.waitForExist({ timeout: 20000 });
    //   console.log("CHOOSE SEAT PAGE FOUND");
    //   await driver.pause(2000);
    //   console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");
    //   const seatElements = await driver.$$(
    //     "//android.view.View[@content-desc]",
    //   );
    //   let found = false;
    //   for (const seat of seatElements) {
    //     const seatNumber = await seat.getAttribute("content-desc");
    //     if (/^[1-9][A-F]$/.test(seatNumber)) {
    //       try {
    //         console.log(`TRYING SEAT: ${seatNumber}`);
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
    //           console.log(`SELECTED SEAT: ${seatNumber}`);
    //           break;
    //         } else {
    //           console.log(`Seat ${seatNumber} not available (no popup).`);
    //           continue;
    //         }
    //       } catch (err) {
    //         console.error(`ERROR SELECTING THE SEAT ${seatNumber}:`, err);
    //         continue;
    //       }
    //     }
    //   }
    //   if (!found) {
    //     console.log("NO AVAILABLE SEATS FOUND BY SEAT NUMBER.");
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
    //   const chooseAnxillaryScreenAgain = await driver.$("~Choose Ancillaries");
    //   await chooseAnxillaryScreenAgain.waitForExist({ timeout: 20000 });
    //   await driver.pause(1000);
    //   console.log("CHOOSE ANXILLARY SCREEN LOADED AGAIN");
    //   const chooseMeals = await driver.$(
    //     '//android.view.View[@content-desc="Choose meal"]',
    //   );

    //   await chooseMeals.waitForExist({ timeout: 2000 });
    //   await chooseMeals.click();
    //   await driver.pause(1000);
    //   const chooseMealsPopUp = await driver.$(
    //     'android=new UiSelector().descriptionContains("Choose meal")',
    //   );

    //   await chooseMealsPopUp.waitForExist({ timeout: 2000 });
    //   await chooseMealsPopUp.click();

    //   await driver.pause(2000);

    //   const allRadioButtons = await driver.$$("//android.widget.RadioButton");
    //   for (const rb of allRadioButtons) {
    //     const desc = await rb.getAttribute("content-desc");
    //     console.log(
    //       "Found android.widget.RadioButton with content-desc:",
    //       desc,
    //     );
    //   }
    //   console.log("MEAL SELECTION SCREEN LOADED");

    //   const mealsSelection = await driver.$(
    //     '//android.widget.RadioButton[contains(@content-desc, "No Meal")]',
    //   );

    //   await mealsSelection.waitForExist({ timeout: 5000 });
    //   await mealsSelection.click();

    //   console.log(" MEAL SELECTED ");
    //   await driver.pause(2000);
    //   const mealsSelectionChooseMealButton = await driver.$(
    //     '//android.widget.Button[@content-desc="Choose Meal"]',
    //   );

    //   await mealsSelectionChooseMealButton.waitForExist({ timeout: 5000 });
    //   await mealsSelectionChooseMealButton.click();
    //   console.log(" MEAL SELECTED  BUTTON CLICKED");
    // } catch (e) {
    //   console.warn(" Meal selection skipped");
    // }

    try {
      await driver.pause(1000);

      // ============================
      // CHECK ANCILLARY SCREEN
      // ============================
      const chooseAnxillaryScreen = await driver.$("~Choose Ancillaries");

      const screenExists = await chooseAnxillaryScreen
        .waitForExist({ timeout: 8000 })
        .catch(() => false);

      if (!screenExists) {
        console.log("No ancillary screen → trying to proceed");

        const proceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );

        const proceedExists = await proceedBtn
          .waitForExist({ timeout: 5000 })
          .catch(() => false);

        if (proceedExists) {
          await proceedBtn.click();
          console.log("PROCEEDED WITHOUT ANCILLARY SCREEN");
        }

        return;
      }

      console.log("CHOOSE ANCILLARY SCREEN LOADED");

      // ============================
      // CHECK "NO ANCILLARY" MESSAGE
      // ============================
      const noAncillaryMsg = await driver.$(
        '//android.view.View[contains(@content-desc,"Ancillary selection not available")]',
      );

      const isNoAncillary = await noAncillaryMsg
        .waitForExist({ timeout: 5000 })
        .catch(() => false);

      if (isNoAncillary) {
        console.log("ANXILLARY NOT AVAILABLE → CLICKING PROCEED");

        const proceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );

        await proceedBtn.waitForExist({ timeout: 5000 });
        await proceedBtn.waitForDisplayed({ timeout: 5000 });

        await proceedBtn.click();

        console.log("PROCEEDED WITHOUT ANXILLARY SELECTION");

        return; // ✅ IMPORTANT
      }

      // ============================
      // SEAT SELECTION
      // ============================
      console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");

      const chooseSeat = await driver.$(
        '//android.view.View[@content-desc="Choose seat"]',
      );

      await chooseSeat.waitForExist({ timeout: 20000 });
      await chooseSeat.click();

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
            console.log(`TRYING SEAT: ${seatNumber}`);
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
              console.log(`SELECTED SEAT: ${seatNumber}`);
              break;
            }
          } catch (err) {
            console.log(`Error selecting seat ${seatNumber}`);
          }
        }
      }

      if (!found) {
        console.log("NO AVAILABLE SEATS FOUND");
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
        console.log("CHECKING FOR MEAL SELECTION");

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

          console.log("MEAL SELECTED");
        }
      } catch (e) {
        console.warn("Meal selection skipped");
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
      //   console.log("PROCEEDED TO TRAVELLER DETAILS SCREEN");
      // } else {
      //   console.log("Proceed button not found at end");
      // }
      console.log("ENTERING INTO PROCEED BUTTON ");
      await driver.pause(2000);
      const proceedBtn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedBtn.waitForDisplayed({ timeout: 3000 });
      await proceedBtn.click();
      console.log(" Proceeded to Traveller Details screen");
    } catch (e) {
      console.warn("Ancillary flow skipped due to error:", e);
    }
  }

  async flightRequestSearchRoundTrip() {
    const driver = this.driver;
    console.log(" Searching flights...");
    await driver.pause(5000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 8000 })
        .catch(() => false);
      if (isPopupVisible) {
        console.log("TRAVEL POLICY DEVIATION POPUP FOUND");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 8000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        console.log("TRAVEL POLICY DEVIATION POPUP YES BUTTON CLICKED");
      } else {
        console.log("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
      }
    } catch (e) {
      console.log("TRAVEL POLICY DEVIATION POPUP NOT FOUND ...");
    }

    await driver.pause(2000);
    const searchResults = await driver.$(
      '//android.view.View[@content-desc="Great things take time! Searching the best flights for your needs"]',
    );
    const isLoading = await searchResults.isExisting();
    if (isLoading) {
      console.log("Loading message found, waiting for flights to load...");
      await driver.pause(2000);
    } else {
      console.log("Loading message not found, continuing...");
    }

    try {
      console.log(" Waiting before loading flight cards...");
      await driver.pause(2000);
      console.log("ONWARD FLIGHT SELECTION SCREEN LOADING...");

      const onwardFlightSelection = await driver.$(
        '//android.view.View[@content-desc="Onward Flights"]',
      );

      try {
        await onwardFlightSelection.waitForExist({ timeout: 30000 });
      } catch (e) {
        const pageSource = await driver.getPageSource();
        console.error(
          "ONWARD FLIGHT SELECTION NOT FOUND. Current page source:",
        );
        console.error(pageSource);
        throw new Error("ONWARD FLIGHT SELECTION NOT FOUND");
      }

      console.log("ONWARD FLIGHT SELECTION SCREEN FOUND ");

      const onwardFlightText = await driver.$(
        '//android.widget.ImageView[contains(@content-desc, "Don\'t find what you are looking for")]',
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
      console.log("FIRST FLIGHT CARD FOUND");
      await firstFlightCard.waitForExist({ timeout: 6000 });
      console.log(" FIRST FLIGHT CARD FOUND  WAITING FOR SHOW FARES OPTION");
      const showFaresOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Show").instance(0)',
      );
      await showFaresOption.waitForDisplayed({ timeout: 5000 });

      await showFaresOption.waitForExist({ timeout: 2000 });
      await showFaresOption.click();
      console.log(" SHOW FARE  OPTION CLICKED ");

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
          console.log(" ONWARD FLIGHT CHOSEN BUTTON CLICKED ");
          chooseClicked = true;
          break;
        }

        console.log(`🔽 Choose not visible, scrolling more (${i + 1})`);

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
        throw new Error("❌ Choose button not found after scrolling");
      }

      console.log(" ONWARD FLIGHT CHOSEN BUTTON CLICKED ");
    } catch (err: any) {
      console.error(" ERROR DURING FLIGHT SELECTION:", err.message || err);
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

    console.log("RETURN FLIGHT SELECTION SCREEN LOADING...");
    try {
      await driver.pause(2000);
      const returnTab = await driver.$(
        '//android.view.View[contains(@content-desc, "Return")]',
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
      "RETURN FLIGHT SELECTION SCREEN LOADED, WAITING FOR FIRST FLIGHT CARD",
    );
    try {
      const firstReturnFlightCard = await driver.$(
        "(//android.widget.ImageView[@content-desc])[1]",
      );
      await firstReturnFlightCard.waitForExist({ timeout: 2000 });
      console.log("FIRST FLIGHT CARD FOUND IN RETURN SELECTION SCREEN");
      const returnShowFaresOption = await driver.$(
        '//android.view.View[contains(@content-desc, "Show") and contains(@content-desc, "fares")]',
      );
      console.log("RETURN SHOW FARES OPTION FOUND");

      await returnShowFaresOption.waitForExist({ timeout: 2000 });
      await returnShowFaresOption.click();
      console.log(" SHOW FARE  OPTION CLICKED");
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

      const returnChooseButton = await driver.$(
        '//android.widget.Button[@content-desc="Choose"]',
      );
      await returnChooseButton.waitForExist({ timeout: 15000 });
      await returnChooseButton.click();
      console.log(" RETURN  FLIGHT CHOSEN BUTTON CLICKED ");
    } catch (err) {
      console.error("ERROR DURING RETURN FLIGHT SELECTION :", err);
      throw err;
    }
    console.log("PROCEED BUTTON FOR RETURN AND ONLINE FLIGHT AFTER SELECTION");
    const proceedButtonAfterFlightSelection = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );
    await proceedButtonAfterFlightSelection.waitForExist({ timeout: 2000 });
    console.log(
      "PROCEED BUTTON FOUND AFTER FLIGHT SELECTION  IS GOING TO BE CLICKEFD ",
    );
    await proceedButtonAfterFlightSelection.click();

    await driver.pause(2000);
    // try {
    //   const chooseAnxillaryScreenOfRoundTrip = await driver.$(
    //     '//android.view.View[@content-desc="Choose Ancillaries"]',
    //   );
    //   const exists = await chooseAnxillaryScreenOfRoundTrip.isExisting();
    //   if (exists) {
    //     console.log("CHOOSE ANXILLARY SCREEN OF ROUND TRIP FOUND");
    //     await chooseAnxillaryScreenOfRoundTrip.waitForExist({
    //       timeout: 8000,
    //     });
    //   } else {
    //     console.warn("Choose Ancillaries screen not found, continuing...");
    //   }
    // } catch (e) {
    //   console.warn("Choose Ancillaries screen not found, continuing...");
    //   const pageSource = await driver.getPageSource();
    //   console.log("Page source after Proceed (exception):", pageSource);
    // }
    // await driver.pause(2000);

    // const summaryProceedBtn = await driver.$(
    //   '//android.widget.Button[@content-desc="Proceed"]',
    // );
    // if (await summaryProceedBtn.isExisting()) {
    //   console.log("Summary Proceed button found, clicking to continue...");
    //   await summaryProceedBtn.click();
    //   await driver.pause(2000);

    //   const chooseAncillariesScreen = await driver.$(
    //     '//android.view.View[@content-desc="Choose Ancillaries"]',
    //   );
    //   if (await chooseAncillariesScreen.isExisting()) {
    //     console.log("Choose Ancillaries screen loaded");

    //     console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");

    //     const chooseSeat = await driver.$(
    //       '//android.view.View[@content-desc="Choose seat"]',
    //     );
    //     await chooseSeat.waitForExist({ timeout: 20000 });
    //     console.log("CHOOSE SEAT Button Found, GOING TO BE CLICKED");
    //     await chooseSeat.click();
    //     console.log("CHOOSE SEAT CLICKED");

    //     const chooseSeatMapPage = await driver.$(
    //       '//android.view.View[@content-desc="Choose Seat Map"]',
    //     );
    //     await chooseSeatMapPage.waitForExist({ timeout: 20000 });
    //     console.log("CHOOSE SEAT PAGE FOUND");
    //     await driver.pause(2000);

    //     console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");
    //     const seatElements = await driver.$$(
    //       "//android.view.View[@content-desc]",
    //     );
    //     let found = false;
    //     for (const seat of seatElements) {
    //       const seatNumber = await seat.getAttribute("content-desc");
    //       if (/^[1-9][A-F]$/.test(seatNumber)) {
    //         try {
    //           console.log(`TRYING SEAT: ${seatNumber}`);
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
    //             console.log(`SELECTED SEAT: ${seatNumber}`);
    //             break;
    //           } else {
    //             console.log(`Seat ${seatNumber} not available (no popup).`);
    //             continue;
    //           }
    //         } catch (err) {
    //           console.error(`ERROR SELECTING THE SEAT ${seatNumber}:`, err);
    //           continue;
    //         }
    //       }
    //     }
    //     if (!found) {
    //       console.log("NO AVAILABLE SEATS FOUND BY SEAT NUMBER.");
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
    //       console.log(
    //         '"Done" button not present after seat selection, continuing...',
    //       );
    //     }
    //     await driver.pause(1000);

    //     try {
    //       const chooseMeals = await driver.$("~Choose meal");
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
    //         console.log("Meal selected and exited");
    //       }
    //     } catch (e) {
    //       console.warn("Meal selection skipped or not available");
    //     }
    //     await driver.pause(2000);
    //     const ancillariesProceedBtn = await driver.$(
    //       '//android.widget.Button[@content-desc="Proceed"]',
    //     );
    //     if (await ancillariesProceedBtn.isExisting()) {
    //       console.log(
    //         "Proceed button on Choose Ancillaries found, clicking...",
    //       );
    //       await ancillariesProceedBtn.click();
    //       await driver.pause(2000);
    //     }
    //   } else {
    //     console.log("Choose Ancillaries screen not found, continuing...");
    //   }
    // }

    try {
      await driver.pause(1000);

      // CLICK SUMMARY PROCEED BUTTON
      const summaryProceedBtn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );

      if (await summaryProceedBtn.isExisting()) {
        console.log("SUMMARY PROCEED BUTTON FOUND, CLICKING...");
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
        console.log("Choose Ancillaries screen not found, continuing...");
        return;
      }

      console.log("CHOOSE ANCILLARIES SCREEN LOADED");

      // CHECK ANCILLARY NOT AVAILABLE MESSAGE
      const noAncillaryMsg = await driver.$(
        '//android.view.View[@content-desc="Ancillary selection not available for the selected flights"]',
      );

      if (await noAncillaryMsg.isExisting()) {
        console.log(
          "ANCILLARY SELECTION NOT AVAILABLE FOR THE SELECTED FLIGHTS",
        );

        const proceedBtn = await driver.$(
          '//android.widget.Button[@content-desc="Proceed"]',
        );

        if (await proceedBtn.isExisting()) {
          await proceedBtn.click();
          console.log("PROCEEDED WITHOUT ANCILLARY SELECTION");
        }

        return;
      }

      // ============================
      // SEAT SELECTION
      // ============================

      console.log("FINDING AVAILABLE SEATS");

      const chooseSeat = await driver.$(
        '//android.view.View[@content-desc="Choose seat"]',
      );

      await chooseSeat.waitForExist({ timeout: 20000 });
      console.log("CHOOSE SEAT BUTTON FOUND");
      await chooseSeat.click();

      const chooseSeatMapPage = await driver.$(
        '//android.view.View[@content-desc="Choose Seat Map"]',
      );

      await chooseSeatMapPage.waitForExist({ timeout: 20000 });
      console.log("SEAT MAP PAGE LOADED");

      await driver.pause(2000);

      const seatElements = await driver.$$(
        "//android.view.View[@content-desc]",
      );

      let seatFound = false;

      for (const seat of seatElements) {
        const seatNumber = await seat.getAttribute("content-desc");

        if (/^[1-9][A-F]$/.test(seatNumber)) {
          try {
            console.log(`TRYING SEAT: ${seatNumber}`);
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
              console.log(`SELECTED SEAT: ${seatNumber}`);
              break;
            } else {
              console.log(`Seat ${seatNumber} not available`);
            }
          } catch (err) {
            console.log(`Error selecting seat ${seatNumber}`);
          }
        }
      }

      if (!seatFound) {
        console.log("NO AVAILABLE SEATS FOUND");
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
        console.log("CHECKING FOR MEAL SELECTION");

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

          console.log("MEAL SELECTED");

          const chooseMealButton = await driver.$(
            '//android.widget.Button[@content-desc="Choose Meal"]',
          );

          if (await chooseMealButton.isExisting()) {
            await chooseMealButton.click();
          }

          console.log("MEAL CONFIRMED");
        }
      } catch (e) {
        console.warn("Meal selection skipped or not available");
      }

      await driver.pause(2000);

      const ancillariesProceedBtn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );

      if (await ancillariesProceedBtn.isExisting()) {
        console.log("CLICKING FINAL PROCEED BUTTON");
        await ancillariesProceedBtn.click();
      }
    } catch (e) {
      console.warn("Ancillary handling skipped due to error:", e);
    }

    await driver.pause(2000);
  }
  async flightRequestSearchMulticity() {
    const driver = this.driver;
    console.log(" Searching flights...");
    await driver.pause(5000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        console.log("TRAVEL POLICY DEVIATION POPUP FOUND");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
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

    // try {
    //   console.log(" Waiting before loading flight cards...");
    //   await driver.pause(2000);

    //   const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
    //   await firstFlightCard.waitForExist({ timeout: 60000 });
    //   console.log("FIRST FLIGHT CARD FOUND FOR FIRST LEG");

    //   await firstFlightCard.click();
    //   console.log(" First flight card clicked");
    //   console.log(" First flight card found");
    //   await driver.pause(4000);
    //   console.log(
    //     "               1111111111111111111111111111111111111111111111111FIRST FLIGHT CARD FOUND FOR FIRST LEG, WAITING FOR SHOW FARES OPTION",
    //   );
    //   const showFaresOption = await driver.$(
    //     '//*[contains(@content-desc,"Show") or contains(@text,"Show")]',
    //   );
    //   // await driver.$(
    //   //   '-android uiautomator:new UiSelector().descriptionContains("Show").instance(0)'
    //   // );
    //   await showFaresOption.waitForExist({ timeout: 20000 });
    //   console.log(
    //     " 2222222222222222222222222222222222222222222222222222222SHOW FARE  OPTION FOUND FOR FIRST LEG, WAITING TO BE CLICKED",
    //   );
    //   await showFaresOption.click();
    //   console.log(
    //     " 33333333333333333333333333333333333333333333333333333SHOW FARE  OPTION CLICKED FOR FIRST LEG, WAITING FOR CHOOSE BUTTON",
    //   );
    //   const chooseButton = await driver.$(
    //     '-android uiautomator:new UiSelector().descriptionContains("Choose").instance(0)',
    //   );
    //   await chooseButton.waitForExist({ timeout: 20000 });
    //   await chooseButton.click();
    //   console.log(" Flight chosen");
    // } catch (err: any) {
    //   console.error(" Error during flight selection:", err.message || err);
    //   throw err;
    // }

    try {
      console.log("Waiting before loading flight cards...");
      await driver.pause(3000);

      const firstFlightCard = await driver.$("(//android.widget.ImageView)[1]");
      await firstFlightCard.waitForExist({ timeout: 60000 });

      console.log("FIRST FLIGHT CARD FOUND FOR FIRST LEG");

      // Do NOT click the card
      // await firstFlightCard.click();

      console.log("Waiting for SHOW FARES option...");

      const showFaresOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("fares")',
      );

      await showFaresOption.waitForDisplayed({ timeout: 30000 });

      console.log("SHOW FARES OPTION FOUND");

      await showFaresOption.click();

      console.log("SHOW FARES OPTION CLICKED");

      // Wait for fares list
      await driver.pause(2000);

      const chooseButton = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("Choose").instance(0)',
      );

      await chooseButton.waitForDisplayed({ timeout: 30000 });

      await chooseButton.click();

      console.log("Flight chosen");
    } catch (err: any) {
      console.error("Error during flight selection:", err.message || err);
      throw err;
    }
    try {
      console.log(" Waiting before loading SECOND FLIGHT  cards...");
      await driver.pause(6000);

      const returnTab = await driver.$(
        `android=new UiSelector().descriptionContains("Tab 2 of 2")`,
      );
      await returnTab.click();
      const firstFlightCardReturn = await driver.$(
        "(//android.widget.ImageView)[1]",
      );
      await firstFlightCardReturn.waitForExist({ timeout: 50000 });
      console.log(" First flight card found");
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
      console.log(" Flight chosen");
    } catch (err: any) {
      console.error(" Error during flight selection:", err.message || err);
      throw err;
    }

    await driver.pause(2000);
    console.log("WAITING FOR THE RETURN FLIGHT TO BE SELECTED");
    await driver.pause(5000);
    console.log("WAITING FOR THE ANCILLARY SELECTION SCREEN TO BE LOADED  ");

    const proceedBtnForChooseAncillarySelection = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]',
    );

    console.log("PROCEED BUTTON FOR CHOOSE ANCILLARY");

    await proceedBtnForChooseAncillarySelection.scrollIntoView();
    await proceedBtnForChooseAncillarySelection.click();
    console.log("PROCEED BUTTON FOR CHOOSE ANCILLARY SELECTION CLICKED");
    await proceedBtnForChooseAncillarySelection.scrollIntoView();
    await proceedBtnForChooseAncillarySelection.click();
    console.log("PROCEED BUTTON FOR CHOOSE ANCILLARY SELECTION CLICKED");

    const chooseAncillaryScreen = await driver.$(
      '//android.view.View[@content-desc="Choose Ancillaries"]',
    );
    await chooseAncillaryScreen.waitForExist({ timeout: 10000 });
    console.log("CHOOSE ANCILLARY SCREEN PRESENT");
    if (await chooseAncillaryScreen.isExisting()) {
      console.log("Choose Ancillaries screen loaded");

      console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");

      const chooseSeat = await driver.$(
        '//android.view.View[@content-desc="Choose seat"]',
      );
      await chooseSeat.waitForExist({ timeout: 20000 });
      console.log("CHOOSE SEAT Button Found, GOING TO BE CLICKED");
      await chooseSeat.click();
      console.log("CHOOSE SEAT CLICKED");

      const chooseSeatMapPage = await driver.$(
        '//android.view.View[@content-desc="Choose Seat Map"]',
      );
      await chooseSeatMapPage.waitForExist({ timeout: 20000 });
      console.log("CHOOSE SEAT PAGE FOUND");
      await driver.pause(2000);

      console.log("FINDING AVAILABLE SEATS BY SEAT NUMBER PATTERN");
      const seatElements = await driver.$$(
        "//android.view.View[@content-desc]",
      );
      let found = false;
      for (const seat of seatElements) {
        const seatNumber = await seat.getAttribute("content-desc");
        if (/^[1-9][A-F]$/.test(seatNumber)) {
          try {
            console.log(`TRYING SEAT: ${seatNumber}`);
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
        console.log(
          '"Done" button not present after seat selection, continuing...',
        );
      }

      await driver.pause(1000);
      const chooseMealsBtn = await driver.$(
        '(//android.view.View[@content-desc="Choose meal"])[1]',
      );
      await chooseMealsBtn.waitForExist({ timeout: 7000 });
      await chooseMealsBtn.click();
      console.log("CHOOSE MEAL ONWARD CLICKED");

      const mealOption = await driver.$(
        '-android uiautomator:new UiSelector().descriptionContains("No Meal")',
      );
      await mealOption.waitForExist({ timeout: 4000 });
      await mealOption.click();
      console.log("MEAL OPTION SELECTED");

      const chooseMealPopupBtn = await driver.$(
        '//android.widget.Button[@content-desc="Choose Meal"]',
      );
      await chooseMealPopupBtn.waitForExist({ timeout: 6000 });
      await chooseMealPopupBtn.click();
      console.log("CHOOSE MEAL POPUP BUTTON CLICKED");

      const proceedBtn = await driver.$(
        '//android.widget.Button[@content-desc="Proceed"]',
      );
      await proceedBtn.waitForExist({ timeout: 10000 });
      await proceedBtn.click();
      console.log("PROCEED BUTTON ON CHOOSE ANCILLARY SCREEN CLICKED");

      const createTravelRequestScreen = await driver.$(
        '//android.view.View[@content-desc="Create Travel Request"]',
      );
      await createTravelRequestScreen.waitForExist({ timeout: 20000 });
      console.log("CREATE TRAVEL REQUEST SCREEN LOADED");

      await driver.pause(2000);

      console.log("TRAVEL REQUEST SCREEN FOUND");
    }
  }
}
