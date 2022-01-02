import { Root, UncaughtCallback } from "./types";
import { ExpressionWord } from "./expression";
export declare class Parser {
    private roots;
    private uncaughtCallbacks;
    onUncaught(callback: UncaughtCallback): void;
    offUncaught(callback: UncaughtCallback): void;
    /**
     * Add an expression to
     * @param root
     * @param priority Default priority is one
     */
    root(root: Root, priority?: number): void;
    removeRoot(root: Root): void;
    removeExpression(expression: ExpressionWord[]): void;
    run(string: string): void;
}
