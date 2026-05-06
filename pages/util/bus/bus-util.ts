///HERE WE ARE USING THE SAME JSON AS OF THE CAB, ONLY THE NAME OF THE FUNCTION IS BEING CHANGED  HERE 
import * as fs from "fs/promises";  
import { Route } from "pages/types/common/routes";
import { TestsData } from "../../types/common/data-test";

import path from "path";

export async function loadBusTestData(): Promise<TestsData> {
  console.log("Loading test data....................");
  const data = new TestsData();
/// different json loaded ///
  try {
    const busLocationOfStayFilePath = path.resolve(__dirname, "../../testdata/routes.json");
    console.log("__dirname: ", __dirname);
    console.log("BUS LOCATION ", busLocationOfStayFilePath);
    const busLocationOfStayData = await fs.readFile(busLocationOfStayFilePath, "utf-8");
    console.log(" BUS DATA :", busLocationOfStayData);
    data.routes = JSON.parse(busLocationOfStayData) as Route[];

    // console.log("PARSED CAB LOCATION DATA:", data.origin);

    
  } catch (error) {
    console.error(" Error loading test data in BUS:", error);
  }

  return data;
}