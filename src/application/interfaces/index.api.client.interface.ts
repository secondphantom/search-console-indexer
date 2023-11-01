export type IIndexApiClient = {
  init: (auth: any) => Promise<string[]>;
  getAuthUrl: () => string;
  getAuthToken: (code: string) => Promise<any>;
  indexingUrl: ({ url }: { url: string }) => Promise<void>;
  inspectUrl: ({ url }: { url: string }) => Promise<boolean>;
};
