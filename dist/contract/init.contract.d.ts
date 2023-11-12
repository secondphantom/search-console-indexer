export type SearchConsoleIndexerConstructorInput = {
    userId: string;
    clientSecretFilePath: string;
    dataDirPath: string;
    options?: {
        saveUser?: boolean;
        saveData?: boolean;
        port?: number;
    };
};
