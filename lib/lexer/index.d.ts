import Rale from "rale";
import { Token } from "./types";
declare class Lexer extends Rale {
    parse(str: string): Token[];
}
export declare const lexer: Lexer;
export {};
