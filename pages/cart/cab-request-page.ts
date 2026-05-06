export class CabRequestSearchPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async cabRequest() {
    const driver = this.driver;
    console.log(
      " ..................................SEARCHING FOR CAB REQUEST  ........................................",
    );
    await driver.pause(3000);
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
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]',
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    console.log(
      "PROCEED BUTTON CLICKED AND CREATE TRAVEL REQUEST SCREEN LOADED",
    );
    await driver.pause(2000);
    // const createTravelRequestScreenProceedButton = await driver.$(
    //   '//android.widget.Button[@content-desc="Proceed"]'
    // );
    // await createTravelRequestScreenProceedButton.waitForExist({
    //   timeout: 5000,
    // });
    // console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    // await createTravelRequestScreenProceedButton.click();
    // console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");
  }
  async cabRequestOutstationCab() {
    const driver = this.driver;
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
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]',
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    console.log(
      "PROCEED BUTTON CLICKED AND CREATE TRAVEL REQUEST SCREEN LOADED",
    );
    await driver.pause(2000);
  }
  async cabRequestAirportTransferCab() {
    // const driver = this.driver;
    // const createTravelRequestScreenProceedButton = await driver.$(
    //   '//android.widget.Button[@content-desc="Proceed"]',
    // );
    // await createTravelRequestScreenProceedButton.waitForDisplayed({
    //   timeout: 20000,
    // });
    // await createTravelRequestScreenProceedButton.click();
    // console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");
  }
}
