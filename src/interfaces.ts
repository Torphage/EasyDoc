/**
 * Store all the interfaces used throughout the program here.
 */

/**
 * The package.json's configurations's default values.
 *
 * @interface IDefaultObject
 */
interface IDefaultObject {

    /**
     * If the documentation should be commented about or below of what to document.
     *
     * @type {boolean}
     * @memberof IDefaultObject
     */
    commentAboveTarget: boolean;

    /**
     * What type of documentation the template file is made for. This will determine
     * what variables that can be used within the template file.
     *
     * @type {string}
     * @memberof IDefaultObject
     */
    docType: string;

    /**
     * What string before the cusror that will trigger the extension on the press of Enter.
     *
     * @type {string}
     * @memberof IDefaultObject
     */
    triggerString: string;
}

/**
 * The interface for each configuration in package.json.
 *
 * @interface IConfiguration
 */
interface IConfiguration {

    /**
     * The type of the configuration.
     *
     * @type {string}
     * @memberof IConfiguration
     */
    type: string;

    /**
     * The default values for the configuration.
     *
     * @type {(string[] | IDefaultObject)}
     * @memberof IConfiguration
     */
    default: string[] | IDefaultObject;
}

/**
 * The configurations of EasyDoc.
 *
 * @interface IConfigurations
 */
interface IConfigurations {

    /**
     * The title of EasyDoc's configurations.
     *
     * @type {string}
     * @memberof IConfigurations
     */
    title: string;

    /**
     * The properties of all EasyDoc's configurations. This is all of the
     * configurations of EasyDoc.
     *
     * @type {{ [key: string]: IConfiguration }}
     * @memberof IConfigurations
     */
    properties: { [key: string]: IConfiguration };
}

/**
 * The contributes in package.json.
 *
 * @interface IContributes
 */
interface IContributes {

    /**
     * The configurations of EasyDoc.
     *
     * @type {IConfigurations}
     * @memberof IContributes
     */
    configuration: IConfigurations;

    [key: string]: any;
}

/**
 * The entire package.json.
 *
 * @interface IPackage
 */
interface IPackage {

    /**
     * The contributes in package.json.
     *
     * @type {IContributes}
     * @memberof IPackage
     */
    contributes: IContributes;

    [key: string]: any;
}

/**
 * Store information about a syntax type's text value and its location.
 *
 * @interface ISyntaxType
 */
interface ISyntaxType {

    /**
     * The syntax type text.
     *
     * @type {string}
     * @memberof ISyntaxType
     */
    text: string;

    /**
     * The start index of the syntax type.
     *
     * @type {number}
     * @memberof ISyntaxType
     */
    start: number;

    /**
     * The length of the text.
     *
     * @type {number}
     * @memberof ISyntaxType
     */
    length: number;
}

/**
 * The syntax variable, the value can differ depending on what variable it is.
 *
 * @interface ISyntaxVariable
 */
interface ISyntaxVariable {
    [key: string]: any;
}

/**
 * Store properties used by the Repeater Class.
 *
 * @interface IRepeater
 */
interface IRepeater {

    /**
     * The offset in use.
     *
     * @type {number}
     * @memberof IRepeater
     */
    offset: number;

    /**
     * The string to insert.
     *
     * @type {string}
     * @memberof IRepeater
     */
    snippetStr: string;
}

/**
 * Store information about params used as the variables.
 *
 * @interface IParams
 */
interface IParams {

    /**
     * The list of params.
     *
     * @type {string[]}
     * @memberof IParams
     */
    paramList: string[];

    /**
     * The lsit of the param types.
     *
     * @type {string[]}
     * @memberof IParams
     */
    paramTypes?: string[];

    /**
     * A string used to print out the params.
     *
     * @type {string}
     * @memberof IParams
     */
    template: string;
}

/**
 * The types of values that will be parsed and used withing getVariablse.
 *
 * @interface IParse
 */
interface IParse {

