import { expect } from '@playwright/test';
import path from 'path';
import { Page } from 'playwright';
import fs from 'fs';

export class FormPage {
  constructor(private page: Page) {
    this.page = page;
  }


  private formNameInput = 'input[name="name"]';
  private createAndEditBtn = 'span[data-text="Create & edit"]';
  private formcreationMessage = '//span[text()="successfully created"][1]';
  private formElements = (actionName: string) => `//span[contains(text(),"${actionName}")][1]`;
  private canvasArea = '//div[@class="formcanvas-content"]';
  private textBox = '//div[@data-label="TextBox"]';
  private selectAFile = '//div[@data-label="Select a file"]';
  private textBoxInput = '//input[@aria-label="TextBox"]';
  private iframeSelector = "//iframe[@class='modulepage-frame']";
  private dropZone = 'div.preview-fileupload';
  private saveFormBtn = 'button[name="save"]';
  private formSaveMessage = '//span[text()="successfully edited"][1]';
  private closeFormBtn = 'button[name="cancel"]';
  private formName = (actionName: string) => `//span[text()="${actionName}"]`;
  private textBoxLabel = (labelName: string) => `div[data-label="${labelName}"] `;
  private elementLabelValue = (labelValue: string) => `div[data-name="${labelValue}"] `;



  async enterFormName(formName: string) {
  await this.page.fill(this.formNameInput, formName);
  console.log(`Entered form name: ${formName}`);
}

async submitForm() {
    await this.page.click(this.createAndEditBtn);
    console.log("Clicked on Create & Edit Button");
  }

