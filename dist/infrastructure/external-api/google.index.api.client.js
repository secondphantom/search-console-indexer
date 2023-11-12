"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleIndexApiClient = void 0;
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
class GoogleIndexApiClient {
    GOOGLE_API_SCOPE = [
        "https://www.googleapis.com/auth/webmasters",
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/indexing",
    ];
    oAuth2Client;
    searchConsole = googleapis_1.google.searchconsole("v1");
    indexing = googleapis_1.google.indexing("v3");
    constructor({ clientSecretFilePath }) {
        const clientSecret = this.getClientSecret(clientSecretFilePath);
        this.oAuth2Client = new google_auth_library_1.OAuth2Client(clientSecret.web.client_id, clientSecret.web.client_secret, clientSecret.web.redirect_uris[0]);
    }
    getClientSecret = (clientSecretFilePath) => {
        if (!fs_1.default.existsSync(clientSecretFilePath)) {
            throw new Error("Client secret file is not existed");
        }
        const clientSecret = JSON.parse(fs_1.default.readFileSync(clientSecretFilePath, { encoding: "utf-8" }));
        return clientSecret;
    };
    init = async (auth) => {
        this.oAuth2Client.setCredentials(auth);
    };
    getAuthUrl = () => {
        const authorizeUrl = this.oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.GOOGLE_API_SCOPE,
        });
        return authorizeUrl;
    };
    getAuthToken = async (code) => {
        const tokenResponse = await this.oAuth2Client.getToken(code);
        return tokenResponse.tokens;
    };
    getSiteList = async () => {
        const resSiteList = (await this.searchConsole.sites.list({ auth: this.oAuth2Client })).data;
        if (!resSiteList.siteEntry)
            return [];
        const siteList = resSiteList.siteEntry
            .map(({ siteUrl }) => siteUrl)
            .filter((v) => {
            return typeof v === "string";
        });
        return siteList;
    };
    indexingUrl = async ({ url }) => {
        const resIndexingUrl = await this.indexing.urlNotifications.publish({
            auth: this.oAuth2Client,
            requestBody: {
                url,
                type: "URL_UPDATED",
            },
        });
        return resIndexingUrl.data.urlNotificationMetadata;
    };
    inspectUrl = async ({ url }) => {
        const resInspectURL = await this.searchConsole.urlInspection.index.inspect({
            requestBody: {
                inspectionUrl: url,
                siteUrl: new URL(url).origin + "/",
            },
            auth: this.oAuth2Client,
        });
        return resInspectURL.data.inspectionResult?.indexStatusResult?.verdict ===
            "PASS"
            ? {
                url,
                isIndexing: true,
            }
            : {
                url,
                isIndexing: false,
            };
    };
}
exports.GoogleIndexApiClient = GoogleIndexApiClient;
