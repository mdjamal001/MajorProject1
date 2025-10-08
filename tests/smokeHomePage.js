const { Builder } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Smoke Test - Home Page", function () {
  this.timeout(20000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should open the home page and check title", async () => {
    await driver.get("http://localhost:8080/listings"); // Your website URL

    const title = await driver.getTitle();
    console.log("Page title:", title);

    // Optional check if title contains some expected text
    expect(title.toLowerCase()).to.include("wandernest");
  });
});
