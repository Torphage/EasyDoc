import * as vs from "vscode";
import { BaseSyntaxType } from "./base_type";
import { SyntaxType } from "../types"

export class Placeholder extends BaseSyntaxType {    
    constructor() {
        super();
    }

    applyType(unexcapedText: string): vs.SnippetString {
        let snippet = new vs.SnippetString();
        let text = this.removeEscapeCharacters(unexcapedText);
        for (let i = 0; i < text.length; i++) {
            if (this.isType(text, i)) {
                let snippetStr = this.createType(text, i);
                snippet.appendPlaceholder(
                    this.removeEscapeCharacters(snippetStr)
                )
                i += snippetStr.length + 2;
            } else {
                snippet.appendText(text[i]);
            }
        }
        return snippet;
    }

    isType(text: string, index: number): boolean {
        let placeholders = this.customTypes.getSyntax(text, 'placeholders');
        for (let i = 0; i < placeholders.length; i++) {
            if (placeholders[i].start === index) {
                return true;
            }
        }
        return false;
    }

    getType(text: string, index: number): SyntaxType {
        let placeholders = this.customTypes.getSyntax(text, 'placeholders');
        for (let i = 0; i < placeholders.length; i++) {
            if (placeholders[i].start === index) {
                return placeholders[i];
            }
        }
    }

    createType(text: string, index: number): string {
        let placeholder = this.getType(text, index);
        let placeholderString = placeholder.text.slice(2, -1);
        return placeholderString;
    }
}