export type Data = {
    userId: string;
    origins: Map<string, Map<string, UrlInfo>>;
};
export type UrlInfo = {
    url: string;
    requestedDate: string;
    isIndexing: boolean;
    request: {
        success: boolean;
        message: string;
    };
};
export declare class UrlDomain {
    private url;
    private requestedDate;
    private isIndexing;
    private request;
    constructor({ url, requestedDate, isIndexing, request }: UrlInfo);
    updateIsIndexing: (isIndexing: boolean) => void;
    updateRequest: (request: UrlInfo["request"]) => void;
    get: () => {
        url: string;
        requestedDate: string;
        isIndexing: boolean;
        request: {
            success: boolean;
            message: string;
        };
    };
}
