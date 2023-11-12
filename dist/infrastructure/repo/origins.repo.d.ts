import { IOriginsRepo } from "../../application/interfaces/origins.repo.interface";
import { UrlInfo } from "../../domain/url.domain";
type OriginsRepoConstructorInput = {
    userId: string;
    dataDirPath: string;
    options?: {
        saveData?: boolean;
    };
};
export declare class OriginsRepo implements IOriginsRepo {
    private dataFilePath;
    private options;
    private data;
    constructor({ userId, dataDirPath, options }: OriginsRepoConstructorInput);
    private loadData;
    updateUrl: (urlInfo: UrlInfo) => void;
    getUrlSet: (origin: string) => Map<string, UrlInfo>;
    private syncSaveData;
    asyncSaveData: () => Promise<void>;
}
export {};
