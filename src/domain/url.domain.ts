export type UrlInfo = {
  url: string;
  requestedDate: string;
  isIndexing: boolean;
  request: {
    success: boolean;
    message: string;
  };
};

export class UrlDomain {
  private url: string;
  private requestedDate: string;
  private isIndexing: boolean;
  private request: {
    success: boolean;
    message: string;
  };

  constructor({ url, requestedDate, isIndexing, request }: UrlInfo) {
    this.url = url;
    this.requestedDate = requestedDate;
    this.isIndexing = isIndexing;
    this.request = request;
  }

  updateIsIndexing = (isIndexing: boolean) => {
    this.isIndexing = isIndexing;
  };

  updateRequest = (request: UrlInfo["request"]) => {
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
