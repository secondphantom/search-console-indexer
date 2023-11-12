import { SearchConsoleIndexerConstructorInput } from "../../contract/init.contract";
import { IndexController } from "../index/index.controller";
import { IInitValidator } from "./init.interface";
export declare class InitController {
    private initValidator;
    constructor(initValidator: IInitValidator);
    getInstance: (constructorInput: SearchConsoleIndexerConstructorInput) => {
        login: () => any;
        index: IndexController;
    };
}
