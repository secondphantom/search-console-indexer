import {
  IndexBulkUrlRequest,
  IndexSingeUrlRequest,
  IndexSitemapRequest,
} from "../../contract/index.contract";

export type IIndexValidator = {
  singleUrl: (dto: IndexSingeUrlRequest) => IndexSingeUrlRequest;
  bulkUrl: (dto: IndexBulkUrlRequest) => IndexBulkUrlRequest;
  sitemap: (dto: IndexSitemapRequest) => IndexSitemapRequest;
};
