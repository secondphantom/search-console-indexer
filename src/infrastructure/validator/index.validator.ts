import z from "zod";
import {
  IndexBulkUrlRequest,
  IndexSingeUrlRequest,
  IndexSitemapRequest,
} from "../../contract/index.contract";
import { IIndexValidator } from "../../controller/index/index.interface";
import { invalidInput } from "../../domain/error";

export class IndexValidator implements IIndexValidator {
  private singleUrlRequestSchema = z.object({
    url: z.union([
      z.string().startsWith("https://"),
      z.string().startsWith("http://"),
    ]),
    ignoreIsIndexingOrNot: z.boolean().optional(),
  });

  singleUrl = (dto: IndexSingeUrlRequest) => {
    try {
      const validDto = this.singleUrlRequestSchema.parse(dto);
      return validDto;
    } catch (error) {
      throw invalidInput;
    }
  };

  private bulkUrlRequestSchema = z.array(this.singleUrlRequestSchema);

  bulkUrl = (dto: IndexBulkUrlRequest) => {
    try {
      const validDto = this.bulkUrlRequestSchema.parse(dto);
      return validDto;
    } catch (error) {
      throw invalidInput;
    }
  };

  private sitemapRequestSchema = z.object({
    sitemapUrl: z.union([
      z.string().startsWith("https://"),
      z.string().startsWith("http://"),
    ]),
    ignoreIsIndexingOrNot: z.boolean().optional(),
  });

  sitemap = (dto: IndexSitemapRequest) => {
    try {
      const validDto = this.sitemapRequestSchema.parse(dto);
      return validDto;
    } catch (error) {
      throw invalidInput;
    }
  };
}
