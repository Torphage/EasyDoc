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
    params: string;
}

interface IParse {
    name: IName;
    class?: string;
    params?: IParams;
    return?: IReturn;
}

interface IRegex {
    name: RegExp;
    type?: RegExp;
}

interface IRegexRegex {
    function: RegExp;
}

interface IRegexString {
    value: string;
    multi: boolean;
    interpolate: boolean;
    escape: boolean;
}

interface IRegexLanguageSyntax {
    string: IRegexString[];
    comment: {
        BLOCK_COMMENT_START: string;
        BLOCK_COMMENT_END: string;
        COMMENT: string;
    };
}

interface ILanguage {
    regex: IRegexRegex;
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
    ILanguage,
    ILanguages,
    IRepeater,
    IReturn,
    IParams,
    IParse,
};
