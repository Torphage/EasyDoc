import regexExpressions from "../config/regex";
import { IParams, IRegexFunc } from "../interfaces";

export abstract class BaseParse {
    public blockStartIndex: number = 0;
    protected regex: IRegexFunc;

    constructor(docType: string) {
        this.regex = regexExpressions[this.constructor.name][docType];
        console.log(docType);
        console.log(this.constructor.name);
        console.log(this.regex);
    }

    public abstract parseBlock(rows: string[]): string[];

    public parseName(rows: string[]): string {
        const regexes = this.regex.name;

        let regex: RegExp;
        for (regex of regexes) {
            const match = regex.exec(rows[0])[1];

            if (match !== undefined) { return match; }
        }
    }
    public abstract parseParams(row: string[]): IParams;
}
