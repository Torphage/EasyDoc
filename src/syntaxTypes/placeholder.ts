import * as vs from "vscode";
import { ISyntaxType } from "../types";
import { BaseSyntaxType } from "./base_type";

export class Placeholder extends BaseSyntaxType {
    constructor() {
        super();
    }

    public applyType(unexcapedText: string): vs.SnippetString {
        const snippet = new vs.SnippetString();
        const text = this.removeEscapeCharacters(unexcapedText);
        for (let i = 0; i < text.length; i++) {
            if (this.isType(text, i)) {
                const snippetStr = this.createType(text, i);
                snippet.appendPlaceholder(
                    this.removeEscapeCharacters(snippetStr),
                );
                i += snippetStr.length + 2;
            } else {
                snippet.appendText(text[i]);
            }
        }
        return snippet;
    }

    protected isType(text: string, index: number): boolean {
        const placeholders = this.customTypes.getSyntax(text, "placeholders");
        for (const placeholder of placeholders) {
            if (placeholder.start === index) {
                return true;
            }
        }
        return false;
    }

    protected getType(text: string, index: number): ISyntaxType {
        const placeholders = this.customTypes.getSyntax(text, "placeholders");
        for (const placeholder of placeholders) {
            if (placeholder.start === index) {
                return placeholder;
            }
        }
    }

    protected createType(text: string, index: number): string {
        const placeholder = this.getType(text, index);
        const placeholderString = placeholder.text.slice(2, -1);
        return placeholderString;
    }
}
