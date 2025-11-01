import { Page } from 'playwright';

export class HomePage {
  constructor(private page: Page) {
    this.page = page;
  }


  private automationLink = 'a[name="automations"]';

  async navigateToAutomation() {
    await this.page.click(this.automationLink);
  }
}

