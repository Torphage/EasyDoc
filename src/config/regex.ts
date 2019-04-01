export default {
    CppParse: {
        function: {
            name: [
                /\s*(\w*)\([^\)]*/g,
            ],
        },
    },
    HaskellParse: {
        function: {
            name: [
                /^\s*(\w+)\s+/g,
            ],
        },
    },
    JavascriptParse: {
        function: {
            name: [
                /\s*(\w*)\([^\)]*/g,
            ],
        },
    },
    PythonParse: {
        function: {
            name: [
                /^\s*\w+\s+(\w+)/g,
            ],
        },
    },
    RubyParse: {
        function: {
            name: [
            /(?:module|class|def)\s*(?:self.(\w*)|(\w*))/g,
            ],
        },
    },
    TypescriptParse: {
        function: {
            name: [
                /\s*(\w*)\s*\([^\)]*/g,
            ],
        },
    },
};
