"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitController = void 0;
const index_service_1 = require("../../application/service/index.service");
const login_service_1 = require("../../application/service/login.service");
const error_1 = require("../../domain/error");
const google_index_api_client_1 = require("../../infrastructure/external-api/google.index.api.client");
const origins_repo_1 = require("../../infrastructure/repo/origins.repo");
const user_repo_1 = require("../../infrastructure/repo/user.repo");
const index_validator_1 = require("../../infrastructure/validator/index.validator");
const index_controller_1 = require("../index/index.controller");
class InitController {
    initValidator;
    constructor(initValidator) {
        this.initValidator = initValidator;
    }
    getInstance = (constructorInput) => {
        try {
            const { clientSecretFilePath, dataDirPath, userId, options } = this.initValidator.constructorInput(constructorInput);
            const userRepo = new user_repo_1.UserRepo({
                userId,
                dataDirPath,
                options,
            });
            const originsRepo = new origins_repo_1.OriginsRepo({
                userId,
                dataDirPath,
                options,
            });
            const indexApiClient = new google_index_api_client_1.GoogleIndexApiClient({
                clientSecretFilePath,
            });
            const loginService = new login_service_1.LoginService({
                indexApiClient,
                userRepo,
                options,
            });
            const indexService = new index_service_1.IndexService({
                indexApiClient,
                originsRepo,
                userRepo,
            });
            const indexValidator = new index_validator_1.IndexValidator();
            const indexController = new index_controller_1.IndexController({
                indexService,
                indexValidator,
            });
            return {
                login: loginService.login,
                index: indexController,
            };
        }
        catch (error) {
            const { message } = (0, error_1.errorResolver)(error);
            throw new Error(message);
        }
    };
}
exports.InitController = InitController;
