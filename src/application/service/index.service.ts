import fs from "fs";

import {
  IndexBulkUrlRequest,
  IndexSingeUrlRequest,
  IndexSiteMapRequest,
} from "../../contract/index.contract";
import { ServiceError, errorResolver } from "../../domain/error";
import { UrlDomain, UrlInfo } from "../../domain/url.domain";
import { IIndexApiClient } from "../interfaces/index.api.client.interface";
import { IUserRepo } from "../interfaces/user.repo.interface";

type IOriginsRepo = {
  updateUrl: (url: UrlInfo) => void;
};

type IndexServiceConstructorInput = {
  indexApiClient: IIndexApiClient;
  userRepo: IUserRepo;
  originsRepo: IOriginsRepo;
};

export class IndexService {
  private indexApiClient: IIndexApiClient;
  private userRepo: IUserRepo;
  private originsRepo: IOriginsRepo;

  constructor({
    indexApiClient,
    userRepo,
    originsRepo,
  }: IndexServiceConstructorInput) {
    this.indexApiClient = indexApiClient;
    this.userRepo = userRepo;
    this.originsRepo = originsRepo;
  }

  singleUrl = async (indexSingeUrlRequest: IndexSingeUrlRequest) => {
    const ignoreIsIndexingOrNot = indexSingeUrlRequest.ignoreIsIndexingOrNot
      ? indexSingeUrlRequest.ignoreIsIndexingOrNot
      : false;

    const urlDomain = new UrlDomain({
      url: indexSingeUrlRequest.url,
      requestedDate: new Date().toISOString(),
      isIndexing: false,
      request: {
        success: false,
        message: "Fail",
      },
    });

    try {
      this.checkInvalidUrl(urlDomain);
      await this.inspectUrl(urlDomain, ignoreIsIndexingOrNot);
      await this.indexingUrl(urlDomain);
    } catch (error) {
      const { message } = errorResolver(error, {
        code: 500,
        message: "index url error",
      });
      urlDomain.updateRequest({
        success: false,
        message,
      });
    }

    this.originsRepo.updateUrl(urlDomain.get());

    return urlDomain.get();
  };

  private checkInvalidUrl = (urlDomain: UrlDomain) => {
    const origin = new URL(urlDomain.get().url).origin;
    if (this.userRepo.findOrigin(origin)) return;
    throw new ServiceError({
      code: 400,
      message: `"${urlDomain.get().url}" is not in siteUrls`,
    });
  };

  private inspectUrl = async (
    urlDomain: UrlDomain,
    ignoreIsIndexingOrNot: boolean
  ) => {
    if (ignoreIsIndexingOrNot) return;
    try {
      const { isIndexing } = await this.indexApiClient.inspectUrl({
        url: urlDomain.get().url,
      });
      urlDomain.updateIsIndexing(isIndexing);
      if (!isIndexing) {
        urlDomain.updateRequest({
          success: true,
          message: "Is Already Indexing",
        });
      }
      return;
    } catch (error) {
      throw new ServiceError({
        code: 500,
        message: `fail inspection url:${urlDomain.get().url}`,
      });
    }
  };

  private indexingUrl = async (urlDomain: UrlDomain) => {
    try {
      await this.indexApiClient.indexingUrl({ url: urlDomain.get().url });
      urlDomain.updateRequest({
        success: true,
        message: "Success",
      });
      return;
    } catch (error) {
      throw new ServiceError({
        code: 500,
        message: `fail indexing url:${urlDomain.get().url}`,
      });
    }
  };

  bulkUrl = async (indexBulkUrlRequest: IndexBulkUrlRequest) => {
    const promises = indexBulkUrlRequest.map((request) => this.singleUrl);

    const result = await Promise.allSettled(promises);

    return result;
  };

  sitemap = async (indexSiteMapRequest: IndexSiteMapRequest) => {
    const ignoreIsIndexingOrNot = indexSiteMapRequest.ignoreIsIndexingOrNot
      ? indexSiteMapRequest.ignoreIsIndexingOrNot
      : false;
    const sitemapUrlList = await this.getSitemapUrl(
      indexSiteMapRequest.siteMapUrl
    );

    const bulkUrlRequest: IndexBulkUrlRequest = sitemapUrlList.map((url) => ({
      url,
      ignoreIsIndexingOrNot,
    }));

    const result = this.bulkUrl(bulkUrlRequest);
    return result;
  };

  private getSitemapUrl = async (siteMapUrl: string) => {
    const sitemapXml = await fetch(siteMapUrl, {
      method: "GET",
    }).then((res) => res.text());

    const matchAry = sitemapXml.matchAll(/<loc>(.+)<\/loc>/g);

    const urlList = [...matchAry].map((match) => match[1]);

    return Array.from(new Set(urlList));
  };
}
