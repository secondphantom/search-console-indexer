"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const http_1 = __importDefault(require("http"));
const readline = __importStar(require("readline/promises"));
const process_1 = require("process");
const user_domain_1 = require("../../domain/user.domain");
class LoginService {
    rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
    httpServer;
    options = {
        port: 3000,
        saveUser: true,
    };
    userRepo;
    indexApiClient;
    code;
    constructor({ userRepo, indexApiClient, options, }) {
        this.options = {
            ...this.options,
            ...options,
        };
        this.userRepo = userRepo;
        this.indexApiClient = indexApiClient;
    }
    //@ts-ignore
    login = async () => {
        const user = new user_domain_1.UserDomain(this.userRepo.getUser());
        if (user.getUserAuth()) {
            console.info(`Success Login with email: ${user.getUserId()}`);
            await this.indexApiClient.init(user.getUserAuth());
            const siteList = await this.indexApiClient.getSiteList();
            user.updateUserOrigins(siteList.map((siteUrl) => new URL(siteUrl).origin));
            this.userRepo.updateUser(user.getUser());
            if (this.options.saveUser) {
                await this.userRepo.asyncSaveUser();
            }
            return;
        }
        await this.updateUserAuth();
        return await this.login();
    };
    updateUserAuth = async () => {
        await this.openHttpServer();
        const authUrl = this.indexApiClient.getAuthUrl();
        console.info(`Go to auth Url and Approve auth: ${authUrl}`);
        await this.rl.question(`Did you approve OAuth?(Enter)\n`);
        this.closeHttpServer();
        if (!this.code)
            throw new Error("Code is not existed");
        const token = await this.indexApiClient.getAuthToken(this.code);
        const user = new user_domain_1.UserDomain(this.userRepo.getUser());
        user.updateUserAuth(token);
        this.userRepo.updateUser(user.getUser());
        if (this.options.saveUser) {
            await this.userRepo.asyncSaveUser();
        }
        console.info(`Updated User AuthData`);
    };
    openHttpServer = async () => {
        if (this.httpServer)
            return;
        return new Promise((resolve, reject) => {
            this.httpServer = http_1.default
                .createServer(async (req, res) => {
                try {
                    if (req.url.indexOf("/oauth2callback") > -1) {
                        const qs = new URL(req.url, `http://localhost:${this.options.port}`).searchParams;
                        this.code = qs.get("code");
                        return res.end("Authentication successful! Please return to the console.");
                    }
                }
                catch (e) { }
                return res.end("Authentication Fail");
            })
                .listen(this.options.port, () => {
                resolve(null);
            });
        });
    };
    closeHttpServer = () => {
        if (!this.httpServer)
            return;
        this.httpServer.close();
        this.httpServer = undefined;
    };
}
exports.LoginService = LoginService;
