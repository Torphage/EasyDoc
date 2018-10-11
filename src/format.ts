import * as vs from 'vscode';
import * as fs from 'fs';
// typescript.


type CustomTypes = {
    variables: string[],
    parameters: string[],
    repetition: string[]
}

class Format {
    filePath: string;
    syntaxFile: string;
    _snippet: vs.SnippetString;
    snippetConfig: any;

    constructor(filePath: string, snippetConfig: any) {
        this.filePath = filePath;
        this.syntaxFile = fs.readFileSync(filePath, 'utf-8');
        this._snippet = new vs.SnippetString();
        this.snippetConfig = snippetConfig;
    }

    public createDoc() {
        // console.log(this.syntaxFile);
        let customTypes = this.getCustomTypes(this.syntaxFile);
        console.log(customTypes);
    }

    private getCustomTypes(fileRows: string) {
        let customDict: CustomTypes = {
            variables: this.getVariables(fileRows),
            parameters: this.getParameters(fileRows),
            repetition: this.getRepetitions(fileRows)
        };
        return customDict;
    }

    private getVariables(fileRows: string) {
        let variables = new RegExp(/([^\\]\$\{[^\}]*\})/, 'g');
        let match = this.matchRegex(fileRows, variables);
        return match;
    }

    private getParameters(fileRows: string) {
        let parameters = new RegExp(/([^\\]\$\[[^\]]*\])/, 'g');
        let match = this.matchRegex(fileRows, parameters);
        return match;
    }
    
    private getRepetitions(fileRows: string) {
        let repetitions = new RegExp(/([^\\]\$\<\d*\>\((?:.|\s)*\))/, 'g');
        let match = this.matchRegex(fileRows, repetitions);
        return match;
    }
    
    private matchRegex(fileRows: string, regex: RegExp) {
        let rawMatch = fileRows.match(regex);
        // A hack that removes the first character of each map. 
        // Wanted to use negative lookbehind in the regex but this isn't supported in
        // ES6.
        let match = rawMatch.map(i => i.substring(1));
        return match;
    }
}

export { Format }