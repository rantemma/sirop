import { Root, RootResolve, UncaughtCallback } from "./types";

import { lexer } from "../lexer";
import { ExpressionWord } from "./expression";
import { Token } from "rale";

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

    public root(root: Root) {
        this.roots.push(root);
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

    public run(string: string){

        const lexed = lexer.parse(string);

        for (let i = 0; i < lexed.length; i++) {

            if (lexed[i].name !== "space") {

                let caught = false;

                for (let ri = 0; ri < this.roots.length; ri++) { // ri: Root Index

                    let matched: RootResolve = {};
                    let match = true;

                    for (let wi = 0; wi < this.roots[ri].expression.length; wi++) { // wi: Word Index

                        let find: Token[] = [];

                        const cwrd = this.roots[ri].expression[wi]; // current word

                        for (let cf = 0; cf < cwrd.figure.length && i < lexed.length; cf++) {

                            const figure = cwrd.figure[cf];

                            let found = 0;

                            if (figure.names.includes(lexed[i].name)) {

                                find.push(lexed[i]);

                                

                            } else if (figure.optional===false){

                                break;

                            }

                        }

                        if (find.length === 0 && cwrd.optional===false){
                            match = false;
                            break;
                        } else {
                            matched[cwrd.key] = find;
                        }

                    }

                    if (match === true) if (this.roots[ri].validate(matched) === true) {
                        caught = true;
                        break;
                    }

                }

                if (caught !== true && lexed[i].name !== "space") {
                    this.uncaughtCallbacks.forEach(v=>v(lexed[i]));
                    break;
                }

            }

        }

        return this;

    }

}