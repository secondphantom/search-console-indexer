"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginsRepo = void 0;
const fs_1 = __importDefault(require("fs"));
class OriginsRepo {
    dataFilePath;
    options = {
        saveData: true,
    };
    data = {
        userId: "",
        origins: new Map(),
    };
    constructor({ userId, dataDirPath, options }) {
        this.data.userId = userId;
        this.dataFilePath = `${dataDirPath}/${userId}-data.json`;
        this.options = {
            ...this.options,
            ...options,
        };
        this.loadData();
        this.syncSaveData();
    }
    loadData = () => {
        if (!fs_1.default.existsSync(this.dataFilePath))
            return;
        if (!this.options.saveData)
            return;
        const rawData = JSON.parse(fs_1.default.readFileSync(this.dataFilePath, { encoding: "utf-8" }));
        this.data.userId = rawData.userId;
        for (const [origin, urlList] of rawData.origins) {
            this.data.origins.set(origin, new Map(urlList));
        }
    };
    updateUrl = (urlInfo) => {
        const origin = new URL(urlInfo.url).origin;
        const urlSet = this.getUrlSet(origin);
        urlSet.set(urlInfo.url, urlInfo);
    };
    getUrlSet = (origin) => {
        if (!this.data.origins.has(origin)) {
            this.data.origins.set(origin, new Map());
        }
        return this.data.origins.get(origin);
    };
    syncSaveData = () => {
        if (!this.options.saveData)
            return;
        const rawData = { userId: this.data.userId, origins: [] };
        for (const [origin, urlSet] of this.data.origins.entries()) {
            rawData.origins.push([origin, [...urlSet.entries()]]);
        }
        fs_1.default.writeFileSync(this.dataFilePath, JSON.stringify(rawData));
    };
    asyncSaveData = async () => {
        if (!this.options.saveData)
            return;
        const rawData = { userId: this.data.userId, origins: [] };
        for (const [origin, urlSet] of this.data.origins.entries()) {
            rawData.origins.push([origin, [...urlSet.entries()]]);
        }
        await fs_1.default.promises.writeFile(this.dataFilePath, JSON.stringify(rawData));
    };
}
exports.OriginsRepo = OriginsRepo;
