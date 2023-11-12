import { IndexService } from "../../application/service/index.service";
import {
  IndexBulkUrlRequest,
  IndexSingeUrlRequest,
  IndexSiteMapRequest,
} from "../../contract/index.contract";
import { errorResolver } from "../../domain/error";
import { IIndexValidator } from "./index.interface";

export class IndexController {
  private indexValidator: IIndexValidator;
  private indexService: IndexService;
  constructor({
    indexValidator,
    indexService,
  }: {
    indexValidator: IIndexValidator;
    indexService: IndexService;
  }) {
    this.indexValidator = indexValidator;
    this.indexService = indexService;
  }

  singleUrl = async (dto: IndexSingeUrlRequest) => {
    try {
      const validDto = this.indexValidator.singleUrl(dto);
      const result = await this.indexService.singleUrl({
        indexSingeUrlRequest: validDto,
      });
      return result;
    } catch (error) {
      const { message } = errorResolver(error);
      throw new Error(message);
    }
  };

  bulkUrl = async (dto: IndexBulkUrlRequest) => {
    try {
      const validDto = this.indexValidator.bulkUrl(dto);
      const result = await this.indexService.bulkUrl(validDto);
      return result;
    } catch (error) {
      const { message } = errorResolver(error);
      throw new Error(message);
    }
  };

  sitemap = async (dto: IndexSiteMapRequest) => {
    try {
      const validDto = this.indexValidator.sitemap(dto);
      const result = await this.indexService.sitemap(validDto);
      return result;
    } catch (error) {
      const { message } = errorResolver(error);
      throw new Error(message);
    }
  };
}
