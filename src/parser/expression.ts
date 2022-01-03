export type Figure = {
    names: string[],
    text: string[],
    optional: boolean,
};

export type ExpressionWord = {
    key: string,
    optional: boolean,
    belongsToLast: boolean,
    until?: string[],
    figure: Figure[],
};

export function formatToExpr(string: string): ExpressionWord[] {

    const words: ExpressionWord[] = [];

    let valid = false;

    for (let i = 0; i < string.length; i++){

        let word: ExpressionWord = {
            key: "",
            belongsToLast: false,
            optional: false,
            figure: [],
        };

        // Belongs to the last

        if (string[i] === "#"){
            word.belongsToLast = true;
            if (words.length === 0) {
                throw "The first word can't belongs to the last word."
            }
            i++;
            if (string[i] === "<" || string[i] === "["){

            } else {
                throw "# has to be next to a word"
            }
        }

        if (string[i] === "<" || string[i] === "[") {

            // Begin Enclosure

            if (string[i] === "<") {
                word.optional = false;
            } else if (string[i] === "[") {
                word.optional = true;
            }

            // Key

            i++;

            let key = "";

            while (string[i]!==":"&&string[i]!=="^"&&string[i]!==">"&&string[i]!=="]") {
                key += string[i];
                i++;
            }

            if (string[i]===">"||string[i]==="]"){
                throw `${key} is implicitely any`
            }

            word.key = key;

            // Figure

            function parseFigure(){

                i++;

                if (string[i] === ">" || string[i] === "]" || string[i] === "^") return;

                let figure: Figure = {
                    optional: false,
                    names: [],
                    text: [],
                }

                // Optional Begin Enclosure

                let enclosure = true;

                if (string[i] === "[") {
                    figure.optional = true;
                    i++;
                } else if (string[i] === "<") {
                    i++;
                } else {
                    if (word.figure.length !== 0) {
                        throw "Name must have enclosure"
                    }
                    enclosure = false;
                }

                // names or brut

                let content = "";

                while (string[i] !== "]" && string[i] !== ">" && string[i] !== "^") {
                    content += string[i];
                    i++;
                }

                if (content === "") {
                    throw "Invalid Figure";
                }

                content.split("|").forEach(v=>{
                    
                    if (v.startsWith("$")) {
                        figure.names.push(v.substring(1));
                    } else {
                        figure.text.push(v);
                    }

                })
                
                word.figure.push(figure);

                // Optional End Enclosure

                if (enclosure===true){
                    if (string[i] === "]"&&figure.optional===true){
                        // ...
                    } else if (string[i] === ">"&&figure.optional===false){
                        // ...
                    } else {
                        throw "Invalid End Enclosure";
                    }
                    // Next Figure
                    parseFigure();
                } 

            }

            if (string[i] !== "^") {
                parseFigure();
            }

            if (string[i] === "^") {

                i++;

                let content = "";

                while (string[i] !== "]" && string[i] !== ">") {
                    content += string[i];
                    i++;
                }

                if (content === "") {
                    throw "Invalid Figure";
                }

                word.until = content.split("|");

            }

            // End Enclosure

            if (string[i] === ">") {

                if (word.optional !== false){
                    throw "Invalid Enclosure"
                }

                valid = true;

            } else if (string[i] === "]") {

                if (word.optional !== true){
                    throw "Invalid Enclosure"
                }

            } else {
                throw "Invalid Enclosure"
            }

            // Add word to expresion words

            if (words.map(v=>v.key).includes(word.key)) {
                throw "You can't use twice the same word."
            }

            words.push(word);

        } else if (string[i] !== " ") {
            throw "Invalid Begin Enclosure";
        } 

    }

    // if (valid===false){
    //     throw "The expression must have at least one word which is none optional"
    // }

    return words;

}