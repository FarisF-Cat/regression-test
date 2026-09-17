import { AddHotelPage } from "./add-hotel-page";
import Page from "../page";

import { RequestSummaryPage } from "../../pages/cart/request-summary-page";
import { HotelRequestSearchPage } from "./hotel-request-page";
import logger from "@wdio/logger";
const log = logger("HotelCancelPage");

export class HotelCancelPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async hotelCancelRequest(city: string) {
    const driver = this.driver;

    log.info("generated route for hotel :", { city });

    await driver.pause(2000);

    const createTravelRequestHotel = new AddHotelPage(driver);
    await createTravelRequestHotel.createHotel(city);

    await driver.pause(2000);

    const hotelRequest = new HotelRequestSearchPage(driver);

    await hotelRequest.hotelRequest();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForHotel();

    await driver.pause(2000);
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
