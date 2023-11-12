import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { GoogleIndexApiClient } from "../../../infrastructure/external-api/google.index.api.client";

describe("Google Index Api Client", () => {
  let googleIndexApiClient: GoogleIndexApiClient;
  const CLIENT_SECRET_FILE_PATH = process.env.CLIENT_SECRET_FILE_PATH!;
  const OAUTH_CODE = process.env.OAUTH_CODE!;
  const TEST_AUTH_FILE_PATH = process.env.TEST_AUTH_FILE_PATH!;
  const INDEXED_URL = process.env.INDEXED_URL!;
  const NOT_INDEXED_URL = process.env.NOT_INDEXED_URL!;

  beforeAll(() => {
    googleIndexApiClient = new GoogleIndexApiClient({
      clientSecretFilePath: CLIENT_SECRET_FILE_PATH,
    });
  });

  describe("Constructor", () => {
    test("Get Client Secret", () => {
      const clientSecret = googleIndexApiClient["getClientSecret"](
        CLIENT_SECRET_FILE_PATH
      );

      expect(clientSecret).toMatchObject({
        web: {
          client_id: expect.any(String),
          project_id: expect.any(String),
          auth_uri: expect.any(String),
          token_uri: expect.any(String),
          client_secret: expect.any(String),
          redirect_uris: expect.any(Array),
        },
      });
    });
  });

  describe.skip("Auth", () => {
    test("Get Auth Url", () => {
      const authUrl = googleIndexApiClient.getAuthUrl();
      console.log(authUrl);
      expect(authUrl).toMatch(/^https:\/\/accounts.google.com/g);
    });
    test("Get Auth Token", async () => {
      const token = await googleIndexApiClient.getAuthToken(OAUTH_CODE);

      expect(token).toMatchObject({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });

      fs.writeFileSync(TEST_AUTH_FILE_PATH, JSON.stringify(token));
    });
  });

  test.skip("Get Site List", async () => {
    const auth = JSON.parse(
      fs.readFileSync(TEST_AUTH_FILE_PATH, {
        encoding: "utf-8",
      })
    );
    await googleIndexApiClient.init(auth);
    const siteList = await googleIndexApiClient.getSiteList();

    expect(Array.isArray(siteList)).toEqual(true);
    for (const url of siteList) {
      expect(url).toEqual(expect.any(String));
    }
  });

  describe.only("Url", () => {
    beforeAll(async () => {
      const auth = JSON.parse(
        fs.readFileSync(TEST_AUTH_FILE_PATH, {
          encoding: "utf-8",
        })
      );
      await googleIndexApiClient.init(auth);
    });

    test("Inspect not indexed Url", async () => {
      const result = await googleIndexApiClient.inspectUrl({
        url: NOT_INDEXED_URL,
      });

      expect(result).toEqual({
        url: NOT_INDEXED_URL,
        isIndexing: false,
      });
    });

    test("Inspect indexed Url", async () => {
      const result = await googleIndexApiClient.inspectUrl({
        url: INDEXED_URL,
      });

      expect(result).toEqual({
        url: INDEXED_URL,
        isIndexing: true,
      });
    });

    test("Indexing Url", async () => {
      const result = await googleIndexApiClient.indexingUrl({
        url: NOT_INDEXED_URL,
      });

      console.log(result);
    });
  });
});
