import fs from "fs";
import { IOriginsRepo } from "../../application/interfaces/origins.repo.interface";
import { UrlInfo } from "../../domain/url.domain";

type OriginsRepoConstructorInput = {
  userId: string;
  dataDirPath: string;
  options?: {
    saveData?: boolean;
  };
};

export class OriginsRepo implements IOriginsRepo {
  private dataFilePath: string;
  private options = {
    saveData: true,
  };
  private data = {
    userId: "",
    origins: new Map<string, Map<string, UrlInfo>>(),
  };

  constructor({ userId, dataDirPath, options }: OriginsRepoConstructorInput) {
    this.data.userId = userId;
    this.dataFilePath = `${dataDirPath}/${userId}-data.json`;
    this.options = {
      ...this.options,
      ...options,
    };
    this.loadData();
    this.syncSaveData();
  }

  private loadData = () => {
    if (!fs.existsSync(this.dataFilePath)) return;
    if (!this.options.saveData) return;
    const rawData = JSON.parse(
      fs.readFileSync(this.dataFilePath, { encoding: "utf-8" })
    ) as { userId: string; origins: [string, [string, UrlInfo][]][] };
    this.data.userId = rawData.userId;
    for (const [origin, urlList] of rawData.origins) {
      this.data.origins.set(origin, new Map(urlList));
    }
  };

  updateUrl = (urlInfo: UrlInfo) => {
    const origin = new URL(urlInfo.url).origin;

    const urlSet = this.getUrlSet(origin);

    urlSet.set(urlInfo.url, urlInfo);
  };

  getUrlSet = (origin: string) => {
    if (!this.data.origins.has(origin)) {
      this.data.origins.set(origin, new Map());
    }
    return this.data.origins.get(origin)!;
  };

  private syncSaveData = () => {
    if (!this.options.saveData) return;
    const rawData = { userId: this.data.userId, origins: [] as any };
    for (const [origin, urlSet] of this.data.origins.entries()) {
      rawData.origins.push([origin, [...urlSet.entries()]]);
    }

    fs.writeFileSync(this.dataFilePath, JSON.stringify(rawData));
  };

  asyncSaveData = async () => {
    if (!this.options.saveData) return;
    const rawData = { userId: this.data.userId, origins: [] as any };
    for (const [origin, urlSet] of this.data.origins.entries()) {
      rawData.origins.push([origin, [...urlSet.entries()]]);
    }

    await fs.promises.writeFile(this.dataFilePath, JSON.stringify(rawData));
  };
}
