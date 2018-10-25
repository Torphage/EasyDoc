import * as vs from 'vscode';
import { SyntaxTypes, VarTypes, SyntaxVariable } from './types';


export class CustomSyntax {
    private variables: SyntaxVariable;

    constructor() {
    }

    public getSyntax(fileRows: string, type: string): SyntaxTypes {
        if (type === 'variables') {
            return this.getVariables(fileRows);
        } else if (type === 'placeholders') {
            return this.getPlaceholders(fileRows);
        } else if (type === 'repetition') {
            return this.getRepetitions(fileRows);
        }
    }

    private getVariables(fileRows: string): SyntaxTypes {
        let variables = new RegExp(/([^\\]\$\{[^\}]*\})/, 'g');
        let match = this.matchRegex(fileRows, variables);
        return match;
    }

    private getPlaceholders(fileRows: string): SyntaxTypes {
        let placeholders = new RegExp(/([^\\]\$\[[^\]]*\])/, 'g');
        let match = this.matchRegex(fileRows, placeholders);
        return match;
    }

    private getRepetitions(fileRows: string): SyntaxTypes {
        let repetitions = new RegExp(/([^\\]\$\<\d*\>\((?:.|\s)*\))/, 'g');
        let match = this.matchRegex(fileRows, repetitions);
        return match;
    }

    private matchRegex(fileRows: string, regex: RegExp): SyntaxTypes {
        let rawMatch: RegExpExecArray;
        let match: SyntaxTypes = new Array();
        while ((rawMatch = regex.exec(fileRows))) {
            let matchString = fileRows.substr(rawMatch.index + 1, rawMatch[0].length - 1)
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