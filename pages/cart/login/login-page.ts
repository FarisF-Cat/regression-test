// LoginUtil.ts
import { HomePage } from "../../home-page";
import { TestData } from "../../types/testdata";
import logger from '@wdio/logger'
const log = logger('LoginPage')



export async function login(driver: WebdriverIO.Browser, data: TestData, role: string) {
  log.info("🔐 starting login..");

  const homePage = new HomePage(driver);

  await driver.pause(2000);
  await homePage.login(data, role);

  log.info("✅ login successful");
}
