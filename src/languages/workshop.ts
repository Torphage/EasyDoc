import * as fs from "fs";
import * as vs from "vscode";
import { CustomSyntax } from "../syntax";
import { Placeholder, Repeater, Variable } from "../syntaxTypes/export";
import { IDocumentationParts, ISyntaxVariable } from "../types";

export abstract class WorkShop {
    protected syntaxFile: string;
    protected document: vs.TextDocument;
    protected position: vs.Position;
    protected config: any;
    protected parse: any;
    protected snippet: vs.SnippetString;
    protected block: string[];
    protected vars: ISyntaxVariable;
    protected customTypes: CustomSyntax;

    constructor(syntaxFile: string) {
        this.syntaxFile = syntaxFile;
        this.document = vs.window.activeTextEditor.document;
        this.position = vs.window.activeTextEditor.selection.active;
        this.block = [];
        this.customTypes = new CustomSyntax();
    }

    public generate(docType: any, config: any, onEnter: boolean): void {
        this.config = config;

        switch (docType) {
            case "function":
                this.getDocParts();
                this.vars = this.getVariables();

                this.generateFunction(this.syntaxFile, onEnter);

                break;

            case "block":
                this.generateFunction(this.syntaxFile, onEnter);

                break;
        }
    }

    protected abstract getCurrentColumn(index: number): number;
    protected abstract getVariables(): ISyntaxVariable;
    protected abstract getFunctionStartLine(row: string): string[];
    protected abstract correctlyPlacedFunction(row: string): boolean;

    private generateFunction(text: string, onEnter: boolean): void {
        const editor = vs.window.activeTextEditor;

        const repeater = new Repeater(this.vars);
        const variable = new Variable(this.vars);
        const placeholder = new Placeholder();

        const varSnippet = variable.applyType(text);
        const repSnippet = repeater.applyType(varSnippet);
        const placeSnippet = placeholder.applyType(repSnippet);

        const cleanSnippet = new vs.SnippetString(this.UnescapeCustomSyntax(placeSnippet.value));

        this.delTriggerString(onEnter);

        editor.insertSnippet(cleanSnippet);
    }

    private UnescapeCustomSyntax(text: string): string {
        return text.replace(/\\\\\$/g, "$");
    }

    private getDocParts(): IDocumentationParts {
        const docRows = fs.readFileSync(this.document.fileName, "utf-8");
        const functionLineString = this.getFunctionStartLine(docRows);
        const correctlyPlacedFunction = this.correctlyPlacedFunction(functionLineString[0]);

        if (!correctlyPlacedFunction) {
            return;
        }

        this.block = this.parse.parseBlock(functionLineString);

        const parts = {
            name: this.parse.parseName(this.block),
            params: this.parse.parseParams(this.block),
        };

        return parts;
    }

    private delTriggerString(onEnter: boolean) {
        const line = this.position.line;
        const character = this.position.character - this.config.triggerString.length;

        let currentChar: vs.Position;

        if (onEnter) {
            currentChar = new vs.Position(this.position.line + 1, this.position.character);
        } else {
            currentChar = new vs.Position(this.position.line, this.position.character);
        }

        const pos = new vs.Position(line, character);
        const selection = new vs.Selection(pos, currentChar);

        vs.window.activeTextEditor.edit((builder) => {
            builder.replace(selection, "");
        });
    }
}
