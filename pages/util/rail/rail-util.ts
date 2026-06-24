///HERE WE ARE USING THE SAME JSON AS OF THE CAB, ONLY THE NAME OF THE FUNCTION IS BEING CHANGED  HERE 
import * as fs from "fs/promises";  
import { Route } from "pages/types/common/routes";
import { TestsData } from "../../types/common/data-test";

import path from "path";
import logger from '@wdio/logger'
const log = logger('RailUtil')


export async function loadRailTestData(): Promise<TestsData> {
  log.debug("loading test data...................");
  const data = new TestsData();
/// different json loaded ///
  try {
    const railLocationOfStayFilePath = path.resolve(__dirname, "../../../testdata/rail.json");
    log.debug("__dirname: ", __dirname);
    log.debug("rail location ", railLocationOfStayFilePath);
    const railLocationOfStayData = await fs.readFile(railLocationOfStayFilePath, "utf-8");
    log.debug("rail data :", railLocationOfStayData);
    data.routes = JSON.parse(railLocationOfStayData) as Route[];

    // log.debug("parsed cab location data:", data.origi);

    
  } catch (error) {
    log.error(" error loading test data in rail:", error);
  }

  return data;
}