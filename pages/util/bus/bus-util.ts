///HERE WE ARE USING THE SAME JSON AS OF THE CAB, ONLY THE NAME OF THE FUNCTION IS BEING CHANGED  HERE 
import * as fs from "fs/promises";  
import { Route } from "pages/types/common/routes";
import { TestsData } from "../../types/common/data-test";

import path from "path";
import logger from '@wdio/logger'
const log = logger('BusUtil')


export async function loadBusTestData(): Promise<TestsData> {
  log.debug("loading test data...................");
  const data = new TestsData();
/// different json loaded ///
  try {
    const busLocationOfStayFilePath = path.resolve(__dirname, "../../../testdata/routes.json");
    log.debug("__dirname: ", __dirname);
    log.debug("bus location ", busLocationOfStayFilePath);
    const busLocationOfStayData = await fs.readFile(busLocationOfStayFilePath, "utf-8");
    log.debug(" bus data :", busLocationOfStayData);
    data.routes = JSON.parse(busLocationOfStayData) as Route[];

    // log.debug("parsed cab location data:", data.origi);

    
  } catch (error) {
    log.error(" error loading test data in bus:", error);
  }

  return data;
}