export declare type Figure = {
    names: string[];
    optional: boolean;
};
export declare type ExpressionWord = {
    key: string;
    optional: boolean;
    belongsToLast: boolean;
    figure: Figure[];
};
export declare function formatToExpr(string: string): ExpressionWord[];
