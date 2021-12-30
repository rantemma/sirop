import { Interrupt, UncaughtCallback } from "./types";

import { lexer } from "../lexer";
import { Token } from "../lexer/types";

export class Parser {

    private interrupts: Interrupt[] = [];
    private uncaughtCallbacks: UncaughtCallback[] = [];

    public onUncaught(callback: UncaughtCallback) {
        this.uncaughtCallbacks.push(callback);
    }

    public offUncaught(callback: UncaughtCallback) {
        this.uncaughtCallbacks = this.uncaughtCallbacks.filter(v=>v!==callback);
    }

    public interrupt(interrupt: Interrupt): void {
        this.interrupts.push(interrupt);
    }

    public run(string: string){

        const lexed = lexer.parse(string);

        for (let i = 0; i < lexed.length;) {

            let caught = false;

            for (let int = 0; int < this.interrupts.length; int++) {

                let matched: Token[] = [];
                let skip = 0;

                for (let m = 0; m < this.interrupts[int].expression.length; m++) {

                    if (lexed[i+m].name === "space") {
                        if (this.interrupts[int].validate.removeSpace === true) {
                            matched.push(lexed[i+m]);
                        } else {
                            skip++;
                        }
                    } if (this.interrupts[int].expression[m-skip].includes(lexed[i+m].name)) {
                        matched.push(lexed[i+m]);
                    } else {
                        break;
                    }

                }

                if (matched.length > 0) {

                    const catchBy = this.interrupts[int].validate.on(matched);

                    if (catchBy === true) {
                        caught = true;
                        i += matched.length + skip;
                        break;
                    }

                }

            }

            if (caught !== true) {
                this.uncaughtCallbacks.forEach(v=>v(lexed[i]));
                break;
            }

        }

    }

}