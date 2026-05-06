export class CashAdvanceTravelRequest {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async cashAdvanceTravelScreen() {
    const driver = this.driver;
    await driver.pause(3000);
    const menuTab = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button',
    );
    await menuTab.waitForDisplayed({ timeout: 25000 });
    await menuTab.click();
    console.log("MENU TAB CLICKED");
    await driver.pause(5000);
    const cashAdvanceTab = await driver.$(
      '//android.view.View[@content-desc="Cash Advance"]',
    );
    await cashAdvanceTab.waitForDisplayed({ timeout: 25000 });
    await cashAdvanceTab.click();
    console.log("CASH ADVANCE TAB CLICKED");
    await driver.pause(5000);
    const firstCard = await driver.$(
      "(//android.view.View[contains(@content-desc,'Submitted by')])[1]",
    );

    await firstCard.waitForDisplayed({ timeout: 25000 });
    await firstCard.click();
    const viewDetails = await driver.$(
      "//android.view.View[@content-desc='View Detail']",
    );
    await viewDetails.waitForDisplayed({ timeout: 25000 });
    console.log("REQUEST DETAILS DISPLAYED");
    await viewDetails.click();
    await driver.pause(6000);

    const viewEntryDetailsBackButton = await driver.$(
      "//android.widget.Button[@content-desc='Back']",
    );
    await viewEntryDetailsBackButton.waitForDisplayed({ timeout: 25000 });
    console.log("BACK BUTTON DISPLAYED");
    await viewEntryDetailsBackButton.click();
  }
}
