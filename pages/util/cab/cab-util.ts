import * as fs from "fs/promises";  
import { Route } from "pages/types/common/routes";
import { TestsData } from "../../types/common/data-test";

import path from "path";
import { AirportTransfer } from "pages/types/common/airporttransfer";
import logger from '@wdio/logger'
const log = logger('CabUtil')


export async function loadCabTestData(): Promise<TestsData> {
  log.debug("loading test data...................");
  const data = new TestsData();
/// different json loaded ///
  try {
    const cabLocationOfStayFilePath = path.resolve(__dirname, "../../../testdata/routes.json");
    log.debug("__dirname: ", __dirname);
    log.debug("cab location ", cabLocationOfStayFilePath);
    const cabLocationOfStayData = await fs.readFile(cabLocationOfStayFilePath, "utf-8");
    log.debug(" cab data :", cabLocationOfStayData);
    data.routes = JSON.parse(cabLocationOfStayData) as Route[];

    // log.debug("parsed cab location data:", data.origi);

const pickupAndDropOfLocation = path.resolve(__dirname, "../../../testdata/airporttransfer.json");
log.debug("__dirname: ", __dirname);
log.debug("pickup nd drop  location ", pickupAndDropOfLocation);
const pickupAndDropOfData = await fs.readFile(pickupAndDropOfLocation, "utf-8");
log.debug(" pickup nd drop data :", pickupAndDropOfData);
data.airporttransfer = JSON.parse(pickupAndDropOfData) as AirportTransfer[];




//  const pickupAndDropOfLocation = path.resolve(__dirname, "../../../testdata/airporttransfer.json");
//     log.debug("__dirname: ", __dirname);
//     log.debug("pickup nd drop  location ", pickupAndDropOfLocation);
//     const pickupAndDropOfData = await fs.readFile(pickupAndDropOfLocation, "utf-8");
//     log.debug(" pickup nd drop data :", pickupAndDropOfData);
//     data.airporttransfer = JSON.parse(pickupAndDropOfData) as AirportTransfer[];

    

    
  } catch (error) {
    log.error(" error loading test data in cab:", error);
  }

  return data;
}