export class HotelRequestSearchPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  private async probeElement(
    selector: string,
    attempts = 10,
    intervalMs = 3000,
  ): Promise<WebdriverIO.Element | null> {
    for (let i = 0; i < attempts; i++) {
      const els = await this.driver.$$(selector);
      if (els.length > 0) return els[0];
      console.log(`⏳ [probe] attempt ${i + 1}/${attempts}: ${selector}`);
      await this.driver.pause(intervalMs);
    }
    return null;
  }

  async hotelRequest() {
    const driver = this.driver;

    await driver.pause(3000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',

    // Travel Policy Deviation popup (optional)
    const policyEls = await driver.$$(
      '//android.view.View[@content-desc="Travel Policy Deviation"]',
    );
    if (policyEls.length > 0) {
      console.log("TRAVEL POLICY DEVIATION POPUP FOUND");
      const yesEls = await driver.$$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      if (await travelPolicyDeviationPopUp.isExisting()) {
        console.log("TRAVEL POLICY DEVIATION POPUP FOUND");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 2500,
        });
        await travelPolicyDeviationPopUpYesButton.click();
      if (yesEls.length > 0) {
        await yesEls[0].click();
        console.log("TRAVEL POLICY DEVIATION POPUP YES BUTTON CLICKED");
      }
    } catch (e) {
      console.log("TRVAEL POLICY DEVIATION POPUP NOT FOUND ...");
    } else {
      console.log("Travel Policy Deviation popup not found, skipping");
    }
    await driver.pause(6000);
    console.log("HOTEL SEARCHING SCREEN LOADING STARTED");
    // const hotelSearchingScreenLoading = await driver.$(
    //   '//android.view.View[contains(@content-desc,"Searching Hotel")]'
    // );

    // await hotelSearchingScreenLoading.waitForExist({ timeout: 30000 });
    await driver.pause(6000);

    const searchingHotel = await driver.$(
      '//android.view.View[contains(@content-desc,"Searching Hotel")]',
    );
    console.log("HOTEL SEARCHING SCREEN LOADING STARTED");

    try {
      await searchingHotel.waitForExist({ timeout: 5000 });
      console.log(
        "ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ Searching Hotel loader appeared",
      );
      await searchingHotel.waitForExist({ reverse: true, timeout: 60000 });
      console.log(
        "✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ Searching Hotel loader disappeared",
      );
    } catch {
      console.log(
        "ℹ️✅ℹ️✅ℹ️✅ℹ️✅ℹ️✅ℹ️✅ℹ️✅ℹ️✅ℹ️✅ Loader did not appear — continuing flow",
    let hotelResult: WebdriverIO.Element | null = null;
    for (let i = 0; i < 45; i++) {
      const els = await driver.$$(
        '//android.view.View[@clickable="true" and @content-desc]',
      );
      if (els.length > 0) {
        // Verify it's not the loading screen element
        const desc = await els[0].getAttribute("content-desc").catch(() => "");
        if (!desc.toLowerCase().includes("searching")) {
          hotelResult = els[0];
          console.log(`✅ Hotel result found on attempt ${i + 1}: "${desc}"`);
          break;
        }
        console.log(`⏳ Attempt ${i + 1}: still on loading screen ("${desc}"), waiting...`);
      } else {
        console.log(`⏳ Attempt ${i + 1}/45: no clickable results yet`);
      }
      await driver.pause(2000);
    }

    if (!hotelResult) {
      throw new Error("❌ No hotel result cards appeared after 90s");
    }
    console.log("HOTEL SEARCHING SCREEN LOADING FOUND");
    const hotelSearchingResultScreen = await driver.$(
      '//android.view.View[@clickable="true" and @content-desc]',
    );

    await hotelSearchingResultScreen.waitForDisplayed({ timeout: 100000 });

    console.log(" HOTEL SEARCHING RESULT SCREEN FOUND");
    await hotelSearchingResultScreen.click();
    await hotelResult.click();
    console.log("HOTEL SEARCHING RESULT SCREEN CLICKED");
    await driver.pause(2000);

    const hotelSearchingResultScreenClicked = await driver.$(
      'android=new UiSelector().className("android.view.View").instance(11)',
    );

    await hotelSearchingResultScreenClicked.waitForExist({ timeout: 20000 });
    console.log("HOTEL SEARCHING RESULT SCREEN CLICKED FOUND");

    const showRoomButton = await driver.$(
    // Show Rooms button
    const showRooms = await this.probeElement(
      '//android.widget.Button[@content-desc="Show Rooms"]',
      15,
      1000,
    );

    await showRoomButton.waitForExist({ timeout: 40000 });
    console.log("HOTEL SEARCHING RESULT SCREEN CLICKED FOUND");
    await showRoomButton.click();
    if (!showRooms) {
      throw new Error("❌ Show Rooms button not found");
    }
    console.log("SHOW ROOMS BUTTON FOUND");
    await showRooms.click();
    console.log("SHOW ROOMS BUTTON CLICKED");

    await driver.pause(2000);
    const bookNowScreen = await driver.$(
      '(//android.widget.Button[@content-desc="Book Now"])[1]',
    );

    await bookNowScreen.waitForExist({ timeout: 35000 });
    await bookNowScreen.waitForDisplayed({ timeout: 35000 });
    // Book Now — scroll-and-probe loop (button is often off-screen)
    const bookNowSelector =
      '//*[@content-desc="Book Now" or contains(@content-desc, "Book Now")]';
    const { height, width } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.85);
    const endY = Math.floor(height * 0.15);

    if (!(await bookNowScreen.isExisting())) {
      throw new Error("NO BOOK NOW BUTTONS FOUND ON THE SCREEN");
    let bookNow: WebdriverIO.Element | null = null;
    for (let swipe = 0; swipe < 10; swipe++) {
      const els = await driver.$$(bookNowSelector);
      if (els.length > 0) {
        const displayed = await els[0].isDisplayed().catch(() => false);
        if (displayed) {
          bookNow = els[0];
          console.log(`✅ Book Now found after ${swipe} swipe(s)`);
          break;
        }
      }
      console.log(`🔄 Swipe #${swipe + 1} looking for Book Now`);
      await driver.performActions([{
        type: "pointer", id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startX, y: startY },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 100 },
          { type: "pointerMove", duration: 1200, x: startX, y: endY },
          { type: "pointerUp", button: 0 },
        ],
      }]);
      await driver.releaseActions();
      await driver.pause(1500);
    }
    console.log("BOOK NOW SCREEN CLICKED");
    await bookNowScreen.click();
    const createTravelRequestScreenBackButton = await driver.$(

    if (!bookNow) {
      throw new Error("❌ Book Now button not found after scrolling");
    }
    console.log("BOOK NOW BUTTON CLICKED");
    await bookNow.click();

    // Back button after booking
    const backButton = await this.probeElement(
      '//android.widget.Button[@content-desc="Back"]',
      10,
      1000,
    );
    await createTravelRequestScreenBackButton.waitForExist({
      timeout: 20000,
    });
    if (!backButton) {
      console.warn("⚠️ Back button not found after Book Now — continuing");
    }
    await driver.pause(2000);
  }
}
