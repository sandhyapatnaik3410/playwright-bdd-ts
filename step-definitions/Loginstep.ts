import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, Page } from "playwright";
import { initPages, loginPage } from '../Fixtures/fixture';
// import { setBrowser } from "../Hooks/hooks";
import config from "../playwright.config";


let browser: Browser;
let page: Page;
let context: BrowserContext;

// setDefaultTimeout(120000);

When("I launch the browser", async function () {
  const cfg = (config as any)?.use ?? {};
  const headless =
    process.env.HEADLESS === "true" ? true : cfg.headless ?? false;

  browser = await chromium.launch({
    headless,
    args: ["--start-maximized"],
  });

  context = await browser.newContext({
    baseURL: cfg.baseURL,
    viewport: cfg.viewport ?? null,
    ignoreHTTPSErrors: cfg.ignoreHTTPSErrors ?? true,
  });

  page = await context.newPage();
  initPages(page);

  // Attach to cucumber world (this) for later steps
  this.browser = browser;
  this.context = context;
  this.page = page;

  console.log("Browser launched and page opened.");
});

When("I navigate to a url", async function () {
  const baseURL = (config as any)?.use?.baseURL;
  await loginPage.navigate(baseURL);
});

Given("the user is logged into the Automation Anywhere application", async function () {
  await loginPage.enterCredentials('sandhyarani.p413@gmail.com', 'C@rby3410');
  await loginPage.clickLogin();
});
