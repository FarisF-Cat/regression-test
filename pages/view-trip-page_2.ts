export class ViewTRipTab {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async viewTripScreen() {
    const driver = this.driver;

    // No Home check here — login.page already confirmed Home before returning.
    // Adding another probe here hits UiAutomator2 immediately after a heavy
    // login transition and is what was causing the crash at this exact point.

    // Tab bar is always present when Home is stable — go straight to click
    const tripTab = await driver.$('android=new UiSelector().descriptionContains("My Trips")');
    await tripTab.click();
    console.log("MY TRIPS TAB CLICKED");

    // Compose tears down the current screen's accessibility tree during navigation.
    // UiAutomator2 crashes if it queries getRootInActiveWindow() while the tree is null.
    // This pause must cover the full Compose transition + accessibility tree rebuild.
    // Do NOT reduce this — probing too early is what kills the UiAutomator2 server.
    await driver.pause(8000);

    // Anchor wait: "Current" tab only exists on the My Trips screen.
    // try/catch inside the loop — if Compose accessibility tree is still null
    // mid-transition, $$ throws instead of returning []. We catch it, pause,
    // and return false to let waitUntil retry rather than crashing the server.
    await driver.waitUntil(
      async () => {
        try {
          const els = await driver.$$('android=new UiSelector().descriptionContains("Current")');
          return els.length > 0;
        } catch {
          await driver.pause(2000);
          return false;
        }
      },
      { timeout: 30000, interval: 3000, timeoutMsg: "My Trips screen did not load" }
    );

    // Stabilization buffer after anchor confirmed — let remaining async renders finish
    await driver.pause(3000);

    // Locators — declared once, used throughout
    const noResultsLocator =
      'android=new UiSelector().descriptionContains("No results found")';
    const cardLocator =
      'android=new UiSelector().className("android.widget.ImageView").descriptionStartsWith("IBS/")';
    const backButtonLocator =
      'android=new UiSelector().className("android.widget.Button").description("Back")';

    // ---------------- CURRENT TAB ----------------
    console.log("CHECKING CURRENT TAB");
    const hasNoCurrentResults = (await driver.$$(noResultsLocator)).length > 0;

    if (hasNoCurrentResults) {
      console.log("NO CURRENT JOURNEYS → MOVING TO UPCOMING");

      const upcomingTab = await driver.$('android=new UiSelector().descriptionContains("Upcoming")');
      await upcomingTab.click();
      console.log("UPCOMING TAB CLICKED");

      await driver.pause(5000);
      await driver.waitUntil(
        async () => {
          try {
            const els = await driver.$$('android=new UiSelector().descriptionContains("Upcoming")');
            return els.length > 0;
          } catch {
            await driver.pause(2000);
            return false;
          }
        },
        { timeout: 20000, interval: 3000, timeoutMsg: "Upcoming tab did not load" }
      );
      await driver.pause(3000);

      // ---------------- UPCOMING TAB ----------------
      const hasNoUpcomingResults = (await driver.$$(noResultsLocator)).length > 0;

      if (hasNoUpcomingResults) {
        console.log("NO UPCOMING JOURNEYS → MOVING TO PAST");

        const pastTab = await driver.$('android=new UiSelector().descriptionContains("Past")');
        await pastTab.click();
        console.log("PAST TAB CLICKED");

        await driver.pause(5000);
        await driver.waitUntil(
          async () => {
            try {
              const els = await driver.$$('android=new UiSelector().descriptionContains("Past")');
              return els.length > 0;
            } catch {
              await driver.pause(2000);
              return false;
            }
          },
          { timeout: 20000, interval: 3000, timeoutMsg: "Past tab did not load" }
        );
        await driver.pause(3000);

        // ---------------- PAST TAB ----------------
        const hasPastCards = await waitForCards(driver, cardLocator);
        if (hasPastCards) {
          const pastCards = await driver.$$(cardLocator);
          await pastCards[0].click();
          console.log("FIRST PAST JOURNEY CLICKED");
          await scrollToBottom(driver);
        } else {
          console.log("NO JOURNEYS FOUND IN ANY TAB");
        }

      } else {
        // Upcoming has results
        const hasUpcomingCards = await waitForCards(driver, cardLocator);
        if (hasUpcomingCards) {
          const upcomingCards = await driver.$$(cardLocator);
          await upcomingCards[0].click();
          console.log("FIRST UPCOMING JOURNEY CLICKED");
          await scrollToBottom(driver);

          await driver.pause(1500);
          await driver.waitUntil(
            async () => {
              await driver.pause(800);
              return (await driver.$$(backButtonLocator)).length > 0;
            },
            { timeout: 10000, interval: 2000, timeoutMsg: "Back button not found (upcoming)" }
          );
          const backButton = await driver.$(backButtonLocator);
          await backButton.click();
          console.log("BACK BUTTON CLICKED");
        } else {
          console.log("UPCOMING TAB: no cards found within timeout");
        }
      }

    } else {
      // Current tab has results
      const hasCurrentCards = await waitForCards(driver, cardLocator);
      if (hasCurrentCards) {
        const currentCards = await driver.$$(cardLocator);
        await currentCards[0].click();
        console.log("FIRST CURRENT JOURNEY CLICKED");
        await scrollToBottom(driver);

        await driver.pause(1500);
        await driver.waitUntil(
          async () => {
            await driver.pause(800);
            return (await driver.$$(backButtonLocator)).length > 0;
          },
          { timeout: 10000, interval: 2000, timeoutMsg: "Back button not found (current)" }
        );
        const backButton = await driver.$(backButtonLocator);
        await backButton.click();
        console.log("BACK BUTTON CLICKED");
      } else {
        console.log("CURRENT TAB: no cards found within timeout");
      }
    }
  }
}

/**
 * Waits for at least one card to appear. Returns true if found, false on timeout.
 * pause(800) inside the callback throttles each probe to prevent UiAutomator2 overload.
 */
async function waitForCards(
  driver: WebdriverIO.Browser,
  locator: string,
  timeout = 20000,
  interval = 3000
): Promise<boolean> {
  try {
    await driver.waitUntil(
      async () => {
        try {
          const cards = await driver.$$(locator);
          return cards.length > 0;
        } catch {
          // Accessibility tree null during Compose transition — wait and retry
          await driver.pause(2000);
          return false;
        }
      },
      { timeout, interval, timeoutMsg: `No cards found with: ${locator}` }
    );
    return true;
  } catch {
    return false;
  }
}

async function scrollToBottom(driver: WebdriverIO.Browser) {
  const MAX_SCROLLS = 5;
  const { height, width } = await driver.getWindowRect();
  const startX = Math.floor(width / 2);
  const startY = Math.floor(height * 0.8);
  const endY = Math.floor(height * 0.2);

  for (let i = 0; i < MAX_SCROLLS; i++) {
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startX, y: startY },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 300 },
          { type: "pointerMove", duration: 1000, x: startX, y: endY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
    await driver.pause(1200);
  }

  console.log("SCREEN SCROLLED TO BOTTOM");
}
