import * as fs from "fs/promises";  
import { HotelStayLocation } from "pages/types/common/hotel-stay-location";
import { HotelTestData } from "../../types/common/hotel-test-data";
// import { HotelTestData } from "pages/types/common/hotel-test-data";
import path from "path";
import logger from '@wdio/logger'
const log = logger('HotelUtil')


export async function loadHotelTestData(): Promise<HotelTestData> {
  log.debug("loading test data...................");
  const data = new HotelTestData();
/// different json loaded ///
  try {
    const hotelLocationOfStayFilePath = path.resolve(__dirname, "../../../testdata/places.json");
    log.debug("__dirname: ", __dirname);
    log.debug("hotel location ", hotelLocationOfStayFilePath);
    const hotelLocationOfStayData = await fs.readFile(hotelLocationOfStayFilePath, "utf-8");
    log.debug(" hotel data:", hotelLocationOfStayData);
 data.locationData = JSON.parse(hotelLocationOfStayData) as HotelStayLocation[];
    log.debug("parsed hotel location data:", data.locationData);

    
  } catch (error) {
    log.error(" error loading test data:", error);
  }

  return data;
}