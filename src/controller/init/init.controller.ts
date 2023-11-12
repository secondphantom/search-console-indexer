import { IndexService } from "../../application/service/index.service";
import { LoginService } from "../../application/service/login.service";
import { SearchConsoleIndexerConstructorInput } from "../../contract/init.contract";
import { errorResolver } from "../../domain/error";
import { GoogleIndexApiClient } from "../../infrastructure/external-api/google.index.api.client";
import { OriginsRepo } from "../../infrastructure/repo/origins.repo";
import { UserRepo } from "../../infrastructure/repo/user.repo";
import { IndexValidator } from "../../infrastructure/validator/index.validator";
import { IndexController } from "../index/index.controller";
import { IInitValidator } from "./init.interface";

export class InitController {
  constructor(private initValidator: IInitValidator) {}

  getInstance = (constructorInput: SearchConsoleIndexerConstructorInput) => {
    try {
      const { clientSecretFilePath, dataDirPath, userId, options } =
        this.initValidator.constructorInput(constructorInput);

      const userRepo = new UserRepo({
        userId,
        dataDirPath,
        options,
      });

      const originsRepo = new OriginsRepo({
        userId,
        dataDirPath,
        options,
      });

      const indexApiClient = new GoogleIndexApiClient({
        clientSecretFilePath,
      });

      const loginService = new LoginService({
        indexApiClient,
        userRepo,
        options,
      });

      const indexService = new IndexService({
        indexApiClient,
        originsRepo,
        userRepo,
      });

      const indexValidator = new IndexValidator();

      const indexController = new IndexController({
        indexService,
        indexValidator,
      });

      return {
        login: loginService.login,
        index: indexController,
      };
    } catch (error) {
      const { message } = errorResolver(error);
      throw new Error(message);
    }
  };
}
