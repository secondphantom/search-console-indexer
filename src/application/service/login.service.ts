import http, { Server } from "http";
import { IUserRepo } from "../interfaces/user.repo.interface";
import * as readline from "readline/promises";
import { stdin, stdout } from "process";
import { IIndexApiClient } from "../interfaces/index.api.client.interface";
import { UserDomain } from "../../domain/user.domain";

type LoginServiceConstructorInput = {
  indexApiClient: IIndexApiClient;
  userRepo: IUserRepo;
  options?: {
    port?: number;
  };
};

export class LoginService {
  private rl = readline.createInterface({ input: stdin, output: stdout });
  private httpServer: undefined | Server;
  private options = {
    port: 3000,
  };
  private userRepo: IUserRepo;
  private indexApiClient: IIndexApiClient;
  private code: string | undefined;

  constructor({
    userRepo,
    indexApiClient,
    options,
  }: LoginServiceConstructorInput) {
    this.options = {
      ...this.options,
      ...options,
    };
    this.userRepo = userRepo;
    this.indexApiClient = indexApiClient;
  }

  //@ts-ignore
  login = async () => {
    const user = new UserDomain(this.userRepo.getUser());
    if (user.getUserAuth()) {
      console.info(`Success Login with email: ${user.getUserId()}`);
      await this.indexApiClient.init(user.getUserAuth());
      const siteList = await this.indexApiClient.getSiteList();
      user.updateUserOrigins(
        siteList.map((siteUrl) => new URL(siteUrl).origin)
      );
      this.userRepo.updateUser(user.getUser());
      await this.userRepo.asyncSaveUser();
      return;
    }

    await this.updateUserAuth();

    return await this.login();
  };

  private updateUserAuth = async () => {
    await this.openHttpServer();
    const authUrl = this.indexApiClient.getAuthUrl();
    console.info(`Go to auth Url and Approve auth: ${authUrl}`);

    await this.rl.question(`Did you approve OAuth?(Enter)\n`);

    this.closeHttpServer();

    if (!this.code) throw new Error("Code is not existed");

    const token = await this.indexApiClient.getAuthToken(this.code);
    const user = new UserDomain(this.userRepo.getUser());
    user.updateUserAuth(token);
    this.userRepo.updateUser(user.getUser());

    console.info(`Updated User AuthData`);
  };

  private openHttpServer = async () => {
    if (this.httpServer) return;
    return new Promise((resolve, reject) => {
      this.httpServer = http
        .createServer(async (req, res) => {
          try {
            if (req.url!.indexOf("/oauth2callback") > -1) {
              const qs = new URL(
                req.url!,
                `http://localhost:${this.options.port}`
              ).searchParams;
              this.code = qs.get("code")!;

              return res.end(
                "Authentication successful! Please return to the console."
              );
            }
          } catch (e) {}

          return res.end("Authentication Fail");
        })
        .listen(this.options.port, () => {
          resolve(null);
        });
    });
  };

  private closeHttpServer = () => {
    if (!this.httpServer) return;
    this.httpServer.close();
    this.httpServer = undefined;
  };
}
