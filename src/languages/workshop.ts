import * as vs from 'vscode';
import * as fs from 'fs';
import { CustomTypes, SyntaxVariable, DocumentationParts } from '../types';



export abstract class WorkShop {
    protected syntaxFile: string;
    protected customTypes: CustomTypes;
    protected document: vs.TextDocument;
    protected position: vs.Position;
    protected config: any;
    protected parse: any;
    protected snippet: vs.SnippetString;
    protected block: string[];
    protected vars: SyntaxVariable;
    
    constructor(syntaxFile: string, customTypes: CustomTypes) {
        this.syntaxFile = syntaxFile;
        this.customTypes = customTypes
        this.document = vs.window.activeTextEditor.document;
        this.position = vs.window.activeTextEditor.selection.active;
        this.block = [];
    }
    
    public generate(docType: any, config: any): void {
        this.config = config;
        let documentRows = fs.readFileSync(this.document.fileName, 'utf-8');
        this.getDocParts(documentRows);
        this.vars = this.getVariables();
        switch (docType) {
            case 'function':
            this.generateFunction(documentRows);
        }
    }
    
    private generateFunction(docRows: string): void {
        let snippet = this.createSnippet(this.syntaxFile);
        let editor = vs.window.activeTextEditor;
        editor.insertSnippet(snippet)
    }

    private createSnippet(syntaxText: string): vs.SnippetString {
        let snippet = new vs.SnippetString();
        for (let i = 0; i < syntaxText.length; i++) {
            if (this.newLine(syntaxText, i)) {
                let currentLine = this.getCurrentLine(syntaxText, i);
                // console.log(syntaxText)
                if (this.lineHasVariables(currentLine)) {
                    let newString = this.handleVariables(currentLine, i);
                    // console.log(newString)
                    console.log('decode')
                    let newStr = this.unescapeStr(newString)
                    // console.log(decodeURI(newString))
                    console.log(newStr)
                    snippet.appendText(newStr)
                    console.log(snippet)
                    i += currentLine.length;
                } else {
                    snippet.appendText(syntaxText[i])
                }
            } else {
                snippet.appendText(syntaxText[i])
            }
        }
        return snippet;
    }

    private newLine(text: string, index: number) {
        if (text[index-1] === '\n' || text[index-1] === undefined) {
            return true;
        }
        return false;
    }

    private unescapeStr(text: string): string {
        let str = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\\') {
                if (text[i-1] === '\\' && text[i+1] === '\\') {
                    str += text[i]
                }
            } else {
                str += text[i]                
            }
        }
        return str;
    }

    private handleVariables(text: string, index: number) {
        let localVars = this.getVariablesInLine(text, index);
        let str = [];
        let maxRepetitions = this.maxRepetitions(localVars);
        for (let i = 0; i < maxRepetitions; i++) {
            let variable = localVars[i];
            let newVar = this.vars[variable.text.slice(2, -1)];
            newVar.forEach(vars => {
                let newStr = text.replace(variable.text, vars);
                let temp = this.createSnippet(newStr)
                str.push(temp.value);
            });
        }
        return str.join('\n');
    }
    
    private maxRepetitions(vars: any[]): number {
        let maxRepetitions = 0
        vars.forEach(locals => {
            if (typeof locals !== 'string') {
                if (locals.length > maxRepetitions) {
                    maxRepetitions = locals.length;
                }
            }
        });
        return maxRepetitions;
    }

    private lineHasVariables(text: string) {
        for (let key in this.vars) {
            if (text.includes(`\${${key}}`)) {
                return true
            }
        }
        return false;
    }

    private getVariablesInLine(text: string, index: number) {
        let vars = this.getAllSyntaxVariablesInOrder(text);
        let includedVars = [];
        vars.forEach(obj => {
            if (index < obj.start && index + text.length > obj.start + obj.length) {
                includedVars.push(obj)
            }
        });
        return includedVars;
    }

    private getAllSyntaxVariablesInOrder(text: string): any {
        let includedVars = [];
        this.customTypes['variables'].forEach(obj => {
            if (text.includes(obj.text)) {
                for (let key in this.vars) {
                    if (obj.text.includes(key)) {
                        includedVars.push(obj)
                    }
                }
            }
        })
        return includedVars;
    }

    private getDocParts(docRows: string): DocumentationParts {
        let functionLineString = this.getFunctionLines(docRows);
        let correctlyPlacedFunction = this.correctlyPlacedFunction(functionLineString[0]);
        
        if (!correctlyPlacedFunction) {
            return;
        }

        this.block = this.parse.parseBlock(functionLineString);

        let name = this.parse.parseName(this.block);
        let params = this.parse.parseParams(this.block);

        let parts = {
            name: name;
            params: params;
        }
        return parts;
    }
    
    abstract getCurrentLine(syntaxText: string, index: number): string;
    abstract getCurrentColumn(index: number): number;
    abstract getVariables(): SyntaxVariable;
    abstract getFunctionLines(row: string): string[];
    abstract correctlyPlacedFunction(row: string): boolean;
}