"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToExpr = void 0;
function formatToExpr(string) {
    const words = [];
    let valid = false;
    for (let i = 0; i < string.length; i++) {
        let word = {
            key: "",
            belongsToLast: false,
            optional: false,
            figure: [],
        };
        // Belongs to the last
        if (string[i] === "#") {
            word.belongsToLast = true;
            if (words.length === 0) {
                throw "The first word can't belongs to the last word.";
            }
            i++;
            if (string[i] === "<" || string[i] === "[") {
            }
            else {
                throw "# has to be next to a word";
            }
        }
        if (string[i] === "<" || string[i] === "[") {
            // Begin Enclosure
            if (string[i] === "<") {
                word.optional = false;
            }
            else if (string[i] === "[") {
                word.optional = true;
            }
            // Key
            i++;
            let key = "";
            while (string[i] !== ":" && string[i] !== ">" && string[i] !== "]") {
                key += string[i];
                i++;
            }
            if (string[i] === ">" || string[i] === "]") {
                throw `${key} is implicitely any`;
            }
            word.key = key;
            // Figure
            function parseFigure() {
                i++;
                if (string[i] === ">" || string[i] === "]")
                    return;
                let figure = {
                    names: [],
                    optional: false,
                };
                // Optional Begin Enclosure
                let enclosure = true;
                if (string[i] === "[") {
                    figure.optional = true;
                    i++;
                }
                else if (string[i] === "<") {
                    i++;
                }
                else {
                    if (word.figure.length !== 0) {
                        throw "Name must have enclosure";
                    }
                    enclosure = false;
                }
                let names = "";
                while (string[i] !== "]" && string[i] !== ">") {
                    names += string[i];
                    i++;
                }
                if (names === "") {
                    throw "Invalid Figure Name";
                }
                figure.names = names.split("|");
                word.figure.push(figure);
                // Optional End Enclosure
                if (enclosure === true) {
                    if (string[i] === "]" && figure.optional === true) {
                        // ...
                    }
                    else if (string[i] === ">" && figure.optional === false) {
                        // ...
                    }
                    else {
                        throw "Invalid End Enclosure";
                    }
                    // Next Figure
                    parseFigure();
                }
            }
            parseFigure();
            // End Enclosure
            if (string[i] === ">") {
                if (word.optional !== false) {
                    throw "Invalid Enclosure";
                }
                valid = true;
            }
            else if (string[i] === "]") {
                if (word.optional !== true) {
                    throw "Invalid Enclosure";
                }
            }
            else {
                throw "Invalid Enclosure";
            }
            // Add word to expresion words
            if (words.map(v => v.key).includes(word.key)) {
                throw "You can't use twice the same word.";
            }
            words.push(word);
        }
        else if (string[i] !== " ") {
            throw "Invalid Begin Enclosure";
        }
    }
    // if (valid===false){
    //     throw "The expression must have at least one word which is none optional"
    // }
    return words;
}
exports.formatToExpr = formatToExpr;
