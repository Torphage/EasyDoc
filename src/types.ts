interface ISyntaxType {
    text: string;
    start: number;
    length: number;
}

interface ICustomTypes {
    [key: string]: ISyntaxType[];
}

interface ISyntaxVariable {
    [key: string]: any;
}

type IVarTypes = IVarType[];

interface IVarType {
    text: string;
    start: number;
    length: number;
    value: any;
}

interface IDocumentationParts {
    name: string;
    params: string[];
}

interface IRepeater {
    offset: number;
    snippetStr: string;
}

export {
    ISyntaxType,
    ICustomTypes,
    IVarTypes,
    ISyntaxVariable,
    IDocumentationParts,
    IRepeater,
};
