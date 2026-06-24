// utils/dateUtils.ts
import { driver } from "@wdio/globals";
import logger from '@wdio/logger'
const log = logger('FlightData')



export async function selectDepartureDate() {
    const departureDate = await $('//android.view.View[@content-desc="Departure Date\nChoose Departure Date"]');
    await departureDate.waitForExist({ timeout: 20000 });
    await departureDate.click();
  
    const nextMonthButton = await driver.$('//android.widget.Button[2]');
    await nextMonthButton.click();
  
    const randomDate = Math.floor(Math.random() * 28) + 1;
    try {
      const dateElement = await driver.$(`//android.widget.Button[contains(@content-desc, "${randomDate}, ")]`);
      await dateElement.waitForExist({ timeout: 20000 });
      await dateElement.click();
    } catch (error) {
      log.error(`error selecting date ${randomDate}:`, error);
    }
  
    await driver.pause(2000);
  }
  


  
