import { CabType } from "./cab-type";
import { ItemType } from "./item-type";
import { JourneyType } from "./joureny-type";
import { TripType } from "./trip-type";
export class Traveller{

    date?: string;
    email?: string;
    
    itemType?: ItemType;
    tripType?: TripType;
    journeyType?: JourneyType;
    cabtype?: CabType;

}