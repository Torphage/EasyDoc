import * as vs from "vscode";
import { BaseSyntaxType } from "./base_type";
import { SyntaxType } from "../types"

export class Repeater extends BaseSyntaxType {    
    constructor() {
        super();
    }

    applyType(text: string): vs.SnippetString {
        let snippet = new vs.SnippetString();
        for (let i = 0; i < text.length; i++) {
            if (this.isType(text, i)) {
                let snippetObj = this.createType(text, i);
                snippet.appendText(
                    this.removeEscapeCharacters(snippetObj.snippetStr)
                );
                let offset = 4 + String(snippetObj.timesToRepeat).length;
                i += this.removeEscapeCharacters(snippetObj.stringToRepeat).length + offset;
            } else {
                snippet.appendText(text[i]);
            }
        }
        return snippet;
    }

    isType(text: string, index: number): boolean {
        let repetitions = this.customTypes.getSyntax(text, 'repetitions');
        for (let i = 0; i < repetitions.length; i++) {
            if (repetitions[i].start === index) {
                return true;
            }
        }
        return false;
    }

    getType(text: string, index: number): SyntaxType {
        let repetitions = this.customTypes.getSyntax(text, 'repetitions');
        for (let i = 0; i < repetitions.length; i++) {
            if (repetitions[i].start === index) {
                return repetitions[i];
            }
        }
    }

    createType(text: string, index: number): {snippetStr: string, stringToRepeat: string, timesToRepeat: number} {
        let repetition = this.getType(text, index);
        // console.log("in create")

        let regex = new RegExp(/\<(\d*)|\((?:.|\s)*/, 'gm');
        let result = repetition.text.match(regex);

        let timesToRepeat = +result[0].substring(1);
        let stringToRepeat = result[1].substr(1, result[1].length - 2);
        
        let snippetStrArr: string[] = []
        for (let i = 0; i < timesToRepeat; i++) {
            snippetStrArr.push(stringToRepeat)
        }

        let snippetStr = snippetStrArr.join('\n')

        return {snippetStr, stringToRepeat, timesToRepeat};
    }
}