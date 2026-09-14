import { AddCabPage } from "./add-cab-page";
import { CabRequestSearchPage } from "./cab-request-page";
import { RequestSummaryPage } from "./request-summary-page";
import { FlightRequestSearchPage } from "./flight-request-page";
import { AddFlightPage } from "./add-flight-page";
import Page from "../page";

import logger from "@wdio/logger";
const log = logger("CabAirportCancelPage");

export class AirportCabCancelPage extends Page {
  constructor(driver: WebdriverIO.Browser) {
    super(driver);
  }

  async airportCabCancelRequest(
    origin: string,
    destination: string,
    airportCodes: string[],
  ) {
    const driver = this.driver;

    log.info("generated airport cab:", { origin, destination });

    const addFlightPage = new AddFlightPage(driver);
    await addFlightPage.createTravelRequestAddFlightPageOneWay(
      origin,
      destination,
      airportCodes,
      "ONEWAY",
    );
    log.info("flight added from", origin, "to", destination);
    const flightRequestPage = new FlightRequestSearchPage(driver);
    await flightRequestPage.flightRequestSearchOneWay();

    const cabSearchAirportCab = new AddCabPage(driver);

    log.info("creating airporttransfer cab from", origin, "to", destination);
    try {
      await cabSearchAirportCab.cabCreationAirportTransfer();
    } catch (error) {
      log.error("error during airporttransfer cab test:", error);
      throw error;
    }
    const cabRequestPage = new CabRequestSearchPage(driver);
    await cabRequestPage.cabRequestAirportTransferCab();
    const requestSummaryCab = new RequestSummaryPage(driver);
    await requestSummaryCab.viewTravelRequestSummaryForCab("AIRPORT_TRANSFER");

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
