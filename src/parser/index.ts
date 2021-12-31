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

                for (let m = 0; m-skip < this.interrupts[int].expression.length && i+m < lexed.length; m++) {

                    if (lexed[i+m].name === "space") {
                        matched.push(lexed[i+m]);
                        skip++;
                    } else if (this.interrupts[int].expression[m-skip].includes(lexed[i+m].name)) {
                        matched.push(lexed[i+m]);
                    } else {
                        break;
                    }

                }

                if (matched.length-skip > 0) {

                    const catchBy = this.interrupts[int].validate.on(
                        this.interrupts[int].validate.removeSpace === true ? matched.filter(v=>v.name!=="space") : matched
                    );

                    if (catchBy === true) {
                        caught = true;
                        i += matched.length;
                        break;
                    }

                }

            }

            if (caught !== true && lexed[i].name !== "space") {
                this.uncaughtCallbacks.forEach(v=>v(lexed[i]));
                break;
            } else if (caught !== true && lexed[i].name === "space") {
                i++;
            }

        }

    }

}