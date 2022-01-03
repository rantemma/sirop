const { Parser } = require('../lib/')

const mathParser = new Parser();

mathParser.onUncaught((token) => {
    console.log(`Invalid token:`, token.content != null ? token.content : token.name)
})

let stored = [];
let operator = null;

// inner
mathParser.root({
    "expression": "[sign:+|-] <number:<$number>[.][$number]>",
    "validate": (matched)=>{
        let number = "";
        if (matched.sign!=null) number += matched.sign[0].content;
        number += matched.number[0].content;
        if (matched.number[1]!=null) {
            if (matched.number[2] !== null) {
                number += "." + matched.number[2].content;
            } else {
                return false;
            }
        }
        if (operator !== null) {
            stored[stored.length-1] = [ stored[stored.length-1], operator, parseFloat(number) ]
            operator = null;
        } else {
            stored.push(parseFloat(number))
        }
        return true;

    }
})

// mul & pow
mathParser.root({
    "expression": "<op:<*>[*]>",
    "validate": (matched) => {
        if (stored.length === 0 || operator !== null) return false;
        if (matched.op[1]!=null) {
            operator = "pow";
        } else {
            operator = "mul";
        }
        return true;
    }
});

// div
mathParser.root({
    "expression": "<op:/>",
    "validate": (matched) => {
        if (stored.length === 0 || operator !== null) return false;
        operator = "div";
        return true;
    }
});

function parseMath(str){
    stored = [];
    let result = 0;
    mathParser.run(str);
    for (let i = 0; i < stored.length; i++) {
        if (stored[i].length != null) {
            if (stored[i][1] === "mul") {
                result += stored[i][0] * stored[i][2];
            } else if (stored[i][1] === "div") {
                result += stored[i][0] / stored[i][2];
            } else if (stored[i][1] === "pow") {
                result += stored[i][0] ** stored[i][2];
            }
        } else {
            result += stored[i];
        }
    }
    if (typeof result !== "number") {
        result = NaN;
    }
    return result;
}

let opp;

opp = "10 ** 3 + 150 + 3700 * 4";
parseMath(opp)
console.time("time")
parseMath(opp)
console.timeEnd("time")
console.log(opp, "->", parseMath(opp))
console.log("From Eval ->", eval(opp), "\n", "\n")

opp = "10 + 25 * 150 - 1";
parseMath(opp)
console.time("time")
parseMath(opp)
console.timeEnd("time")
console.log(opp, "->", parseMath(opp))
console.log("From Eval ->", eval(opp))

