import { IndexService } from "../../application/service/index.service";
import { LoginService } from "../../application/service/login.service";
import { GoogleIndexApiClient } from "../../infrastructure/external-api/google.index.api.client";
import { OriginsRepo } from "../../infrastructure/repo/origins.repo";
import { UserRepo } from "../../infrastructure/repo/user.repo";
import { IndexController } from "../index/index.controller";
import { IndexValidator } from "../index/index.interface";
import { IInitValidator } from "./init.interface";

export class InitController {
  constructor(private initValidator: IInitValidator) {}

  getInstance = (constructorInput: SearchConsoleIndexerConstructorInput) => {
    const { clientSecretFilePath, dataDirPath, userId, options } =
      this.initValidator.validateConstructor(constructorInput);

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

    const indexValidator = {} as IndexValidator;

    const indexController = new IndexController({
      indexService,
      indexValidator,
    });

    return {
      login: loginService.login,
      index: {
        singleUrl: indexController.singleUrl,
        bulkUrl: indexController.bulkUrl,
        sitemap: indexController.sitemap,
      },
    };
  };
}
