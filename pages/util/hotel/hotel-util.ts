import * as fs from "fs/promises";  
import { HotelStayLocation } from "pages/types/common/hotel-stay-location";
import { HotelTestData } from "../../types/common/hotel-test-data";
// import { HotelTestData } from "pages/types/common/hotel-test-data";
import path from "path";

export async function loadHotelTestData(): Promise<HotelTestData> {
  console.log("Loading test data....................");
  const data = new HotelTestData();
/// different json loaded ///
  try {
    const hotelLocationOfStayFilePath = path.resolve(__dirname, "../../testdata/places.json");
    console.log("__dirname: ", __dirname);
    console.log("HOTEL LOCATION ", hotelLocationOfStayFilePath);
    const hotelLocationOfStayData = await fs.readFile(hotelLocationOfStayFilePath, "utf-8");
    console.log(" HOTEL DATA:", hotelLocationOfStayData);
 data.locationData = JSON.parse(hotelLocationOfStayData) as HotelStayLocation[];
    console.log("PARSED HOTEL LOCATION DATA:", data.locationData);

    
  } catch (error) {
    console.error(" Error loading test data:", error);
  }

  return data;
}