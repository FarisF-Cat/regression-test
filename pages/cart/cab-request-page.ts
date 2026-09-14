import logger from '@wdio/logger'
const log = logger('CabRequestPage')

export class CabRequestSearchPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }
  async cabRequest() {
    const driver = this.driver;
    log.info(
      " ..................................searching for cab request  ........................................",
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
        log.debug("travel policy deviation popup found");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 5000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        log.info("travel policy deviation popup yes button clicked");
      } else {
        log.debug("travel policy deviation popup not found ..");
      }
    } catch (e) {
      log.debug("travel policy deviation popup not found ..");
    }
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]',
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    log.info(
      "proceed button clicked and create travel request screen loaded",
   );
    await driver.pause(6000);
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
        log.debug("travel policy deviation popup found");
        const travelPolicyDeviationPopUpYesButton = await driver.$(
          '//android.widget.Button[@content-desc="Yes"]',
        );
        await travelPolicyDeviationPopUpYesButton.waitForExist({
          timeout: 5000,
        });
        await travelPolicyDeviationPopUpYesButton.click();
        log.info("travel policy deviation popup yes button clicked");
      } else {
        log.debug("travel policy deviation popup not found ..");
      }
    } catch (e) {
      log.debug("travel policy deviation popup not found ..");
    }
    const createTravelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Create Travel Request"]',
    );
    await createTravelRequestScreen.waitForExist({ timeout: 30000 });
    log.info(
      "proceed button clicked and create travel request screen loaded",
   );
    await driver.pause(6000);
  }
  async cabRequestAirportTransferCab() {}
}
