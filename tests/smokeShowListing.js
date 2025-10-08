const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Listing Show Page Test", function () {
  this.timeout(20000);

  let driver;
  const listingId = "68e6541d96cee3bc94ee399f"; // <-- replace x with your actual listing _id

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("should open a listing details page and check card-listing exists", async () => {
    await driver.get(`http://localhost:8080/listings/${listingId}`);

    // Wait until the listing card is visible
    const listingCard = await driver.wait(
      until.elementLocated(By.css(".card-listing")),
      10000
    );
    await driver.wait(until.elementIsVisible(listingCard), 10000);

    console.log("Listing card is visible ✅");

    // Optional: check title text exists
    const title = await driver.findElement(By.css(".card-title")).getText();
    console.log("Listing title:", title);
    expect(title.length).to.be.greaterThan(0);
  });
});
