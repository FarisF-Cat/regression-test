import * as fs from "fs/promises";  
import { Route } from "pages/types/common/routes";
import { TestsData } from "../../types/common/data-test";

import path from "path";
import { AirportTransfer } from "pages/types/common/airporttransfer";

export async function loadCabTestData(): Promise<TestsData> {
  console.log("Loading test data....................");
  const data = new TestsData();
/// different json loaded ///
  try {
    const cabLocationOfStayFilePath = path.resolve(__dirname, "../../testdata/routes.json");
    console.log("__dirname: ", __dirname);
    console.log("CAB LOCATION ", cabLocationOfStayFilePath);
    const cabLocationOfStayData = await fs.readFile(cabLocationOfStayFilePath, "utf-8");
    console.log(" CAB DATA :", cabLocationOfStayData);
    data.routes = JSON.parse(cabLocationOfStayData) as Route[];

    // console.log("PARSED CAB LOCATION DATA:", data.origin);

const pickupAndDropOfLocation = path.resolve(__dirname, "../../testdata/airporttransfer.json");
console.log("__dirname: ", __dirname);
console.log("PICKUP ND DROP  LOCATION ", pickupAndDropOfLocation);
const pickupAndDropOfData = await fs.readFile(pickupAndDropOfLocation, "utf-8");
console.log(" PICKUP ND DROP DATA :", pickupAndDropOfData);
data.airporttransfer = JSON.parse(pickupAndDropOfData) as AirportTransfer[];




//  const pickupAndDropOfLocation = path.resolve(__dirname, "../../testdata/airporttransfer.json");
//     console.log("__dirname: ", __dirname);
//     console.log("PICKUP ND DROP  LOCATION ", pickupAndDropOfLocation);
//     const pickupAndDropOfData = await fs.readFile(pickupAndDropOfLocation, "utf-8");
//     console.log(" PICKUP ND DROP DATA :", pickupAndDropOfData);
//     data.airporttransfer = JSON.parse(pickupAndDropOfData) as AirportTransfer[];

    

    
  } catch (error) {
    console.error(" Error loading test data in CAB:", error);
  }

  return data;
}