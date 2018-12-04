import * as fs from "fs";
import * as vs from "vscode";
import { IDocumentationParts, ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";
import { ErrorHandler, Placeholder, Repeater, Variable } from "../syntaxTypes/export";

export abstract class WorkShop {
    protected syntaxFile: string;
    protected config: any;
    protected vars: ISyntaxVariable;

    protected document = vs.window.activeTextEditor.document;
    protected position = vs.window.activeTextEditor.selection.active;
    protected block: string[] = [];
    protected customTypes = new CustomSyntax();

    constructor(syntaxFile: string) {
        this.syntaxFile = syntaxFile;
    }

    public generate(docType: any, config: any, onEnter: boolean): void {
        this.config = config;

        switch (docType) {
            case "block":
                this.generateFunction(onEnter);
                break;

            case "function":
                this.getDocParts();
                this.vars = this.getVariables();

                this.generateFunction(onEnter);
                break;
        }
    }

    protected abstract getCurrentColumn(index: number): number;
    protected abstract getVariables(): ISyntaxVariable;
    protected abstract getFunctionStartLine(row: string): string[];
    protected abstract correctlyPlacedFunction(row: string): boolean;

    private generateFunction(onEnter: boolean): void {
        const editor = vs.window.activeTextEditor;

        const errorHandler = new ErrorHandler(this.vars);
        const repeater = new Repeater(this.vars);
        const variable = new Variable(this.vars);
        const placeholder = new Placeholder();

        const cleanText = errorHandler.handle(this.syntaxFile);
        const varSnippet = variable.generate(cleanText);
        const repSnippet = repeater.generate(varSnippet);
        const placeSnippet = placeholder.generate(repSnippet);

        if (onEnter) {
            this.delTriggerString();
        }

        editor.insertSnippet(placeSnippet);
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

    private delTriggerString() {
        const line = this.position.line;
        const character = this.position.character - this.config.triggerString.length;

        let currentChar: vs.Position;

        currentChar = new vs.Position(this.position.line + 1, this.position.character);

        const pos = new vs.Position(line, character);
        const selection = new vs.Selection(pos, currentChar);

        vs.window.activeTextEditor.edit((builder) => {
            builder.replace(selection, "");
        });
    }
}
