export declare type Figure = {
    names: string[];
    text: string[];
    optional: boolean;
};
export declare type ExpressionWord = {
    key: string;
    optional: boolean;
    belongsToLast: boolean;
    until?: {
        text: string[];
        names: string[];
    };
    figure: Figure[];
};
export declare function formatToExpr(string: string): ExpressionWord[];
