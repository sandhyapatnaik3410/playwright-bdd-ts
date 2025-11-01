export interface Filter {
  operator: string;
  operands: any[];
}

export interface Page {
  offset: number;
  length: number;
}

export class LearningInstanceListModel {
  filter: Filter;
  sort: any[];
  page: Page;

  constructor(
    filter: Filter = { operator: "and", operands: [] },
    sort: any[] = [],
    page: Page = { offset: 0, length: 100 }
  ) {
    this.filter = filter;
    this.sort = sort;
    this.page = page;
  }

  static fromJson(json: any): LearningInstanceListModel {
    return new LearningInstanceListModel(json.filter, json.sort, json.page);
  }
}