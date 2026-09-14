import logger from '@wdio/logger'
const log = logger('ExpenseReportBillPage')

export class ExpenseReportBill {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async expenseReportBillScreen() {
    const driver = this.driver;
    await driver.pause(3000);
    const menuTab = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button',
    );
    await menuTab.waitForDisplayed({ timeout: 25000 });
    await menuTab.click();
    log.info("menu tab clicked");
    await driver.pause(5000);
    const expenseTab = await driver.$(
      '//android.view.View[@content-desc="Expense"]',
    );
    await expenseTab.waitForDisplayed({ timeout: 25000 });
    await expenseTab.click();
    log.info("expense report tab clicked");
    await driver.pause(5000);
    const firstCard = await driver.$(
      "(//android.view.View[contains(@content-desc,'Submitted by')])[1]",
    );

    await firstCard.waitForDisplayed({ timeout: 25000 });
    await firstCard.click();
    const viewBill = await driver.$(
      "//android.view.View[@content-desc='View Bill']",
    );
    await viewBill.waitForDisplayed({ timeout: 25000 });
    log.info("request details displayed");
    await viewBill.click();

    const viewEntryDetailsBackButton = await driver.$(
      "//android.widget.Button[@content-desc='Back']",
    );
    await viewEntryDetailsBackButton.waitForDisplayed({ timeout: 25000 });
    log.info("back button displayed");
    await viewEntryDetailsBackButton.click();
  }
}
