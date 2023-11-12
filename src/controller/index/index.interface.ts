import {
  IndexBulkUrlRequest,
  IndexSingeUrlRequest,
  IndexSiteMapRequest,
} from "../../contract/index.contract";

export type IIndexValidator = {
  singleUrl: (dto: IndexSingeUrlRequest) => IndexSingeUrlRequest;
  bulkUrl: (dto: IndexBulkUrlRequest) => IndexBulkUrlRequest;
  sitemap: (dto: IndexSiteMapRequest) => IndexSiteMapRequest;
};
