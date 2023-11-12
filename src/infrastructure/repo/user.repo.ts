import fs from "fs";
import { User } from "../../domain/user.domain";
import {
  IUserRepo,
  UserRepoConstructorInput,
} from "../../application/interfaces/user.repo.interface";

export class UserRepo implements IUserRepo {
  private userDataFilePath: string;
  private options = {
    saveUser: true,
  };
  private user: User = {
    auth: "",
    userId: "",
    origins: [],
  };

  constructor({ userId, dataDirPath, options }: UserRepoConstructorInput) {
    this.user.userId = userId;
    this.userDataFilePath = `${dataDirPath}/${userId}-user.json`;
    this.options = {
      ...this.options,
      ...options,
    };
    this.loadUser();
    this.syncSaveUser();
  }

  private loadUser = () => {
    if (!fs.existsSync(this.userDataFilePath)) return;
    if (!this.options.saveUser) return;
    this.user = {
      ...this.user,
      ...JSON.parse(
        fs.readFileSync(this.userDataFilePath, { encoding: "utf-8" })
      ),
    };
  };

  getUser = () => {
    return this.user;
  };

  updateUser = (user: User) => {
    this.user = user;
  };

  findOrigin = (siteUrl: string) => {
    return this.user.origins.includes(siteUrl);
  };

  private syncSaveUser = () => {
    if (!this.options.saveUser) return;
    fs.writeFileSync(this.userDataFilePath, JSON.stringify(this.user));
  };

  asyncSaveUser = async () => {
    if (!this.options.saveUser) return;
    await fs.promises.writeFile(
      this.userDataFilePath,
      JSON.stringify(this.user)
    );
  };
}
