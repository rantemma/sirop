import { Long, Token as _Token, Unique, Wrapper } from "rale";

export const defaultWrapper: Wrapper[] = [

    {begin: "{", end: "}", name: "curly_bracket"},
    {begin: "[", end: "]", name: "bracket"},
    {begin: "(", end: ")", name: "parenthesis"},
    {begin: "<", end: ">", name: "angle_bracket"},

]

export const defaultLong: Long[] = [

    {regex: /[0-9]/, name: "number"},
    {regex: /[a-z0-9_]/i, name: "string"},
    
]

export const defaultUnique: Unique[] = [

    {name: "dot", character: "."},
    {name: "semicolon", character: ";"},
    {name: "colon", character: ":"},

    {name: "dash", character: "-"},
    {name: "plus", character: "+"},
    {name: "equal", character: "="},
    {name: "star", character: "*"},
    {name: "slash", character:"/"},
    {name: "anti_slash", character: "\\"},

    {name: "question_mark", character: "?"},
    {name: "exclamation_mark", character: "!"},

    {name: "double_quote", character: '"'},
    {name: "single_quote", character: "'"},

    {name: "backtick", character: "`"},

]
