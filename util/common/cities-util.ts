

  // util/common/cities-util.ts
import { TestData } from "../../pages/types/testdata";
import { HotelTestData } from "pages/types/common/hotel-test-data";
import { HotelStayLocation } from "pages/types/common/hotel-stay-location";
import { Route } from "pages/types/common/routes";
export function getRandomCity(hotelData: HotelTestData): HotelStayLocation {
  const list = hotelData.locationData ?? [];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

// FUNCTION USED IN BUS FOR GETTING THE FROM AND THE TO LOCATION
export function getRandomRoute(data: TestData): Route {
  if (!data.routes || data.routes.length === 0) {
    throw new Error("No routes found in data.");
  }
  const randomIndex = Math.floor(Math.random() * data.routes.length);
  return data.routes[randomIndex];
}
export function getRandomDomesticCity(data: TestData): { city: string } {
  if (!data.cities || !Array.isArray(data.cities)) {
    throw new Error('cities list is undefined or not an array in test data');
  }

  const domesticCities = data.cities.filter(place => place.type === 'DOMESTIC' && place.city);

  if (domesticCities.length === 0) {
    throw new Error('No valid domestic cities with names available.');
  }

  const randomIndex = Math.floor(Math.random() * domesticCities.length);
  const selected = domesticCities[randomIndex];

  return { city: selected.city! }; // non-null assertion
}