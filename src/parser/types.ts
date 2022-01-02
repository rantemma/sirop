import { Token } from "rale";
import { ExpressionWord } from "./expression";

export interface RootResolve {
    [key: string]: Token[]
}

export interface Root {
    expression: ExpressionWord[],
    validate: (matched: RootResolve) => boolean,
}

export type UncaughtCallback = (token: Token) => void;