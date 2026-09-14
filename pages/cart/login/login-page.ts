// LoginUtil.ts
import { HomePage } from "../../home-page"; 
import logger from '@wdio/logger'
const log = logger('LoginPage')



export async function login(driver: WebdriverIO.Browser, data: any, role: string) {
  log.info("🔐 starting login..");

  const homePage = new HomePage(driver);

  await driver.pause(2000);
  await homePage.login(data, role);

  log.info("✅ login successful");
}
