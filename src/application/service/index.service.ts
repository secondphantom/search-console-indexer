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
import { IOriginsRepo } from "../interfaces/origins.repo.interface";

type IndexServiceConstructorInput = {
  indexApiClient: IIndexApiClient;
  userRepo: IUserRepo;
  originsRepo: IOriginsRepo;
  options?: {
    saveData?: boolean;
  };
};

export class IndexService {
  private indexApiClient: IIndexApiClient;
  private userRepo: IUserRepo;
  private originsRepo: IOriginsRepo;
  private options = {
    saveData: true,
  };

  constructor({
    indexApiClient,
    userRepo,
    originsRepo,
    options,
  }: IndexServiceConstructorInput) {
    this.options = {
      ...this.options,
      ...options,
    };
    this.indexApiClient = indexApiClient;
    this.userRepo = userRepo;
    this.originsRepo = originsRepo;
  }

  singleUrl = async ({
    indexSingeUrlRequest,
    saveData,
  }: {
    indexSingeUrlRequest: IndexSingeUrlRequest;
    saveData?: boolean;
  }) => {
    saveData = saveData === undefined ? true : saveData;
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
      this.checkInvalidOrigin(urlDomain);
      await this.inspectUrl(urlDomain);
      await this.indexingUrl(urlDomain, ignoreIsIndexingOrNot);
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
    if (saveData && this.options.saveData) {
      await this.originsRepo.asyncSaveData();
    }

    return urlDomain.get();
  };

  private checkInvalidOrigin = (urlDomain: UrlDomain) => {
    const origin = new URL(urlDomain.get().url).origin;
    if (this.userRepo.findOrigin(origin)) return;
    throw new ServiceError({
      code: 400,
      message: `"${urlDomain.get().url}" is not in origins`,
    });
  };

  private inspectUrl = async (urlDomain: UrlDomain) => {
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

  private indexingUrl = async (
    urlDomain: UrlDomain,
    ignoreIsIndexingOrNot: boolean
  ) => {
    try {
      if (!ignoreIsIndexingOrNot && urlDomain.get().isIndexing) {
        urlDomain.updateRequest({
          success: true,
          message: "Is Already Indexing",
        });
        return;
      }

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
    const promises = indexBulkUrlRequest.map((request) =>
      this.singleUrl({ indexSingeUrlRequest: request, saveData: false })
    );

    const result = await Promise.all(promises);
    if (this.options.saveData) {
      await this.originsRepo.asyncSaveData();
    }

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
