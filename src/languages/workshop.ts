import * as vs from 'vscode';
import * as fs from 'fs';
import { SyntaxVariable, DocumentationParts } from '../types';
import { CustomSyntax } from '../syntax';



export abstract class WorkShop {
    protected syntaxFile: string;
    protected document: vs.TextDocument;
    protected position: vs.Position;
    protected config: any;
    protected parse: any;
    protected snippet: vs.SnippetString;
    protected block: string[];
    protected vars: SyntaxVariable;
    protected placeholderIndex: number;
    protected customTypes: CustomSyntax

    constructor(syntaxFile: string) {
        this.syntaxFile = syntaxFile;
        this.document = vs.window.activeTextEditor.document;
        this.position = vs.window.activeTextEditor.selection.active;
        this.block = [];
        this.placeholderIndex = 1;
        this.customTypes = new CustomSyntax()
    }

    public generate(docType: any, config: any): void {
        this.config = config;
        let documentRows = fs.readFileSync(this.document.fileName, 'utf-8');
        this.getDocParts(documentRows);
        this.vars = this.getVariables();
        switch (docType) {
            case 'function':
                this.generateFunction(this.syntaxFile);
        }
    }

    private generateFunction(text: string): void {
        let snippet = this.createRepetition(text)
        snippet = this.createVariables(this.unescapeStr(snippet.value))
        snippet = this.createPlaceholders(this.unescapeStr(snippet.value))
        let editor = vs.window.activeTextEditor;
        let line = this.position.line
        let character = this.position.character - this.config.triggerString.length
        let pos = new vs.Position(line, character)
        let sel = new vs.Selection(pos, this.position)
        vs.window.activeTextEditor.edit(builder => {
            builder.replace(sel, '')
        });

        editor.insertSnippet(snippet)
    }

    private createVariables(text: string): vs.SnippetString {
        let snippet = new vs.SnippetString();
        for (let i = 0; i < text.length; i++) {
            if (this.newLine(text, i)) {
                let currentLine = this.getCurrentLine(text, i);
                if (this.lineHasVariables(currentLine)) {
                    let newString = this.handleVariables(currentLine, i);
                    let newStr = this.unescapeStr(newString);
                    snippet.appendText(newStr);
                    i += currentLine.length;
                } else {
                    snippet.appendText(text[i]);
                }
            } else {
                snippet.appendText(text[i]);
            }
        }
        return snippet;
    }

    private createPlaceholders(text: string): vs.SnippetString {
        let snippet = new vs.SnippetString();
        for (let i = 0; i < text.length; i++) {
            if (this.isPlaceholder(text, i)) {
                let newString = this.handlePlaceholders(text, i)
                let newStr = this.unescapeStr(newString)
                snippet.appendPlaceholder(newStr);
                i += newStr.length + 2;
            } else {
                snippet.appendText(text[i]);
            }
        }
        return snippet;
    }

    private isPlaceholder(text: string, index: number): boolean {
        let placeholders = this.customTypes.getSyntax(text, 'placeholders')
        for (let i = 0; i < placeholders.length; i++) {
            if (placeholders[i].start === index) {
                if (placeholders[i].start === index) {
                    return true;
                }
            }
        }
        return false;
    }

    private getPlaceholder(text: string, index: number): any {
        let placeholders = this.customTypes.getSyntax(text, 'placeholders')
        for (let i = 0; i < placeholders.length; i++) {
            if (placeholders[i].start === index) {
                return placeholders[i];
            }
        }
    }

    private handlePlaceholders(text: string, index: number): string {
        let placeholder = this.getPlaceholder(text, index);
        let placeholderString = placeholder.text.slice(2, -1);
        this.placeholderIndex++;
        return placeholderString;
    }

    private createRepetition(text: string): vs.SnippetString {
        let snippet = new vs.SnippetString();
        for (let i = 0; i < text.length; i++) {
            if (this.isRepetition(text, i)) {
                let repetition = this.handleRepetitions(text, i);
                let str = []
                for (let i = 0; i < repetition.timesToRepeat; i++) {
                    str.push(repetition.stringToRepeat)
                }
                let newStr = this.unescapeStr(str.join('\n'));
                snippet.appendText(newStr);
                let offset = 4 + String(repetition.timesToRepeat).length;
                i += this.unescapeStr(repetition.stringToRepeat).length + offset;
            } else {
                snippet.appendText(text[i])
            }
        }
        return snippet;
    }

    private isRepetition(text: string, index: number): boolean {
        let repetition = this.customTypes.getSyntax(text, 'repetition')
        for (let i = 0; i < repetition.length; i++) {
            if (repetition[i].start === index) {
                return true;
            }
        }
        return false;
    }

    private getRepetition(text: string, index: number): any {
        let repetitions = this.customTypes.getSyntax(text, 'repetition')
        for (let i = 0; i < repetitions.length; i++) {
            if (repetitions[i].start === index) {
                return repetitions[i];
            }
        }
    }

    private handleRepetitions(text: string, index: number): {timesToRepeat: number, stringToRepeat: string} {
        let repetition = this.getRepetition(text, index);

        let regex = new RegExp(/\<(\d*)|\((?:.|\s)*/, 'gm');
        let result = repetition.text.match(regex);
        let timesToRepeat = +result[0].substring(1);
        let stringToRepeat = result[1].substr(1, result[1].length - 2);
        return {timesToRepeat, stringToRepeat};
    }

    private newLine(text: string, index: number) {
        if (text[index - 1] === '\n' || text[index - 1] === undefined) {
            return true;
        }
        return false;
    }

    private unescapeStr(text: string): string {
        let str = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\\') {
                if (text[i - 1] === '\\' && text[i + 1] === '\\') {
                    str += text[i]
                }
            } else {
                str += text[i]
            }
        }
        return str;
    }

    private handleVariables(text: string, index: number): string {
        let str = [];
        let localVars = this.getAllSyntaxInOrder(text, 'variables');
        let maxRepetitions = this.maxRepetitions(localVars);

        localVars.forEach(variable => {
            let newVar = this.vars[variable.text.slice(2, -1)];

            if (typeof newVar === 'string') {
                let newStr = text.replace(variable.text, newVar);
                let temp = this.createVariables(newStr);
                str.push(temp.value);

            } else {
                for (let i = 0; i < maxRepetitions; i++) {

                    if (newVar.length === maxRepetitions) {
                        let newStr = text.replace(variable.text, newVar[i]);
                        let temp = this.createVariables(newStr);
                        str.push(temp.value);

                    } else {
                        let newStr = text.replace(variable.text, newVar[0]);
                        let temp = this.createVariables(newStr);
                        str.push(temp.value);
                    }
                }
            }
        })
        return str.join('\n');
    }

    private maxRepetitions(vars: any[]): number {
        let maxRepetitions = 0
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

    private lineHasVariables(text: string) {
        for (let key in this.vars) {
            if (text.includes(`\${${key}}`)) {
                return true
            }
        }
        return false;
    }

    private getAllSyntaxInOrder(text: string, type: string): any {
        let includedVars = [];
        this.customTypes.getSyntax(text, type).forEach(obj => {
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

        let parts = {
            name: this.parse.parseName(this.block),
            params: this.parse.parseParams(this.block),
        }
        return parts;
    }

    abstract getCurrentLine(syntaxText: string, index: number): string;
    abstract getCurrentColumn(index: number): number;
    abstract getVariables(): SyntaxVariable;
    abstract getFunctionLines(row: string): string[];
    abstract correctlyPlacedFunction(row: string): boolean;
}