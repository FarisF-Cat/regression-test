import logger from '@wdio/logger'
const log = logger('BusRequestPage')

export class BusRequestSearchPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async busRequest() {
    const driver = this.driver;

    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]'
      );
      const isPopupVisible = await travelPolicyDeviationPopUp
        .waitForExist({ timeout: 5000 })
        .catch(() => false);
      if (isPopupVisible) {
        log.debug("travel policy deviation popup found");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]'
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
    await driver.pause(6000);
    const busResultPage = await driver.$(
      '//android.view.View[@content-desc="Bus Results"]'
    );
    await busResultPage.waitForExist({ timeout: 20000 });
    await busResultPage.waitForDisplayed({ timeout: 5000 });

    log.debug("bus result page found");

    const allViews = await driver.$$("//android.view.View[@content-desc]");
    log.info("all android.view.view with content-desc:", allViews.lengt);
    for (let i = 0; i < (await allViews.length); i++) {
      const desc = await allViews[i].getAttribute("content-desc");
      log.info(`view[${i}]: ${desc}`);
    }

    await driver.pause(1000);

    log.info(" searching for available buses..");

    let clicked = false;
    let maxScrolls = 4; // safety limit to prevent infinite loop

    for (let scrollCount = 0; scrollCount < maxScrolls; scrollCount++) {
      // Step 1: Get all visible bus cards on the screen
      const busCards = await this.driver.$$(
        '//android.view.View[contains(@content-desc,"Starting at")]'
      );
      log.debug(
        ` scroll #${scrollCount + 1}: found ${busCards.length} bus cards.`,
     );

      // Step 2: Loop through each visible card
      for (let i = 0; i < (await busCards.length); i++) {
        const desc = await busCards[i].getAttribute("content-desc");

        // Step 3: Skip if "0 seats left" or "0 seats found"
        if (desc.includes("0 seats left") || desc.includes("0 seats found")) {
          log.info(`⏭ skipping bus [${i + 1}] — no seats availabl`);
          continue;
        }

        // Step 4: Found available bus — click it
        log.debug(` found available bus [${i + 1}] — clicking i`);
        await busCards[i].scrollIntoView();
        await busCards[i].waitForDisplayed({ timeout: 5000 });
        await busCards[i].click();
        clicked = true;
        break;
      }

      if (clicked) break;
    }

    if (!clicked) {
      throw new Error(
        "❌ No available buses found after scrolling all results."
      );
    }

    log.info("🎯 successfully selected a bus with available seats");

    await driver.pause(4000);

    const chooseBusPage = await driver.$("~Choose Bus");

    await chooseBusPage.waitForExist({ timeout: 20000 });
    log.debug("choose bus found");
    await driver.pause(2000);

    const pickUpPoint = await driver.$(
      '//android.view.View[@content-desc="Pickup Point"]'
    );
    await pickUpPoint.waitForExist({ timeout: 20000 });
    log.debug("search bus button found going to be clicked");
    await pickUpPoint.click();
    log.info("pick up point clicked");
    await driver.pause(2000);
    const pickUpSearchField = await driver.$(
      "(//android.widget.RadioButton)[1]"
    );
    await pickUpSearchField.waitForExist({ timeout: 20000 });
    log.debug("pick up search field found");
    await pickUpSearchField.click();
    log.info("pick up search field clicked");

    const dropPoint = await driver.$(
      '//android.view.View[@content-desc="Drop Point"]'
    );
    await dropPoint.waitForExist({ timeout: 20000 });
    log.debug("search bus button found going to be clicked");
    await dropPoint.click();
    log.info("drop point clicked");
    await driver.pause(2000);
    const dropSearchField = await driver.$("(//android.widget.RadioButton)[1]");
    await dropSearchField.waitForExist({ timeout: 20000 });
    log.debug("drop up search field found");
    await dropSearchField.click();
    log.info("drop up search field clicked");
    await driver.pause(2000);

    const chooseSeat = await driver.$(
      '//android.view.View[contains(@content-desc, "Seat not selected")]'
    );
    await chooseSeat.waitForExist({ timeout: 20000 });
    log.debug("choose seat button found going to be clicked");
    await chooseSeat.click();
    log.info("choose seat clicked");
    await driver.pause(3500);
    const chooseSeatPage = await driver.$(
      '//android.view.View[@content-desc="Choose Seat"]'
    );

    await chooseSeatPage.waitForExist({ timeout: 20000 });
    log.debug("choose seat page found");

    const allSeats = await driver.$$(
      '//android.view.View[@content-desc and not(contains(@content-desc, "Driver"))]'
    );

    let foundAvailable = false;

    for (const seat of allSeats) {
      const desc = await seat.getAttribute("content-desc");

      await seat.click();
      await driver.pause(1000);

      const bottomBarTextElement = await driver.$(
        '//android.view.View[contains(@content-desc, "L")]'
      );

      const priceElement = await driver.$(
        '//android.view.View[contains(@content-desc, "₹")]'
      );

      const isSeatTextDisplayed = await bottomBarTextElement
        .isDisplayed()
        .catch(() => false);
      const isPriceDisplayed = await priceElement
        .isDisplayed()
        .catch(() => false);

      if (isSeatTextDisplayed && isPriceDisplayed) {
        const seatText = await bottomBarTextElement.getAttribute(
          "content-desc"
        );
        const priceText = await priceElement.getAttribute("content-desc");
        if (seatText !== "-- NA --" && priceText.startsWith("₹")) {
          log.info(
            `seat ${desc} is available (bottom bar shows: ${seatText}, ${priceText})`
         );
          foundAvailable = true;
          break;
        }
      }
    }

    if (!foundAvailable) {
      log.debug(
        "no available seats found (no price shown at bottom after clicking)."
     );
    }

    await driver.pause(3500);

    const doneButtonSeat = await driver.$(
      '//android.widget.Button[@content-desc="Done"]'
    );
    await doneButtonSeat.waitForExist({ timeout: 20000 });
    log.debug("choose seat button found going to be clicked");
    await doneButtonSeat.click();
    await driver.pause(2000);
    log.info("choose seat clicked");
    const chooseBusPageAgain = await driver.$("~Choose Bus");

    await chooseBusPageAgain.waitForExist({ timeout: 20000 });
    log.debug("choose bus found");

    const chooseBusPageDoneButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );

    await chooseBusPageDoneButton.waitForExist({ timeout: 20000 });
    log.info("choose bus done button going to be  clicked");
    await chooseBusPageDoneButton.click();
    log.info("choose bus done button clicked");

    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]'
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    log.info(
      "proceed button clicked and create travel request screen loaded"
   );
    await driver.pause(2000);
  }
}
