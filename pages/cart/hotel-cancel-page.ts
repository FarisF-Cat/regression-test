import { AddHotelPage } from "./add-hotel-page";
import { getRandomDomesticCity } from "../../util/common/cities-util";

import { RequestSummaryPage } from "../../pages/cart/request-summary-page";
import { HotelRequestSearchPage } from "./hotel-request-page";
import { TestsData } from "pages/types/common/data-test";

export class HotelCancelPage {
  driver: WebdriverIO.Browser;
  data: TestsData;

  constructor(driver: WebdriverIO.Browser, data: TestsData) {
    this.driver = driver;
    this.data = data;
  }

  async hotelCancelRequest() {
    const driver = this.driver;

    const { city } = getRandomDomesticCity(this.data);
    console.log("Generated Route for HOTEL :", { city });
    // const homePage = new HomePage(driver);

    await driver.pause(2000);
    // await homePage.login(data, "COMPANY_ADMIN");

    const createTravelRequestHotel = new AddHotelPage(driver);
    await createTravelRequestHotel.createHotel(city);

    await driver.pause(2000);

    const hotelRequest = new HotelRequestSearchPage(driver);

    await hotelRequest.hotelRequest();

    await driver.pause(2000);

    const requestSummaryOneWay = new RequestSummaryPage(driver);

    await requestSummaryOneWay.viewTravelRequestSummaryForHotel();

    await driver.pause(2000);
    // await homePage.logout();
    await this.driver.pause(2000);
    console.log("4444444444444444444444444444444444444..");
    const firstViewBtn = await driver.$(
      "(//android.view.View[contains(@content-desc,'IBS/')])[1]//android.widget.Button",
    );

    await firstViewBtn.waitForDisplayed({ timeout: 10000 });

    console.log("5555555555555555555555555555555555555555555555...");
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
