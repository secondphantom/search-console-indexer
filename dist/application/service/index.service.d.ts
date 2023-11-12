import { IndexBulkUrlRequest, IndexSingeUrlRequest, IndexSitemapRequest } from "../../contract/index.contract";
import { IIndexApiClient } from "../interfaces/index.api.client.interface";
import { IUserRepo } from "../interfaces/user.repo.interface";
import { IOriginsRepo } from "../interfaces/origins.repo.interface";
type IndexServiceConstructorInput = {
    indexApiClient: IIndexApiClient;
    userRepo: IUserRepo;
    originsRepo: IOriginsRepo;
    options?: {
        saveData?: boolean;
    };
};
export declare class IndexService {
    private indexApiClient;
    private userRepo;
    private originsRepo;
    private options;
    constructor({ indexApiClient, userRepo, originsRepo, options, }: IndexServiceConstructorInput);
    singleUrl: ({ indexSingeUrlRequest, saveData, }: {
        indexSingeUrlRequest: IndexSingeUrlRequest;
        saveData?: boolean | undefined;
    }) => Promise<{
        url: string;
        requestedDate: string;
        isIndexing: boolean;
        request: {
            success: boolean;
            message: string;
        };
    }>;
    private checkInvalidOrigin;
    private inspectUrl;
    private indexingUrl;
    bulkUrl: (indexBulkUrlRequest: IndexBulkUrlRequest) => Promise<{
        url: string;
        requestedDate: string;
        isIndexing: boolean;
        request: {
            success: boolean;
            message: string;
        };
    }[]>;
    sitemap: (indexSiteMapRequest: IndexSitemapRequest) => Promise<{
        url: string;
        requestedDate: string;
        isIndexing: boolean;
        request: {
            success: boolean;
            message: string;
        };
    }[]>;
    private getSitemapUrl;
}
export {};
