"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const fs_1 = __importDefault(require("fs"));
class UserRepo {
    userDataFilePath;
    options = {
        saveUser: true,
    };
    user = {
        auth: "",
        userId: "",
        origins: [],
    };
    constructor({ userId, dataDirPath, options }) {
        this.user.userId = userId;
        this.userDataFilePath = `${dataDirPath}/${userId}-user.json`;
        this.options = {
            ...this.options,
            ...options,
        };
        this.loadUser();
        this.syncSaveUser();
    }
    loadUser = () => {
        if (!fs_1.default.existsSync(this.userDataFilePath))
            return;
        if (!this.options.saveUser)
            return;
        this.user = {
            ...this.user,
            ...JSON.parse(fs_1.default.readFileSync(this.userDataFilePath, { encoding: "utf-8" })),
        };
    };
    getUser = () => {
        return this.user;
    };
    updateUser = (user) => {
        this.user = user;
    };
    findOrigin = (siteUrl) => {
        return this.user.origins.includes(siteUrl);
    };
    syncSaveUser = () => {
        if (!this.options.saveUser)
            return;
        fs_1.default.writeFileSync(this.userDataFilePath, JSON.stringify(this.user));
    };
    asyncSaveUser = async () => {
        if (!this.options.saveUser)
            return;
        await fs_1.default.promises.writeFile(this.userDataFilePath, JSON.stringify(this.user));
    };
}
exports.UserRepo = UserRepo;
