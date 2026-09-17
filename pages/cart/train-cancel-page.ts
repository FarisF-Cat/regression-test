import Page from "../page";

import { RequestSummaryPage } from "./request-summary-page";

import { RailRequestSearchPage } from "./rail-request-page";
import { AddRailPage } from "./add-rail-page";
import logger from "@wdio/logger";
const log = logger("TrainCancelPage");

export class TrainCancelPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async trainCancelRequest(origin: string, destination: string) {
    const driver = this.driver;
    await driver.pause(4000);
    const railSearch = new AddRailPage(driver);
    await railSearch.railCreation(origin, destination);

    await driver.pause(3000);
    const railRequestPage = new RailRequestSearchPage(driver);

    await railRequestPage.railRequest();

    await driver.pause(2000);
    const requestSummaryRail = new RequestSummaryPage(driver);
    await requestSummaryRail.viewTravelRequestSummaryForTrain();

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
