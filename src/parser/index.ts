import { PreRoot, Root, RootResolve, UncaughtCallback } from "./types";

import { lexer } from "../lexer";
import { ExpressionWord } from "./expression";
import { Token } from "rale";
import { formatToExpr } from "..";

export class Parser {

    private roots: Root[] = [];

    private uncaughtCallbacks: UncaughtCallback[] = [];

    public onUncaught(callback: UncaughtCallback) {
        this.uncaughtCallbacks.push(callback);
        return this;
    }

    public offUncaught(callback: UncaughtCallback) {
        this.uncaughtCallbacks = this.uncaughtCallbacks.filter(v=>v!==callback);
        return this;
    }

    public root(root: PreRoot) {
        this.roots.push({
            expression: typeof root.expression === "string" ? formatToExpr(root.expression) : root.expression,
            validate: root.validate,
        });
        return this;
    }

    public removeRoot(root: Root) {
        this.roots = this.roots.filter(v=>v!==root);
        return this;
    }

    public removeExpression(expression: ExpressionWord[]) {
        this.roots = this.roots.filter(v=>v.expression!==expression);
        return this;
    }

    public run(ins: string | Token[]){

        const lexed = typeof ins === "string" ? lexer.parse(ins) : ins;

        for (let i = 0; i < lexed.length;) {

            if (lexed[i].name !== "space") {

                let caught = false;

                for (let ri = 0; ri < this.roots.length; ri++) { // ri: Root Index

                    let matched: RootResolve = {};

                    for (let wi = 0; wi < this.roots[ri].expression.length; wi++) { // wi: Word Index

                        const currentWord = this.roots[ri].expression[wi];

                        let word: Token[] = [];
                        let lgth = 0;

                        for (let cf = 0; cf < currentWord.figure.length;) {

                            const currentFigure = currentWord.figure[cf];

                            if (lexed[i+lgth] == null) {
                                break;
                            }

                            let cat = false;

                            let total = "";

                            let another = lgth;

                            let cnt = lexed[i+another].content;

                            while (cnt!=="|"&&cnt!==">"&&cnt!=="]"&&cnt!==" ") {

                                total += cnt;

                                if (currentFigure.text.includes(total)) {
                                    const begin = lexed[i+lgth].begin;
                                    const end = lexed[i+another].end;
                                    lgth=another+1;
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

                                if (lexed[i+another]==null) break;

                                cnt = lexed[i+another].content;

                            }

                            if (cat===false) if (currentFigure.names.includes(lexed[i+lgth].name)) {
                                word.push(lexed[i+lgth]);
                                lgth++;
                                cf++;
                            } else if (lexed[i+lgth].name === "space") {
                                lgth++;
                            } else if (currentFigure.optional === false) {
                                word = [];
                                break;
                            } else {
                                cf++;
                            }

                        }

                        if (lexed[i+lgth] != null) if (currentWord.until != null) {

                            while (!currentWord.until.includes(lexed[i+lgth].name)) {
                                word.push(lexed[i+lgth]);
                                lgth++;
                                if (lexed[i+lgth] == null) {
                                    word = [];
                                    break;
                                }
                            }

                        }

                        if (word.length > 0) {
                            matched[currentWord.key] = word;
                            i += lgth+1;
                        }

                    }
                    
                    // is root resolve match to expression ?

                    let valid = true;

                    for (let ia = 0; ia < this.roots[ri].expression.length; ia++) {

                        const v = this.roots[ri].expression[ia];

                        if (matched[v.key]==null&&v.optional===false){
                            valid = false;
                            break;
                        }

                    }

                    if (valid === true) if (this.roots[ri].validate(matched)===true){
                        caught = true;
                        break;
                    }

                }

                if (caught === false && lexed[i]!=null) {
                    this.uncaughtCallbacks.forEach(v=>v(lexed[i]));
                    break;
                }

            } else {
                i++;
            }

        }

        return this;

    }

}