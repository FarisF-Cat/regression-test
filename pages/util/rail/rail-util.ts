///HERE WE ARE USING THE SAME JSON AS OF THE CAB, ONLY THE NAME OF THE FUNCTION IS BEING CHANGED  HERE 
import { TestData } from "../../types/testdata";
import * as fs from "fs/promises";  
import { Route } from "pages/types/common/routes";
import path from "path";
import logger from '@wdio/logger'
const log = logger('RailUtil')

export async function loadRailTestData(): Promise<TestData> {
  log.debug("loading test data...................");
  const data = new TestData();
/// different json loaded ///
  try {
    const railLocationOfStayFilePath = path.resolve(__dirname, "../../../testdata/rail.json");
    log.debug("__dirname: ", __dirname);
    log.debug("rail location ", railLocationOfStayFilePath);
    const railLocationOfStayData = await fs.readFile(railLocationOfStayFilePath, "utf-8");
    log.debug("rail data :", railLocationOfStayData);
    data.routes = JSON.parse(railLocationOfStayData) as Route[];

  } catch (error) {
    log.error(" error loading test data in rail:", error);
  }

  return data;
}