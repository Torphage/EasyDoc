import * as vs from "vscode";
import { BaseSyntaxType } from "./base_type";
import { SyntaxType, SyntaxVariable } from "../types"

export class Variable extends BaseSyntaxType {
    constructor(vars: SyntaxVariable) {
        super(vars);
    }

    applyType(unexcapedText: string): vs.SnippetString {
        let snippet = new vs.SnippetString();
        let text = this.removeEscapeCharacters(unexcapedText);
        for (let i = 0; i < text.length; i++) {
            if (this.isNewLine(text, i)) {
                let currentLine = this.getCurrentLine(text, i);
                if (this.typeInLine(currentLine)) {
                    let snippetStr = this.createType(currentLine, i);
                    snippet.appendText(
                        this.removeEscapeCharacters(snippetStr)
                    )
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

    isType(text: string, index: number): boolean {
        let repetitions = this.customTypes.getSyntax(text, 'variables');
        for (let i = 0; i < repetitions.length; i++) {
            if (repetitions[i].start === index) {
                return true;
            }
        }
        return false;
    }

    getType(text: string, index: number, type: string): any {
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

    createType(text: string, index: number): string {
        let str = [];
        let localVars = this.getType(text, undefined, 'variables');
        let maxRepetitions = this.maxNumOfType(localVars);

        localVars.forEach(variable => {
            let newVar = this.vars[variable.text.slice(2, -1)];

            if (typeof newVar === 'string') {
                let newStr = text.replace(variable.text, newVar);
                let temp = this.applyType(newStr);
                str.push(temp.value);

            } else {
                for (let i = 0; i < maxRepetitions; i++) {

                    if (newVar.length === maxRepetitions) {
                        let newStr = text.replace(variable.text, newVar[i]);
                        let temp = this.applyType(newStr);
                        str.push(temp.value);

                    } else {
                        let newStr = text.replace(variable.text, newVar[0]);
                        let temp = this.applyType(newStr);
                        str.push(temp.value);
                    }
                }
            }
        })
        return str.join('\n');
    }
}