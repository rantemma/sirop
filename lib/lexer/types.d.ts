import { Long, Token as _Token, Unique, Wrapper } from "rale";
export declare const defaultWrapper: Wrapper[];
export declare const defaultLong: Long[];
export declare const defaultUnique: Unique[];
export declare type TokenName = "curly_bracket" | "bracket" | "parenthesis" | "angle_bracket" | "number" | "string" | "dot" | "semicolon" | "colon" | "dash" | "plus" | "equal" | "star" | "slash" | "anti_slash" | "question_mark" | "exclamation_mark" | "double_quote" | "single_quote" | "backtick" | "space";
export interface Token extends _Token {
    name: TokenName;
}
