import Rale from "rale";
import { Token } from "./types";
declare class Lexer extends Rale {
    constructor();
    parse(str: string): Token[];
}
export declare const lexer: Lexer;
export {};
