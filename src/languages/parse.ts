import regexExpressions from "../config/languages";
import { IParams, IRegex, IRegexFunc } from "../interfaces";

export abstract class BaseParse {
    public blockStartIndex: number = 0;
    protected allRegex: IRegex;
    protected regex: IRegexFunc;

    constructor(docType: string) {
        this.allRegex = regexExpressions[this.constructor.name.slice(0, -5)];
        this.regex = this.allRegex[docType];
    }

    public abstract parseBlock(rows: string[]): string[];
    public abstract parseParams(row: string[]): IParams;

    public parseName(rows: string[]): string | undefined {
        console.log(0)
        // const l = await this.preParse(rows);
        console.log(1)
        // console.log(l);
        console.log(2)
        const regexes = this.regex.name;

        let regex: RegExp;
        for (regex of regexes) {
            const match = regex.exec(rows[0])[1];

            if (match !== undefined) { return match; }
        }

        return undefined;
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
