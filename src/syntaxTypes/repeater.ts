import * as vs from "vscode";
import { IRepeater, ISyntaxType } from "../types";
import { BaseSyntaxType } from "./base_type";

export class Repeater extends BaseSyntaxType {
    constructor(vars) {
        super(vars);
    }

    public applyType(text: string): vs.SnippetString {
        const snippet = new vs.SnippetString();
        const repeaters = this.customTypes.getSyntax(text, "repeaters");

        for (let i = 0; i < text.length; i++) {
            const repeater = this.getType(repeaters, i);

            if (repeater) {
                const snippetObj = this.repeatObj(repeater);

                snippet.appendText(snippetObj.snippetStr);

                i += snippetObj.offset;
            } else {
                snippet.appendText(text[i]);
            }
        }

        return snippet;
    }

    protected getType(repeaters: ISyntaxType[], index: number): ISyntaxType {
        for (const repeater of repeaters) {
            if (repeater.start === index) {
                return repeater;
            }
        }
    }

    protected getTypeText(repeater: ISyntaxType): string[] {
        const result = this.repeatRegex(repeater);

        const timesToRepeat = this.timesToRepeat(repeater);
        const stringToRepeat = this.applyType(
            result[1].substr(1));

        const snippetStrArr: string[] = [];

        for (let i = 0; i < timesToRepeat; i++) {
            snippetStrArr.push(
                this.removeEscapeCharacters(stringToRepeat.value),
            );
        }

        return snippetStrArr;
    }

    private timesToRepeat(repeater: ISyntaxType): number {
        const regexResult = this.repeatRegex(repeater);
        const timesToRepeat = regexResult[0].substring(1);

        let num: number;

        if (isNaN(+timesToRepeat)) {
            num = this.vars[timesToRepeat];
        } else {
            num = +timesToRepeat;
        }

        return num;
    }

    private repeatRegex(repeater: ISyntaxType): RegExpMatchArray {
        const regex = /\<((\d|\w)*)|\((?:.|\s)*/gm;
        const result = repeater.text.slice(0, -1).match(regex);

        return result;
    }

    private repeatObj(repeater: ISyntaxType): IRepeater {
        const snippetStrArr = this.getTypeText(repeater);
        const snippetStr = snippetStrArr.join("");

        const timesToRepeat = this.timesToRepeat(repeater);

        const temp = 4 + String(timesToRepeat).length;
        const offset = snippetStrArr[0].length + temp;

        return {
            offset,
            snippetStr,
        };
    }
}
