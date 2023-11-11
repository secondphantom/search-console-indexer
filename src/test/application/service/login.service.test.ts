import { IIndexApiClient } from "../../../application/interfaces/index.api.client.interface";
import { IUserRepo } from "../../../application/interfaces/user.repo.interface";
import { LoginService } from "../../../application/service/login.service";

describe("Login Service", () => {
  let loginService: LoginService;
  let userRepo = {} as IUserRepo;
  let indexApiClient = {} as IIndexApiClient;
  beforeAll(async () => {
    loginService = new LoginService({
      userRepo,
      indexApiClient,
    });
  });

  test("Success Login", async () => {
    userRepo.getUser = jest.fn(() => ({
      userId: "example",
      auth: "auth file",
      origins: ["https://example.com"],
    }));
    indexApiClient.init = jest.fn();

    const result = await loginService.login();

    expect(userRepo.getUser).toBeCalledTimes(1);
    expect(indexApiClient.init).toBeCalledTimes(1);
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
