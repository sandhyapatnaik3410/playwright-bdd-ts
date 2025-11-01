import { Page } from 'playwright';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';
import { AutomationPage } from './AutomationPage';

export class Pages {
  login: LoginPage;
  home: HomePage;
  automation: AutomationPage;

  constructor(private page: Page) {
    this.login = new LoginPage(page);
    this.home = new HomePage(page);
    this.automation = new AutomationPage(page);
  }
}