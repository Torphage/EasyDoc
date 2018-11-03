import * as vs from "vscode";
import { ISyntaxType } from "../types";
import { BaseSyntaxType } from "./base_type";

export class Placeholder extends BaseSyntaxType {
    constructor() {
        super();
    }

    public applyType(unescapedText: string): vs.SnippetString {
        const snippet = new vs.SnippetString();
        const text = this.removeEscapeCharacters(unescapedText);

        const placeholders = this.customTypes.getSyntax(text, "placeholders");

        for (let i = 0; i < text.length; i++) {
            const placeholder = this.getType(placeholders, i);

            if (placeholder) {
                const snippetStr = this.getTypeText(placeholder);

                snippet.appendPlaceholder(snippetStr);

                i += snippetStr.length + 2;
            } else {
                snippet.appendText(text[i]);
            }
        }

        return snippet;
    }

    protected getType(placeholders: ISyntaxType[], index: number): ISyntaxType {
        for (const placeholder of placeholders) {
            if (placeholder.start === index) {
                return placeholder;
            }
        }
    }

    protected getTypeText(placeholder: ISyntaxType): string {
        const placeholderString = placeholder.text.slice(2, -1);

        return placeholderString;
    }
}
