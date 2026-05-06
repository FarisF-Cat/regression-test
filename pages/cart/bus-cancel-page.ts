import { TestData } from "../../pages/types/testdata";
import { getRandomRoute } from "../../util/common/cities-util";
import { TestsData } from "pages/types/common/data-test";
import { RequestSummaryPage } from "./request-summary-page";
import { AddBusPage } from "./add-bus-page";
import { BusRequestSearchPage } from "../../pages/cart/bus-request-page";

export class BusCancelPage {
  driver: WebdriverIO.Browser;
  data: TestData;
  busData: TestsData;

  constructor(driver: WebdriverIO.Browser, data: TestData, busData: TestsData) {
    this.driver = driver;
    this.data = data;
    this.busData = busData;
  }

  async busCancelRequest() {
    const driver = this.driver;
    const { origin, destination } = getRandomRoute(this.busData);
    await driver.pause(2000);

    const busSearch = new AddBusPage(driver);
    await busSearch.busCreation(origin, destination);

    const busRequestPage = new BusRequestSearchPage(driver);

    await busRequestPage.busRequest();

    await driver.pause(2000);
    const requestSummaryBus = new RequestSummaryPage(driver);
    await requestSummaryBus.viewTravelRequestSummaryForBus();

    await this.driver.pause(2000);
    console.log(
      "444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444...",
    );
    const firstViewBtn = await driver.$(
      "(//android.view.View[contains(@content-desc,'IBS/')])[1]//android.widget.Button",
    );

    await firstViewBtn.waitForDisplayed({ timeout: 10000 });

    console.log(
      "55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555...",
    );
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
