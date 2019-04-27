import { expect } from "chai";
import regexExpressions from "../../config/languages";
import { RegexTest } from "../regex";

describe("Language: Typescript", () => {
    describe("Regex: function", () => {
        context("Variable: export", () => {
            context("export is found", () => {
                it("should return \"export\"", () => {
                    const language = new RegexTest();
                    const result = language.tryRegex(
                        regexExpressions.Typescript.regex.function,
                        "export",
                        "export function main(test: string) {}",
                    );
                    expect(result).to.eql("export");
                });
            });
            context("export is not found", () => {
                it("should not return \"export\"", () => {
                    const language = new RegexTest();
                    const result = language.tryRegex(
                        regexExpressions.Typescript.regex.function,
                        "export",
                        "export",
                    );
                    expect(result).to.not.eql("export");
                });
            });
        });
        context("Variable: abstract", () => {
            context("abstract is found", () => {
                it("should return \"abstract\"", () => {
                    const testLang = new RegexTest();
                    regexExpressions.Typescript.regex.function.lastIndex = 0;
                    const result = testLang.tryRegex(
                        regexExpressions.Typescript.regex.function,
                        "abstract",
                        // tslint:disable-next-line:max-line-length
                        "export abstract function testFunction(test: string, obj: { myBoy: string, try: number }, hi: string[]): { myBoy: string, try: number } {}",
                        );
                    expect(result).to.eql("abstract");
                });
            });
            context("abstract is not found", () => {
                it("should not return \"abstract\"", () => {
                    const testLang = new RegexTest();
                    regexExpressions.Typescript.regex.function.lastIndex = 0;
                    const result = testLang.tryRegex(
                        regexExpressions.Typescript.regex.function,
                        "abstract",
                        // tslint:disable-next-line:max-line-length
                        "export abstract function testFunction(test: string, obj: { myBoy: string, try: number }, hi: string[]): { myBoy: string, try: number } {}",
                        );
                    expect(result).to.not.eql("abstract");
                })
            })
        });
    });
});
