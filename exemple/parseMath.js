const { Parser } = require('../lib/')

const mathParser = new Parser();

mathParser.onUncaught((token) => {
    console.log(`Invalid token`, token.content)
})

const number = {
    0: 0, 5: 5,
    1: 1, 6: 6,          
    2: 2, 7: 7,      
    3: 3, 8: 8,
    4: 4, 9: 9,     
}

function parseInteger(string){
    if (typeof string !== "string") return NaN;
    let res = 0;
    let mul = 1;
    for (let i = 1; i <= string.length; i++) {
        if (i===1) {
            if (string[0] === "+") {
                i++;    
            } else if (string[0] === "-") {
                mul = -1;
                i++;
            }
        }
        if (number[string[i-1]]==null) return NaN;
        res+=number[string[i-1]]*(10**(string.length-i));
    }
    return res*mul;
}

let stored = [];
let operator = null;

// inner
mathParser.interrupt({
    "expression": [ ["plus", "dash", "number"], ["number"] ],
    "validate": {
        "on": (matched) => {
            if (matched[0].name === "number") {
                if (operator !== null) {
                    stored[stored.length-1] = [stored[stored.length-1], operator, parseInteger(matched[0].content) ]
                    operator = null;
                } else {
                    stored.push(parseInteger(matched[0].content))
                }
                return true;               
            } else if (matched.length === 2) {
                if (matched[0].name !== "number") {
                    if (operator !== null) {
                        stored[stored.length-1] = [stored[stored.length-1], operator, parseInteger(matched[0].content + matched[1].content) ]
                        operator = null;
                    } else {
                        stored.push(parseInteger(matched[0].content + matched[1].content))
                    }
                    return true;   
                }
            }
            return false;

        },
        "removeSpace": true,
    }
})

// mul & pow
mathParser.interrupt({
    "expression": [ ["star"], ["star"] ],
    "validate": {
        "on": (matched) => {
            if (stored.length === 0 || operator !== null) {
                return false;
            }
            if (matched.length === 1) {
                operator = "mul";
                return true;
            } else if (matched.length === 2) {
                operator = "pow";
                return true;
            }
            return false;
        },
        "removeSpace": true,
    }
});

// div
mathParser.interrupt({
    "expression": [ ["star"] ],
    "validate": {
        "on": (matched) => {
            if (matched.length === 1) {
                if (stored.length === 0 || operator !== null) {
                    return false;
                }
                operator = "div";
                return true;
            }
            return false;
        },
        "removeSpace": true,
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

console.log("25 * 150 - 1", parseMath("25 * 150 - 1"))

console.log("10 ** 3", parseMath("10 ** 3"))
