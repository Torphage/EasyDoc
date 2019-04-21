/**
 * The syntax and regular expressions for every language are stored here.
 */

/**
 * EasyDoc.
 */
import { ILanguages } from "../interfaces";

/**
 * The syntax and regular expressions for each supported languages.
 *
 * @type {ILanguags}
 */
const languageSyntax: ILanguages = {
    Cpp: {
        regex: {
            function: /\s*(?<returnType>\w+[\w\s*&]*)\s+(?<name>\w+)\s*\((?<params>[^)]*)/g,
        },
        syntax: {
            string: [
                {
                    value: "\"",
                    multi: false,
                    interpolate: false,
                    escape: false,
                },
            ],
            comment: {
                BLOCK_COMMENT_START: "/*",
                BLOCK_COMMENT_END: "*/",
                COMMENT: "//",
            },
        },
    },
    Haskell: {
        regex: {
            function: /^\s*(?<name>\w+)\s*(?<params>[^\n]*\sdo)/g,
        },
        syntax: {
            string: [
                {
                    value: "\"",
                    multi: false,
                    interpolate: false,
                    escape: false,
                },
                {
                    value: "'",
                    multi: false,
                    interpolate: false,
                    escape: false,
                },
            ],
            comment: {
                BLOCK_COMMENT_START: "{-",
                BLOCK_COMMENT_END: "-}",
                COMMENT: "--",
            },
        },
    },
    Javascript: {
        regex: {
            function: /\s*(?<name>\w+)\s*\((?<params>[^)]*)/g,
        },
        syntax: {
            string: [
                {
                    value: "`",
                    multi: true,
                    interpolate: true,
                    escape: true,
                },
                {
                    value: "\"",
                    multi: false,
                    interpolate: false,
                    escape: true,
                },
                {
                    value: "'",
                    multi: false,
                    interpolate: false,
                    escape: true,
                },
            ],
            comment: {
                BLOCK_COMMENT_START: "/*",
                BLOCK_COMMENT_END: "*/",
                COMMENT: "//",
            },
        },
    },
    Python: {
        regex: {
            function: /^\s*(?:class|def)\s+(?<name>\w+)\s*\((?:self, |)(?<params>[^)]*)/g,
        },
        syntax: {
            string: [
                {
                    value: "\"\"\"",
                    multi: true,
                    interpolate: false,
                    escape: false,
                },
                {
                    value: "\"",
                    multi: false,
                    interpolate: true,
                    escape: true,
                },
                {
                    value: "'",
                    multi: false,
                    interpolate: true,
                    escape: true,
                },
            ],
            comment: {
                BLOCK_COMMENT_START: "\"\"\"",
                BLOCK_COMMENT_END: "\"\"\"",
                COMMENT: "#",
            },
        },
    },
    Ruby: {
        regex: {
            // tslint:disable-next-line:max-line-length
            function: /^\s*(?<const>module|class|def)(?:\s*(?<self>self)\.|\s*)(?<name>\w+[\=\?\!]?)\s*(?:(?<relation>\<)?\s+(?<relationName>\w+)?|\(?(?<params>[^)\n]*)?)?/g,
        },
        syntax: {
            string: [
                {
                    value: "\"",
                    multi: false,
                    interpolate: true,
                    escape: true,
                },
                {
                    value: "'",
                    multi: false,
                    interpolate: false,
                    escape: false,
                },
            ],
            comment: {
                BLOCK_COMMENT_START: "=begin",
                BLOCK_COMMENT_END: "=end",
                COMMENT: "#",
            },
        },
    },
    Typescript: {
        regex: {
            // tslint:disable-next-line:max-line-length
            function: /\s*(?<export>export)?\s*(?<abstract>abstract)?\s*(?<default>private|protected|public)?\s*(?<const>class|function|module)?\s+(?<name>\w+)\s*(?:(?<relation>extends|implements)?\s+(?<relationName>\w*)?|(?:\s*\((?<params>[^)]*)\)\:\s*(?<returnType>(?:\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})|[^}]*)\s*\{))?\s*?/g,
        },
        syntax: {
            string: [
                {
                    value: "`",
                    multi: true,
                    interpolate: true,
                    escape: true,
                },
                {
                    value: "\"",
                    multi: false,
                    interpolate: false,
                    escape: true,
                },
                {
                    value: "'",
                    multi: false,
                    interpolate: false,
                    escape: true,
                },
            ],
            comment: {
                BLOCK_COMMENT_START: "/*",
                BLOCK_COMMENT_END: "*/",
                COMMENT: "//",
            },
        },
    },
};

export default languageSyntax;
