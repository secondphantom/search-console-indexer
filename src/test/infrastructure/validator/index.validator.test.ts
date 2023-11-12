import { IndexValidator } from "../../../infrastructure/validator/index.validator";

// case validate url http or https
//

describe("Index validator", () => {
  let indexValidator: IndexValidator;

  beforeEach(() => {
    indexValidator = new IndexValidator();
  });

  describe("Single Url", () => {
    test.each<{
      message: string;
      throwError: boolean;
      dto: any;
    }>([
      {
        message: "valid protocol https",
        throwError: false,
        dto: {
          url: "https://example.com",
        },
      },
      {
        message: "valid protocol http",
        throwError: false,
        dto: {
          url: "http://example.com",
        },
      },
      {
        message: "valid input",
        throwError: false,
        dto: {
          url: "http://example.com",
          ignoreIsIndexingOrNot: true,
        },
      },
      {
        message: "invalid protocol",
        throwError: true,
        dto: {
          url: "ws://example.com",
        },
      },
      {
        message: "invalid url type",
        throwError: true,
        dto: {
          url: true,
        },
      },
      {
        message: "invalid other type",
        throwError: true,
        dto: {
          ignoreIsIndexingOrNot: "string",
        },
      },
      {
        message: "required url value",
        throwError: true,
        dto: {
          ignoreIsIndexingOrNot: true,
        },
      },
    ])("$message", async ({ dto, throwError }) => {
      let occurError = false;
      try {
        const result = indexValidator.singleUrl(dto as any);
      } catch (error) {
        occurError = true;
      }
      if (throwError) {
        expect(occurError).toEqual(true);
      } else {
        expect(occurError).toEqual(false);
      }
    });
  });

  describe("Bulk Url", () => {
    test.each<{
      message: string;
      throwError: boolean;
      dto: any;
    }>([
      {
        message: "valid type",
        throwError: false,
        dto: [
          {
            url: "https://example.com",
          },
          {
            url: "http://example.com",
          },
        ],
      },
      {
        message: "invalid type",
        throwError: true,
        dto: {
          url: "http://example.com",
        },
      },
    ])("$message", async ({ dto, throwError }) => {
      let occurError = false;
      try {
        const result = indexValidator.bulkUrl(dto as any);
      } catch (error) {
        occurError = true;
      }
      if (throwError) {
        expect(occurError).toEqual(true);
      } else {
        expect(occurError).toEqual(false);
      }
    });
  });

  describe("Sitemap", () => {
    test.each<{
      message: string;
      throwError: boolean;
      dto: any;
    }>([
      {
        message: "valid protocol https",
        throwError: false,
        dto: {
          sitemapUrl: "https://example.com/sitemap.xml",
        },
      },
      {
        message: "valid protocol http",
        throwError: false,
        dto: {
          sitemapUrl: "http://example.com/sitemap.xml",
        },
      },
      {
        message: "valid input",
        throwError: false,
        dto: {
          sitemapUrl: "https://example.com/sitemap.xml",
          ignoreIsIndexingOrNot: true,
        },
      },
      {
        message: "invalid protocol",
        throwError: true,
        dto: {
          sitemapUrl: "ws://example.com/sitemap.xml",
        },
      },
      {
        message: "invalid sitemap url type",
        throwError: true,
        dto: {
          sitemapUrl: true,
        },
      },
      {
        message: "invalid other type",
        throwError: true,
        dto: {
          ignoreIsIndexingOrNot: "string",
        },
      },
      {
        message: "required sitemap value",
        throwError: true,
        dto: {
          ignoreIsIndexingOrNot: true,
        },
      },
    ])("$message", async ({ dto, throwError }) => {
      let occurError = false;
      try {
        const result = indexValidator.sitemap(dto as any);
      } catch (error) {
        occurError = true;
      }
      if (throwError) {
        expect(occurError).toEqual(true);
      } else {
        expect(occurError).toEqual(false);
      }
    });
  });
});
