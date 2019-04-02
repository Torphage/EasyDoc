import regexExpressions from "../config/languages";
import { ILanguage, IParams, IReturn } from "../interfaces";

export abstract class BaseParse {
    public blockStartIndex: number = 0;
    protected allRegex: ILanguage;
    protected regex: RegExp;

    constructor(docType: string) {
        this.allRegex = regexExpressions[this.constructor.name.slice(0, -5)];
        this.regex = this.allRegex.regex[docType];
    }

    public abstract parseBlock(rows: string[]): string[];
    public abstract parseParams(params: string): IParams;

    public parse(rows: string[]): {[key: string]: string} {
        this.regex.lastIndex = 0;
        const match = this.regex.exec(rows[0]);

        return match.groups;
    }

    protected preParse(rows: string[]): Promise<string[]> {
        const charToEscape = /(?<!\\)([(){}])/g;
        const whenToEscape = this.allRegex.syntax.string;

        const newRows: string[] = [];

        let row: string;
        for (row of rows) {
            let tempStr = row;

            let stringSyntax: string[];
            for (stringSyntax of whenToEscape) {
                const regex = new RegExp(`(?<!\\\\)${stringSyntax[0]}.*?(?<!\\\\)${stringSyntax[1]}`, "g");
                const match = row.match(regex);

                if (match === null) { continue; }

                let regexMatch: string;
                for (regexMatch of match) {
                    tempStr = tempStr.replace(regexMatch, regexMatch.replace(charToEscape, "\\$1"));
                }
            }

            newRows.push(tempStr);
        }

        return new Promise((resolve, reject) => {
            resolve(newRows);
            reject(undefined);
        });
    }}
