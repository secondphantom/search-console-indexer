import { IIndexApiClient } from "../../../application/interfaces/index.api.client.interface";
import { IUserRepo } from "../../../application/interfaces/user.repo.interface";
import { LoginService } from "../../../application/service/login.service";

describe("Login Service", () => {
  let loginService: LoginService;
  let userRepo = {} as IUserRepo;
  let indexApiClient = {} as IIndexApiClient;
  beforeEach(async () => {
    loginService = new LoginService({
      userRepo,
      indexApiClient,
    });
  });

  afterEach(() => {
    userRepo = {} as IUserRepo;
    indexApiClient = {} as IIndexApiClient;
  });

  test("Success Login", async () => {
    userRepo.getUser = jest.fn(() => ({
      userId: "example",
      auth: "auth file",
      origins: ["https://example.com"],
    }));
    indexApiClient.init = jest.fn();
    indexApiClient.getSiteList = jest.fn(async () => {
      return [];
    });
    userRepo.updateUser = jest.fn();
    userRepo.asyncSaveUser = jest.fn();

    const result = await loginService.login();

    expect(userRepo.getUser).toBeCalledTimes(1);
    expect(indexApiClient.init).toBeCalledTimes(1);
    expect(indexApiClient.getSiteList).toBeCalledTimes(1);
    expect(userRepo.updateUser).toBeCalledTimes(1);
    expect(userRepo.asyncSaveUser).toBeCalledTimes(1);
    expect(result).toEqual(undefined);
  });

  test("Fail Login", async () => {
    let userRepoGetUserCall = 0;
    userRepo.getUser = jest.fn(() => {
      userRepoGetUserCall++;
      if (userRepoGetUserCall === 1) {
        return {
          userId: "example@gmail.com",
          auth: undefined,
          origins: ["https://example.com"],
        };
      }
      return {
        userId: "example@gmail.com",
        auth: "authCode",
        origins: ["https://example.com"],
      };
    });
    userRepo.updateUser = jest.fn();
    indexApiClient.init = jest.fn();
    indexApiClient.getSiteList = jest.fn(async () => {
      return [];
    });
    indexApiClient.getAuthUrl = jest.fn(() => "authUrl");
    indexApiClient.getAuthToken = jest.fn(async () => "authToken");
    loginService["code"] = "authCode";
    userRepo.asyncSaveUser = jest.fn();

    await loginService.login();
    expect(indexApiClient.getAuthUrl).toBeCalledTimes(1);
    expect(indexApiClient.getAuthToken).toBeCalledTimes(1);
    expect(indexApiClient.getSiteList).toBeCalledTimes(1);
    expect(userRepo.getUser).toBeCalledTimes(3);
    expect(userRepo.updateUser).toBeCalledTimes(2);
    expect(userRepo.asyncSaveUser).toBeCalledTimes(2);
  }, 120000);
});
