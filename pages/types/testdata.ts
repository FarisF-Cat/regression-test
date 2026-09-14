import { Account } from "./common/account";
import { Employee } from "./common/employe";
import { Airport } from "./common/airport";
import { City } from "./common/city";
import { Traveller } from "./common/traveller";
import { Route } from "./common/routes";
import { AirportTransfer } from "./common/airporttransfer";
import { AirportCity } from "./common/airport-city-map";
import { HotelStayLocation } from "./common/hotel-stay-location";

/**
 * The test data every loader produces: accounts, employees and the reference
 * lists the specs draw origins/destinations/cities from.
 *
 * This was previously split across two interchangeable names — `TestData`
 * here and `TestsData` in `common/data-test` — with every loader actually
 * returning the latter. They are now one type.
 */
export class TestData {
  accounts?: Account[];
  employees?: Employee[];
  airports?: Airport[];
  cities?: City[];
  traveller?: Traveller[];
  routes?: Route[];
  airporttransfer?: AirportTransfer[];
  airportcity?: AirportCity[];
  HotelStayLocation?: HotelStayLocation[];
}
