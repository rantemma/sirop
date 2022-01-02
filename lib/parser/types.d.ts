import { Token } from "rale";
import { ExpressionWord } from "./expression";
export interface RootResolve {
    [key: string]: Token[];
}
export interface Root {
    expressionWord: ExpressionWord[];
    validate: (matched: RootResolve) => boolean;
}
export declare type UncaughtCallback = (token: Token) => void;
