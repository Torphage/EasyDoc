type SyntaxType = {
    text: string;
    start: number;
    length: number;
}[]

type CustomTypes = {
    [key:string]: SyntaxType;
}

type VarTypes = {
    text: string;
    start: number;
    length: number;
    value: any;
}[]

export { SyntaxType, CustomTypes, VarTypes }