type SyntaxType = {
    text: string;
    start: number;
    length: number;
}[]

type CustomTypes = {
    [key:string]: SyntaxType;
}

type SyntaxVariable = {
    [key:string]: any;
}

type VarTypes = {
    text: string;
    start: number;
    length: number;
    value: any;
}[]

type DocumentationParts = {
    name: string,
    params: string[]
}

export { SyntaxType, CustomTypes, VarTypes, SyntaxVariable, DocumentationParts }