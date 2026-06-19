export class ViewTRipTab {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async viewTripScreen() {
    const driver = this.driver;

    const tripTab = await driver.$('android=new UiSelector().descriptionContains("My Trips")');
    await tripTab.click();
    console.log("MY TRIPS TAB CLICKED");

    await driver.pause(8000);

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

    await driver.pause(5000);

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
      await driver.pause(5000);

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
        await driver.pause(5000);

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
        const hasUpcomingCards = await waitForCards(driver, cardLocator);
        if (hasUpcomingCards) {
          const upcomingCards = await driver.$$(cardLocator);
          await upcomingCards[0].click();
          console.log("FIRST UPCOMING JOURNEY CLICKED");
          await scrollToBottom(driver);

          await driver.pause(1500);
          await driver.waitUntil(
            async () => {
              await driver.pause(5000);
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
      const hasCurrentCards = await waitForCards(driver, cardLocator);
      if (hasCurrentCards) {
        const currentCards = await driver.$$(cardLocator);
        await currentCards[0].click();
        console.log("FIRST CURRENT JOURNEY CLICKED");
        await scrollToBottom(driver);

        await driver.pause(3000);
        await driver.waitUntil(
          async () => {
            await driver.pause(3000);
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


async function waitForCards(
  driver: WebdriverIO.Browser,
  locator: string,
  timeout = 30000,
  interval = 3000
): Promise<boolean> {
  try {
    await driver.waitUntil(
      async () => {
        await driver.pause(3000);
        const cards = await driver.$$(locator);
        return cards.length > 0;
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
          { type: "pause", duration: 1000 },
          { type: "pointerMove", duration: 1000, x: startX, y: endY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
    await driver.pause(3000);
  }

  console.log("SCREEN SCROLLED TO BOTTOM");
}
