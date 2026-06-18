export class ViewTRipTab {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  private async findTab(label: string, tabIndexInfo: string) {
    const selectors = [
      `~${label}\nTab ${tabIndexInfo}`,
      `android=new UiSelector().descriptionContains("${label}")`,
      `//android.view.View[contains(@content-desc,"${label}")]`,
      `//android.widget.ImageView[contains(@content-desc,"${label}")]`,
    ];

    for (const selector of selectors) {
      const element = await this.driver.$(selector);
      const visible = await element
        .waitForDisplayed({ timeout: 5000 })
        .catch(() => false);

      if (visible) {
        return element;
      }
    }

    throw new Error(`Could not locate '${label}' tab with known selectors.`);
  }

  ///WORKING CODE WHICH DOES NOT HAVE THE CONDITION "Trips - Handle if current trips are not present. Same for Upcoming"""
  // async viewTripScreen() {
  //   const driver = this.driver;
  //   await driver.pause(3000);
  //   const tripTab = await driver.$("~My Trips\nTab 3 of 4");

  //   await tripTab.waitForDisplayed({ timeout: 25000 });
  //   await tripTab.click();

  //   console.log("MY TRIPS TAB CLICKED");
  //   await driver.pause(5000);
  //   const myTripScreen = await driver.$(
  //     '//android.view.View[@content-desc="My Trips"]'
  //   );
  //   await myTripScreen.waitForExist({
  //     timeout: 300000,
  //   });
  //   console.log("MY TRIPS SCREEN DISPLAYED");

  //   const currentTab = await driver.$(
  //     "android=new UiScrollable(new UiSelector().scrollable(true))" +
  //       '.getChildByInstance(new UiSelector().className("android.widget.ImageView"), 0)'
  //   );

  //   console.log(
  //     "212122121212121212121212121212121212CURRENT TAB ELEMENT FOUND2121212121212121212121212121"
  //   );
  //   await currentTab.click();

  //   console.log("MY TRIPS SCREEN DISPLAYED");
  //   await scrollToBottom(driver);
  //   const backButton = await driver.$(
  //     '//android.widget.Button[@content-desc="Back"]'
  //   );
  //   await backButton.waitForExist({
  //     timeout: 300000,
  //   });
  //   console.log("MY TRIPS SCREEN DISPLAYED");
  //   await backButton.click();
  //   console.log("BACK BUTTON CLICKED TO GO TO MY TRIPS SCREEN");
  //   await driver.pause(3000);
  //   const upcomingTab = await driver.$("~Upcoming\nTab 2 of 3");
  //   await upcomingTab.waitForDisplayed({ timeout: 10000 });
  //   await upcomingTab.click();

  //   console.log("UPCOMING TAB CLICKED");
  //   await driver.waitUntil(
  //     async () => {
  //       const cards = await driver.$$(
  //         '//android.widget.ImageView[contains(@content-desc,"IBS/")]'
  //       );
  //       return (await cards.length) > 0;
  //     },
  //     {
  //       timeout: 20000,
  //       timeoutMsg: "Upcoming trip cards not loaded",
  //     }
  //   );

  //   const upcomingCards = await driver.$$(
  //     '//android.widget.ImageView[contains(@content-desc,"IBS/")]'
  //   );

  //   await upcomingCards[0].click();

  //   console.log("FIRST UPCOMING JOURNEY CLICKED");
  //   await scrollToBottom(driver);
  //   const backButtonUpcomingJourney = await driver.$(
  //     '//android.widget.Button[@content-desc="Back"]'
  //   );
  //   await backButtonUpcomingJourney.waitForExist({
  //     timeout: 300000,
  //   });
  //   console.log("MY TRIPS SCREEN DISPLAYED");
  //   await backButtonUpcomingJourney.click();
  //   console.log("BACK BUTTON CLICKED TO GO TO MY TRIPS SCREEN");
  //   await driver.pause(3000);
  //   const pastTab = await driver.$("~Past\nTab 3 of 3");
  //   await pastTab.waitForDisplayed({ timeout: 10000 });
  //   await pastTab.click();

  //   console.log("PAST TAB CLICKED");
  //   await driver.waitUntil(
  //     async () => {
  //       const cards = await driver.$$(
  //         '//android.widget.ImageView[contains(@content-desc,"IBS/")]'
  //       );
  //       return (await cards.length) > 0;
  //     },
  //     {
  //       timeout: 20000,
  //       timeoutMsg: "Past trip cards not loaded",
  //     }
  //   );

  //   const pastCards = await driver.$$(
  //     '//android.widget.ImageView[contains(@content-desc,"IBS/")]'
  //   );

  //   await pastCards[0].click();

  //   console.log("FIRST PAST JOURNEY CLICKED");
  //   await scrollToBottom(driver);
  // }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async viewTripScreen() {
    const driver = this.driver;

    await driver.pause(5000);

    const tripTab = await this.findTab("My Trips", "3 of 4");
    await tripTab.waitForDisplayed({ timeout: 25000 });
    await tripTab.click();
    console.log("MY TRIPS TAB CLICKED");

    const myTripScreen = await driver.$(
      '//android.view.View[@content-desc="My Trips"]',
    );
    await myTripScreen.waitForExist({ timeout: 300000 });

    const noResults =
      '//android.view.View[contains(@content-desc,"No results found")]';
    console.log(
      "MY TRIPS SCREEN DISPLAYED, CHECKING FOR JOURNEYS.......................",
    );
    const cardLocator =
      '//android.widget.ImageView[contains(@content-desc,"IBS/")]';

    // ---------------- CURRENT TAB ----------------
    console.log("CHECKING CURRENT TAB");

    const currentNoResult = await driver.$(noResults);

    if (await currentNoResult.isExisting()) {
      console.log("NO CURRENT JOURNEYS → MOVING TO UPCOMING");

      const upcomingTab = await this.findTab("Upcoming", "2 of 3");
      await upcomingTab.click();

      await driver.pause(5000);

      // ---------------- UPCOMING TAB ----------------
      const upcomingNoResult = await driver.$(noResults);

      if (await upcomingNoResult.isExisting()) {
        console.log("NO UPCOMING JOURNEYS → MOVING TO PAST");

        const pastTab = await this.findTab("Past", "3 of 3");
        await pastTab.click();

        await driver.pause(3000);

        // ---------------- PAST TAB ----------------
        const pastCards = await driver.$$(cardLocator);

        if ((await pastCards.length) > 0) {
          await pastCards[0].click();
          console.log("FIRST PAST JOURNEY CLICKED");
          await scrollToBottom(driver);
        } else {
          console.log("NO JOURNEYS IN PAST ALSO");
        }
      } else {
        const upcomingCards = await driver.$$(cardLocator);

        if ((await upcomingCards.length) > 0) {
          await upcomingCards[0].click();
          console.log("FIRST UPCOMING JOURNEY CLICKED");

          await scrollToBottom(driver);

          const backButton = await driver.$(
            '//android.widget.Button[@content-desc="Back"]',
          );
          await backButton.click();
        } else {
          console.log("UPCOMING TAB LOADED BUT NO JOURNEY CARDS FOUND");
        }
      }
    } else {
      const currentCards = await driver.$$(cardLocator);

      if ((await currentCards.length) > 0) {
        await currentCards[0].click();
        console.log("FIRST CURRENT JOURNEY CLICKED");

        await scrollToBottom(driver);

        const backButton = await driver.$(
          '//android.widget.Button[@content-desc="Back"]',
        );
        await backButton.click();
      } else {
        console.log("CURRENT TAB LOADED BUT NO JOURNEY CARDS FOUND");
      }
    }
  }
}
async function scrollToBottom(driver: WebdriverIO.Browser) {
  let previousSource = "";
  let currentSource = await driver.getPageSource();

  while (previousSource !== currentSource) {
    previousSource = currentSource;

    const { height, width } = await driver.getWindowRect();

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          {
            type: "pointerMove",
            duration: 0,
            x: Math.floor(width / 2),
            y: Math.floor(height * 0.8),
          },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 300 },
          {
            type: "pointerMove",
            duration: 1000,
            x: Math.floor(width / 2),
            y: Math.floor(height * 0.2),
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
    await driver.pause(1200);

    currentSource = await driver.getPageSource();
  }

  console.log("SCREEN SCROLLED TO BOTTOM");
}
