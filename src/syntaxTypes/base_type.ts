import * as vs from 'vscode';
import { SyntaxVariable } from '../types';
import { CustomSyntax } from '../syntax';


export abstract class BaseSyntaxType {
    protected customTypes: CustomSyntax;
    protected vars: SyntaxVariable;
    
    constructor(vars?: SyntaxVariable) {
        this.customTypes = new CustomSyntax();
        this.vars = vars;
    }

    protected isNewLine(text: string, index: number) {
        if (text[index - 1] === '\n' || text[index - 1] === undefined) {
            return true;
        }
        return false;
    }

    protected removeEscapeCharacters(text: string): string {
        let unescapedString = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\\') {
                if (text[i - 1] === '\\' && text[i + 1] === '\\') {
                    unescapedString += text[i];
                }
            } else {
                unescapedString += text[i];
            }
        }
        return unescapedString;
    }

    protected getCurrentLine(syntaxText: string, index: number): string {
        let leftOfCurrentPos = syntaxText.slice(0, index);
        let leftIndex = leftOfCurrentPos.lastIndexOf('\n');

        let rightOfCurrentPos = syntaxText.slice(index);
        let rightIndex = rightOfCurrentPos.indexOf('\n');
        
        if (rightIndex !== -1) {
            let fullLine = syntaxText.substring(leftIndex, leftOfCurrentPos.length + rightIndex);
            return fullLine.trim();
        } else {
            let fullLine = syntaxText.substring(leftOfCurrentPos.length + 2);
            return fullLine.trim();
        }
    }

    protected typeInLine(text: string) {
        for (let key in this.vars) {
            if (text.includes(`\${${key}}`) && !(text.includes(`\\\${${key}}`))) {
                return true
            }
        }
        return false;
    }

    protected maxNumOfType(vars: any[]): number {
        let maxRepetitions = 0;
        vars.forEach(locals => {
            if (typeof locals !== 'string') {
                let variable = this.vars[locals.text.slice(2, -1)]
                if (variable.length > maxRepetitions) {
                    maxRepetitions = variable.length;
                }
            }
        });
        return maxRepetitions;
    }

    abstract applyType(text: string): vs.SnippetString;
    abstract isType(text: string, index: number): boolean;
    abstract getType(text: string, index?: number, type?: string): any;
    abstract createType(text: string, index: number): any;
}