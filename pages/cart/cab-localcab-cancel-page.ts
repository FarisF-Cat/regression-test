import { TestData } from "../../pages/types/testdata";
import { AddCabPage } from "./add-cab-page";
import { getRandomRoute } from "../../util/common/cities-util";
import { TestsData } from "pages/types/common/data-test";
import { CabRequestSearchPage } from "./cab-request-page";
import { RequestSummaryPage } from "./request-summary-page";
import logger from '@wdio/logger'
const log = logger('CabLocalcabCancelPage')


export class LocalCabCancelPage {
  driver: WebdriverIO.Browser;
  data: TestData;
  cabData: TestsData;

  constructor(driver: WebdriverIO.Browser, data: TestData, cabData: TestsData) {
    this.driver = driver;
    this.data = data;
    this.cabData = cabData;
  }

  async localCabCancelRequest() {
    const driver = this.driver;
    const { origin, destination } = getRandomRoute(this.cabData);
    log.info("generated route for local cab:", { origin, destination );
    const localCabCancel = new AddCabPage(this.driver);

    await localCabCancel.cabCreationLocalCab(origin, "LOCALCAB");
    await this.driver.pause(2000);
    const cabRequestPage = new CabRequestSearchPage(this.driver);
    await cabRequestPage.cabRequest();
    await this.driver.pause(2000);
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForCab("LOCAL");
    await this.driver.pause(2000);
    log.info(
      "444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444...",
   );
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
