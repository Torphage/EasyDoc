import regexExpressions from "../config/languages";
import { ILanguage, IParams } from "../interfaces";

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
}
