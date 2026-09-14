import { AddCabPage } from "./add-cab-page";
import { CabRequestSearchPage } from "./cab-request-page";
import { RequestSummaryPage } from "./request-summary-page";
import Page from "../page";

import logger from "@wdio/logger";
const log = logger("CabLocalcabCancelPage");

export class LocalCabCancelPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async localCabCancelRequest(origin: string) {
    const driver = this.driver;
    log.info("generated route for local cab:", { origin });
    const localCabCancel = new AddCabPage(this.driver);

    await localCabCancel.cabCreationLocalCab(origin, "LOCALCAB");
    await this.driver.pause(2000);
    const cabRequestPage = new CabRequestSearchPage(this.driver);
    await cabRequestPage.cabRequest();
    await this.driver.pause(2000);
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForCab("LOCAL");
    await this.driver.pause(2000);

    const firstViewBtn = await driver.$(
      "(//android.view.View[contains(@content-desc,'IBS/')])[1]//android.widget.Button",
    );

    await firstViewBtn.waitForDisplayed({ timeout: 10000 });

    await firstViewBtn.click();
    await this.driver.pause(2000);
    const cancelBtn = await driver.$(
      '//android.widget.Button[@content-desc="Cancel Request"]',
    );
    await cancelBtn.click();
    await this.driver.pause(2000);
    const cancelRequest = await driver.$(
      '//android.widget.Button[@content-desc="Yes"]',
    );
    await cancelRequest.click();
    await this.driver.pause(2000);
  }
}
