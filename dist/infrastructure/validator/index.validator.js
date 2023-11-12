"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const error_1 = require("../../domain/error");
class IndexValidator {
    singleUrlRequestSchema = zod_1.default.object({
        url: zod_1.default.union([
            zod_1.default.string().startsWith("https://"),
            zod_1.default.string().startsWith("http://"),
        ]),
        ignoreIsIndexingOrNot: zod_1.default.boolean().optional(),
    });
    singleUrl = (dto) => {
        try {
            const validDto = this.singleUrlRequestSchema.parse(dto);
            return validDto;
        }
        catch (error) {
            throw error_1.invalidInput;
        }
    };
    bulkUrlRequestSchema = zod_1.default.array(this.singleUrlRequestSchema);
    bulkUrl = (dto) => {
        try {
            const validDto = this.bulkUrlRequestSchema.parse(dto);
            return validDto;
        }
        catch (error) {
            throw error_1.invalidInput;
        }
    };
    sitemapRequestSchema = zod_1.default.object({
        sitemapUrl: zod_1.default.union([
            zod_1.default.string().startsWith("https://"),
            zod_1.default.string().startsWith("http://"),
        ]),
        ignoreIsIndexingOrNot: zod_1.default.boolean().optional(),
    });
    sitemap = (dto) => {
        try {
            const validDto = this.sitemapRequestSchema.parse(dto);
            return validDto;
        }
        catch (error) {
            throw error_1.invalidInput;
        }
    };
}
exports.IndexValidator = IndexValidator;
