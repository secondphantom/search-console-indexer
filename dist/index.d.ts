import { SearchConsoleIndexerConstructorInput } from "./contract/init.contract";
import { IndexController } from "./controller/index/index.controller";
export declare class SearchConsoleIndexer {
    login: () => Promise<void>;
    index: IndexController;
    constructor(constructorInput: SearchConsoleIndexerConstructorInput);
}
