import { TestData } from "../../pages/types/testdata";
import { AddCabPage } from "./add-cab-page";
import { getRandomRoute } from "../../util/common/cities-util";
import { TestsData } from "pages/types/common/data-test";
import { CabRequestSearchPage } from "./cab-request-page";
import { RequestSummaryPage } from "./request-summary-page";
import { FlightRequestSearchPage } from "./flight-request-page";
import { getRandomDomesticAirports } from "../../util/common/airport-util";
import { AddFlightPage } from "./add-flight-page";

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

    console.log("Generated Route CAB:", routeCab);
    console.log("Generated Airport CAB:", airportCab);

    const airportCodes = this.data.airports!.map((a) => a.airport);
    const addFlightPage = new AddFlightPage(driver);
    await addFlightPage.createTravelRequestAddFlightPageOneWay(
      airportCab.origin,
      airportCab.destination,
      airportCodes,
      "ONEWAY",
    );
    console.log(
      "Flight added from",
      airportCab.origin,
      "to",
      airportCab.destination,
    );
    const flightRequestPage = new FlightRequestSearchPage(driver);
    await flightRequestPage.flightRequestSearchOneWay();

    const cabSearchAirportCab = new AddCabPage(driver);

    console.log(
      "Creating AIRPORTTRANSFER CAB from",
      airportCab.origin,
      "to",
      airportCab.destination,
    );
    try {
      await cabSearchAirportCab.cabCreationAirportTransfer();
    } catch (error) {
      console.error("Error during AIRPORTTRANSFER CAB test:", error);
      throw error;
    }
    const cabRequestPage = new CabRequestSearchPage(driver);
    await cabRequestPage.cabRequestAirportTransferCab();
    const requestSummaryCab = new RequestSummaryPage(driver);
    await requestSummaryCab.viewTravelRequestSummaryForCab("AIRPORT_TRANSFER");

    await this.driver.pause(2000);
    console.log(
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
