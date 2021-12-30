import { TokenName, Token } from "../lexer/types";

export interface Interrupt {

    expression: TokenName[][],

    validate: {
        on: (matched: Token[]) => boolean,
        removeSpace?: boolean,
    },

}

export type UncaughtCallback = (token: Token) => void;