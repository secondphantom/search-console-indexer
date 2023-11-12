import { SearchConsoleIndexer } from "..";
import dotenv from "dotenv";
dotenv.config();

describe("Module Index", () => {
  let indexer: SearchConsoleIndexer;
  beforeAll(() => {
    indexer = new SearchConsoleIndexer({
      userId: process.env.USER_ID!,
      dataDirPath: process.env.DATA_DIR_PATH!,
      clientSecretFilePath: process.env.CLIENT_SECRET_FILE_PATH!,
    });
    indexer.login();
  });

  test("Single Url", async () => {
    const result = await indexer.index.singleUrl({
      url: process.env.NOT_INDEXED_URL!,
    });

    expect(result).toMatchObject({
      url: process.env.NOT_INDEXED_URL!,
      requestedDate: expect.any(String),
      isIndexing: false,
      request: { success: true, message: "Success" },
    });
  });

  test("Bulk Url", async () => {
    const result = await indexer.index.bulkUrl([
      {
        url: process.env.NOT_INDEXED_URL!,
      },
      {
        url: process.env.NOT_INDEXED_URL_2!,
      },
      {
        url: process.env.INDEXED_URL!,
      },
    ]);

    expect(result[0]).toMatchObject({
      url: process.env.NOT_INDEXED_URL!,
      requestedDate: expect.any(String),
      isIndexing: false,
      request: { success: true, message: "Success" },
    });

    expect(result[1]).toMatchObject({
      url: process.env.NOT_INDEXED_URL_2!,
      requestedDate: expect.any(String),
      isIndexing: false,
      request: { success: true, message: "Success" },
    });

    expect(result[2]).toMatchObject({
      url: process.env.INDEXED_URL!,
      requestedDate: expect.any(String),
      isIndexing: true,
      request: { success: true, message: "Is Already Indexing" },
    });
  }, 40000);

  test("Sitemap", async () => {
    const result = await indexer.index.sitemap({
      sitemapUrl: process.env.SITEMAP_URL!,
    });

    console.log(result);
  }, 120000);
});
