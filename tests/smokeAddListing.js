const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const path = require("path");
const fs = require("fs");

describe("Sign In + Menu + Add New Listing Test", function () {
  this.timeout(120000); // increased timeout for all steps
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should login with valid credentials", async () => {
    await driver.get("http://localhost:8080/signin");

    const usernameInput = await driver.findElement(By.name("username"));
    await driver.wait(until.elementIsVisible(usernameInput), 5000);
    await usernameInput.sendKeys("vatchav@143");

    const passwordInput = await driver.findElement(By.name("password"));
    await driver.wait(until.elementIsVisible(passwordInput), 5000);
    await passwordInput.sendKeys("12345678");

    const signInButton = await driver.findElement(
      By.xpath("//button[text()='Sign In']")
    );
    await driver.wait(until.elementIsEnabled(signInButton), 5000);
    await signInButton.click();

    await driver.wait(until.urlContains("/listings"), 10000);
    expect(await driver.getCurrentUrl()).to.include("/listings");

    console.log("Login successful!");
  });

  it("should open menu sidebar and click 'Add your place'", async () => {
    await driver.get("http://localhost:8080/listings");

    const menuButton = await driver.findElement(
      By.css(".openbtn label[for='opcl'] i.fa-bars")
    );
    await driver.wait(until.elementIsVisible(menuButton), 5000);
    await menuButton.click();

    const addPlaceButton = await driver.wait(
      until.elementLocated(
        By.css(".sidebar .sidebar-content-top a[href='/listings/new']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(addPlaceButton), 5000);
    await addPlaceButton.click();

    await driver.wait(until.urlContains("/listings/new"), 5000);
    expect(await driver.getCurrentUrl()).to.include("/listings/new");

    console.log("'Add your place' button works!");
  });

  it("should fill the create listing form and submit", async () => {
    // Title
    const titleInput = await driver.findElement(By.name("title"));
    await driver.wait(until.elementIsVisible(titleInput), 5000);
    await titleInput.sendKeys("Test Listing");

    // Description
    const descInput = await driver.findElement(By.name("description"));
    await driver.wait(until.elementIsVisible(descInput), 5000);
    await descInput.sendKeys("This is a test property description.");

    // Price
    const priceInput = await driver.findElement(By.name("price"));
    await driver.wait(until.elementIsVisible(priceInput), 5000);
    await priceInput.sendKeys("1000");

    // Image Upload
    const imageInput = await driver.findElement(By.name("image"));
    const imagePath = path.resolve(__dirname, "listing_1.jpg");

    if (!fs.existsSync(imagePath)) {
      throw new Error("File not found: " + imagePath);
    }

    // Send the file path directly (works in headless Jenkins)
    await imageInput.sendKeys(imagePath);

    // City
    const cityInput = await driver.findElement(By.name("city"));
    await driver.wait(until.elementIsVisible(cityInput), 5000);
    await cityInput.sendKeys("Test City");

    // Country
    const countryInput = await driver.findElement(By.name("country"));
    await driver.wait(until.elementIsVisible(countryInput), 5000);
    await countryInput.sendKeys("Test Country");

    // Submit
    const submitButton = await driver.findElement(
      By.css("button.btn.btn-danger")
    );
    await driver.wait(until.elementIsEnabled(submitButton), 5000);
    await submitButton.click();

    await driver.wait(until.urlContains("/listings"), 10000);
    expect(await driver.getCurrentUrl()).to.include("/listings");

    console.log("New listing created successfully!");
  });
});
