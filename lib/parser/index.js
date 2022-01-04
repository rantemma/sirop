"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const lexer_1 = require("../lexer");
const __1 = require("..");
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
        this.roots.push({
            expression: typeof root.expression === "string" ? (0, __1.formatToExpr)(root.expression) : root.expression,
            validate: root.validate,
        });
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
    run(ins) {
        const lexed = typeof ins === "string" ? lexer_1.lexer.parse(ins) : ins;
        for (let i = 0; i < lexed.length;) {
            if (lexed[i].name !== "space") {
                let caught = false;
                for (let ri = 0; ri < this.roots.length; ri++) { // ri: Root Index
                    let matched = {};
                    for (let wi = 0; wi < this.roots[ri].expression.length; wi++) { // wi: Word Index
                        const currentWord = this.roots[ri].expression[wi];
                        let word = [];
                        let lgth = 0;
                        for (let cf = 0; cf < currentWord.figure.length;) {
                            const currentFigure = currentWord.figure[cf];
                            if (lexed[i + lgth] == null) {
                                break;
                            }
                            let cat = false;
                            let total = "";
                            let another = lgth;
                            let cnt = lexed[i + another].content;
                            while (cnt !== "|" && cnt !== ">" && cnt !== "]" && cnt !== " ") {
                                total += cnt;
                                if (currentFigure.text.includes(total)) {
                                    const begin = lexed[i + lgth].begin;
                                    const end = lexed[i + another].end;
                                    lgth = another + 1;
                                    word.push({
                                        begin: begin,
                                        end: end,
                                        type: "long",
                                        name: "unknown",
                                        content: total,
                                    });
                                    cf++;
                                    cat = true;
                                    break;
                                }
                                another++;
                                if (lexed[i + another] == null)
                                    break;
                                cnt = lexed[i + another].content;
                            }
                            if (cat === false)
                                if (currentFigure.names.includes(lexed[i + lgth].name)) {
                                    word.push(lexed[i + lgth]);
                                    lgth++;
                                    cf++;
                                }
                                else if (lexed[i + lgth].name === "space") {
                                    lgth++;
                                }
                                else if (currentFigure.optional === false) {
                                    word = [];
                                    break;
                                }
                                else {
                                    cf++;
                                }
                        }
                        if (lexed[i + lgth] != null)
                            if (currentWord.until != null) {
                                while (!currentWord.until.includes(lexed[i + lgth].name)) {
                                    word.push(lexed[i + lgth]);
                                    lgth++;
                                    if (lexed[i + lgth] == null) {
                                        word = [];
                                        break;
                                    }
                                }
                            }
                        if (word.length > 0) {
                            matched[currentWord.key] = word;
                            i += lgth + 1;
                        }
                    }
                    // is root resolve match to expression ?
                    let valid = true;
                    for (let ia = 0; ia < this.roots[ri].expression.length; ia++) {
                        const v = this.roots[ri].expression[ia];
                        if (matched[v.key] == null && v.optional === false) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid === true)
                        if (this.roots[ri].validate(matched) === true) {
                            caught = true;
                            break;
                        }
                }
                if (caught === false && lexed[i] != null) {
                    this.uncaughtCallbacks.forEach(v => v(lexed[i]));
                    break;
                }
            }
            else {
                i++;
            }
        }
        return this;
    }
}
exports.Parser = Parser;
