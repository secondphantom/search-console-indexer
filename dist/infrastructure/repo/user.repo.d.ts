import { User } from "../../domain/user.domain";
import { IUserRepo, UserRepoConstructorInput } from "../../application/interfaces/user.repo.interface";
export declare class UserRepo implements IUserRepo {
    private userDataFilePath;
    private options;
    private user;
    constructor({ userId, dataDirPath, options }: UserRepoConstructorInput);
    private loadUser;
    getUser: () => User;
    updateUser: (user: User) => void;
    findOrigin: (siteUrl: string) => boolean;
    private syncSaveUser;
    asyncSaveUser: () => Promise<void>;
}
