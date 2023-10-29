import http, { Server } from "http";
import { UserRepo } from "../interfaces/user.repo.interface";
import * as readline from "readline/promises";
import { stdin, stdout } from "process";
import { IndexApiClient } from "../interfaces/index.api.client";
import { UserDomain } from "../domain/user.domain";

type LoginServiceConstructorInput = {
  indexApiClient: IndexApiClient;
  userRepo: UserRepo;
  options: {
    port?: number;
  };
};

export class LoginService {
  private rl = readline.createInterface({ input: stdin, output: stdout });
  private httpServer: undefined | Server;
  private options = {
    port: 3000,
  };
  private userRepo: UserRepo;
  private indexApiClient: IndexApiClient;
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

    if (user.auth) {
      console.log(`Success Login with email: ${user.email}`);
      await this.indexApiClient.init(user.auth);
      return;
    }

    try {
      await this.updateUserAuth();
    } catch (error) {}
    return await this.login();
  };

  private updateUserAuth = async () => {
    await this.openHttpServer();

    const authUrl = this.indexApiClient.getAuthUrl();
    console.log(`Go to auth Url and Approve auth: ${authUrl}`);

    await this.rl.question(`Are you redirected?(Enter)\n`);

    this.closeHttpServer();

    if (!this.code) throw new Error("Cannot Get a code");

    const token = await this.indexApiClient.getAuthToken(this.code);
    const user = new UserDomain(this.userRepo.getUser());
    user.updateUserAuth(token);
    this.userRepo.updateUser(user.getUser());

    console.log(`Updated User AuthData`);
  };

  private openHttpServer = async () => {
    if (this.httpServer) return;
    this.httpServer = http
      .createServer(async (req, res) => {
        try {
          if (req.url!.indexOf("/oauth2callback") > -1) {
            const qs = new URL(
              req.url!,
              `http://localhost:${this.options.port}`
            ).searchParams;
            this.code = qs.get("code")!;
            console.log(`Code is ${this.code}`);
            return res.end(
              "Authentication successful! Please return to the console."
            );
          }
        } catch (e) {}

        return res.end("Authentication Fail");
      })
      .listen(this.options.port, () => {});
  };

  private closeHttpServer = () => {
    if (!this.httpServer) return;
    this.httpServer.close();
    this.httpServer = undefined;
  };
}
