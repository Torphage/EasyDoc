type ISyntaxTypes = ISyntaxType[];

interface ISyntaxType {
    text: string;
    start: number;
    length: number;
}

interface ICustomTypes {
    [key: string]: ISyntaxTypes;
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
    snippetStr: string;
    stringToRepeat: string;
    timesToRepeat: number;
}

export { ISyntaxTypes, ISyntaxType, ICustomTypes, IVarTypes, ISyntaxVariable, IDocumentationParts, IRepeater };
