import { UrlInfo } from "../../domain/url.domain";
export type IOriginsRepo = {
    updateUrl: (url: UrlInfo) => void;
    getUrlSet: (origin: string) => Map<string, UrlInfo>;
    asyncSaveData: () => Promise<void>;
};
