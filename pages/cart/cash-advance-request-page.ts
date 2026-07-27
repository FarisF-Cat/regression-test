import logger from '@wdio/logger'

const log = logger('CashAdvanceRequestPage')

async function probeElement(
  driver: WebdriverIO.Browser,
  selector: string,
  attempts = 25,
  interval = 1000,
): Promise<WebdriverIO.Element> {
  for (let i = 0; i < attempts; i++) {
    const els = await driver.$$(selector);
    if (els.length > 0) {
      const isDisplayed = await els[0].isDisplayed().catch(() => false);
      if (isDisplayed) return els[0];
    }
    await driver.pause(interval);
  }
  throw new Error(`Element not found after ${attempts} attempts: ${selector}`);
}

export class CashAdvanceRequest {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async cashAdvanceScreen() {
    const driver = this.driver;

    await driver.pause(6000);

    const menuTab = await probeElement(
      driver,
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button',
      30,
      1000,
    );
    await menuTab.click();
    log.info('menu tab clicked');
    await driver.pause(5000);

    const cashAdvanceTab = await probeElement(
      driver,
      '//android.view.View[@content-desc="Cash Advance"]',
      25,
      1000,
    );
    await cashAdvanceTab.click();
    log.info('cash advance tab clicked');
    await driver.pause(5000);

    const firstCard = await probeElement(
      driver,
      "(//android.view.View[contains(@content-desc,'Submitted by')])[1]",
      35,
      1000,
    );
    // const firstCard = await driver.$(   'android=new UiSelector().className("android.widget.Button").instance(2)');
    await firstCard.click();
    log.info('first cash advance card clicked');

    const viewDetails = await probeElement(
      driver,
      "//android.view.View[@content-desc='View Detail']",
      25,
      1000,
    );
    log.info('request details displayed');
    await viewDetails.click();
    await driver.pause(6000);

    const viewEntryDetailsBackButton = await probeElement(
      driver,
      "//android.widget.Button[@content-desc='Back']",
      25,
      1000,
    );
    log.info('back button displayed');
    await viewEntryDetailsBackButton.click();
    await driver.pause(6000);

    const auditViewButton = await probeElement(
      driver,
      'android=new UiSelector().className("android.widget.Button").instance(1)',
      25,
      1000,
    );
    log.info('audit details displayed');
    await auditViewButton.click();
    await driver.pause(6000);

    const workFlowAuditButton = await probeElement(
      driver,
      '//android.widget.Button[@content-desc="Workflow Audit"]',
      25,
      1000,
    );
    log.info('workflow audit button displayed');
    await workFlowAuditButton.click();
    await driver.pause(6000);

    const workflowAuditDoneButton = await probeElement(
      driver,
      '//android.widget.Button[@content-desc="Done"]',
      25,
      1000,
    );
    log.info('done button displayed');
    await workflowAuditDoneButton.click();
  }
}
