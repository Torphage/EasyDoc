import { ILanguages } from "../interfaces";

const languageSyntax: ILanguages = {
    Cpp: {
        regex: {
            function: {
                name: [
                    /\s*(\w*)\([^\)]*/g,
                ],
                params: {
                    name: /\s*\w*\(([^\)]+)/g,
                },
            },
        },
        syntax: {
            string: [
                ["\"", "'"],
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
            function: {
                name: [
                    /^\s*(\w+)\s+/g,
                ],
                params: {
                    name: /^\w+\s*(.*|\s*)= do/gm,
                },
            },
        },
        syntax: {
            string: [
                ["\"", "'"],
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
            function: {
                name: [
                    /\s*(\w*)\([^\)]*/g,
                ],
                params: {
                    name: /\w*\s*\(([^\)]+)*/g,
                },
            },
        },
        syntax: {
            string: [
                ["`", "`"],
                ["\"", "'"],
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
            function: {
                name: [
                    /^\s*(?:class|def)\s+\w+\s+(\w+)/g,
                ],
                params: {
                    name: /(?:\s|\sself.)\w*\(([^\)]+)*/g,
                },
            },
        },
        syntax: {
            string: [
                ["\"\"\"", "\"\"\""],
                ["\"", "'"],
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
            function: {
                name: [
                    /^\s*(?:module|class|def)\s+(?:self.(\w*)|(\w*))/g,
                ],
                params: {
                    name: /(?:class|def|module)(?:\s|\sself.)\w*\s*(?:\(|\s)(?!\()([^\)]+)*/g,
                },
            },
        },
        syntax: {
            string: [
                ["\"", "'"],
            ],
            lineComment: {
                BLOCK_COMMENT_START: "=begin",
                BLOCK_COMMENT_END: "=end",
                COMMENT: "#",
            },
        },
    },
    Typescript: {
        regex: {
            function: {
                name: [
                    /\s*(\w*)\s*\([^\)]*/g,
                ],
                params: {
                    name: /(\()(?:(?=(\\?))\2.)*?\1/g,
                },
            },
        },
        syntax: {
            string: [
                ["`", "`"],
                ["'", "\""],
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
