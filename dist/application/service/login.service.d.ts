import { IUserRepo } from "../interfaces/user.repo.interface";
import { IIndexApiClient } from "../interfaces/index.api.client.interface";
type LoginServiceConstructorInput = {
    indexApiClient: IIndexApiClient;
    userRepo: IUserRepo;
    options?: {
        port?: number;
        saveUser?: boolean;
    };
};
export declare class LoginService {
    private rl;
    private httpServer;
    private options;
    private userRepo;
    private indexApiClient;
    private code;
    constructor({ userRepo, indexApiClient, options, }: LoginServiceConstructorInput);
    login: () => any;
    private updateUserAuth;
    private openHttpServer;
    private closeHttpServer;
}
export {};
