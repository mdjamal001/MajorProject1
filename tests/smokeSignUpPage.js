const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Menu + Signup Tests - WanderNest", function () {
  this.timeout(60000); // Extra timeout for multiple steps
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should open the menu sidebar and click the Sign Up button", async () => {
    await driver.get("http://localhost:8080/listings");

    const menuButton = await driver.findElement(
      By.css(".openbtn label[for='opcl']")
    );
    await driver.wait(until.elementIsVisible(menuButton), 5000);
    await menuButton.click();

    const sidebar = await driver.findElement(By.css(".sidebar"));
    await driver.wait(until.elementIsVisible(sidebar), 5000);

    const signUpButton = await driver.findElement(
      By.css(".sidebar a[href='/signup']")
    );
    await driver.wait(until.elementIsVisible(signUpButton), 5000);
    await signUpButton.click();

    await driver.wait(until.urlContains("/signup"), 5000);
    console.log("✅ Sign Up button clicked successfully!");
  });

  it("should register a new user", async () => {
    await driver.get("http://localhost:8080/signup"); // Ensure on signup page

    const randomSuffix = Math.floor(Math.random() * 100000);
    const username = `testuser${randomSuffix}`;
    const email = `test${randomSuffix}@gmail.com`;
    const password = "12345678";

    await driver.findElement(By.name("username")).sendKeys(username);
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("password")).sendKeys(password);

    const signupBtn = await driver.findElement(
      By.xpath("//button[contains(text(),'Sign Up')]")
    );
    await driver.wait(until.elementIsVisible(signupBtn), 5000);
    await signupBtn.click();

    // --- Robust check: wait for either redirect OR success message ---
    const timeout = 20000;
    let signupSuccess = false;

    try {
      // Option 1: URL contains /signin
      await driver.wait(until.urlContains("/listings"), timeout);
      console.log("✅ Signup test completed. Redirected to /signin");
      signupSuccess = true;
    } catch (_) {
      // Option 2: Success message appears instead
      try {
        const successMsg = await driver.wait(
          until.elementLocated(By.css(".alert-success")), // replace with actual selector
          timeout
        );
        const msgText = await successMsg.getText();
        expect(msgText.toLowerCase()).to.include("success");
        console.log(
          "✅ Signup test completed. Success message shown:",
          msgText
        );
        signupSuccess = true;
      } catch (err) {
        // If both fail, test fails
        throw new Error(
          "Signup failed: Neither redirected to /signin nor success message appeared."
        );
      }
    }

    expect(signupSuccess).to.be.true;
  });
});
