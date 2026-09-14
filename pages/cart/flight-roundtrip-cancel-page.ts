import { AddFlightPage } from "./add-flight-page";
import { FlightRequestSearchPage } from "./flight-request-page";
import { RequestSummaryPage } from "../../pages/cart/request-summary-page";
import Page from "../page";

import logger from "@wdio/logger";
const log = logger("FlightRoundtripCancelPage");

export class FlightRoundTripCancelPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async flightRoundTripCancelRequest(
    origin: string,
    destination: string,
    airportCodes: string[],
  ) {
    const driver = this.driver;
    const flightCancelOneway = new AddFlightPage(this.driver);

    await flightCancelOneway.createTravelRequestAddFlightPageRoundTrip(
      origin,
      destination,
      airportCodes,
      "ROUNDTRIP",
    );
    await this.driver.pause(2000);
    const flightRequestPage = new FlightRequestSearchPage(this.driver);
    await flightRequestPage.flightRequestSearchRoundTrip();
    await this.driver.pause(2000);
    const requestSummaryPage = new RequestSummaryPage(driver);

    await requestSummaryPage.viewTravelRequestSummaryForFlight();
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
