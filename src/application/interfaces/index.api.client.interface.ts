export type IIndexApiClient = {
  init: (auth: any) => Promise<void>;
  getAuthUrl: () => string;
  getAuthToken: (code: string) => Promise<any>;
  getSiteList: () => Promise<string[]>;
  indexingUrl: ({ url }: { url: string }) => Promise<any>;
  inspectUrl: ({
    url,
  }: {
    url: string;
  }) => Promise<{ url: string; isIndexing: boolean }>;
};
