// import { Airport } from "././common/airport";

// // import { Config } from "../types/config";
// import { Account } from "./../types/common/account";



// export class TestData {
//   accounts?: Account[] = [];
//   airports?: Airport[] = [];
//   // env!: Config;
// }


import { Account } from "././common/account";
import{ Employee } from "././common/employe";
import { Airport } from "././common/airport";
import { City } from "././common/city";
import { Traveller } from "././common/traveller";
import { AirportCity } from "./common/airport-city-map";
import { AirportTransfer } from "./common/airporttransfer";

export class TestData {
    accounts?: Account[];
    employees?: Employee[];
    airports?: Airport[];
    cities?: City[];
    traveller? : Traveller[];
    airportcity?: AirportCity[];
         airporttransfer?: AirportTransfer[];
    
}



