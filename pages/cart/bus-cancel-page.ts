import { RequestSummaryPage } from "./request-summary-page";
import { AddBusPage } from "./add-bus-page";
import { BusRequestSearchPage } from "../../pages/cart/bus-request-page";
import logger from "@wdio/logger";
import Page from "../page";

const log = logger("BusCancelPage");

export class BusCancelPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async busCancelRequest(origin: string, destination: string) {
    const driver = this.driver;
    await driver.pause(2000);

    const busSearch = new AddBusPage(driver);
    await busSearch.busCreation(origin, destination);

    const busRequestPage = new BusRequestSearchPage(driver);

    await busRequestPage.busRequest();

    await driver.pause(2000);
    const requestSummaryBus = new RequestSummaryPage(driver);
    await requestSummaryBus.viewTravelRequestSummaryForBus();

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
