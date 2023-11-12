import fs from "fs";
import { google } from "googleapis";
import { IIndexApiClient } from "../../application/interfaces/index.api.client.interface";
import { OAuth2Client } from "google-auth-library";

type ClientSecret = {
  web: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    client_secret: string;
    redirect_uris: string[];
  };
};

export class GoogleIndexApiClient implements IIndexApiClient {
  private GOOGLE_API_SCOPE = [
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/indexing",
  ];
  private oAuth2Client: OAuth2Client;
  private searchConsole = google.searchconsole("v1");
  private indexing = google.indexing("v3");

  constructor({ clientSecretFilePath }: { clientSecretFilePath: string }) {
    const clientSecret = this.getClientSecret(clientSecretFilePath)!;
    this.oAuth2Client = new OAuth2Client(
      clientSecret.web.client_id,
      clientSecret.web.client_secret,
      clientSecret.web.redirect_uris[0]
    );
  }

  private getClientSecret = (clientSecretFilePath: string) => {
    if (!fs.existsSync(clientSecretFilePath)) {
      throw new Error("Client secret file is not existed");
    }
    const clientSecret = JSON.parse(
      fs.readFileSync(clientSecretFilePath, { encoding: "utf-8" })
    ) as ClientSecret;
    return clientSecret;
  };

  init = async (auth: any) => {
    this.oAuth2Client.setCredentials(auth);
  };

  getAuthUrl = () => {
    const authorizeUrl = this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.GOOGLE_API_SCOPE,
    });
    return authorizeUrl;
  };

  getAuthToken = async (code: string) => {
    const tokenResponse = await this.oAuth2Client.getToken(code);
    return tokenResponse.tokens;
  };

  getSiteList = async () => {
    const resSiteList = (
      await this.searchConsole.sites.list({ auth: this.oAuth2Client })
    ).data;

    if (!resSiteList.siteEntry) return [];

    const siteList = resSiteList.siteEntry
      .map(({ siteUrl }) => siteUrl)
      .filter((v) => {
        return typeof v === "string";
      }) as string[];

    return siteList;
  };

  indexingUrl = async ({ url }: { url: string }) => {
    const resIndexingUrl = await this.indexing.urlNotifications.publish({
      auth: this.oAuth2Client,
      requestBody: {
        url,
        type: "URL_UPDATED",
      },
    });
    return resIndexingUrl.data.urlNotificationMetadata;
  };

  inspectUrl = async ({ url }: { url: string }) => {
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
