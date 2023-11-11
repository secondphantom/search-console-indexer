export type IndexSingeUrlRequest = {
  url: string;
  ignoreIsIndexingOrNot?: boolean;
};

export type IndexSingeUrlResponse = {
  url: string;
  requestedDate: string;
  isIndexing: boolean;
  request: {
    success: boolean;
    message: string;
  };
};

export type IndexBulkUrlRequest = IndexSingeUrlRequest[];
export type IndexBulkRulResponse = IndexSingeUrlResponse[];

export type IndexSiteMapRequest = {
  siteMapUrl: string;
  ignoreIsIndexingOrNot?: boolean;
};
export type IndexSiteMapResponse = IndexSingeUrlResponse[];
