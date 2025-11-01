import { Page } from 'playwright';

export class LoginPage {
  constructor(private page: Page) {
    this.page = page;
  }

  private usernameInput = 'input[name="username"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'button[name="submitLogin"]';
  private dashboardHeader = 'h1.dashboard-title';

  async navigate(url: string): Promise<void>  {
    await this.page.goto(url, { timeout: 120000 });
    console.log("Navigated to the URL");
  }

  async enterCredentials(username: string, password: string): Promise<void>  {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() : Promise<void> {
    await this.page.click(this.loginButton);
  }

}