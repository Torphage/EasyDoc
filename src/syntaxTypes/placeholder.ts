/**
 * Handle placeholders.
 */
import * as vs from "vscode";
import { ISyntaxType } from "../interfaces";
import { CustomSyntax } from "../syntax";

/**
 * Handle placeholders.
 *
 * @export
 * @class Placeholder
 */
export class Placeholder {

    /**
     * Loops through text and converts placeholders into a snippetstring
     *
     * @param {string} text The text to loop thorugh and handle placeholders.
     * @returns {vs.SnippetString} A vs.SnippetString with all the finished values ready to insert.
     * @memberof Placeholder
     */
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

    /**
     * Get placeholder at a specific index.
     *
     * @private
     * @param {ISyntaxType[]} placeholders The placeholders to search through.
     * @param {number} index The index to search at.
     * @returns {ISyntaxType} The placeholder if one is found. If found use it as true.
     * @memberof Placeholder
     */
    private getPlaceholderAtIndex(placeholders: ISyntaxType[], index: number): ISyntaxType {
        for (const placeholder of placeholders) {
            if (placeholder.start === index) {
                return placeholder;
            }
        }
    }

    /**
     * Get the placeholder text.
     *
     * @private
     * @param {ISyntaxType} placeholder The placeholder where text should be searched for.
     * @returns {string} The placeholder text.
     * @memberof Placeholder
     */
    private getPlaceholderText(placeholder: ISyntaxType): string {
        const placeholderString = placeholder.text.slice(2, -1);

        return placeholderString;
    }
}
