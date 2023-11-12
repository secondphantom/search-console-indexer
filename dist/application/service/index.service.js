"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexService = void 0;
const error_1 = require("../../domain/error");
const url_domain_1 = require("../../domain/url.domain");
class IndexService {
    indexApiClient;
    userRepo;
    originsRepo;
    options = {
        saveData: true,
    };
    constructor({ indexApiClient, userRepo, originsRepo, options, }) {
        this.options = {
            ...this.options,
            ...options,
        };
        this.indexApiClient = indexApiClient;
        this.userRepo = userRepo;
        this.originsRepo = originsRepo;
    }
    singleUrl = async ({ indexSingeUrlRequest, saveData, }) => {
        saveData = saveData === undefined ? true : saveData;
        const ignoreIsIndexingOrNot = indexSingeUrlRequest.ignoreIsIndexingOrNot
            ? indexSingeUrlRequest.ignoreIsIndexingOrNot
            : false;
        const urlDomain = new url_domain_1.UrlDomain({
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
        }
        catch (error) {
            const { message } = (0, error_1.errorResolver)(error, {
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
    checkInvalidOrigin = (urlDomain) => {
        const origin = new URL(urlDomain.get().url).origin;
        if (this.userRepo.findOrigin(origin))
            return;
        throw new error_1.ServiceError({
            code: 400,
            message: `"${urlDomain.get().url}" is not in origins`,
        });
    };
    inspectUrl = async (urlDomain) => {
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
        }
        catch (error) {
            throw new error_1.ServiceError({
                code: 500,
                message: `fail inspection url:${urlDomain.get().url}`,
            });
        }
    };
    indexingUrl = async (urlDomain, ignoreIsIndexingOrNot) => {
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
        }
        catch (error) {
            throw new error_1.ServiceError({
                code: 500,
                message: `fail indexing url:${urlDomain.get().url}`,
            });
        }
    };
    bulkUrl = async (indexBulkUrlRequest) => {
        const promises = indexBulkUrlRequest.map((request) => this.singleUrl({ indexSingeUrlRequest: request, saveData: false }));
        const result = await Promise.all(promises);
        if (this.options.saveData) {
            await this.originsRepo.asyncSaveData();
        }
        return result;
    };
    sitemap = async (indexSiteMapRequest) => {
        const ignoreIsIndexingOrNot = indexSiteMapRequest.ignoreIsIndexingOrNot
            ? indexSiteMapRequest.ignoreIsIndexingOrNot
            : false;
        const sitemapUrlList = await this.getSitemapUrl(indexSiteMapRequest.sitemapUrl);
        const bulkUrlRequest = sitemapUrlList.map((url) => ({
            url,
            ignoreIsIndexingOrNot,
        }));
        const result = this.bulkUrl(bulkUrlRequest);
        return result;
    };
    getSitemapUrl = async (sitemapUrl) => {
        const sitemapXml = await fetch(sitemapUrl, {
            method: "GET",
        }).then((res) => res.text());
        const matchAry = sitemapXml.matchAll(/<loc>(.+)<\/loc>/g);
        const urlList = [...matchAry].map((match) => match[1]);
        return Array.from(new Set(urlList));
    };
}
exports.IndexService = IndexService;
