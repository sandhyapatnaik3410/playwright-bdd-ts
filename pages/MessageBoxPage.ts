import { expect } from '@playwright/test';
import { Page } from 'playwright';

export class MessageBoxPage {
  constructor(private page: Page) {
    this.page = page;
  }

  private actionSearchInputField = 'input[placeholder="Search actions"]';
  private actionItem = (actionName: string) => `button[name="item-button"] span[data-text="${actionName}"]`;
  private clickOnActionItem = '//div[@data-item-name="messagebox#messagebox"]/div/button';
  private actionNameInConfigPanel = (actionName: string) => `.editor-layout__details span[data-text="Message box"]`;
  private saveConfigButton = 'button[name="save"]'; 
  private closeConfigButton = 'button[name="close"]';
  private formName = (actionName: string) => `//span[text()="${actionName}"]`;
  private formNameInConfigPanel = (actionName: string) => `//*[@class='editor-details__header-title']//span[contains(text(),"${actionName}")][1]`;
  private displayMessageInput = 'div[role="textbox"][name="content"]';


    async searchAction(actionName: string): Promise<void> {
    const input = this.page.locator(this.actionSearchInputField);

    // Wait for search input to be visible and interactable
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.fill(actionName);
    console.log(`Searched for action: ${actionName}`);
    await input.press('Enter');
    await this.page.waitForTimeout(1000);
    }

    async verifySearchActionVisible(actionName: string): Promise<boolean> {
      try {
          await this.page.waitForSelector(this.actionItem(actionName), { timeout: 60000 });
          const visible = await this.page.isVisible(this.actionItem(actionName));
          console.log(`Search result for ${actionName} is visible:`, visible);
          return visible;
      } catch (error) {
          console.error(`Search result for ${actionName} not visible:`, error);
          return false;
      }
    }

    async addAction(actionName: string) {
        const actionSelector = this.actionItem(actionName);
        await this.page.waitForSelector(actionSelector, { timeout: 120000 });
        await this.page.dblclick(actionSelector); // Double-click to add the action
        console.log(`Added action: ${actionName}`);
    }

    async isConfigPanelVisible(actionName: string): Promise<boolean> {
        try {
            await this.page.getByText(`${actionName}`).waitFor({ timeout: 120000 });
            const visible = await this.page.getByText(`${actionName}`).isVisible();
            console.log(`Configuration panel for ${actionName} is visible:`, visible);
            return visible;
        } catch (error) {
            console.error(`Configuration panel for ${actionName} not visible:`, error);
            return false;
        }
    }

    async verifyMessageBoxUIElementsInConfigPanel() {
        try {
            await this.page.waitForSelector(this.actionNameInConfigPanel("Message box"), { timeout: 120000 });
            console.log("Message Box action configuration panel is visible");
            const elementSelector = `.editor-layout__details form[data-path="Form"] div[data-label="Enter the message to display"]`;
            await this.page.waitForSelector(elementSelector, { timeout: 60000 });

        } catch (error) {
            console.error("Message Box action configuration panel not visible:", error);
        }

    }

    async saveConfiguration() {
        const saveButton = this.page.locator(this.saveConfigButton);

        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        console.log("Clicked on Save Button in configuration panel");

        //Wait for some time after click to allow configuration to save
        await this.page.waitForTimeout(3000);
        console.log("Waited for configuration to complete saving");
    }

    async addActionItemToCanvas(actionName: string): Promise<void> {
        const locator = this.page.locator(this.actionItem(actionName));
        await locator.waitFor({ state: "visible", timeout: 10000 });
        await locator.dblclick({ timeout: 50000 });
        console.log("Successfully added action item to Canvas.");
    }

    async verifyConfigPanelVisible(actionName: string): Promise<void> {
        const locator = this.page.locator(this.formNameInConfigPanel(actionName));
        await locator.waitFor({ state: "visible", timeout: 50000 });
        await expect(locator).toBeVisible();
        console.log(`Verified action item in configuration panel is visible: "${actionName}"`);
    }

    async closeActionItem() {
    await this.page.click(this.closeConfigButton);
    console.log("Clicked on Close Action Item Button");
    await this.page.waitForTimeout(3000);
   }

    async enterDisplayMessage(message: string): Promise<void> {
        const locator = this.page.locator(this.displayMessageInput);
        await locator.waitFor({ state: "visible", timeout: 10000 });
        await locator.click();
        await locator.fill(message);
        console.log(`Entered message: "${message}" into the content text box`);
    }

}