import dotenv from "dotenv";
dotenv.config();
import { IIndexApiClient } from "../../../application/interfaces/index.api.client.interface";
import { IOriginsRepo } from "../../../application/interfaces/origins.repo.interface";
import { IUserRepo } from "../../../application/interfaces/user.repo.interface";
import { IndexService } from "../../../application/service/index.service";

describe("Index Service", () => {
  let indexService: IndexService;
  let userRepo = {} as IUserRepo;
  let indexApiClient = {} as IIndexApiClient;
  let originsRepo = {} as IOriginsRepo;

  beforeEach(async () => {
    indexService = new IndexService({
      userRepo,
      indexApiClient,
      originsRepo,
    });
  });

  describe("Single Url", () => {
    describe("Fail", () => {
      test("invalid origin", async () => {
        const request = {
          url: "https://example.com",
        };
        userRepo.findOrigin = jest.fn(() => false);
        originsRepo.updateUrl = jest.fn(() => undefined);
        indexService["inspectUrl"] = jest.fn(() => undefined as any);

        const result = await indexService.singleUrl(request);

        expect(result).toMatchObject({
          url: request.url,
          requestedDate: expect.any(String),
          isIndexing: false,
          request: {
            success: false,
            message: `"${request.url}" is not in origins`,
          },
        });

        expect(userRepo.findOrigin).toBeCalledTimes(1);
        expect(originsRepo.updateUrl).toBeCalledTimes(1);
        expect(indexService["inspectUrl"]).toBeCalledTimes(0);
      });

      test("fail inspect url", async () => {
        const request = {
          url: "https://example.com",
        };
        userRepo.findOrigin = jest.fn(() => true);
        originsRepo.updateUrl = jest.fn(() => undefined);
        indexApiClient.inspectUrl = jest.fn(async () => {
          throw new Error();
        });
        indexService["indexingUrl"] = jest.fn(() => undefined as any);

        const result = await indexService.singleUrl(request);

        expect(result).toMatchObject({
          url: request.url,
          requestedDate: expect.any(String),
          isIndexing: false,
          request: {
            success: false,
            message: `fail inspection url:${request.url}`,
          },
        });

        expect(userRepo.findOrigin).toBeCalledTimes(1);
        expect(originsRepo.updateUrl).toBeCalledTimes(1);
        expect(indexApiClient.inspectUrl).toBeCalledTimes(1);
        expect(indexService["indexingUrl"]).toBeCalledTimes(0);
      });

      test("fail indexing url", async () => {
        const request = {
          url: "https://example.com",
        };
        userRepo.findOrigin = jest.fn(() => true);
        originsRepo.updateUrl = jest.fn(() => undefined);
        indexApiClient.inspectUrl = jest.fn(() => {
          return new Promise((res) => {
            res({ isIndexing: false, url: request.url });
          });
        });
        indexApiClient.indexingUrl = jest.fn(() => {
          throw new Error();
        });

        const result = await indexService.singleUrl(request);

        expect(result).toMatchObject({
          url: request.url,
          requestedDate: expect.any(String),
          isIndexing: false,
          request: {
            success: false,
            message: `fail indexing url:${request.url}`,
          },
        });

        expect(userRepo.findOrigin).toBeCalledTimes(1);
        expect(originsRepo.updateUrl).toBeCalledTimes(1);
        expect(indexApiClient.inspectUrl).toBeCalledTimes(1);
        expect(indexApiClient.indexingUrl).toBeCalledTimes(1);
      });
    });
    describe("Success", () => {
      test("ignore inspect", async () => {
        const request = {
          url: "https://example.com",
          ignoreIsIndexingOrNot: true,
        };
        userRepo.findOrigin = jest.fn(() => true);
        originsRepo.updateUrl = jest.fn(() => undefined);
        indexApiClient.inspectUrl = jest.fn(() => {
          return new Promise((res) => {
            res({ isIndexing: true, url: request.url });
          });
        });
        indexApiClient.indexingUrl = jest.fn(() => {
          return new Promise((res) => {
            res(undefined);
          });
        });

        const result = await indexService.singleUrl(request);

        expect(result).toMatchObject({
          url: request.url,
          requestedDate: expect.any(String),
          isIndexing: true,
          request: {
            success: true,
            message: `Success`,
          },
        });

        expect(userRepo.findOrigin).toBeCalledTimes(1);
        expect(originsRepo.updateUrl).toBeCalledTimes(1);
        expect(indexApiClient.inspectUrl).toBeCalledTimes(1);
        expect(indexApiClient.indexingUrl).toBeCalledTimes(1);
      });
      test("not ignore", async () => {
        const request = {
          url: "https://example.com",
        };
        userRepo.findOrigin = jest.fn(() => true);
        originsRepo.updateUrl = jest.fn(() => undefined);
        indexApiClient.inspectUrl = jest.fn(() => {
          return new Promise((res) => {
            res({ isIndexing: true, url: request.url });
          });
        });
        indexApiClient.indexingUrl = jest.fn(() => {
          return new Promise((res) => {
            res(undefined);
          });
        });

        const result = await indexService.singleUrl(request);

        expect(result).toMatchObject({
          url: request.url,
          requestedDate: expect.any(String),
          isIndexing: true,
          request: {
            success: true,
            message: `Is Already Indexing`,
          },
        });

        expect(userRepo.findOrigin).toBeCalledTimes(1);
        expect(originsRepo.updateUrl).toBeCalledTimes(1);
        expect(indexApiClient.inspectUrl).toBeCalledTimes(1);
        expect(indexApiClient.indexingUrl).toBeCalledTimes(0);
      });
    });
  });

  describe("Bulk Url", () => {
    test("Success", async () => {
      const requests = [
        {
          url: "https://example.com",
          ignoreIsIndexingOrNot: true,
        },
        {
          url: "https://example.com",
          ignoreIsIndexingOrNot: true,
        },
        {
          url: "https://example.com",
          ignoreIsIndexingOrNot: true,
        },
        {
          url: "https://example.com",
          ignoreIsIndexingOrNot: true,
        },
      ];

      indexService.singleUrl = jest.fn(() => {
        return new Promise((res) => {
          res(undefined as any);
        });
      });

      const result = indexService.bulkUrl(requests);

      expect(indexService.singleUrl).toBeCalledTimes(requests.length);
    });
  });

  describe("Sitemap Url", () => {
    test("Get Sitemap Url", async () => {
      const sitemapUrl = process.env.SITEMAP_URL!;
      const origin = new URL(sitemapUrl).origin;
      const result = await indexService["getSitemapUrl"](sitemapUrl as string);

      expect(result).toEqual(expect.any(Array));
      result.forEach((url) => {
        expect(url.startsWith(origin)).toEqual(true);
      });
    });
  });
});
