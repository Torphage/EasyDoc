import { ILanguages } from "../interfaces";

const languageSyntax: ILanguages = {
    Cpp: {
        regex: {
            function: /\s*(?<returnType>\w+)\s+(?<name>\w+)\s*\((?<params>[^)]*)/g,
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
                BLOCK_COMMENT_START: "*/",
                BLOCK_COMMENT_END: "/*",
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
            function: /^\s*(?:module|class|def)(?:\s*self\.|\s*)(?<name>\w+[\=\?\!]?)\s*\(?(?<params>[^)\n]*)/g,
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
            function: /\s*(?<name>\w+)\s*\((?<params>[^)]*)\)\:\s*(?<returnType>[^{]*)/g,
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
