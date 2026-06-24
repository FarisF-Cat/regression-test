



import { TestsData } from "../../types/common/data-test";




import { Airport } from "../../types/common/airport";
import * as fs from "fs/promises";  
import path from "path";
import logger from '@wdio/logger'
const log = logger('FlightUtil')


export async function loadTestData(): Promise<TestsData> {
  log.debug("loading test data...................");
  const data = new TestsData();
/// different json loaded ///
  try {
    const accountsFilePath = path.resolve(__dirname, "../../../testdata/accounts.json");
    log.debug("__dirname: ", __dirname);
    log.debug("accounts path ", accountsFilePath);
    const accountsData = await fs.readFile(accountsFilePath, "utf-8");
    log.debug("account  data:", accountsData);

    data.accounts = JSON.parse(accountsData);
    log.debug("parsed account  data:", data.accounts);

    const citiesFilePath = path.resolve(__dirname, "../../../testdata/places.json");
  const citiesJson = await fs.readFile(citiesFilePath, "utf-8");
  data.cities = JSON.parse(citiesJson); // ✅ make sure this is assigned

  // Load other test data (accounts, routes, etc.)


    const airportsPath = path.resolve(__dirname, "../../../testdata/airports.json");
    log.debug("__dirname: ", __dirname);
    log.debug("airports path:", airportsPath);

    const rawAirports = await fs.readFile(airportsPath, "utf-8");
    log.debug("raw airports data:", rawAirports);

    data.airports = JSON.parse(rawAirports) as Airport[];
    log.debug("parsed airports data:", data.airports);
  } catch (error) {
    log.error(" error loading test data:", error);
  }

  return data;
}
