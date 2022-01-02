"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const lexer_1 = require("../lexer");
class Parser {
    constructor() {
        this.roots = [];
        this.uncaughtCallbacks = [];
    }
    onUncaught(callback) {
        this.uncaughtCallbacks.push(callback);
        return this;
    }
    offUncaught(callback) {
        this.uncaughtCallbacks = this.uncaughtCallbacks.filter(v => v !== callback);
        return this;
    }
    root(root) {
        this.roots.push(root);
        return this;
    }
    removeRoot(root) {
        this.roots = this.roots.filter(v => v !== root);
        return this;
    }
    removeExpression(expression) {
        this.roots = this.roots.filter(v => v.expression !== expression);
        return this;
    }
    run(string) {
        const lexed = lexer_1.lexer.parse(string);
        for (let i = 0; i < lexed.length; i++) {
            if (lexed[i].name !== "space") {
                let caught = false;
                for (let ri = 0; ri < this.roots.length; ri++) { // ri: Root Index
                    let matched = {};
                    let match = true;
                    for (let wi = 0; wi < this.roots[ri].expression.length; wi++) { // wi: Word Index
                        let find = [];
                        const cwrd = this.roots[ri].expression[wi]; // current word
                        for (let cf = 0; cf < cwrd.figure.length && i < lexed.length; cf++) {
                            const figure = cwrd.figure[cf];
                            let found = 0;
                            if (figure.names.includes(lexed[i].name)) {
                                find.push(lexed[i]);
                            }
                            else if (figure.optional === false) {
                                break;
                            }
                        }
                        if (find.length === 0 && cwrd.optional === false) {
                            match = false;
                            break;
                        }
                        else {
                            matched[cwrd.key] = find;
                        }
                    }
                    if (match === true)
                        if (this.roots[ri].validate(matched) === true) {
                            caught = true;
                            break;
                        }
                }
                if (caught !== true && lexed[i].name !== "space") {
                    this.uncaughtCallbacks.forEach(v => v(lexed[i]));
                    break;
                }
            }
        }
        return this;
    }
}
exports.Parser = Parser;
