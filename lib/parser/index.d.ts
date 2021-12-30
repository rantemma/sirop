import { Interrupt, UncaughtCallback } from "./types";
export declare class Parser {
    private interrupts;
    private uncaughtCallbacks;
    onUncaught(callback: UncaughtCallback): void;
    offUncaught(callback: UncaughtCallback): void;
    interrupt(interrupt: Interrupt): void;
    run(string: string): void;
}
