import * as fs from "fs";
import * as vs from "vscode";
import regexFile from "../config/languages";
import { ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";
import { ErrorHandler, Placeholder, Repeater, Variable } from "../syntaxTypes/export";

export abstract class WorkShop {
    protected syntaxFile: string;
    protected config: any;
    protected vars: ISyntaxVariable;
    protected parse: any;

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

    public async generate(docType: any, config: any, onEnter: boolean): Promise<void> {
        this.config = config;

        switch (docType) {
            case "block":
                this.generateFunction(onEnter, false);
                break;

            case "function":
                this.setCodeBlock(onEnter);
                this.vars = await this.getVariables();

                this.generateFunction(onEnter, true);
                break;
        }
    }

    protected abstract getCurrentColumn(index: number): number;
    protected abstract getVariables(): Promise<ISyntaxVariable>;
    protected abstract correctlyPlacedFunction(row: string): boolean;

    protected getComment(variable: string): string {
        let commentString: string;

        if (this.constructor.name in regexFile) {
            commentString = regexFile[this.constructor.name].syntax.comment[variable];
        } else {
            commentString = "";
        }

        return commentString;
    }

    private async generateFunction(onEnter: boolean, strictPlace: boolean): Promise<void> {
        const errorHandler = new ErrorHandler(this.vars);
        const variable = new Variable(this.vars);
        const repeater = new Repeater(this.vars);
        const placeholder = new Placeholder();

        const cleanText = errorHandler.handle(this.syntaxFile);
        const varSnippet = variable.generate(cleanText);
        const repSnippet = repeater.generate(varSnippet);
        const placeSnippet = placeholder.generate(repSnippet);

        if (onEnter && placeSnippet.value.length !== 0) {
            await this.delTriggerString();
        }

        if (!this.config.commentAboveTarget) {
            for (let i = 0; i < this.parse.blockStartIndex; i++) {
                await this.stepDownInEditor();
            }
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

    private getFunctionStartLine(rows: string, onEnter: boolean): string[] {
        let functionLineIndex: number;

        if (!onEnter) {
            functionLineIndex = this.position.line;
        } else if (this.config.commentAboveTarget) {
            functionLineIndex = this.position.line + 1;
        } else {
            functionLineIndex = this.position.line - 1;
        }

        const functionLineString = rows.split("\n").splice(functionLineIndex);

        return functionLineString;
    }

    private setCodeBlock(onEnter: boolean): void {
        const functionLineString = this.getFunctionStartLine(this.docRows, onEnter);
        const correctlyPlacedFunction = this.correctlyPlacedFunction(functionLineString[0]);

        if (!correctlyPlacedFunction) {
            return;
        }

        this.block = this.parse.parseBlock(functionLineString);
    }

    private delTriggerString(): Promise<Thenable<{}>|undefined> {
        const character = this.config.triggerString.length;

        const currentPosition = vs.window.activeTextEditor.selection.active;

        const pos = new vs.Position(this.position.line, this.position.character - character);
        const range = new vs.Range(pos, currentPosition);

        return new Promise((resolve, reject) => {
            resolve(
                this.editor.edit((builder: vs.TextEditorEdit) => {
                    builder.delete(range);
                }),
            );
            reject(undefined);
        });
    }
}
