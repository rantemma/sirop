import Rale from "rale";

import { defaultLong, defaultUnique, defaultWrapper } from "./types";

class Lexer extends Rale {

    public constructor(){
        super(defaultLong, defaultUnique, defaultWrapper);
    }

}

export const lexer = new Lexer();