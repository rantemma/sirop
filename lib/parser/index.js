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
            let resolved = {};
            // if expression are matching
            let match = false;
            // abstract index/position
            let abstract = epos + 0;
            for (let w = 0; w < this.roots[i].expression.length; w++) {
                const word = this.roots[i].expression[w];
                if (entry[abstract] == null) {
                    if (word.optional === true && this.roots[i].expression.slice(w).filter(v => v.optional === false).length === 0) {
                        match = true;
                    }
                    break;
                }
                while (entry[abstract].name === "space") {
                    abstract++;
                    if (entry[abstract] == null) {
                        if (word.optional === true && this.roots[i].expression.slice(w).filter(v => v.optional === false).length === 0) {
                            match = true;
                        }
                        break;
                    }
                }
                if (this.roots[i].expression[w - 1] != null)
                    if (word.belongsToLast === true && resolved[this.roots[i].expression[w - 1].key] == null) {
                        if (w === this.roots[i].expression.length - 1 && word.optional === true && this.roots[i].expression.slice(w).filter(v => v.optional === false).length === 0) {
                            match = true;
                        }
                        continue;
                    }
                // figure found for this word
                let found = [];
                // if word is valid
                let valid = false;
                for (let f = 0; f < word.figure.length; f++) {
                    if (entry[abstract] == null) {
                        break;
                    }
                    let ati = abstract + 0;
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
                        abstract++;
                        vf = true;
                    }
                    else if (word.figure[f].optional === false) {
                        break;
                    }
                    if (word.figure.length - 1 === f && vf === true)
                        valid = true;
                }
                // Until Expression
                let untilValid = true;
                if (word.until != null)
                    if (word.until.length > 0 && (valid === true || word.figure.length === 0)) {
                        if (entry[abstract] == null) {
                            untilValid = false;
                        }
                        else {
                            while (!word.until.includes(entry[abstract].name)) {
                                found.push(entry[abstract]);
                                abstract++;
                                if (entry[abstract] == null) {
                                    untilValid = false;
                                    break;
                                }
                            }
                            if (untilValid === true) {
                                abstract++;
                            }
                            else {
                                found = [];
                            }
                        }
                    }
                // Check if figure is valid
                if (untilValid === false && word.optional === true) {
                }
                else if (valid === false && word.figure.length !== 0 && untilValid === false && word.optional === false) {
                    break;
                }
                else if (found.length > 0) {
                    resolved[word.key] = found;
                }
                // Check if word match expression description
                if (w === this.roots[i].expression.length - 1 && (valid === true || word.figure.length === 0) && untilValid === true) {
                    match = true;
                }
            }
            if (match === true) {
                if (this.roots[i].validate(resolved) === true)
                    return this.parse(entry.slice(abstract));
            }
        }
        this.uncaughtCallbacks.forEach(v => typeof entry !== "string" ? v(entry[epos]) : null);
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
