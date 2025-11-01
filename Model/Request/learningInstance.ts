export interface Field {
  name: string;
  description: string;
  confidenceThreshold: string;
  isRequired: boolean;
  dataType: string;
  domainVersion: string;
  featureType: string;
  displayName: string;
  tabId: string;
}

export interface LearningInstance {
  name: string;
  description: string;
  locale: string;
  fields: Field[];
}