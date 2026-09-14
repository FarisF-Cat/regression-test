import Page from "../page";

import logger from "@wdio/logger";
const log = logger("HotelRequestPage");

export class HotelRequestSearchPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async hotelRequest() {
    const driver = this.driver;

    await driver.pause(3000);

    // Travel Policy Deviation popup (optional)
    const policyEls = await driver.$$(
      '//android.view.View[@content-desc="Travel Policy Deviation"]',
    ).getElements();
    if (policyEls.length > 0) {
      log.debug("travel policy deviation popup found");
      const yesEls = await driver.$$(
        '//android.widget.Button[@content-desc="Yes"]',
      ).getElements();
      if (yesEls.length > 0) {
        await yesEls[0].click();
        log.info("travel policy deviation popup yes button clicked");
      }
    } else {
      log.debug("travel policy deviation popup not found, skipping");
    }

    await driver.pause(6000);

    log.info("hotel searching screen loading started");

    let hotelResult: WebdriverIO.Element | null = null;
    for (let i = 0; i < 45; i++) {
      const els = await driver.$$(
        '//android.view.View[@clickable="true" and @content-desc]',
      ).getElements();
      if (els.length > 0) {
        // Verify it's not the loading screen element
        const desc = (await els[0].getAttribute("content-desc").catch(() => "")) ?? "";
        if (!desc.toLowerCase().includes("searching")) {
          hotelResult = els[0];
          log.debug(`✅ hotel result found on attempt ${i + 1}: "${desc}`);
          break;
        }
        log.info(
          `⏳ attempt ${i + 1}: still on loading screen ("${desc}"), waiting..`,
        );
      } else {
        log.info(`⏳ attempt ${i + 1}/45: no clickable results ye`);
      }
      await driver.pause(2000);
    }

    if (!hotelResult) {
      throw new Error("❌ No hotel result cards appeared after 90s");
    }
    log.debug("hotel searching screen loading found");
    await hotelResult.click();
    log.info("hotel searching result screen clicked");

    // Show Rooms button
    const showRooms = await this.probeElement(
      '//android.widget.Button[@content-desc="Show Rooms"]',
      15,
      1000,
    );
    if (!showRooms) {
      throw new Error("❌ Show Rooms button not found");
    }
    log.debug("show rooms button found");
    await showRooms.click();
    log.info("show rooms button clicked");

    await driver.pause(10000);

    // Book Now — scroll-and-probe loop (button is often off-screen)
    const bookNowSelector =
      '//*[@content-desc="Book Now" or contains(@content-desc, "Book Now")]';
    const { height, width } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.85);
    const endY = Math.floor(height * 0.15);

    let bookNow: WebdriverIO.Element | null = null;
    for (let swipe = 0; swipe < 10; swipe++) {
      const els = await driver.$$(bookNowSelector).getElements();
      if (await els.length > 0) {
        const displayed = await els[0].isDisplayed().catch(() => false);
        if (displayed) {
           bookNow = els[0];
          log.debug(`✅ book now found after ${swipe} swipe(s`);
          break;
        }
      }
      log.info(`🔄 swipe #${swipe + 1} looking for book now`);
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
      await driver.pause(1500);
    }

    if (!bookNow) {
      throw new Error("❌ Book Now button not found after scrolling");
    }
    log.info("book now button clicked");
    await bookNow.click();

    // Back button after booking
    const backButton = await this.probeElement(
      '//android.widget.Button[@content-desc="Back"]',
      10,
      1000,
    );
    if (!backButton) {
      log.warn("⚠️ back button not found after book now — continuin");
    }
    await driver.pause(2000);
  }
}
