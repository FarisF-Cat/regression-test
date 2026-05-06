export class RailRequestSearchPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async railRequest() {
    const driver = this.driver;
    const chooseTrainButton = await driver.$(
      '//android.widget.Button[@content-desc="Choose Trains"]'
    );
    await chooseTrainButton.waitForExist({
      timeout: 10000,
    });
    await chooseTrainButton.click();
    await driver.pause(1000);
    const trainPrefernceScreen = await driver.$(
      '//android.view.View[@content-desc="Train Preferences"]'
    );
    await trainPrefernceScreen.waitForExist({
      timeout: 10000,
    });
    await trainPrefernceScreen.click();
    await driver.pause(1000);
    const firstTrain = await driver.$(
      '(//android.view.View[contains(@content-desc, "Express")])[1]'
    );
    await firstTrain.waitForExist({
      timeout: 10000,
    });
    const firstTrainCheckBox = await driver.$("//android.widget.CheckBox");

    await firstTrainCheckBox.waitForExist({
      timeout: 10000,
    });
    await firstTrainCheckBox.click();
    console.log("FIRST TRAIN CHECKBOX CLICKED");
    await firstTrain.click();
    console.log("FIRST TRAIN CLICKED");
    await driver.pause(1000);
    console.log("FIRST TRAIN SELECTED");
    await driver.pause(1000);
    const proceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await proceedButton.waitForExist({
      timeout: 10000,
    });
    await proceedButton.click();
    console.log("PROCEED BUTTON CLICKED");
    await driver.pause(1000);
    const addTrainPrefernceScreen = await driver.$(
      '//android.view.View[@content-desc="Add Train Preferences"]'
    );
    await addTrainPrefernceScreen.waitForExist({
      timeout: 10000,
    });
    console.log("ADDED TRAIN PREFERENCES SCREEN FOUND");
    const addTrainPrefernceScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await addTrainPrefernceScreenProceedButton.waitForExist({
      timeout: 10000,
    });
    await addTrainPrefernceScreenProceedButton.click();
    console.log("ADDED TRAIN PREFERENCES PROCEED BUTTON CLICKED");
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]'
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    console.log(
      "PROCEED BUTTON CLICKED AND CREATE TRAVEL REQUEST SCREEN LOADED"
    );
    await driver.pause(2000);
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 5000,
    });
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON FOUND");
    await createTravelRequestScreenProceedButton.click();
    console.log("CREATE TRAVELLER SCREEN PROCEED BUTTON CLICKED");
  }
}
