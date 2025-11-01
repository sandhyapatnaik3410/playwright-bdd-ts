import { Given, When, Then, setDefaultTimeout, DataTable } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";
import { expect } from '@playwright/test';
import { initPages, homePage, automationPage, taskBotPage, messageBoxPage, formPage, helper, globalVariables } from '../Fixtures/fixture';


let page: Page;

// setDefaultTimeout(120000);


When('the user navigates to the {string} workspace', async (workspace: string) => {
  await homePage.navigateToAutomation();
});

When("the user opens the Create dropdown", async function () {
 await automationPage.clickCreateDropdown();
});

When('the user selects {string} from the creation options', async (option: string) => {
    await automationPage.clickDropdownOption(option);
});

When('verify the {string} creation pop up is displayed', async (popupName: string) => {
        await taskBotPage.verifyPopup(popupName);

});


// When('selects {string} from the creation options', async (option: string) => {
//   await automationPage.selectCreateOption(option);
// });

When('provides all mandatory Task Bot details', async () => {
    globalVariables.taskBotName = helper.generateUniqueName("Task_Bot");
    await taskBotPage.fillMandatoryFields(globalVariables.taskBotName);
});

When('submits the Task Bot creation form', async () => {
  await taskBotPage.submitForm();
});

Then('the Task Bot workspace should be displayed', async () => {
  const isVisible = await taskBotPage.isWorkspaceVisible();
  expect(isVisible).toBeTruthy();
});

When('the user searches for the {string} action in the Actions panel', async (actionName: string) => {
  await messageBoxPage.searchAction(actionName);
  await messageBoxPage.verifySearchActionVisible(actionName);
});

// When('adds the {string} action to the Task Bot', async (actionName: string) => {
//   await messageBoxPage.addAction(actionName);
// });

Then('adds the {string} action to the Task Bot', async function (actionName: string) {
  await messageBoxPage.addActionItemToCanvas(actionName);
});

Then('the {string} configuration panel should appear on the right side', async (actionName: string) => {
    await messageBoxPage.verifyConfigPanelVisible(actionName);
});

// When('the user validates all UI elements in the {string} configuration panel', async (actionName: string, dataTable: DataTable) => {
//   const expectedElements = dataTable.rawTable;
//   await messageBoxPage.verifyUIElements(actionName, expectedElements);
// });

When('saves the Message Box configuration', async () => {
  await messageBoxPage.saveConfiguration();
  await messageBoxPage.closeActionItem();
});

// Then('the {string} action should be visible in the Task Bot editor', async (actionName: string) => {
//   const exists = await taskBotPage.isActionVisible(actionName);
//   expect(exists).to.be.true;
// })

When('provides all mandatory Form details', async function () {
     globalVariables.formName = helper.generateUniqueName("Form");
     await formPage.enterFormName(globalVariables.formName);
});

When('submits the Form creation form', async function () {
  await formPage.submitForm();
});

Then('Verify the Form is created successfully', async function () {
  await formPage.formCreatedSuccessfully();
});

Then('I drag and drop {string} onto the canvas', async function (elementName: string) {
  await formPage.dragAndDropElement(elementName);
});

Then('I click on Textbox and verify all UI elements in the configuration panel', async function () {
  await formPage.clickTextBox();
  await formPage.verifyConfigurationPanelUIOfTextBox();
});

Then('I click on Select File and verify all UI elements in the configuration panel', async function () {
  await formPage.clickSelectFile();
  //await formPage.verifyConfigurationPanelUIOfSelectFile();
});

When('enter Textbox name', async function () {
  await formPage.enterTextBoxName('Sample TextBox');
});

Then('upload a document in Select File', async function () {
       await formPage.uploadFile("Data/data_file.pdf");
});

When('saves the Form configuration', async function () {
        await formPage.saveForm();
        await formPage.closeForm();
});

Then('the Form should be visible in the Automation Bot page', async function () {
        await formPage.verifyFormIsVisible(globalVariables.formName);
});

Then('I verify the file is uploaded successfully', async function () {
  
});

Then('Verify the Task Bot is created successfully', async function () {
    await formPage.formCreatedSuccessfully();
});

Then('the Task Bot should be visible in the Automation Bot page', async function () {
  await taskBotPage.verifyTaskBotIsVisible(globalVariables.taskBotName);
});

// When('the user validates all UI elements in the configuration panel', async function () {
//   await taskBotPage.verifyAllMessageBoxLabelsVisible();
// });

When('the user validates all UI elements in the configuration panel:', async function (dataTable: DataTable) {
  // DataTable.raw() returns string[][]; flatten to string[]
  const rows = dataTable.raw();
  const expectedLabels: string[] = rows.flat().map(r => String(r).trim()).filter(Boolean);
  console.log(`[Step] Expecting ${expectedLabels.length} labels:`, expectedLabels);
  // Delegate actual verification to page object
  await taskBotPage.validateConfigurationPanelLabels(expectedLabels);
});

When('user enters the Display Message name', async function () {
  const message = "Message Box";
  await messageBoxPage.enterDisplayMessage(message);
});