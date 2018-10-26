type SyntaxTypes = SyntaxType[]

type SyntaxType = {
    text: string;
    start: number;
    length: number;
}

type CustomTypes = {
    [key:string]: SyntaxTypes;
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

export { SyntaxTypes, SyntaxType, CustomTypes, VarTypes, SyntaxVariable, DocumentationParts }