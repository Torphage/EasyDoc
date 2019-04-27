import { ILanguages } from "../interfaces";

export class RegexTest {
    protected regexes: ILanguages;

    public tryRegex(regex: RegExp, group: string, testString: string): string {
        const result = regex.exec(testString);
        return result.groups[group];
    }
}