    /**
     * The parsed name.
     *
     * @type {string}
     * @memberof IParse
     */
    name: string;

    /**
     * The parsed class.
     *
     * @type {string}
     * @memberof IParse
     */
    class?: string;

    /**
     * The parsed params.
     *
     * @type {IParams}
     * @memberof IParse
     */
    params?: IParams;

    /**
     * The parsed return type.
     *
     * @type {string}
     * @memberof IParse
     */
    returnType: string;
}

/**
 * The regex available for parsing in each language.
 *
 * @interface IRegexRegex
 */
interface IRegexRegex {

    /**
     * Regex for parsing function.
     *
     * @type {RegExp}
     * @memberof IRegexRegex
     */
    function: RegExp;
}

/**
 * The strings available for each language.
 *
 * @interface IRegexString
 */
interface IRegexString {

    /**
     * The value of the string.
     *
     * @type {string}
     * @memberof IRegexString
     */
    value: string;

    /**
     * If the string can span mulitple lines.
     *
     * @type {boolean}
     * @memberof IRegexString
     */
    multi: boolean;

    /**
     * If interpolation is supported.
     *
     * @type {boolean}
     * @memberof IRegexString
     */
    interpolate: boolean;

    /**
     * If escaping is supported.
     *
     * @type {boolean}
     * @memberof IRegexString
     */
    escape: boolean;
}

/**
 * The supported comment types for each language.
 *
 * @interface IRegexComments
 */
interface IRegexComments {

    /**
     * The syntax for the start of a block comment.
     *
     * @type {string}
     * @memberof IRegexComments
     */
    BLOCK_COMMENT_START: string;

    /**
     * The syntax for the end of a block comment.
     *
     * @type {string}
     * @memberof IRegexComments
     */
    BLOCK_COMMENT_END: string;

    /**
     * The syntax for a line comment.
     *
     * @type {string}
     * @memberof IRegexComments
     */
    COMMENT: string;
}

/**
 * The syntax for each language.
 *
 * @interface IRegexLanguageSyntax
 */
interface IRegexLanguageSyntax {

    /**
     * The supported string for each language.
     *
     * @type {IRegexString[]}
     * @memberof IRegexLanguageSyntax
     */
    string: IRegexString[];

    /**
     *
     *
     * @type {IRegexComments}
     * @memberof IRegexLanguageSyntax
     */
    comment: IRegexComments;
}

/**
 * The interface for each language.
 *
 * @interface ILanguage
 */
interface ILanguage {

    /**
     * The regexs for each language.
     *
     * @type {IRegexRegex}
     * @memberof ILanguage
     */
    regex: IRegexRegex;

    /**
     * The syntaxes for each language.
     *
     * @type {IRegexLanguageSyntax}
     * @memberof ILanguage
     */
    syntax: IRegexLanguageSyntax;
}

/**
 * The different languages.
 *
 * @interface ILanguages
 */
interface ILanguages {

    /**
     * The Cpp language.
     *
     * @type {ILanguage}
     * @memberof ILanguages
     */
    Cpp: ILanguage;

    /**
     * The Haskell language.
     *
     * @type {ILanguage}
     * @memberof ILanguages
     */
    Haskell: ILanguage;

    /**
     * The Javascript language.
     *
     * @type {ILanguage}
     * @memberof ILanguages
     */
    Javascript: ILanguage;

    /**
     * The Python language.
     *
     * @type {ILanguage}
     * @memberof ILanguages
     */
    Python: ILanguage;

    /**
     * The Ruby language.
     *
     * @type {ILanguage}
     * @memberof ILanguages
     */
    Ruby: ILanguage;

    /**
     * The Typescript language.
     *
     * @type {ILanguage}
     * @memberof ILanguages
     */
    Typescript: ILanguage;
}

export {
    IDefaultObject,
    IPackage,
    ISyntaxType,
    ISyntaxVariable,
    ILanguage,
    ILanguages,
    IRepeater,
    IParams,
    IParse,
};
