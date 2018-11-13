import { CustomSyntax } from "../syntax";
import { IRepeater, ISyntaxType, ISyntaxVariable } from "../types";

export class Repeater {
    private customTypes: CustomSyntax;
    private vars: ISyntaxVariable;

    constructor(vars: ISyntaxVariable) {
        this.customTypes = new CustomSyntax();
        this.vars = vars;
    }

    public generate(text: string): string {
        const snippet = [];

        const repeaters = this.customTypes.getSyntax(text, "repeaters");

        for (let i = 0; i < text.length; i++) {
            const repeater = this.getRepeaterAtIndex(repeaters, i);

            if (repeater) {
                const snippetObj = this.repeatObj(repeater);

                snippet.push(snippetObj.snippetStr);

                i += snippetObj.offset;
            } else {
                snippet.push(text[i]);
            }
        }

        return snippet.join("");
    }

    private getRepeaterAtIndex(repeaters: ISyntaxType[], index: number): ISyntaxType {
        for (const repeater of repeaters) {
            if (repeater.start === index) {
                return repeater;
            }
        }
    }

    private getTextToRepeat(repeater: ISyntaxType): string[] {
        const result = this.repeatRegex(repeater);

        const timesToRepeat = this.timesToRepeat(repeater);
        const stringToRepeat = result[2];

        const snippetStrArr: string[] = [];

        for (let i = 0; i < timesToRepeat; i++) {
            snippetStrArr.push(
                stringToRepeat,
            );
        }

        return snippetStrArr;
    }

    private timesToRepeat(repeater: ISyntaxType): number {
        const regexResult = this.repeatRegex(repeater);
        const timesToRepeat = regexResult[1];

        let num: number;

        if (isNaN(+timesToRepeat)) {
            num = this.vars[timesToRepeat];
        } else {
            num = +timesToRepeat;
        }

        return num;
    }

    private repeatRegex(repeater: ISyntaxType): RegExpMatchArray {
        const regex = /\<(\w*)\>\(((?:.|\s)*)/gm;
        const result: any[] = new Array();

        let rawMatch: RegExpExecArray;

        do {
            rawMatch = regex.exec(repeater.text.slice(1));

            if (rawMatch !== null) {
                result.push(rawMatch);
            }
        } while (rawMatch);

        return result[0];
    }

    private repeatObj(repeater: ISyntaxType): IRepeater {
        const snippetStrArr = this.getTextToRepeat(repeater);
        const snippetStr = snippetStrArr.join("");

        const timesToRepeat = this.timesToRepeat(repeater);

        const temp = 6 + String(timesToRepeat).length;
        const offset = snippetStrArr[0].length + temp;

        return {
            offset,
            snippetStr,
        };
    }
}
