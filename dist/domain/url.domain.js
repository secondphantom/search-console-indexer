"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlDomain = void 0;
class UrlDomain {
    url;
    requestedDate;
    isIndexing;
    request;
    constructor({ url, requestedDate, isIndexing, request }) {
        this.url = url;
        this.requestedDate = requestedDate;
        this.isIndexing = isIndexing;
        this.request = request;
    }
    updateIsIndexing = (isIndexing) => {
        this.isIndexing = isIndexing;
    };
    updateRequest = (request) => {
        this.request = request;
    };
    get = () => {
        return {
            url: this.url,
            requestedDate: this.requestedDate,
            isIndexing: this.isIndexing,
            request: this.request,
        };
    };
}
exports.UrlDomain = UrlDomain;
