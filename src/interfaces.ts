interface ISyntaxType {
    text: string;
    start: number;
    length: number;
}

interface ISyntaxVariable {
    [key: string]: any;
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
    ISyntaxVariable,
    IDocumentationParts,
    IRepeater,
};
