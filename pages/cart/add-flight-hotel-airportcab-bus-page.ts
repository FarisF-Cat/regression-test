// import { AddCabPage } from "./add-cab-page";
import { TestsData } from "../../pages/types/common/data-test";
import { getRandomRoute } from "../../util/common/cities-util";
// import { CabRequestSearchPage } from "./cab-request-page";
import { getRandomDomesticAirports } from "../../util/common/airport-util";
import { AddFlightPage } from "./add-flight-page";
import { TestData } from "../../pages/types/testdata";
import { FlightRequestSearchPage } from "./flight-request-page";
import { AddHotelPage } from "./add-hotel-page";
import { getRandomDomesticCity } from "../../util/common/cities-util";
import { HotelRequestSearchPage } from "../../pages/cart/hotel-request-page";
import { AddCabPage } from "./add-cab-page";
import { CabRequestSearchPage } from "./cab-request-page";
import { AddBusPage } from "./add-bus-page";
import { BusRequestSearchPage } from "./bus-request-page";

// import { login } from "../pages/cart/login/login-page";

export class AddFlightHotelAirportCabBusPage {
  driver: WebdriverIO.Browser;
  cabData: TestsData;
  data: TestData;
  busData: TestsData;

  constructor(
    driver: WebdriverIO.Browser,
    cabData: TestsData,
    data: TestData,
    busData: TestsData,
  ) {
  busData: TestsData; 
  constructor(driver: WebdriverIO.Browser, cabData: TestsData, data: TestData,busData: TestsData) {
    this.driver = driver;
    this.cabData = cabData;
    this.data = data;
    this.busData = busData;
  }
  // private getTwoUniqueAirports(
  //   exclude: string[],
  //   airports: string[]
  // ): [string, string] {
  //   const filtered = airports.filter((a) => !exclude.includes(a));
  //   if (filtered.length < 2)
  //     throw new Error("Not enough unique airports for sector 2");
  //   const shuffled = filtered.sort(() => 0.5 - Math.random());
  //   return [shuffled[0], shuffled[1]];
  // }

  async selectLocationOfStay(city: string): Promise<void> {
    const driver = this.driver;

    const searchInput = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")',
      'android=new UiSelector().className("android.widget.EditText")'
    );
    await searchInput.waitForDisplayed({ timeout: 10_000 });
    await searchInput.clearValue();
    await searchInput.setValue(city);

    await driver.pause(2_000);

    const rows = await driver.$$(`//android.view.View[@content-desc]`);

    let match: WebdriverIO.Element | undefined;
    for (const el of rows) {
      const desc = (await el.getAttribute("content-desc")) ?? "";
      if (desc.toLowerCase().includes(city.toLowerCase())) {
        match = el;
        break;
      }
    }

    if (match) {
      await match.click();
    } else if (await rows.length) {
      await rows[0].click();
    } else {
      throw new Error(`No suggestion list appeared for "${city}".`);
    }

    await driver.pause(1_000);
  }

  async scrollUntilVisible(selector: string, maxSwipes = 8) {
    const driver = this.driver;
    const { height, width } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.9);
    const endY = Math.floor(height * 0.05);

    for (let swipe = 1; swipe <= maxSwipes; swipe++) {
      if (await driver.$(selector).isDisplayed()) {
        console.log(`✅ Found element after ${swipe - 1} swipe(s)`);
        return true;
      }

      console.log(`🔄 Swipe #${swipe}`);
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 100 },
            { type: "pointerMove", duration: 1200, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
      await driver.pause(500);
    }

    console.warn(`⚠️ Element not found after ${maxSwipes} swipes`);
    return false;
  }

  async createTravelRequestFlightHotelAirportCabBus() {
    // const driver = this.driver;
    const { origin, destination } = getRandomDomesticAirports(
      this.data.airports!,
      this.data.airports!
    );
    const airportCodes = this.data.airports!.map((a) => a.airport);

    const flightHotelCabBusSearch = new AddFlightPage(this.driver);

    await flightHotelCabBusSearch.createTravelRequestAddFlightPageRoundTrip(
      origin,
      destination,
      airportCodes,
      "ROUNDTRIP",
      "ROUNDTRIP"
    );
    await this.driver.pause(2000);
    const flightRequestPage = new FlightRequestSearchPage(this.driver);
    await flightRequestPage.flightRequestSearchRoundTrip();
    await this.driver.pause(2000);

    const hotelSearch = new AddHotelPage(this.driver);
    await hotelSearch.createHotel(city);

    await hotelRequestPage.hotelRequest();
    await this.driver.pause(2000);
    const routeCab = getRandomRoute(this.cabData);
    const airportCab = getRandomDomesticAirports(this.data.airports!);

    console.log("Generated Route CAB:", routeCab);
    console.log("Generated Airport CAB:", airportCab);

    const cabSearch = new AddCabPage(this.driver);
    await cabSearch.cabCreationAirportTransfer();
    await cabSearch.cabCreationAirportTransfer(this.data);
    await this.driver.pause(2000);
    const cabRequestPage = new CabRequestSearchPage(this.driver);
    await cabRequestPage.cabRequestAirportTransferCab();
    const { origin: busOrigin, destination: busDestination } = getRandomRoute(
      this.busData,
    );
    console.log(
      "9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999Generated Route for BUS :",
      { origin: busOrigin, destination: busDestination },
    );
    const busSearch = new AddBusPage(this.driver);
    await busSearch.busCreation(busOrigin, busDestination);
     const { origin:busOrigin, destination:busDestination } = getRandomRoute(this.busData);
     console.log("9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999Generated Route for BUS :", { origin: busOrigin,destination:busDestination });
const busSearch = new AddBusPage(this.driver);
    await busSearch.busCreation(busOrigin,busDestination);
    await this.driver.pause(2000);
    const busRequestPage = new BusRequestSearchPage(this.driver);
    await busRequestPage.busRequest();
  }
}
