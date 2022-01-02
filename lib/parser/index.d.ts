import { Root, UncaughtCallback } from "./types";
import { ExpressionWord } from "./expression";
export declare class Parser {
    private roots;
    private uncaughtCallbacks;
    onUncaught(callback: UncaughtCallback): this;
    offUncaught(callback: UncaughtCallback): this;
    root(root: Root): this;
    removeRoot(root: Root): this;
    removeExpression(expression: ExpressionWord[]): this;
    run(string: string): this;
}
