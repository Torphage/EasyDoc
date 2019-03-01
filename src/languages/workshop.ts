import * as fs from "fs";
import * as vs from "vscode";
import commentFile from "../config/comments";
import { ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";
import { ErrorHandler, Placeholder, Repeater, Variable } from "../syntaxTypes/export";

export abstract class WorkShop {
    protected syntaxFile: string;
    protected config: any;
    protected vars: ISyntaxVariable;
    protected parse: any;
    protected blockStartIndex: 0;

    protected document = vs.window.activeTextEditor.document;
    protected position = vs.window.activeTextEditor.selection.active;
    protected block: string[] = [];
    protected customTypes = new CustomSyntax();
    protected editor = vs.window.activeTextEditor;
    private docRows: string;

    constructor(syntaxFile: string) {
        this.syntaxFile = syntaxFile;
        this.docRows = fs.readFileSync(this.document.fileName, "utf-8");
    }

    public generate(docType: any, config: any, onEnter: boolean): void {
        this.config = config;

        switch (docType) {
            case "block":
                this.generateFunction(onEnter, false);
                break;

            case "function":
                this.setCodeBlock(onEnter);
                this.vars = this.getVariables();

                this.generateFunction(onEnter, true);
                break;
        }
    }

    protected abstract getCurrentColumn(index: number): number;
    protected abstract getVariables(): ISyntaxVariable;
    protected abstract getFunctionStartLine(row: string, onEnter: boolean): string[];
    protected abstract correctlyPlacedFunction(row: string): boolean;

    protected getComment(variable: string): string {
        let commentString: string;

        if (this.constructor.name in commentFile) {
            commentString = commentFile[this.constructor.name][variable];
        } else {
            commentString = "";
        }

        return commentString;
    }

    private async generateFunction(onEnter: boolean, strictPlace: boolean): Promise<void> {
        const errorHandler = new ErrorHandler(this.vars);
        const repeater = new Repeater(this.vars);
        const variable = new Variable(this.vars);
        const placeholder = new Placeholder();

        const cleanText = errorHandler.handle(this.syntaxFile);
        const varSnippet = variable.generate(cleanText);
        const repSnippet = repeater.generate(varSnippet);
        const placeSnippet = placeholder.generate(repSnippet);

        if (!this.config.commentAboveTarget) {
            for (let i = 0; i < this.blockStartIndex; i++) {
                await this.stepDownInEditor();
            }
        }

        if (onEnter && placeSnippet.value.length !== 0) {
            this.delTriggerString();
        }

        const functionLineString = this.getFunctionStartLine(this.docRows, onEnter);

        if (strictPlace) {
            if (functionLineString.length === this.docRows.split("\n").splice(this.position.line).length) {
                await this.waitForInsertLine();
            }
        }

        this.editor.insertSnippet(placeSnippet);
    }

    private waitForInsertLine(): Promise<Thenable<{}>|undefined> {
        if (this.config.commentAboveTarget) {
            return new Promise((resolve, reject) => {
                resolve(vs.commands.executeCommand("editor.action.insertLineBefore"));
                reject(undefined);
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve(vs.commands.executeCommand("editor.action.insertLineAfter"));
                reject(undefined);
            });
        }
    }

    private stepDownInEditor(): Promise<Thenable<{}>|undefined> {
        return new Promise((resolve, reject) => {
            resolve(vs.commands.executeCommand("cursorDown"));
            reject(undefined);
        });
    }

    private setCodeBlock(onEnter: boolean): void {
        const functionLineString = this.getFunctionStartLine(this.docRows, onEnter);
        const correctlyPlacedFunction = this.correctlyPlacedFunction(functionLineString[0]);

        if (!correctlyPlacedFunction) {
            return;
        }

        this.block = this.parse.parseBlock(functionLineString);
    }

    private delTriggerString() {
        const line = this.position.line;
        const character = this.position.character - this.config.triggerString.length;

        const currentChar = new vs.Position(this.position.line + 1, this.position.character);

        const pos = new vs.Position(line, character);
        const selection = new vs.Selection(pos, currentChar);

        vs.window.activeTextEditor.edit((builder) => {
            builder.replace(selection, "");
        });
    }
}
