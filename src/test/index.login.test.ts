import { SearchConsoleIndexer } from "../index";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

describe("Module Login", () => {
  let indexer: SearchConsoleIndexer;
  const userFilePath = `${process.env.DATA_DIR_PATH!}/${process.env
    .USER_ID!}-user.json`;
  beforeAll(() => {
    indexer = new SearchConsoleIndexer({
      userId: process.env.USER_ID!,
      dataDirPath: process.env.DATA_DIR_PATH!,
      clientSecretFilePath: process.env.CLIENT_SECRET_FILE_PATH!,
    });
  });

  test.skip("OAuth", async () => {
    fs.unlinkSync(userFilePath);
    await indexer.login();
  }, 30000);

  test("don't require OAuth", async () => {
    await indexer.login();
  });
});
