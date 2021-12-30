"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexer = void 0;
const rale_1 = __importDefault(require("rale"));
class Lexer extends rale_1.default {
    parse(str) {
        const result = super.parse(str);
        return result;
    }
}
exports.lexer = new Lexer();
