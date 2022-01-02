import { Token } from "rale";
import { ExpressionWord } from "./expression";
export interface RootResolve {
    [key: string]: Token[];
}
export interface PreRoot {
    expression: ExpressionWord[] | string;
    validate: (matched: RootResolve) => boolean;
}
export interface Root extends PreRoot {
    expression: ExpressionWord[];
}
export declare type UncaughtCallback = (token: Token) => void;
