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
import Page from '../page';

import logger from '@wdio/logger'

const log = logger('AddFlightHotelAirportcabBusPage')
 
 
// import { login } from "../pages/cart/login/login-page";
 
export class AddFlightHotelAirportCabBusPage extends Page {


  constructor(driver: WebdriverIO.Browser) {
        super(driver);

  }

  
  async createTravelRequestFlightHotelAirportCabBus(params: {
    origin: string;
    destination: string;
    airportCodes: string[];
    city: string;
    busOrigin: string;
    busDestination: string;
  }) {

    // const driver = this.driver;

    const {
      origin,
      destination,
      airportCodes,
      city,
      busOrigin,
      busDestination,
    } = params;

    const flightHotelCabBusSearch = new AddFlightPage(this.driver);
 
    await flightHotelCabBusSearch.createTravelRequestAddFlightPageRoundTrip(

      origin,

      destination,

      airportCodes,

      "ROUNDTRIP"

    );

    await this.driver.pause(2000);

    const flightRequestPage = new FlightRequestSearchPage(this.driver);

    await flightRequestPage.flightRequestSearchRoundTrip();

    await this.driver.pause(2000);

    const hotelSearch = new AddHotelPage(this.driver);

    await hotelSearch.createHotel(city);
 
    

     const hotelRequestPage = new HotelRequestSearchPage(this.driver);

    await hotelRequestPage.hotelRequest();

    await this.driver.pause(2000);

    const cabSearch = new AddCabPage(this.driver);

    await cabSearch.cabCreationAirportTransfer();

    await this.driver.pause(2000);

    const cabRequestPage = new CabRequestSearchPage(this.driver);

    await cabRequestPage.cabRequestAirportTransferCab();

     log.info("!!! generated route for bus :", { origin: busOrigin,destination:busDestination });

const busSearch = new AddBusPage(this.driver);

    await busSearch.busCreation(busOrigin,busDestination);

    await this.driver.pause(2000);

    const busRequestPage = new BusRequestSearchPage(this.driver);

    await busRequestPage.busRequest();

  }

}
 