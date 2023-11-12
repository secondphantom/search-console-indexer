import { IndexService } from "./application/service/index.service";
import { LoginService } from "./application/service/login.service";
import { IndexController } from "./controller/index/index.controller";
import { InitController } from "./controller/init/init.controller";
import { GoogleIndexApiClient } from "./infrastructure/external-api/google.index.api.client";
import { OriginsRepo } from "./infrastructure/repo/origins.repo";
import { UserRepo } from "./infrastructure/repo/user.repo";
import { IndexValidator } from "./infrastructure/validator/index.validator";
import { InitValidator } from "./infrastructure/validator/init.validator";

export class SearchConsoleIndexer {
  login: () => any;
  index: IndexController;

  constructor(constructorInput: SearchConsoleIndexerConstructorInput) {
    const initValidator = new InitValidator();
    const { login, index } = new InitController(initValidator).getInstance(
      constructorInput
    );

    this.login = login;
    this.index = index;
  }
}
