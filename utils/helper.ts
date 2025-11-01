import { Page } from 'playwright';

export class Helper {

  constructor(private page: Page) {
      this.page = page;
    }

  /**
   * Generates a unique form name in the format Form_DDMMHHSS
   * Example: Form_30101542 → 30th Oct, 10:15:42
   */
   generateUniqueName(prefix: string): string {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, "0");

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    const uniqueName = `${prefix}_${day}${month}${hours}${minutes}${seconds}`;
    console.log(`Generated unique name: ${uniqueName}`);
    return uniqueName;
  }
}
