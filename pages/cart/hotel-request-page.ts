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

    // Travel Policy Deviation popup (optional)
    const policyEls = await driver.$$(
      '//android.view.View[@content-desc="Travel Policy Deviation"]',
    );
    if (policyEls.length > 0) {
      console.log("TRAVEL POLICY DEVIATION POPUP FOUND");
      const yesEls = await driver.$$(
        '//android.widget.Button[@content-desc="Yes"]',
      );
      if (yesEls.length > 0) {
        await yesEls[0].click();
        console.log("TRAVEL POLICY DEVIATION POPUP YES BUTTON CLICKED");
      }
    } else {
      console.log("Travel Policy Deviation popup not found, skipping");
    }

    await driver.pause(6000);

    console.log("HOTEL SEARCHING SCREEN LOADING STARTED");

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
    await hotelResult.click();
    console.log("HOTEL SEARCHING RESULT SCREEN CLICKED");

    // Show Rooms button
    const showRooms = await this.probeElement(
      '//android.widget.Button[@content-desc="Show Rooms"]',
      15,
      1000,
    );
    if (!showRooms) {
      throw new Error("❌ Show Rooms button not found");
    }
    console.log("SHOW ROOMS BUTTON FOUND");
    await showRooms.click();
    console.log("SHOW ROOMS BUTTON CLICKED");

    await driver.pause(2000);

    // Book Now — scroll-and-probe loop (button is often off-screen)
    const bookNowSelector =
      '//*[@content-desc="Book Now" or contains(@content-desc, "Book Now")]';
    const { height, width } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.85);
    const endY = Math.floor(height * 0.15);

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
    if (!backButton) {
      console.warn("⚠️ Back button not found after Book Now — continuing");
    }
    await driver.pause(2000);
  }
}
