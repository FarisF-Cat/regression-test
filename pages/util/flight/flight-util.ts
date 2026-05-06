



import { TestsData } from "../../types/common/data-test.ts";




import { Airport } from "../../types/common/airport";
import * as fs from "fs/promises";  
import path from "path";

export async function loadTestData(): Promise<TestsData> {
  console.log("Loading test data....................");
  const data = new TestsData();
/// different json loaded ///
  try {
    const accountsFilePath = path.resolve(__dirname, "../../testdata/accounts.json");
    console.log("__dirname: ", __dirname);
    console.log("ACCOUNTS PATH ", accountsFilePath);
    const accountsData = await fs.readFile(accountsFilePath, "utf-8");
    console.log("ACCOUNT  DATA:", accountsData);

    data.accounts = JSON.parse(accountsData);
    console.log("PARSED ACCOUNT  DATA:", data.accounts);

    const citiesFilePath = path.resolve(__dirname, "../../testdata/places.json");
  const citiesJson = await fs.readFile(citiesFilePath, "utf-8");
  data.cities = JSON.parse(citiesJson); // ✅ make sure this is assigned

  // Load other test data (accounts, routes, etc.)


    const airportsPath = path.resolve(__dirname, "../../testdata/airports.json");
    console.log("__dirname: ", __dirname);
    console.log("AIRPORTS PATH:", airportsPath);

    const rawAirports = await fs.readFile(airportsPath, "utf-8");
    console.log("RAW AIRPORTS DATA:", rawAirports);

    data.airports = JSON.parse(rawAirports) as Airport[];
    console.log("PARSED AIRPORTS DATA:", data.airports);
  } catch (error) {
    console.error(" Error loading test data:", error);
  }

  return data;
}
