import Page from "../page";

import logger from "@wdio/logger";
const log = logger("RequestCancelPage");

export class RequestCancelPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
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

    log.info("first travel request card clicked");

    await driver.pause(5000);

    log.info("waiting for travel request card..");
    // CORRECT CODE TO LOCATE FIRST TRAVEL REQUEST CARD
    const firstCard = await driver.$(
      '(//android.view.View[contains(@content-desc,"IBS/")])[1]',
    );

    await firstCard.waitForDisplayed({ timeout: 60000 });

    await firstCard.click();

    log.info("first travel request card clicked");

    const viewButton = await driver.$(
      "//android.widget.ScrollView/android.widget.Button[1]",
    );
    await viewButton.click();
    log.info("first travel request card clicked");
    const cancelButton = await driver.$(
      '//android.widget.Button[@content-desc="Cancel"]',
    );
    await cancelButton.waitForExist({
      timeout: 300000,
    });
    await cancelButton.click();

    log.info("cancel popup button clicked");
    await driver.pause(2000);
    const cancelRequest = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );
    await cancelRequest.click();
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
