import Rale from "rale";

import { Token, defaultLong, defaultUnique, defaultWrapper } from "./types";

class Lexer extends Rale {

    public constructor(){
        super(defaultLong, defaultUnique, defaultWrapper);
    }

    public parse(str: string): Token[] {
        const result: any[] = super.parse(str);
        return result;
    }

}

export const lexer = new Lexer();