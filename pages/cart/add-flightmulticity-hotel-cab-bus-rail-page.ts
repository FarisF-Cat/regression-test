// import { AddCabPage } from "./add-cab-page";
// import { CabRequestSearchPage } from "./cab-request-page";
import { AddFlightPage } from "./add-flight-page";
import { FlightRequestSearchPage } from "./flight-request-page";
import { AddHotelPage } from "./add-hotel-page";
import { HotelRequestSearchPage } from "../../pages/cart/hotel-request-page";
import { AddCabPage } from "./add-cab-page";
import { CabRequestSearchPage } from "./cab-request-page";
import { AddBusPage } from "./add-bus-page";
import { BusRequestSearchPage } from "./bus-request-page";
import { AddRailPage } from "./add-rail-page";
import { RailRequestSearchPage } from "./rail-request-page";
import Page from '../page';

import logger from '@wdio/logger'
const log = logger('AddFlightmulticityHotelCabBusRailPage')


// import { login } from "../pages/cart/login/login-page";

export class AddFlightMultiictyHotelCabBusRailPage extends Page  {

  constructor(driver: WebdriverIO.Browser) {
       super(driver);
  }

  async createTravelRequestFlightMultiCityHotelCabBusRail(params: {
    origin: string;
    destination: string;
    airportCodes: string[];
    city: string;
    cabOrigin: string;
    busOrigin: string;
    busDestination: string;
    railOrigin: string;
    railDestination: string;
  }) {
    // const driver = this.driver;
    const {
      origin,
      destination,
      airportCodes,
      city,
      cabOrigin,
      busOrigin,
      busDestination,
      railOrigin,
      railDestination,
    } = params;

    const flightMultiCityHotelCabBusRailSearch = new AddFlightPage(this.driver);

    await flightMultiCityHotelCabBusRailSearch.createTravelRequestAddFlightPageMultiCity(
      origin,
      destination,
      airportCodes,
    );
    await this.driver.pause(2000);
    const flightRequestPage = new FlightRequestSearchPage(this.driver);
    await flightRequestPage.flightRequestSearchMulticity();
    await this.driver.pause(2000);
    const hotelSearch = new AddHotelPage(this.driver);
    await hotelSearch.createHotel(city);

    
    const hotelRequestPage = new HotelRequestSearchPage(this.driver);
    await hotelRequestPage.hotelRequest();
    await this.driver.pause(2000);
    log.info("generated route for local cab:", { origin: cabOrigin });
    const cabSearch = new AddCabPage(this.driver);
    await cabSearch.cabCreationLocalCab(cabOrigin,"LOCALCAB");
    await this.driver.pause(2000);
    const cabRequestPage = new CabRequestSearchPage(this.driver);
    await cabRequestPage.cabRequest();
    log.info("generated route for bus :", { origin: busOrigin,destination:busDestination });
    const busSearch = new AddBusPage(this.driver);
    await busSearch.busCreation(busOrigin,busDestination);
    await this.driver.pause(2000);
    const busRequestPage = new BusRequestSearchPage(this.driver);
    await busRequestPage.busRequest();
    const railSearch = new AddRailPage(this.driver);
    await railSearch.railCreation(railOrigin, railDestination);
    await this.driver.pause(2000);
    const railRequestPage = new RailRequestSearchPage(this.driver);
    await railRequestPage.railRequest();
  }
}
