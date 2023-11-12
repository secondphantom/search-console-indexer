import { IndexService } from "../../application/service/index.service";
import { IndexValidator } from "./index.interface";

export class IndexController {
  private indexValidator: IndexValidator;
  private indexService: IndexService;
  constructor({
    indexValidator,
    indexService,
  }: {
    indexValidator: IndexValidator;
    indexService: IndexService;
  }) {
    this.indexValidator = indexValidator;
    this.indexService = indexService;
  }

  singleUrl = () => {};
  bulkUrl = () => {};
  sitemap = () => {};
}
