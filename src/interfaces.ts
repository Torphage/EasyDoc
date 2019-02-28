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

interface IName {
    name: string;
}

interface IParams {
    paramList: string[];
    paramTypes?: string[];
}

interface IReturn {
    name: string;
    type?: string;
}

interface IParse {
    name: IName;
    class?: string;
    params?: IParams;
    return?: IReturn;
}

export {
    ISyntaxType,
    ISyntaxVariable,
    IDocumentationParts,
    IRepeater,
    IParams,
    IParse,
};
