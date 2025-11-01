import { expect } from '@playwright/test';
import { Page } from 'playwright';

export class TaskBotPage {
  constructor(private page: Page) {
    this.page = page;
  }

  private popupLabel = (popupName: string) => `//span[contains(text(),"${popupName}")][1]`;
  private taskBotNameInput = 'input[name="name"]';
  private taskBotDescription = 'input[name="description"]';
  private createAndEditBtn = 'span[data-text="Create & edit"]';
  private taskBotWorkspace = 'div.taskbot-canvas-flow__layout';
  private taskBotName = (actionName: string) => `//span[text()="${actionName}"]`;
  private textBoxLabel = (labelName: string) => `div[data-label="${labelName}"] `;


  async verifyPopup(popupName: string) {
    await this.page.waitForSelector(this.popupLabel(popupName), { timeout: 120000 });
    console.log(`${popupName} is visible`);
  }

  async fillMandatoryFields(taskBotName: string) {
    await this.page.fill(this.taskBotNameInput, taskBotName);
    console.log("Filled Task Bot Name: " + taskBotName);
  }

  async submitForm() {
    await this.page.click(this.createAndEditBtn);
    console.log("Clicked on Create & Edit Button");
  }

  async createTaskBot() {
    await this.page.waitForSelector(this.popupLabel("Create Task Bot"), { timeout: 120000 });
    console.log("Create Task Bot Label is visible");
    await this.page.fill(this.taskBotNameInput, 'MyTaskBot');
    console.log("Filled Task Bot Name");
    await this.page.fill(this.taskBotDescription, 'MyTaskBot Description');
    console.log("Filled Task Bot Description");
    await this.page.click(this.createAndEditBtn);
    console.log("Clicked on Create & Edit Button");
  }

async isWorkspaceVisible(): Promise<boolean> {
  try {
    await this.page.waitForSelector(this.taskBotWorkspace, { timeout: 120000 });
    const visible = await this.page.isVisible(this.taskBotWorkspace);
    console.log("Task Bot Workspace is visible:", visible);
    return visible;
  } catch (error) {
    console.error("Task Bot Workspace not visible:", error);
    return false;
  }
}

async verifyTaskBotIsVisible(taskBotName: string) {
    const taskBotLocator = this.page.locator(this.taskBotName(taskBotName)).first();
    await taskBotLocator.waitFor({ state: "visible", timeout: 60000 });

    const isVisible = await taskBotLocator.isVisible();
    if (isVisible) {
        console.log(`The Task Bot ${taskBotName} is visible on the Automation Bot page.`);
    } else {
        throw new Error(`The Task Bot ${taskBotName} is not visible in the Automation Bot page.`);
    }

  }

  async verifyAllMessageBoxLabelsVisible(): Promise<void> {
  const expectedLabels = [
    "Enter the message box window title",
    "Enter the message to display",
    "Scrollbar after lines",
  ];

  for (const label of expectedLabels) {
    const locator = this.page.locator(this.textBoxLabel(label));
    await locator.waitFor({ state: "visible", timeout: 50000 });
    await expect(locator).toBeVisible();
    console.log(`Message Box field label visible: "${label}"`);
  }

  console.log("All Message Box text box labels are present and visible for Message Box action.");
}

async validateConfigurationPanelLabels(expectedLabels: string[]): Promise<void> {
  if (!expectedLabels?.length) {
    throw new Error("Expected labels list cannot be empty.");
  }

  console.log(`[TaskBotPage] Validating configuration panel labels...`);

  const missingLabels: string[] = [];

  for (const label of expectedLabels) {
    const locator = this.page.locator(`text=${label}`);
    const isVisible = await locator.isVisible();

    if (!isVisible) {
      missingLabels.push(label);
    }
  }

  if (missingLabels.length > 0) {
    throw new Error(
      `[TaskBotPage] Missing labels: ${missingLabels.join(", ")}`
    );
  }

  console.log(`[TaskBotPage] All ${expectedLabels.length} labels are visible.`);
} 


}