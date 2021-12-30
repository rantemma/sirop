import Rale from "rale";

import { Token } from "./types";

class Lexer extends Rale {

    public parse(str: string): Token[] {
        const result: any[] = super.parse(str);
        return result;
    }

}

export const lexer = new Lexer();