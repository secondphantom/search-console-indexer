export type IndexApiClient = {
  init: (auth: any) => Promise<void>;
  getAuthUrl: () => string;
  getAuthToken: (code: string) => Promise<any>;
  indexingUrl: () => Promise<void>;
};
