///HERE WE ARE USING THE SAME JSON AS OF THE CAB, ONLY THE NAME OF THE FUNCTION IS BEING CHANGED  HERE 
import * as fs from "fs/promises";  
import { Route } from "pages/types/common/routes";
import { TestsData } from "../../types/common/data-test";

import path from "path";

export async function loadRailTestData(): Promise<TestsData> {
  console.log("Loading test data....................");
  const data = new TestsData();
/// different json loaded ///
  try {
    const railLocationOfStayFilePath = path.resolve(__dirname, "../../testdata/rail.json");
    console.log("__dirname: ", __dirname);
    console.log("RAIL LOCATION ", railLocationOfStayFilePath);
    const railLocationOfStayData = await fs.readFile(railLocationOfStayFilePath, "utf-8");
    console.log("RAIL DATA :", railLocationOfStayData);
    data.routes = JSON.parse(railLocationOfStayData) as Route[];

    // console.log("PARSED CAB LOCATION DATA:", data.origin);

    
  } catch (error) {
    console.error(" Error loading test data in RAIL:", error);
  }

  return data;
}