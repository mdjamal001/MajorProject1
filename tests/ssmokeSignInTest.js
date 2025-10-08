const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Menu + Sign In Tests", function () {
  this.timeout(40000); // increased timeout for multiple steps
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

  it("should login with valid credentials", async () => {
    await driver.get("http://localhost:8080/signin"); // Ensure on signin page

    const username = "vatchav@143";
    const password = "12345678";

    await driver.findElement(By.name("username")).sendKeys(username);
    await driver.findElement(By.name("password")).sendKeys(password);

    // Click the Sign In button
    await driver.findElement(By.xpath("//button[text()='Sign In']")).click();

    // Wait for URL to contain '/listings' after login
    await driver.wait(until.urlContains("/listings"), 10000);
    const url = await driver.getCurrentUrl();
    expect(url).to.include("/listings");

    console.log("Login with valid credentials successful!");
  });

  it("should show error for invalid login", async () => {
    await driver.get("http://localhost:8080/signin");

    await driver.findElement(By.name("username")).sendKeys("wronguser");
    await driver.findElement(By.name("password")).sendKeys("wrongpass");

    // Click the Sign In button
    await driver.findElement(By.xpath("//button[text()='Sign In']")).click();

    // Wait and verify error message
    const alert = await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(), 'Password or username is incorrect')]")
      ),
      5000
    );
    const text = await alert.getText();
    expect(text).to.include("Password or username is incorrect");

    console.log("Invalid username or password!");
  });
});
