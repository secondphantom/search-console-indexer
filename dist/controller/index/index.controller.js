"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexController = void 0;
const error_1 = require("../../domain/error");
class IndexController {
    indexValidator;
    indexService;
    constructor({ indexValidator, indexService, }) {
        this.indexValidator = indexValidator;
        this.indexService = indexService;
    }
    singleUrl = async (dto) => {
        try {
            const validDto = this.indexValidator.singleUrl(dto);
            const result = await this.indexService.singleUrl({
                indexSingeUrlRequest: validDto,
            });
            return result;
        }
        catch (error) {
            const { message } = (0, error_1.errorResolver)(error);
            throw new Error(message);
        }
    };
    bulkUrl = async (dto) => {
        try {
            const validDto = this.indexValidator.bulkUrl(dto);
            const result = await this.indexService.bulkUrl(validDto);
            return result;
        }
        catch (error) {
            const { message } = (0, error_1.errorResolver)(error);
            throw new Error(message);
        }
    };
    sitemap = async (dto) => {
        try {
            const validDto = this.indexValidator.sitemap(dto);
            const result = await this.indexService.sitemap(validDto);
            return result;
        }
        catch (error) {
            const { message } = (0, error_1.errorResolver)(error);
            throw new Error(message);
        }
    };
}
exports.IndexController = IndexController;
