import { OriginsRepo } from "../../../infrastructure/repo/origins.repo";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

describe("Origins Repo", () => {
  let originsRepo: OriginsRepo;

  beforeAll(() => {
    originsRepo = new OriginsRepo({
      userId: process.env.USER_ID!,
      dataDirPath: process.env.DATA_DIR_PATH!,
    });
  });

  test("Check file is existed", () => {
    const dataFilePath = `${process.env.DATA_DIR_PATH!}/${process.env
      .USER_ID!}-data.json`;
    expect(fs.existsSync(dataFilePath)).toEqual(true);
  });

  test("Update Url Info", async () => {
    const origin = "https://example.com";
    const urlInfoList = [
      {
        url: `${origin}/1/`,
        requestedDate: new Date().toISOString(),
        isIndexing: false,
        request: {
          success: true,
          message: "Success",
        },
      },
      {
        url: `${origin}/2/`,
        requestedDate: new Date().toISOString(),
        isIndexing: false,
        request: {
          success: true,
          message: "Success",
        },
      },
    ];

    for (const urlInfo of urlInfoList) {
      originsRepo.updateUrl(urlInfo);
    }

    await originsRepo.asyncSaveData();

    const urlSet = originsRepo.getUrlSet(origin);

    expect(urlSet.has(urlInfoList[0].url)).toEqual(true);
    expect(urlSet.has(urlInfoList[1].url)).toEqual(true);
  });
});
