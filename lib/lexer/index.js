"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexer = void 0;
const rale_1 = __importDefault(require("rale"));
const types_1 = require("./types");
class Lexer extends rale_1.default {
    constructor() {
        super(types_1.defaultLong, types_1.defaultUnique, types_1.defaultWrapper);
    }
}
exports.lexer = new Lexer();
