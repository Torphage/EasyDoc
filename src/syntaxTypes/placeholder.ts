import * as vs from "vscode";
import { ISyntaxType } from "../interfaces";
import { CustomSyntax } from "../syntax";

export class Placeholder {

    public generate(text: string): vs.SnippetString {
        const snippet = new vs.SnippetString();

        const customTypes = new CustomSyntax();
        const placeholders = customTypes.getSyntax(text, "placeholders");

        for (let i = 0; i < text.length; i++) {
            const placeholder = this.getPlaceholderAtIndex(placeholders, i);

            if (placeholder) {
                const snippetStr = this.getPlaceholderText(placeholder);

                snippet.appendPlaceholder(snippetStr);

                i += snippetStr.length + 2;
            } else {
                snippet.appendText(text[i]);
            }
        }

        return snippet;
    }

    private getPlaceholderAtIndex(placeholders: ISyntaxType[], index: number): ISyntaxType {
        for (const placeholder of placeholders) {
            if (placeholder.start === index) {
                return placeholder;
            }
        }
    }

    private getPlaceholderText(placeholder: ISyntaxType): string {
        const placeholderString = placeholder.text.slice(2, -1);

        return placeholderString;
    }
}
