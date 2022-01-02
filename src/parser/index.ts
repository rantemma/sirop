import { Root, RootResolve, UncaughtCallback } from "./types";

import { lexer } from "../lexer";
import { ExpressionWord } from "./expression";
import { Token } from "rale";

export class Parser {

    private roots: Root[] = [];

    private uncaughtCallbacks: UncaughtCallback[] = [];

    public onUncaught(callback: UncaughtCallback) {
        this.uncaughtCallbacks.push(callback);
    }

    public offUncaught(callback: UncaughtCallback) {
        this.uncaughtCallbacks = this.uncaughtCallbacks.filter(v=>v!==callback);
    }

    /**
     * Add an expression to 
     * @param root 
     * @param priority Default priority is one
     */
    public root(root: Root, priority?: number): void {

        this.roots.push(root);

        // <name:string> <'='> !semicolon<def:any>
        // <type:string> <name:string> <';'>
        // bool type = true;
        // type = false;

        // <integer:number> ['.'] #<decimal:number>

    }

    public removeRoot(root: Root): void {
        this.roots = this.roots.filter(v=>v!==root);
    }

    public removeExpression(expression: ExpressionWord[]): void {
        this.roots = this.roots.filter(v=>v.expressionWord!==expression);
    }

    public run(string: string){

        const lexed = lexer.parse(string);

        for (let i = 0; i < lexed.length; i++) {

            if (lexed[i].name !== "space") {

                let caught = false;

                for (let ri = 0; ri < this.roots.length; ri++) { // ri: Root Index

                    let matched: RootResolve = {};
                    let match = true;

                    for (let wi = 0; wi < this.roots[ri].expressionWord.length; wi++) { // wi: Word Index

                        let find: Token[] = [];

                        const cwrd = this.roots[ri].expressionWord[wi]; // current word

                        for (let cf = 0; cf < cwrd.figure.length; cf++) {

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

    }

}