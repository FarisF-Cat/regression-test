// LoginUtil.ts
import { HomePage } from "../../home-page"; 


export async function login(driver: WebdriverIO.Browser, data: any, role: string) {
  console.log("🔐 Starting Login...");

  const homePage = new HomePage(driver);

  await driver.pause(2000);
  await homePage.login(data, role);

  console.log("✅ Login Successful!");
}
