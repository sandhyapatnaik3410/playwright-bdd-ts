import { After, Before, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, Page } from "playwright";
import config from "../playwright.config";
import { initPages } from "../Fixtures/fixture";

setDefaultTimeout(120_000);

Before(async function (this: any) {
  const cfg = (config as any)?.use ?? {};
  const headless = process.env.HEADLESS === "true" ? true : cfg.headless ?? true;

  const browser: Browser = await chromium.launch({
    headless,
    args: ["--start-maximized"],
  });

  const context: BrowserContext = await browser.newContext({
    baseURL: cfg.baseURL ?? "https://community.cloud.automationanywhere.digital/",
    viewport: cfg.viewport ?? null,
    ignoreHTTPSErrors: cfg.ignoreHTTPSErrors ?? true,
  });

  const page: Page = await context.newPage();

  // initPages returns { loginPage, homePage, ... }
  const pages = initPages(page);

  // Attach everything to Cucumber World in one go
  Object.assign(this, { browser, context, page, ...pages });

  console.log("[Hook] Browser + page objects attached.");
});

After(async function () {
  const activeBrowser: Browser | undefined = this.browser;
  if (activeBrowser && activeBrowser.isConnected()) {
    await activeBrowser.close();
    console.log("Browser closed after scenario execution.");
  } else {
    console.warn("No active browser instance found to close.");
  }
});