import { Page } from 'playwright';
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { AutomationPage } from "../pages/AutomationPage";
import { TaskBotPage } from '../pages/TaskBotPage';
import { MessageBoxPage } from '../pages/MessageBoxPage';
import { FormPage } from '../pages/FormPage';
import { Helper } from '../utils/helper';
import { GlobalVariables } from '../utils/globalVariables';


// module-level holders (will be set when page is ready)
export let loginPage: LoginPage;
export let homePage: HomePage;
export let automationPage: AutomationPage;
export let taskBotPage: TaskBotPage;
export let messageBoxPage: MessageBoxPage;  
export let formPage: FormPage;
export let helper: Helper;
export let globalVariables: GlobalVariables;

let pageInstance: Page | null = null;

/**
 * Initialize all page objects using the provided Playwright Page instance.
 * Call this immediately after creating your Playwright page (browser.newPage()).
 */
export const initPages = (page: Page) => {
  pageInstance = page;

  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  automationPage = new AutomationPage(page);
  taskBotPage = new TaskBotPage(page);
  messageBoxPage = new MessageBoxPage(page);
  formPage = new FormPage(page);
  helper = new Helper(page);
  globalVariables = GlobalVariables.getInstance(page);

  return { loginPage, homePage, automationPage, taskBotPage, messageBoxPage, formPage, helper, globalVariables };
};