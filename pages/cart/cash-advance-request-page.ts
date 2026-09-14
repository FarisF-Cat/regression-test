import logger from "@wdio/logger";
import Page from "../page";

const log = logger("CashAdvanceRequestPage");

export class CashAdvanceRequest extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async cashAdvanceScreen() {
    const driver = this.driver;

    await driver.pause(6000);

    const menuTab = await this.probeVisibleElement(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button',
      30,
      1000,
    );
    await menuTab.click();
    log.info("menu tab clicked");
    await driver.pause(5000);

    const cashAdvanceTab = await this.probeVisibleElement(
      '//android.view.View[@content-desc="Cash Advance"]',
      25,
      1000,
    );
    await cashAdvanceTab.click();
    log.info("cash advance tab clicked");
    await driver.pause(5000);

    const firstCard = await this.probeVisibleElement(
      "(//android.view.View[contains(@content-desc,'Submitted by')])[1]",
      35,
      1000,
    );
    // const firstCard = await driver.$(   'android=new UiSelector().className("android.widget.Button").instance(2)');
    await firstCard.click();
    log.info("first cash advance card clicked");

    const viewDetails = await this.probeVisibleElement(
      "//android.view.View[@content-desc='View Detail']",
      25,
      1000,
    );
    log.info("request details displayed");
    await viewDetails.click();
    await driver.pause(6000);

    const viewEntryDetailsBackButton = await this.probeVisibleElement(
      "//android.widget.Button[@content-desc='Back']",
      25,
      1000,
    );
    log.info("back button displayed");
    await viewEntryDetailsBackButton.click();
    await driver.pause(6000);

    const auditViewButton = await this.probeVisibleElement(
      'android=new UiSelector().className("android.widget.Button").instance(1)',
      25,
      1000,
    );
    log.info("audit details displayed");
    await auditViewButton.click();
    await driver.pause(6000);

    const workFlowAuditButton = await this.probeVisibleElement(
      '//android.widget.Button[@content-desc="Workflow Audit"]',
      25,
      1000,
    );
    log.info("workflow audit button displayed");
    await workFlowAuditButton.click();
    await driver.pause(6000);

    const workflowAuditDoneButton = await this.probeVisibleElement(
      '//android.widget.Button[@content-desc="Done"]',
      25,
      1000,
    );
    log.info("done button displayed");
    await workflowAuditDoneButton.click();
  }
}
