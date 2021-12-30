"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const lexer_1 = require("../lexer");
class Parser {
    constructor() {
        this.interrupts = [];
        this.uncaughtCallbacks = [];
    }
    onUncaught(callback) {
        this.uncaughtCallbacks.push(callback);
    }
    offUncaught(callback) {
        this.uncaughtCallbacks = this.uncaughtCallbacks.filter(v => v !== callback);
    }
    interrupt(interrupt) {
        this.interrupts.push(interrupt);
    }
    run(string) {
        const lexed = lexer_1.lexer.parse(string);
        for (let i = 0; i < lexed.length;) {
            let caught = false;
            for (let int = 0; int < this.interrupts.length; int++) {
                let matched = [];
                let skip = 0;
                for (let m = 0; m < this.interrupts[int].expression.length; m++) {
                    if (lexed[i + m].name === "space") {
                        if (this.interrupts[int].validate.removeSpace === true) {
                            matched.push(lexed[i + m]);
                        }
                        else {
                            skip++;
                        }
                    }
                    if (this.interrupts[int].expression[m - skip].includes(lexed[i + m].name)) {
                        matched.push(lexed[i + m]);
                    }
                    else {
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
                this.uncaughtCallbacks.forEach(v => v(lexed[i]));
                break;
            }
        }
    }
}
exports.Parser = Parser;
