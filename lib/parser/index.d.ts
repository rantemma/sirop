import { PreRoot, Root, UncaughtCallback } from "./types";
import { ExpressionWord } from "./expression";
import { Token } from "rale";
export declare class Parser {
    private roots;
    private uncaughtCallbacks;
    onUncaught(callback: UncaughtCallback): this;
    offUncaught(callback: UncaughtCallback): this;
    root(root: PreRoot): this;
    removeRoot(root: Root): this;
    removeExpression(expression: ExpressionWord[]): this;
    run(ins: string | Token[]): this;
}
