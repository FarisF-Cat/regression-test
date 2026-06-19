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
    await driver.pause(6000);
    const busResultPage = await driver.$(
      '//android.view.View[@content-desc="Bus Results"]'
    );
    await busResultPage.waitForExist({ timeout: 20000 });
    await busResultPage.waitForDisplayed({ timeout: 5000 });

    console.log("BUS RESULT PAGE FOUND");

    const allViews = await driver.$$("//android.view.View[@content-desc]");
    console.log("All android.view.View with content-desc:", allViews.length);
    for (let i = 0; i < (await allViews.length); i++) {
      const desc = await allViews[i].getAttribute("content-desc");
      console.log(`View[${i}]: ${desc}`);
    }

    await driver.pause(1000);

    console.log(" Searching for available buses...");

    let clicked = false;
    let maxScrolls = 4; // safety limit to prevent infinite loop

    for (let scrollCount = 0; scrollCount < maxScrolls; scrollCount++) {
      // Step 1: Get all visible bus cards on the screen
      const busCards = await this.driver.$$(
        '//android.view.View[contains(@content-desc,"Starting at")]'
      );
      console.log(
        ` Scroll #${scrollCount + 1}: Found ${busCards.length} bus cards.`,
      );

      // Step 2: Loop through each visible card
      for (let i = 0; i < (await busCards.length); i++) {
        const desc = await busCards[i].getAttribute("content-desc");

        // Step 3: Skip if "0 seats left" or "0 seats found"
        if (desc.includes("0 seats left") || desc.includes("0 seats found")) {
          console.log(`⏭ Skipping Bus [${i + 1}] — no seats available`);
          continue;
        }

        // Step 4: Found available bus — click it
        console.log(` Found available Bus [${i + 1}] — clicking it`);
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

    console.log("🎯 Successfully selected a bus with available seats!");

    await driver.pause(4000);

    const chooseBusPage = await driver.$("~Choose Bus");

    await chooseBusPage.waitForExist({ timeout: 20000 });
    console.log("CHOOSE BUS FOUND");
    await driver.pause(2000);

    const pickUpPoint = await driver.$(
      '//android.view.View[@content-desc="Pickup Point"]'
    );
    await pickUpPoint.waitForExist({ timeout: 20000 });
    console.log("Search Bus Button Found GOING TO BE CLICKED ");
    await pickUpPoint.click();
    console.log("PICK UP POINT CLICKED");
    await driver.pause(2000);
    const pickUpSearchField = await driver.$(
      "(//android.widget.RadioButton)[1]"
    );
    await pickUpSearchField.waitForExist({ timeout: 20000 });
    console.log("Pick Up Search Field Found");
    await pickUpSearchField.click();
    console.log("Pick Up Search Field Clicked");

    const dropPoint = await driver.$(
      '//android.view.View[@content-desc="Drop Point"]'
    );
    await dropPoint.waitForExist({ timeout: 20000 });
    console.log("Search Bus Button Found GOING TO BE CLICKED ");
    await dropPoint.click();
    console.log("DROP POINT CLICKED");
    await driver.pause(2000);
    const dropSearchField = await driver.$("(//android.widget.RadioButton)[1]");
    await dropSearchField.waitForExist({ timeout: 20000 });
    console.log("DROP Up Search Field Found");
    await dropSearchField.click();
    console.log("DROP Up Search Field Clicked");
    await driver.pause(2000);

    const chooseSeat = await driver.$(
      '//android.view.View[contains(@content-desc, "Seat not selected")]'
    );
    await chooseSeat.waitForExist({ timeout: 20000 });
    console.log("CHOOSE SEAT Button Found GOING TO BE CLICKED ");
    await chooseSeat.click();
    console.log("CHOOSE SEAT CLICKED");
    await driver.pause(3500);
    const chooseSeatPage = await driver.$(
      '//android.view.View[@content-desc="Choose Seat"]'
    );

    await chooseSeatPage.waitForExist({ timeout: 20000 });
    console.log("CHOOSE SEAT PAGE FOUND");

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
          console.log(
            `Seat ${desc} is available (bottom bar shows: ${seatText}, ${priceText})`
          );
          foundAvailable = true;
          break;
        }
      }
    }

    if (!foundAvailable) {
      console.log(
        "No available seats found (no price shown at bottom after clicking)."
      );
    }

    await driver.pause(3500);

    const doneButtonSeat = await driver.$(
      '//android.widget.Button[@content-desc="Done"]'
    );
    await doneButtonSeat.waitForExist({ timeout: 20000 });
    console.log("CHOOSE SEAT Button Found GOING TO BE CLICKED ");
    await doneButtonSeat.click();
    await driver.pause(2000);
    console.log("CHOOSE SEAT CLICKED");
    const chooseBusPageAgain = await driver.$("~Choose Bus");

    await chooseBusPageAgain.waitForExist({ timeout: 20000 });
    console.log("CHOOSE BUS FOUND");

    const chooseBusPageDoneButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );

    await chooseBusPageDoneButton.waitForExist({ timeout: 20000 });
    console.log("CHOOSE BUS DONE BUTTON GOING TO BE  CLICKED ");
    await chooseBusPageDoneButton.click();
    console.log("CHOOSE BUS DONE BUTTON CLICKED");

    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]'
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    console.log(
      "PROCEED BUTTON CLICKED AND CREATE TRAVEL REQUEST SCREEN LOADED"
    );
    await driver.pause(2000);
  }
}
