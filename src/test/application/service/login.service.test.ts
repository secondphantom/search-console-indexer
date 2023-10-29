import { IndexApiClient } from "../../../application/interfaces/index.api.client";
import { UserRepo } from "../../../application/interfaces/user.repo.interface";
import { LoginService } from "../../../application/service/login.service";
// import dotenv from "dotenv";
// dotenv.config();

describe("Login Service", () => {
  let loginService: LoginService;
  let userRepo = {} as UserRepo;
  let indexApiClient = {} as IndexApiClient;
  beforeAll(async () => {
    loginService = new LoginService({
      userRepo,
      indexApiClient,
    });
  });

  test("Success Login", async () => {
    userRepo.getUser = jest.fn(() => ({
      email: "example@gmail.com",
      auth: "auth file",
      hosts: ["https://example.com"],
    }));
    indexApiClient.init = jest.fn();

    const result = await loginService.login();

    expect(userRepo.getUser).toBeCalledTimes(2);
    expect(indexApiClient.init).toBeCalledTimes(1);
    expect(result).toEqual(undefined);
  });

  test.only("Fail Login", async () => {
    let userRepoGetUserCall = 0;
    userRepo.getUser = jest.fn(() => {
      userRepoGetUserCall++;
      if (userRepoGetUserCall === 1) {
        return {
          email: "example@gmail.com",
          auth: undefined,
          hosts: ["https://example.com"],
        };
      }
      return {
        email: "example@gmail.com",
        auth: "authCode",
        hosts: ["https://example.com"],
      };
    });
    userRepo.updateUser = jest.fn();
    indexApiClient.init = jest.fn();
    indexApiClient.getAuthUrl = jest.fn(() => "authUrl");
    indexApiClient.getAuthToken = jest.fn(async () => "authToken");
    loginService["code"] = "authCode";

    const result = await loginService.login();
    expect(indexApiClient.getAuthUrl).toBeCalledTimes(1);
    expect(indexApiClient.getAuthToken).toBeCalledTimes(1);
    expect(userRepo.getUser).toBeCalledTimes(3);
    expect(userRepo.updateUser).toBeCalledTimes(1);
    expect(result).toEqual(undefined);
  }, 120000);
});
