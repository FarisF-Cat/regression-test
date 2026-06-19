export default class Page {
  driver: WebdriverIO.Browser;

  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
  }

  public open(path: string) {
    return this.driver.url(`https://the-internet.herokuapp.com/${path}`);
  }
}
