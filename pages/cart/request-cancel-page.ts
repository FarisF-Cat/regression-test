import logger from '@wdio/logger'
const log = logger('RequestCancelPage')

export class RequestCancelPage {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async requestCancelScreen() {
    const driver = this.driver;
    await driver.pause(3000);

    const requestTab = await driver.$("~My Requests\nTab 2 of 4");

    await requestTab.waitForDisplayed({ timeout: 25000 });
    await requestTab.click();

    log.info("my requests tab clicked");
    await driver.pause(5000);

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen.waitForExist({
      timeout: 300000,
    });
    log.info("travel request screen displayed");
    // const cards = await driver.$(
    //   "android=new UiScrollable(new UiSelector().scrollable(true))" +
    //     '.getChildByInstance(new UiSelector().className("android.view.View"), 0)',
    // );

    // await cards.waitForDisplayed({ timeout: 20000 });

    // await cards.click();
    log.info("first travel request card clicked");

    // log.info("view details popup button clicked");
    await driver.pause(5000);
    log.info("22222222222222222222222222paused for 5 second");

    log.info("waiting for travel request cards..");
    log.info("waiting for travel request card..");
    // CORRECT CODE TO LOCATE FIRST TRAVEL REQUEST CARD
    const firstCard = await driver.$(
      '(//android.view.View[contains(@content-desc,"IBS/")])[1]',
    );
    // const firstCard = await driver.$(
    //   '-android uiautomator:new UiSelector().descriptionStartsWith("IBS/")',
    // );
    log.info(
      "4444444444444444444444444444444444444444444444444444444444444444444444444444444444444444first travel request card located",
   );
    await firstCard.waitForDisplayed({ timeout: 60000 });

    await firstCard.click();
    log.info(
      "55555555555555555555555555555555555555555555555555555555555555555555555555555555555first travel request card clicked",
   );
    log.info("first travel request card clicked");

    log.info("first travel request card clicked");

    const viewButton = await driver.$(
      "//android.widget.ScrollView/android.widget.Button[1]",
    );
    await viewButton.click();
    log.info(
      "f???????????????????????????????????????????????????????????irst travel request card clicked",
   );
    const cancelButton = await driver.$(
      '//android.widget.Button[@content-desc="Cancel"]',
    );
    await cancelButton.waitForExist({
      timeout: 300000,
    });
    await cancelButton.click();

    log.info("cancel popup button clicked");
    await driver.pause(2000);
    // const cancelBtn = await driver.$(
    //   '//android.widget.Button[@content-desc="Cancel Request"]',
    // );
    // await cancelBtn.click();
    // await this.driver.pause(2000);
    const cancelRequest = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );
    await cancelRequest.click();
    // const cancelPopupButton = await driver.$(
    //   '//android.widget.Button[@content-desc="Cancel"]',
    // );
    // await cancelPopupButton.waitForExist({
    //   timeout: 300000,
    // });
    // await cancelPopupButton.click();
    // log.info("confirm cancel button clicked");
    // await driver.pause(5000);
    // const cancelBtn = await driver.$(
    //   '//android.widget.Button[@content-desc="Cancel Request"]',
    // );
    // await cancelBtn.click();
    // await this.driver.pause(2000);
    // const cancelRequest = await driver.$(
    //   '//android.widget.Button[@content-desc="Yes"]',
    // );
    // await cancelRequest.click();
    // await this.driver.pause(2000);
    // const cancelRequestPopup = await driver.$(
    //   '//android.view.View[@content-desc="Cancel Request"]',
    // );
    // await cancelRequestPopup.waitForExist({
    //   timeout: 300000,
    // });
    // log.info("cancel request popup displayed");
    // const cancelRequestPopupYesButton = await driver.$(
    //   '//android.widget.Button[@content-desc="Yes"]',
    // );
    // await cancelRequestPopupYesButton.waitForExist({
    //   timeout: 300000,
    // });
    // await cancelRequestPopupYesButton.click();
    // log.info("cancel request popup yes button clicked");
    await driver.pause(2000);
    const backButton = await driver.$(
      '//android.widget.Button[@content-desc="Back"]',
    );
    await backButton.waitForExist({
      timeout: 300000,
    });
    await backButton.click();
  }
}
