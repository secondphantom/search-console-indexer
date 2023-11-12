import { SearchConsoleIndexerConstructorInput } from "./contract/init.contract";
import { IndexController } from "./controller/index/index.controller";
import { InitController } from "./controller/init/init.controller";
import { InitValidator } from "./infrastructure/validator/init.validator";

export class SearchConsoleIndexer {
  login: () => Promise<void>;
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
