export type SearchConsoleIndexerConstructorInput = {
  userId: string;
  clientSecretFilePath: string;
  dataDirPath: string;
  options?: {
    //default true
    saveUser?: boolean;
    //default true
    saveData?: boolean;
    //default 3005
    port?: number;
  };
};
