import { TestData } from "../../pages/types/testdata";
import { AddCabPage } from "./add-cab-page";
import { getRandomRoute } from "../../util/common/cities-util";
import { TestsData } from "pages/types/common/data-test";
import { CabRequestSearchPage } from "./cab-request-page";
import { RequestSummaryPage } from "./request-summary-page";
import { FlightRequestSearchPage } from "./flight-request-page";
import { getRandomDomesticAirports } from "../../util/common/airport-util";
import { AddFlightPage } from "./add-flight-page";
import logger from '@wdio/logger'
const log = logger('CabAirportCancelPage')


export class AirportCabCancelPage {
  driver: WebdriverIO.Browser;
  data: TestData;
  cabData: TestsData;

  constructor(driver: WebdriverIO.Browser, data: TestData, cabData: TestsData) {
    this.driver = driver;
    this.data = data;
    this.cabData = cabData;
  }

  async airportCabCancelRequest() {
    const driver = this.driver;
    const routeCab = getRandomRoute(this.cabData);
    const airportCab = getRandomDomesticAirports(this.data.airports!);

    log.info("generated route cab:", routeCab);
    log.info("generated airport cab:", airportCab);

    const airportCodes = this.data.airports!.map((a) => a.airport);
    const addFlightPage = new AddFlightPage(driver);
    await addFlightPage.createTravelRequestAddFlightPageOneWay(
      airportCab.origin,
      airportCab.destination,
      airportCodes,
      "ONEWAY",
    );
    log.info(
      "flight added from",
      airportCab.origin,
      "to",
      airportCab.destination,
   );
    const flightRequestPage = new FlightRequestSearchPage(driver);
    await flightRequestPage.flightRequestSearchOneWay();

    const cabSearchAirportCab = new AddCabPage(driver);

    log.info(
      "creating airporttransfer cab from",
      airportCab.origin,
      "to",
      airportCab.destination,
   );
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
