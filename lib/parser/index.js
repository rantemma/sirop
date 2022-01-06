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
    parse(entry) {
        if (typeof entry === "string")
            entry = lexer_1.lexer.parse(entry);
        if (entry.length === 0)
            return this;
        // entry pos
        let epos = 0;
        // skip space token
        while (entry[epos].name === "space") {
            epos++;
        }
        // check for a valid root
        for (let i = 0; i < this.roots.length; i++) {
            // resolved word
            let resolve = {};
            // if expression are matching
            let match = false;
            // abstract index/position
            let abstract = epos;
            for (let w = 0; w < this.roots[i].expression.length; w++) {
                const word = this.roots[i].expression[w];
                // figure found for this word
                let found = [];
                // if word is valid
                let valid = false;
                aloop: for (let f = 0; f < word.figure.length; f++) {
                    if (entry[abstract] == null) {
                        break;
                    }
                    while (entry[abstract].name === "space") {
                        abstract++;
                        if (entry[abstract] == null) {
                            break aloop;
                        }
                    }
                    let ati = abstract;
                    let ats = "";
                    while (!word.figure[f].text.includes(ats)) {
                        if (entry[ati] == null) {
                            break;
                        }
                        if (entry[ati].content == null) {
                            break;
                        }
                        ats += entry[ati].content;
                        ati++;
                    }
                    let vf = false;
                    if (word.figure[f].text.includes(ats)) {
                        found.push({
                            begin: entry[abstract].begin,
                            end: entry[ati - 1].end,
                            type: "long",
                            name: "unknown",
                            content: ats,
                        });
                        abstract = ati;
                        vf = true;
                    }
                    else if (word.figure[f].names.includes(entry[abstract].name)) {
                        found.push(entry[abstract]);
                        vf = true;
                    }
                    else if (word.figure[f].optional === false) {
                        break;
                    }
                    if (word.figure.length - 1 === f && vf === true)
                        valid = true;
                }
                if (valid === false && word.optional === false) {
                    break;
                }
                else {
                    resolve[word.key] = found;
                }
                if (w === this.roots[i].expression.length - 1) {
                    match = true;
                }
            }
            if (match === true) {
                console.log("eee");
                return this.parse(entry.slice(abstract));
            }
        }
        console.log('[Unstable::Sirop] A token is uncaught. Error & Recover option aren\'t implemented');
        return this;
    }
    /**
     * @deprecated Until expression are unstable.
     */
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
                            if (currentWord.until != null)
                                if (currentWord.until.length > 0) {
                                    while (!currentWord.until.includes(lexed[i + lgth].name)) {
                                        word.push(lexed[i + lgth]);
                                        lgth++;
                                        if (lexed[i + lgth] == null) {
                                            word = [];
                                            break;
                                        }
                                    }
                                    lgth += currentWord.figure.length;
                                }
                        if (word.length > 0) {
                            matched[currentWord.key] = word;
                            i += lgth;
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
new Parser().root({
    expression: "<import> <a:$string> <:> <b:$string> <;>",
    validate: (matched) => {
        return true;
    }
}).parse("import aaa:aaa;");
