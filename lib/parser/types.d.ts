import { Token } from "rale";
import { ExpressionWord } from "./expression";
export interface Resolve {
    [key: string]: Token[];
}
export interface PreRoot {
    expression: ExpressionWord[] | string;
    validate: (resolved: Resolve) => boolean;
}
export interface Root extends PreRoot {
    expression: ExpressionWord[];
}
export declare type UncaughtCallback = (token: Token) => void;
