import { AddFlightPage } from "./add-flight-page";
import { FlightRequestSearchPage } from "./flight-request-page";
import { getRandomDomesticAirports } from "../../util/common/airport-util";
import { TestData } from "../../pages/types/testdata";
import { RequestSummaryPage } from "../../pages/cart/request-summary-page";

export class FlightOnewayCancelPage {
  driver: WebdriverIO.Browser;
  data: TestData;

  constructor(driver: WebdriverIO.Browser, data: TestData) {
    this.driver = driver;
    this.data = data;
  }

  async flightCancelRequest() {
    const driver = this.driver;
    const { origin, destination } = getRandomDomesticAirports(
      this.data.airports!,
    );
    const airportCodes = this.data.airports!.map((a) => a.airport);
    const flightCancelOneway = new AddFlightPage(this.driver);

    await flightCancelOneway.createTravelRequestAddFlightPageOneWay(
      origin,
      destination,
      airportCodes,
      "ONEWAY",
    );
    await this.driver.pause(2000);
    const flightRequestPage = new FlightRequestSearchPage(this.driver);
    await flightRequestPage.flightRequestSearchOneWay();
    await this.driver.pause(2000);
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlight();
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
