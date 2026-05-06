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

    console.log("MY REQUESTS TAB CLICKED");
    await driver.pause(5000);

    const travelRequestScreen = await driver.$(
      '//android.view.View[@content-desc="Travel Requests"]',
    );
    await travelRequestScreen.waitForExist({
      timeout: 300000,
    });
    console.log("TRAVEL REQUEST SCREEN DISPLAYED");
    // const cards = await driver.$(
    //   "android=new UiScrollable(new UiSelector().scrollable(true))" +
    //     '.getChildByInstance(new UiSelector().className("android.view.View"), 0)',
    // );

    // await cards.waitForDisplayed({ timeout: 20000 });

    // await cards.click();
    console.log("FIRST TRAVEL REQUEST CARD CLICKED");

    // console.log("VIEW DETAILS POPUP BUTTON CLICKED");
    await driver.pause(5000);
    console.log("22222222222222222222222222PAUSED FOR 5 SECONDS");

    console.log("Waiting for travel request cards...");
    console.log("Waiting for travel request card...");
    // CORRECT CODE TO LOCATE FIRST TRAVEL REQUEST CARD
    const firstCard = await driver.$(
      '(//android.view.View[contains(@content-desc,"IBS/")])[1]',
    );
    // const firstCard = await driver.$(
    //   '-android uiautomator:new UiSelector().descriptionStartsWith("IBS/")',
    // );
    console.log(
      "4444444444444444444444444444444444444444444444444444444444444444444444444444444444444444FIRST TRAVEL REQUEST CARD LOCATED",
    );
    await firstCard.waitForDisplayed({ timeout: 60000 });

    await firstCard.click();
    console.log(
      "55555555555555555555555555555555555555555555555555555555555555555555555555555555555FIRST TRAVEL REQUEST CARD CLICKED",
    );
    console.log("FIRST TRAVEL REQUEST CARD CLICKED");

    console.log("FIRST TRAVEL REQUEST CARD CLICKED");

    const viewButton = await driver.$(
      "//android.widget.ScrollView/android.widget.Button[1]",
    );
    await viewButton.click();
    console.log(
      "F???????????????????????????????????????????????????????????IRST TRAVEL REQUEST CARD CLICKED",
    );
    const cancelButton = await driver.$(
      '//android.widget.Button[@content-desc="Cancel"]',
    );
    await cancelButton.waitForExist({
      timeout: 300000,
    });
    await cancelButton.click();

    console.log("CANCEL POPUP BUTTON CLICKED");
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
    // console.log("CONFIRM CANCEL BUTTON CLICKED");
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
    // console.log("CANCEL REQUEST POPUP DISPLAYED");
    // const cancelRequestPopupYesButton = await driver.$(
    //   '//android.widget.Button[@content-desc="Yes"]',
    // );
    // await cancelRequestPopupYesButton.waitForExist({
    //   timeout: 300000,
    // });
    // await cancelRequestPopupYesButton.click();
    // console.log("CANCEL REQUEST POPUP YES BUTTON CLICKED");
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
