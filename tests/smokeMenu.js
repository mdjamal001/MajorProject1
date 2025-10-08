const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Smoke Test - Menu Button and Sign In", function () {
  this.timeout(30000); // increased timeout
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should open the menu sidebar and click the Sign In button", async () => {
    // Open the listings page
    await driver.get("http://localhost:8080/listings");

    // Click the menu button (hamburger)
    const menuButton = await driver.findElement(
      By.css(".openbtn label[for='opcl'] i.fa-bars")
    );
    await menuButton.click();

    // Wait until the sidebar becomes visible
    const sidebar = await driver.findElement(By.css(".sidebar"));
    await driver.wait(until.elementIsVisible(sidebar), 5000);

    // Wait until Sign In button is clickable
    const signInButton = await driver.wait(
      until.elementLocated(
        By.css(".sidebar .signinorsignup a[href='/signin']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(signInButton), 5000);
    await driver.wait(until.elementIsEnabled(signInButton), 5000);

    // Click the Sign In button
    await signInButton.click();

    // Wait until navigation to /signin
    await driver.wait(until.urlContains("/signin"), 5000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("/signin");

    console.log("Sign In button clicked successfully!");
  });
});
