/**
 * The Workshop, where all the functions is called from after the requirements have been met.
 */

/**
 * EasyDoc.
 */
import * as fs from "fs";
import * as vs from "vscode";
import regexFile from "../config/languages";
import { IDefaultObject, ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";
import { ErrorHandler, Placeholder, Repeater, Variable } from "../syntaxTypes/export";

/**
 * Class that handles most functions besides after requirements from EasyDoc class have been met.
 *
 * @export
 * @abstract
 * @class WorkShop
 */
export abstract class WorkShop {

    /**
     * The template file text.
     *
     * @protected
     * @type {string}
     * @memberof WorkShop
     */
    protected syntaxFile: string;

    /**
     * The configuration of the template file in use.
     *
     * @protected
     * @type {IDefaultObject}
     * @memberof WorkShop
     */
    protected config: IDefaultObject;

    /**
     * The available variables.
     *
     * @protected
     * @type {ISyntaxVariable}
     * @memberof WorkShop
     */
    protected vars: ISyntaxVariable;

    /**
     * The parser that corresponds the the current class.
     *
     * @protected
     * @type {*}
     * @memberof WorkShop
     */
    protected parse: any;

    /**
     * The active text editor document..
     *
     * @protected
     * @type {vs.TextDocument}
     * @memberof WorkShop
     */
    protected document: vs.TextDocument = vs.window.activeTextEditor.document;

    /**
     * The cursor's current position within the [[WorkShop.document]]
     *
     * @protected
     * @type {vs.Position}
     * @memberof WorkShop
     */
    protected position: vs.Position = vs.window.activeTextEditor.selection.active;

    /**
     * The wanted block from the parser.
     *
     * @protected
     * @type {string[]}
     * @memberof WorkShop
     */
    protected block: string[] = [];

    /**
     * The active text editor.
     *
     * @protected
     * @type {vs.TextEditor}
     * @memberof WorkShop
     */
    protected editor: vs.TextEditor = vs.window.activeTextEditor;

    /**
     * The document rows.
     *
     * @protected
     * @type {string}
     * @memberof WorkShop
     */
    protected docRows: string;

    /**
     * Creates an instance of WorkShop.
     *
     * @param {string} syntaxFile The template file of what to generate documentation
     * dynamically from.
     * @memberof WorkShop
     */
    constructor(syntaxFile: string) {
        this.syntaxFile = syntaxFile;
        this.docRows = fs.readFileSync(this.document.fileName, "utf-8");
    }

    /**
     * Start generateFunction, run different functions based on docType.
     *
     * @param {string} docType The type of documentation to make.
     * @param {*} config The configuration for this specific documentation.
     * @param {boolean} onEnter If enter activated the extension.
     * @returns {Promise<void>} Promise to return a void.
     * @memberof WorkShop
     */
    public async generate(docType: string, config: any, onEnter: boolean): Promise<void> {
        this.config = config;

        switch (docType) {
            case "block":
                this.generateFunction(onEnter, false);
                break;

            case "function":
            const functionLineIndex = this.getFunctionStartLine(onEnter);

            this.setCodeBlock(functionLineIndex);
            this.vars = await this.getVariables(functionLineIndex);

            this.generateFunction(onEnter, true);
            break;
        }
    }

    /**
     * Get the variables based on the language.
     *
     * @protected
     * @abstract
     * @param {number} index The start index of the function.
     * @returns {Promise<ISyntaxVariable>} An promise to return the variables.
     * @memberof WorkShop
     */
    protected abstract getVariables(index: number): Promise<ISyntaxVariable>;

    /**
     * Check if the cursor is correctly placed in the function.
     *
     * @protected
     * @abstract
     * @param {string} functionLineIndex The row to search on.
     * @returns {boolean} If cursor is correctly placed.
     * @memberof WorkShop
     */
    protected abstract correctlyPlacedFunction(functionLineIndex: string): boolean;

    /**
     * Get the comment based on the language and the variable wanted.
     *
     * @protected
     * @param {string} variable What comment wanted.
     * @returns {string | undefined} The comment string.
     * @memberof WorkShop
     */
    protected getComment(variable: string): string | undefined {
        if (this.constructor.name in regexFile) {
            const commentString: string = regexFile[this.constructor.name].syntax.comment[variable];
            return commentString.replace(/\\(.)/g, "$1");
        } else {
            return undefined;
        }
    }

    /**
     * Get the current column in the editor
     *
     * @protected
     * @param {number} index The line index.
     * @returns {number} The column the user is positioned at.
     * @memberof WorkShop
     */
    protected getCurrentColumn(index: number): number {
        const leftOfCurrentPos = this.syntaxFile.slice(0, index);
        const leftIndex = leftOfCurrentPos.lastIndexOf("\n");
        const currentColumn = leftOfCurrentPos.length - leftIndex;
        return currentColumn;
    }

    /**
     * Converts the template file to its correct values, then move
     * cursor to correct place. Then continue to insert the documentation.
     *
     * @private
     * @param {boolean} onEnter If extension was activated by pressing Enter.
     * @param {boolean} strictPlace If should place strictly, basically if it should
     * insert directly at the cursor's position.
     * @returns {Promise<void>} Promises a void.
     * @memberof WorkShop
     */
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

        if (this.config.docType !== "block") {
            if (!this.config.commentAboveTarget) {
                for (let i = 0; i < this.parse.blockStartIndex; i++) {
                    await this.stepDownInEditor();
                }
            }
        }

        const functionLineString = this.getFunctionStartLine(onEnter);

        if (strictPlace) {
            const blockAndBelowString = this.docRows.split("\n").splice(functionLineString);
            if (blockAndBelowString.length === this.docRows.split("\n").splice(this.position.line).length) {
                await this.waitForInsertLine();
            }
        }

        this.editor.insertSnippet(placeSnippet);
    }

    /**
     * Insert a line and wait for it.
     *
     * @private
     * @returns {(Promise<Thenable<{}>|undefined>)} A promise.
     * @memberof WorkShop
     */
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

    /**
     * Move down cursor in editor and wait for it.
     *
     * @private
     * @returns {(Promise<Thenable<{}>|undefined>)} A promise.
     * @memberof WorkShop
     */
    private stepDownInEditor(): Promise<Thenable<{}>|undefined> {
        return new Promise((resolve, reject) => {
            resolve(vs.commands.executeCommand("cursorDown"));
            reject(undefined);
        });
    }

    /**
     * Get all the rows after function start line.
     *
     * @private
     * @param {boolean} onEnter If extension was activated by pressing enter.
     * @returns {number} The index of the function's start line.
     * @memberof WorkShop
     */
    private getFunctionStartLine(onEnter: boolean): number {
        let functionLineIndex: number;

        if (!onEnter) {
            functionLineIndex = this.position.line;
        } else if (this.config.commentAboveTarget) {
            functionLineIndex = this.position.line + 1;
        } else {
            functionLineIndex = this.position.line - 1;
        }

        return functionLineIndex;
    }

    /**
     * Set the code block.
     *
     * @private
     * @param {number} functionLineIndex The start index of the function.
     * @memberof WorkShop
     */
    private setCodeBlock(functionLineIndex: number): void {
        const blockAndBelowString = this.docRows.slice().split("\n").splice(functionLineIndex);
        const correctlyPlacedFunction = this.correctlyPlacedFunction(blockAndBelowString[0]);

        if (!correctlyPlacedFunction) {
            return;
        }

        this.block = this.parse.parseBlock(blockAndBelowString);
    }

    /**
     * Delete the triggerText string.
     *
     * @private
     * @returns {(Promise<Thenable<{}>|undefined>)} A promise.
     * @memberof WorkShop
     */
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
