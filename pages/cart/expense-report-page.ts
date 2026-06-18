export class ExpenseReport {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  async expenseReportScreen() {
    const driver = this.driver;
    await driver.pause(3000);
    const menuTab = await driver.$(
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button',
    );
    await menuTab.waitForDisplayed({ timeout: 25000 });
    await menuTab.click();
    console.log("MENU TAB CLICKED");
    await driver.pause(5000);
    const expenseTab = await driver.$(
      '//android.view.View[@content-desc="Expense"]',
    );
    await expenseTab.waitForDisplayed({ timeout: 25000 });
    await expenseTab.click();
    console.log("EXPENSE REPORT TAB CLICKED");
    await driver.pause(5000);
    console.log(
      "......................................EXPENSE REPORTS DISPLAYED, NOW CLICKING FIRST CARD.....................................................",
    const firstCard = await driver.$(
      "(//android.view.View[contains(@content-desc,'Submitted by')])[1]",
    );

    const firstCard = await driver.$("~Submitted by");
    // await driver.$(
    //   '//android.view.View[contains(@content-desc,"Submitted by")]',
    // );
    console.log(
      "...............................................FIRST CARD LOCATED",
    );
    await firstCard.waitForExist({ timeout: 35000 });
    await firstCard.scrollIntoView();
    console.log(
      "...................................................FIRST CARD SCROLLED INTO VIEW",
    );
    await firstCard.waitForDisplayed({ timeout: 35000 });
    await firstCard.waitForDisplayed({ timeout: 25000 });
    await firstCard.click();

    console.log("FIRST CARD CLICKED");
    // const firstCard = await driver.$(
    //   "(//android.view.View[contains(@content-desc,'Submitted by')])[1]",
    // );

    // await firstCard.waitForDisplayed({ timeout: 35000 });
    // await firstCard.click();
    // console.log("FIRST CARD CLICKED");
    await driver.pause(5000);
    const viewDetails = await driver.$(
      "//android.view.View[@content-desc='View Detail']",
    );
    await viewDetails.waitForDisplayed({ timeout: 35000 });
    await viewDetails.waitForDisplayed({ timeout: 25000 });
    console.log("REQUEST DETAILS DISPLAYED");
    await viewDetails.click();
    await driver.pause(6000);
    const viewEntryDetailsBackButton = await driver.$(
      "//android.widget.Button[@content-desc='Back']",
    );
    await viewEntryDetailsBackButton.waitForDisplayed({ timeout: 35000 });
    await viewEntryDetailsBackButton.waitForDisplayed({ timeout: 25000 });
    console.log("BACK BUTTON DISPLAYED");
    await viewEntryDetailsBackButton.click();
    const viewBill = await driver.$(
      "//android.view.View[@content-desc='View Bill']",
    );
    await viewBill.waitForDisplayed({ timeout: 35000 });
    await viewBill.waitForDisplayed({ timeout: 25000 });
    console.log("REQUEST DETAILS DISPLAYED");
    await viewBill.click();
    await driver.pause(6000);

    const viewEntryDetailsBackButtonBill = await driver.$(
      "//android.widget.Button[@content-desc='Back']",
    );
    await viewEntryDetailsBackButtonBill.waitForDisplayed({ timeout: 35000 });
    await viewEntryDetailsBackButtonBill.waitForDisplayed({ timeout: 25000 });
    console.log("BACK BUTTON DISPLAYED");
    await viewEntryDetailsBackButtonBill.click();

    const auditViewButton = await driver.$(
      'android=new UiSelector().className("android.widget.Button").instance(1)',
    );
    await auditViewButton.waitForDisplayed({ timeout: 35000 });
    await auditViewButton.waitForDisplayed({ timeout: 25000 });
    console.log("AUDIT  DETAILS DISPLAYED");
    await auditViewButton.click();
    await driver.pause(6000);
    const workFlowAuditButton = await driver.$(
      '//android.widget.Button[@content-desc="Workflow Audit"]',
    );
    await workFlowAuditButton.waitForDisplayed({ timeout: 35000 });
    await workFlowAuditButton.waitForDisplayed({ timeout: 25000 });
    console.log("AUDIT  DETAILS DISPLAYED");
    await workFlowAuditButton.click();
    await driver.pause(6000);
    const workflowAuditDoneButton = await driver.$(
      '//android.widget.Button[@content-desc="Done"]',
    );
    await workflowAuditDoneButton.waitForDisplayed({ timeout: 35000 });
    await workflowAuditDoneButton.waitForDisplayed({ timeout: 25000 });
    console.log("DONE BUTTON DISPLAYED");
    await workflowAuditDoneButton.click();
  }
}
