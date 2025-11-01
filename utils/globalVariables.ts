import { Page } from "@playwright/test";

export class GlobalVariables {
  //Singleton instance — must come before constructor to be recognized
  private static _instance: GlobalVariables | null = null;

  //Common global variables
  public formName: string = "";
  public taskBotName: string = "";
  public learningInstanceName: string = "";

  //Keep Playwright Page reference
  private constructor(private page: Page) {}

  //Singleton getter (inject Page only once)
  public static getInstance(page?: Page): GlobalVariables {
    if (!GlobalVariables._instance) {
      if (!page) {
        throw new Error(
          "GlobalVariables not initialized. Call getInstance(page) with a Page object on first use."
        );
      }
      GlobalVariables._instance = new GlobalVariables(page);
    }
    return GlobalVariables._instance;
  }

  //Expose page if needed
  public getPage(): Page {
    return this.page;
  }

  //Reset global state between scenarios
  public reset(): void {
    this.formName = "";
    this.taskBotName = "";
    this.learningInstanceName = "";
  }
}
