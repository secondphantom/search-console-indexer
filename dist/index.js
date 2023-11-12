"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchConsoleIndexer = void 0;
const init_controller_1 = require("./controller/init/init.controller");
const init_validator_1 = require("./infrastructure/validator/init.validator");
class SearchConsoleIndexer {
    login;
    index;
    constructor(constructorInput) {
        const initValidator = new init_validator_1.InitValidator();
        const { login, index } = new init_controller_1.InitController(initValidator).getInstance(constructorInput);
        this.login = login;
        this.index = index;
    }
}
exports.SearchConsoleIndexer = SearchConsoleIndexer;
