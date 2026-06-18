export class HotelRequestSearchPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async hotelRequest() {
    const driver = this.driver;

    await driver.pause(3000);
    try {
      const travelPolicyDeviationPopUp = await driver.$(
        '//android.view.View[@content-desc="Travel Policy Deviation"]',
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
        console.log("TRAVEL POLICY DEVIATION POPUP YES BUTTON CLICKED");
      }
    } catch (e) {
      console.log("TRVAEL POLICY DEVIATION POPUP NOT FOUND ...");
    }
    await driver.pause(6000);
    console.log("HOTEL SEARCHING SCREEN LOADING STARTED");
    // const hotelSearchingScreenLoading = await driver.$(
    //   '//android.view.View[contains(@content-desc,"Searching Hotel")]'
    // );

    // await hotelSearchingScreenLoading.waitForExist({ timeout: 30000 });

    const searchingHotel = await driver.$(
      '//android.view.View[contains(@content-desc,"Searching Hotel")]',
    );

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
      );
    }

    console.log("HOTEL SEARCHING SCREEN LOADING FOUND");
    const hotelSearchingResultScreen = await driver.$(
      '//android.view.View[@clickable="true" and @content-desc]',
    );

    await hotelSearchingResultScreen.waitForDisplayed({ timeout: 100000 });

    console.log(" HOTEL SEARCHING RESULT SCREEN FOUND");
    await hotelSearchingResultScreen.click();
    console.log("HOTEL SEARCHING RESULT SCREEN CLICKED");
    await driver.pause(2000);

    const hotelSearchingResultScreenClicked = await driver.$(
      'android=new UiSelector().className("android.view.View").instance(11)',
    );

    await hotelSearchingResultScreenClicked.waitForExist({ timeout: 20000 });
    console.log("HOTEL SEARCHING RESULT SCREEN CLICKED FOUND");

    const showRoomButton = await driver.$(
      '//android.widget.Button[@content-desc="Show Rooms"]',
    );

    await showRoomButton.waitForExist({ timeout: 40000 });
    console.log("HOTEL SEARCHING RESULT SCREEN CLICKED FOUND");
    await showRoomButton.click();
    console.log("SHOW ROOMS BUTTON CLICKED");

    await driver.pause(2000);
    const bookNowScreen = await driver.$(
      '(//android.widget.Button[@content-desc="Book Now"])[1]',
    );

    await bookNowScreen.waitForExist({ timeout: 35000 });
    await bookNowScreen.waitForDisplayed({ timeout: 35000 });

    if (!(await bookNowScreen.isExisting())) {
      throw new Error("NO BOOK NOW BUTTONS FOUND ON THE SCREEN");
    }
    console.log("BOOK NOW SCREEN CLICKED");
    await bookNowScreen.click();
    const createTravelRequestScreenBackButton = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    await createTravelRequestScreenBackButton.waitForExist({
      timeout: 20000,
    });
    await driver.pause(2000);
  }
}
