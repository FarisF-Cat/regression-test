export type JourneyType = 'ONEWAY' | 'ROUNDTRIP' | 'MULTICITY';
export type TripType = 'DOMESTIC' | 'INTERNATIONAL';



export interface FlightRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
    journeyType: JourneyType; // ✅ Add this

}
