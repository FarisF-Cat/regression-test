import { Account } from "./account";
import { Employee } from "./employe";
import { Airport } from "./airport";
import { City } from "./city";
import { Traveller } from "./traveller";
import { Route } from "./routes";
import { AirportTransfer } from "./airporttransfer";
import { AirportCity } from "./airport-city-map";
import { HotelStayLocation } from "./hotel-stay-location";

export class TestsData {
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
////data tests 