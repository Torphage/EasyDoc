import * as vs from "vscode";
import { IRepeater, ISyntaxType } from "../types";
import { BaseSyntaxType } from "./base_type";

export class Repeater extends BaseSyntaxType {
    constructor() {
        super();
    }

    public applyType(text: string): vs.SnippetString {
        const snippet = new vs.SnippetString();
        for (let i = 0; i < text.length; i++) {
            if (this.isType(text, i)) {
                const snippetObj = this.createType(text, i);
                snippet.appendText(
                    this.removeEscapeCharacters(snippetObj.snippetStr),
                );
                const offset = 4 + String(snippetObj.timesToRepeat).length;
                i += this.removeEscapeCharacters(snippetObj.stringToRepeat).length + offset;
            } else {
                snippet.appendText(text[i]);
            }
        }
        return snippet;
    }

    protected isType(text: string, index: number): boolean {
        const repetitions = this.customTypes.getSyntax(text, "repetitions");
        for (const repetition of repetitions) {
            if (repetition.start === index) {
                return true;
            }
        }
        return false;
    }

    protected getType(text: string, index: number): ISyntaxType {
        const repetitions = this.customTypes.getSyntax(text, "repetitions");
        for (const repetition of repetitions) {
            if (repetition.start === index) {
                return repetition;
            }
        }
    }

    protected createType(text: string, index: number): IRepeater {
        const repetition = this.getType(text, index);

        const regex = new RegExp(/\<(\d*)|\((?:.|\s)*/, "gm");
        const result = repetition.text.match(regex);

        const timesToRepeat = +result[0].substring(1);
        const stringToRepeat = result[1].substr(1, result[1].length - 2);

        const snippetStrArr: string[] = [];
        for (let i = 0; i < timesToRepeat; i++) {
            snippetStrArr.push(stringToRepeat);
        }

        const snippetStr = snippetStrArr.join("\n");

        return {
            snippetStr,
            stringToRepeat,
            timesToRepeat,
        };
    }
}
