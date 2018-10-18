import * as vs from 'vscode';
import * as fs from 'fs';
import * as languages from './languages/export';
import { SyntaxType, CustomTypes } from './types';



export class Format {
    private syntaxFile: string;
    private snippetConfig: any;
    private document: vs.TextDocument;
    private workShop: languages.WorkShop;

    constructor(filePath: string, snippetConfig: any) {
        this.syntaxFile = fs.readFileSync(filePath, 'utf-8');
        this.snippetConfig = snippetConfig;
        this.document = vs.window.activeTextEditor.document;
    }

    public createDoc(): void {
        let customTypes = this.getCustomTypes(this.syntaxFile);
        let languageID = this.document.languageId;
        let docType = this.snippetConfig.docType;
        switch (languageID) {
            case 'ruby':
                this.workShop = new languages.Ruby()
        }
        this.workShop.generate(customTypes, docType, this.snippetConfig)
    }

    private getCustomTypes(fileRows: string): CustomTypes {
        let customDict: CustomTypes = {
            variables: this.getVariables(fileRows),
            parameters: this.getParameters(fileRows),
            repetition: this.getRepetitions(fileRows)
        };
        return customDict;
    }

    private getVariables(fileRows: string): SyntaxType {
        let variables = new RegExp(/([^\\]\$\{[^\}]*\})/, 'g');
        let match = this.matchRegex(fileRows, variables);
        return match;
    }

    private getParameters(fileRows: string): SyntaxType {
        let parameters = new RegExp(/([^\\]\$\[[^\]]*\])/, 'g');
        let match = this.matchRegex(fileRows, parameters);
        return match;
    }
    
    private getRepetitions(fileRows: string): SyntaxType {
        let repetitions = new RegExp(/([^\\]\$\<\d*\>\((?:.|\s)*\))/, 'g');
        let match = this.matchRegex(fileRows, repetitions);
        return match;
    }
    
    private matchRegex(fileRows: string, regex: RegExp): SyntaxType {
        let rawMatch: RegExpExecArray; 
        let match: SyntaxType = new Array();
        while ( (rawMatch = regex.exec(fileRows)) ) {
            let matchString = fileRows.substr(rawMatch.index+1, rawMatch[0].length-1)
            let matchStart = rawMatch.index + 1;
            let matchLength = rawMatch[0].length - 1;
            match.push({
                text: matchString,
                start: matchStart,
                length: matchLength
            })
        }
        return match;
    }
}