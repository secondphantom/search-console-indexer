import { IIndexApiClient } from "../../application/interfaces/index.api.client.interface";
export declare class GoogleIndexApiClient implements IIndexApiClient {
    private GOOGLE_API_SCOPE;
    private oAuth2Client;
    private searchConsole;
    private indexing;
    constructor({ clientSecretFilePath }: {
        clientSecretFilePath: string;
    });
    private getClientSecret;
    init: (auth: any) => Promise<void>;
    getAuthUrl: () => string;
    getAuthToken: (code: string) => Promise<import("google-auth-library").Credentials>;
    getSiteList: () => Promise<string[]>;
    indexingUrl: ({ url }: {
        url: string;
    }) => Promise<import("googleapis").indexing_v3.Schema$UrlNotificationMetadata | undefined>;
    inspectUrl: ({ url }: {
        url: string;
    }) => Promise<{
        url: string;
        isIndexing: boolean;
    }>;
}