  async formCreatedSuccessfully() {
  const message = this.page.locator(this.formcreationMessage);
  await expect(message).toBeVisible({ timeout: 10000 });
  console.log("Form creation message is visible: " + await message.textContent());
}

async dragAndDropElement(actionName: string) {
    const frame = this.page.frameLocator(this.iframeSelector);

    const source = frame.locator(this.formElements(actionName));
    const target = frame.locator(this.canvasArea);

    // Wait for source to be present and interactable inside the frame
    await source.waitFor({ state: 'visible', timeout: 50000 });
    await expect(source).toBeVisible();
    await expect(source).toBeEnabled();

    // Wait for target (canvas) to be ready inside the same frame
    await target.waitFor({ state: 'visible', timeout: 50000 });
    await expect(target).toBeVisible();

    // small pause to allow transient animations / rendering to settle
    await this.page.waitForTimeout(200);

    // Perform the drag and drop (Playwright handles frame coordinate translation)
    await source.dragTo(target, { timeout: 15000 });

    console.log(`"${actionName}" successfully dragged and dropped onto the canvas.`);
  }

async clickTextBox() {
  const frame = this.page.frameLocator(this.iframeSelector);
  const textBoxElement = frame.locator(this.textBox);
  await textBoxElement.click({ timeout: 5000 });
  console.log('Clicked on TextBox in canvas successfully.');
}

async clickSelectFile() {
  const frame = this.page.frameLocator(this.iframeSelector);
  const selectFileElement = frame.locator(this.selectAFile);
  await selectFileElement.click({ timeout: 5000 });
  console.log('Clicked on Select a file in canvas successfully.');
}

async enterTextBoxName(textBoxName: string) {
  const frame = this.page.frameLocator(this.iframeSelector);
  const textBoxInputElement = frame.locator(this.textBoxInput);
  await textBoxInputElement.fill(textBoxName, { timeout: 5000 });
  console.log(`Entered text box name: ${textBoxName}`);
}

async uploadFile(filePath: string) {
  //Use helper method
  const absPath = this.getProjectFilePath(filePath);

  const fileBuffer = fs.readFileSync(absPath);
  const base64 = fileBuffer.toString("base64");
  const fileName = path.basename(absPath);

  const frame = this.page.frameLocator(this.iframeSelector);

  const target = frame.locator(this.dropZone);
  await target.waitFor({ state: "visible", timeout: 50000 });

  // === Minimal change: evaluate inside the element (inside the iframe) ===
  await target.evaluate(
    async (el: Element, { b64, name }: { b64: string; name: string }) => {
      function base64ToUint8Array(base64: string): Uint8Array {
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
      }

      // 'el' is the drop zone element passed by Locator.evaluate
      if (!el) throw new Error("Drop zone element not provided");

      const uint8 = base64ToUint8Array(b64);
      const blob = new Blob([uint8 as unknown as BlobPart], {
        type: "application/octet-stream",
      });

      const file = new File([blob], name, { type: "application/octet-stream" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const eventInit: any = { bubbles: true, cancelable: true, dataTransfer };
      el.dispatchEvent(new DragEvent("dragenter", eventInit));
      el.dispatchEvent(new DragEvent("dragover", eventInit));
      el.dispatchEvent(new DragEvent("drop", eventInit));
    },
    { b64: base64, name: fileName }
  );

  // optional small pause for widget processing (keep if you relied on it)
    await this.page.waitForTimeout(5000);
    console.log(`Uploaded file successfully. File name: ${fileName}`);
  }

  private getProjectFilePath(relativePath: string): string {
    let normalizedPath = relativePath.replace(/\\/g, path.sep);

    if (!path.isAbsolute(normalizedPath)) {
      normalizedPath = path.resolve(process.cwd(), normalizedPath);
    }

    const absPath = path.normalize(normalizedPath);

    if (!fs.existsSync(absPath)) {
      throw new Error(`File not found at path: ${absPath}`);
    }

    console.log("Resolved file path:", absPath);
    return absPath;
  }

  async saveForm() {
    const frame = this.page.frameLocator(this.iframeSelector);
    await frame.locator(this.saveFormBtn).click();
    console.log("Clicked on Save Form Button");
    const message = this.page.locator(this.formSaveMessage);
    await expect(message).toBeVisible({ timeout: 50000 });
    console.log("Form creation message is visible: " + await message.textContent());
  }

 async closeForm() {
    const frame = this.page.frameLocator(this.iframeSelector);
    await frame.locator(this.closeFormBtn).click();
    console.log("Clicked on Close Form Button");
   }

   async verifyFormIsVisible(formName: string) {
    const formLocator = this.page.locator(this.formName(formName)).first();

    await formLocator.waitFor({ state: "visible", timeout: 50000 });

    const isVisible = await formLocator.isVisible();
    if (isVisible) {
        console.log(`The form ${formName} is visible on the page in the Automation Bot page.`);
    } else {
        throw new Error(`The form ${formName} is not visible in the Automation Bot page.`);
    }
}

async verifyConfigurationPanelUIOfTextBox() {
  await this.verifyAllTextBoxLabelsVisible();
  await this.verifyLabelValue();
}

async verifyAllTextBoxLabelsVisible(): Promise<void> {
    const expectedLabels = [
      "Element ID",
      "Default value",
      "Formatting",
      "Hint below field",
      "Tool tip",
      "Advanced behavior",
    ];
    for (const label of expectedLabels) {
      const frame = this.page.frameLocator(this.iframeSelector);
      const locator = await frame.locator(this.textBoxLabel(label));
      await locator.waitFor({ state: "visible", timeout: 50000 });
      await expect(locator).toBeVisible();
      console.log(`Field label visible: "${label}"`);
    }

    console.log("All text box labels are present and visible for Text Box.");
  }

  async verifyLabelValue(): Promise<void> {
    const expectedValues = [
      "label",
      "defaultValue"
    ];
    for (const value of expectedValues) {
      const frame = this.page.frameLocator(this.iframeSelector);
      const locator = await frame.locator(this.elementLabelValue(value));
      await locator.waitFor({ state: "visible", timeout: 10000 });
      await expect(locator).toBeVisible();
      console.log(`Field label visible: "${value}"`);
    }
    console.log("All text box label values are present and visible for Text Box.");
  }

}

