import { AirportCity } from "pages/types/common/airport-city-map";


export class IataUtil {
    private static iataCodes: string[] = [];
  
    static addIataCode(code: string) {
      if (code && !this.iataCodes.includes(code)) {
        this.iataCodes.push(code);
      }
    }
  
    static getIataCodes(): string[] {
      return this.iataCodes;
    }
  
    static clear() {
      this.iataCodes = [];
    }
    
    static getCityForIata(iataCode: string, airportData: AirportCity[]): string | undefined {
        const cityData = airportData.find(item => item.airport === iataCode);
        if (cityData) {
          return cityData.city; // Return the city name
        }
        console.log(`City for ${iataCode} not found in the data`); // Debug log
        return undefined; // Return undefined if the city is not found
      }



     

}

