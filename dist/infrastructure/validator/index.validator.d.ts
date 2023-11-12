import { IndexBulkUrlRequest, IndexSingeUrlRequest, IndexSitemapRequest } from "../../contract/index.contract";
import { IIndexValidator } from "../../controller/index/index.interface";
export declare class IndexValidator implements IIndexValidator {
    private singleUrlRequestSchema;
    singleUrl: (dto: IndexSingeUrlRequest) => {
        url: string;
        ignoreIsIndexingOrNot?: boolean | undefined;
    };
    private bulkUrlRequestSchema;
    bulkUrl: (dto: IndexBulkUrlRequest) => {
        url: string;
        ignoreIsIndexingOrNot?: boolean | undefined;
    }[];
    private sitemapRequestSchema;
    sitemap: (dto: IndexSitemapRequest) => {
        sitemapUrl: string;
        ignoreIsIndexingOrNot?: boolean | undefined;
    };
}
