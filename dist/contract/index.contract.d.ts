export type IndexSingeUrlRequest = {
    url: string;
    ignoreIsIndexingOrNot?: boolean;
};
export type IndexSingeUrlResponse = {
    url: string;
    requestedDate: string;
    isIndexing: boolean;
    request: {
        success: boolean;
        message: string;
    };
};
export type IndexBulkUrlRequest = IndexSingeUrlRequest[];
export type IndexBulkRulResponse = IndexSingeUrlResponse[];
export type IndexSitemapRequest = {
    sitemapUrl: string;
    ignoreIsIndexingOrNot?: boolean;
};
export type IndexSitemapResponse = IndexSingeUrlResponse[];
