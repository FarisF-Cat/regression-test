import { TestData } from "../../pages/types/testdata";
import { getRandomRoute } from "../../util/common/cities-util";
import { TestsData } from "pages/types/common/data-test";
import { RequestSummaryPage } from "./request-summary-page";

import { RailRequestSearchPage } from "./rail-request-page";
import { AddRailPage } from "./add-rail-page";

export class TrainCancelPage {
  driver: WebdriverIO.Browser;
  data: TestData;
  railData: TestsData;

  constructor(
    driver: WebdriverIO.Browser,
    data: TestData,
    railData: TestsData,
  ) {
    this.driver = driver;
    this.data = data;
    this.railData = railData;
  }

  async trainCancelRequest() {
    const driver = this.driver;
    const { origin, destination } = getRandomRoute(this.railData);
    await driver.pause(4000);
    console.log(
      "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
    );
    const railSearch = new AddRailPage(driver);
    await railSearch.railCreation(origin, destination);
    console.log(
      "222222222222222222222222222222222222222222222222222222222222222222222222222",
    );
    await driver.pause(3000);
    const railRequestPage = new RailRequestSearchPage(driver);

    await railRequestPage.railRequest();

    await driver.pause(2000);
    const requestSummaryRail = new RequestSummaryPage(driver);
    await requestSummaryRail.viewTravelRequestSummaryForTrain();

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
