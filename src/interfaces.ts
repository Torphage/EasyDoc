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
    template: string;
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

interface IRegexParams {
    name: RegExp;
    type?: RegExp;
}

interface IRegexFunc {
    name: RegExp[];
    params: IRegexParams;
}

interface IRegexLanguageSyntax {
    string: Array<[string, string]>;
    comment: {
        BLOCK_COMMENT_START: string;
        BLOCK_COMMENT_END: string;
        COMMENT: string;
    };
}

interface IRegex {
    function: IRegexFunc;
}

interface ILanguage {
    regex: {
        function: IRegexFunc;
    };
    syntax: IRegexLanguageSyntax;
}

interface ILanguages {
    Cpp: ILanguage;
    Haskell: ILanguage;
    Javascript: ILanguage;
    Python: ILanguage;
    Ruby: ILanguage;
    Typescript: ILanguage;
}


export {
    ISyntaxType,
    ISyntaxVariable,
    IDocumentationParts,
    ILanguages,
    IRepeater,
    IParams,
    IParse,
    IRegex,
    IRegexFunc,
};
