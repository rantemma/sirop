export interface Figure {
    names: string[];
    text: string[];
    optional: boolean;
}
export interface ExpressionWord {
    key: string;
    optional: boolean;
    belongsToLast: boolean;
    until?: string[];
    figure: Figure[];
}
export declare function formatToExpr(string: string): ExpressionWord[];
