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

    /**
     * The name of what is documented. If it's a function it's the name of the function,
     * if it's class it's the name of the class.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    NAME: string | undefined;

    /**
     * The parametrs of a function as a list. If it's a sinatra block instead of a function,
     * it instead returns the optional route paths.
     *
     * @type {(string[] | undefined)}
     * @memberof ISyntaxVariable
     */
    PARAMS: string[] | undefined;

    /**
     * The type of each parameter as a list. It lines up with the [[IsyntaxVariable.PARAMS]]
     * if every parameter is documented.
     *
     * @type {(string[] | undefined)}
     * @memberof ISyntaxVariable
     */
    PARAMS_TYPES: string[] | undefined;

    /**
     * The parameters returned as a string. If [[ISyntaxVariable.PARAMS]] returned
     * [foo, bar, baz] this would instead return "foo, bar, baz".
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    PARAMS_TEMPLATE: string | undefined;

    /**
     * The abstract property of a definition. Returns the set of characters that is used
     * to represent the abstract property in that specific language.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    ABSTRACT: string | undefined;

    /**
     * The export property of a definition. Returns the set of characters that is used
     * to represent the export property in that specific language.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    EXPORT: string | undefined;

    /**
     * The attribute's visibility, could for example be private or protected if it's
     * supported by the language.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    ACCESS: string | undefined;

    /**
     * The constructor, is normally either a function, class or a module.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    CONST: string | undefined;

    /**
     * The type of relation it has with a class, module or even interfaces for
     * the languages that supports it. It returns if it extends of another object
     * or if it implements.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    RELATION: string | undefined;

    /**
     * The name of what it has a relation with. It only exists if
     * [[ISyntaxVariable.RELATION]] is defined.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    RELATIONNAME: string | undefined;

    /**
     * The [[ISyntaxVariable.NAME]] of the parent node.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    PARENT: string | undefined;

    /**
     * The [[ISyntaxVariable.CONST]] of the parent node.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    PARENT_CONST: string | undefined;

    /**
     * The type of the return value.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    RETURN_TYPE: string | undefined;

    /**
     * The start of a block comment in a specific language.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    BLOCK_COMMENT_START: string | undefined;

    /**
     * The end of a block comment in a specific language.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    BLOCK_COMMENT_END: string | undefined;

    /**
     * The characters which makes up a line comment in a specific language.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    COMMENT: string | undefined;

    /**
     * In a Sinatra application, return the block of an object. Could for be any of
     * GET, POST, PUT, PATCH, DELETE, OPTIONS, LINK, UNLINK
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    BLOCK: string | undefined;

    /**
     * In a Sinatra application, return the route of a block.
     *
     * @type {(string | undefined)}
     * @memberof ISyntaxVariable
     */
    ROUTE: string | undefined;
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
