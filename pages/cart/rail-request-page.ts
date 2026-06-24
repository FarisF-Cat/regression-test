import logger from '@wdio/logger'
const log = logger('RailRequestPage')

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
    log.info("first train checkbox clicked");
    await firstTrain.click();
    log.info("first train clicked");
    await driver.pause(1000);
    log.info("first train selected");
    await driver.pause(1000);
    const proceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await proceedButton.waitForExist({
      timeout: 10000,
    });
    await proceedButton.click();
    log.info("proceed button clicked");
    await driver.pause(1000);
    const addTrainPrefernceScreen = await driver.$(
      '//android.view.View[@content-desc="Add Train Preferences"]'
    );
    await addTrainPrefernceScreen.waitForExist({
      timeout: 10000,
    });
    log.debug("added train preferences screen found");
    const addTrainPrefernceScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await addTrainPrefernceScreenProceedButton.waitForExist({
      timeout: 10000,
    });
    await addTrainPrefernceScreenProceedButton.click();
    log.info("added train preferences proceed button clicked");
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]'
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    log.info(
      "proceed button clicked and create travel request screen loaded"
   );
    await driver.pause(2000);
    const createTravelRequestScreenProceedButton = await driver.$(
      '//android.widget.Button[@content-desc="Proceed"]'
    );
    await createTravelRequestScreenProceedButton.waitForExist({
      timeout: 5000,
    });
    log.debug("create traveller screen proceed button found");
    await createTravelRequestScreenProceedButton.click();
    log.info("create traveller screen proceed button clicked");
  }
}
