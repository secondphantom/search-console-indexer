import { IndexService } from "../../application/service/index.service";
import { IndexBulkUrlRequest, IndexSingeUrlRequest, IndexSitemapRequest } from "../../contract/index.contract";
import { IIndexValidator } from "./index.interface";
export declare class IndexController {
    private indexValidator;
    private indexService;
    constructor({ indexValidator, indexService, }: {
        indexValidator: IIndexValidator;
        indexService: IndexService;
    });
    singleUrl: (dto: IndexSingeUrlRequest) => Promise<{
        url: string;
        requestedDate: string;
        isIndexing: boolean;
        request: {
            success: boolean;
            message: string;
        };
    }>;
    bulkUrl: (dto: IndexBulkUrlRequest) => Promise<{
        url: string;
        requestedDate: string;
        isIndexing: boolean;
        request: {
            success: boolean;
            message: string;
        };
    }[]>;
    sitemap: (dto: IndexSitemapRequest) => Promise<{
        url: string;
        requestedDate: string;
        isIndexing: boolean;
        request: {
            success: boolean;
            message: string;
        };
    }[]>;
}
