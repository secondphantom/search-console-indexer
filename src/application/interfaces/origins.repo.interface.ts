import { UrlInfo } from "../../domain/url.domain";

export type IOriginsRepo = {
  updateUrl: (url: UrlInfo) => void;
};
