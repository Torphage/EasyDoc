/**
 * Handle if the requierments for running EasyDoc are met.
 *
 * The UI for the dropdown menu is created here and the corrections in EasyDoc's configurations
 * are also called from this file. The directories for the templates are also read as to check
 * if the requirements for running continuing the program are met..
 */

 /**
  * EasyDoc.
  */
import * as path from "path";
import * as vs from "vscode";
import { Config } from "./config";
import { Format } from "./format";
import { IDefaultObject } from "./interfaces";

/**
 * Make the call to start the program on the correct template file. The template files are read
 * from the specified directories and handled accordingly. Also calls the [[Config]] file to make
 * sure the configurations are handled when needed.
 *
 * @export
 * @class EasyDoc
 */
export class EasyDoc {

    /**
     * The configurations for EasyDoc found by vscode settings.
     *
     * @private
     * @type {vs.WorkspaceConfiguration}
     * @memberof EasyDoc
     */
    private config: vs.WorkspaceConfiguration;

    /**
     * The active text editor.
     *
     * @private
     * @type {vs.TextEditor}
     * @memberof EasyDoc
     */
    private document: vs.TextEditor;

    /**
     * The absolute directory of where the extension is installed.
     *
     * @private
     * @type {string}
     * @memberof EasyDoc
     */
    private dir: string;

    /**
     * Creates an instance of EasyDoc.
     *
     * @memberof EasyDoc
     */
    constructor() {
        this.config = vs.workspace.getConfiguration("EasyDoc");
        this.document = vs.window.activeTextEditor;
        this.dir = vs.extensions.getExtension("Torphage.easydoc").extensionPath;
    }

    /**
     * Handle if the activation was made by a command or by pressing Enter. Should make sure the correct
     * template file is activated and initialize [[Format]] with the specified arguments for the template file.
     *
     * @param {boolean} onEnter A boolean value if the extension was triggered by pressing Enter.
     * @returns {Promise<void>} void.
     * @memberof EasyDoc
     */
    public async checkDoc(onEnter: boolean): Promise<void> {
        /**
         * The directories where the template files should be read from.
         */
        const syntaxDir: string[] = this.config.dir;

        const config = new Config();
        config.removeConfigWithRemovalOfFile(syntaxDir);

        /**
         * If the extension was trigged by a command
         */
        if (!onEnter) {

            const choice = await this.quickPick(config);

            const fileName = choice.split("    ")[0];
            const dirPath = choice.split("    ")[1];
            const filePath = path.join(dirPath, `${fileName}.txt`);

            const fileConfig = this.fixConfig(config, fileName);

            const format = new Format(filePath, fileConfig, onEnter);
            format.createDoc();

            return;
        }

        /**
         * If the extension was trigged by pressing Enter.
         */
        for (const dir of syntaxDir) {
            let dirPath: string;

            if (dir.startsWith("./")) {
                dirPath = `${this.dir}${dir.slice(1)}`;
            } else {
                dirPath = dir;
            }

            const customFiles = config.dirSync(dirPath);

            for (const fileName of customFiles) {

                const fileConfig = this.fixConfig(config, fileName);

                const triggerText = fileConfig.triggerString;

                if ((this.getTextBeforeCursor(triggerText) === triggerText)) {
                    const filePath = path.join(dirPath, `${fileName}.txt`);

                    const format = new Format(filePath, fileConfig, onEnter);
                    format.createDoc();

                    return;
                }
            }
        }
    }

    /**
     * Add, update and remove values from the configurations when needed to.
     *
     * @private
     * @param {Config} config The local package.json as an object, used to get the configurations.
     * @param {string} fileName The filename of the configuration that is handled.
     * @returns {IDefaultObject} The configurations for the template file. Will return the package.json
     * if configuration was just created, will return the vscode configuration otherwise.
     * @memberof EasyDoc
     */
    private fixConfig(config: Config, fileName: string): IDefaultObject {
        const extensionPackage = config.packageFiles.contributes.configuration.properties;

        const configName = `EasyDoc.${fileName}`;

        if (!(configName in extensionPackage)) {
            config.addConfig(configName);
        }

        const missingKeys = config.getMissingKeys(configName);

        if (missingKeys) {
            config.addMissingKeys(configName, missingKeys);
        }

        let fileConfig: any;

        fileConfig = vs.workspace.getConfiguration("EasyDoc").get(fileName);

        if (fileConfig === undefined) {
            fileConfig = extensionPackage[configName].default;
        }

        return fileConfig;
    }

    /**
     * Initialize and show a QuickPick menu. This QuickPick will
     * show different files withing the dir attribute of config.
     *
     * @private
     * @param {Config} config he configuration of EasyDoc.
     * @returns {Thenable<string>} A promise that resolves to the selection.
     * @memberof EasyDoc
     */
    private quickPick(config: Config): Thenable<string> {
        const items = this.getAllItems(config);
        const pick = vs.window.showQuickPick(items);
        return pick;
    }

    /**
     * Get every file's name and diretory inside a given dir based on the configuration.
     *
     * @private
     * @param {Config} config The configuration of EasyDoc.
     * @returns {string[]} List of file's name and directory.
     * @memberof EasyDoc
     */
    private getAllItems(config: Config): string[] {
        const items: string[] = [];

        for (const dir of this.config.dir) {
            let dirPath: string;

            if (dir.startsWith("./")) {
                dirPath = `${this.dir}${dir.slice(1)}`;
            } else {
                dirPath = dir;
            }

            const customFiles = config.dirSync(dirPath);

            for (const fileName of customFiles) {
                items.push(`${fileName}    ${dirPath}`);
            }
        }

        return items;
    }

    /**
     * Get the text of the editor in front of the cursor, with the length of the triggerText.
     *
     * @private
     * @param {string} triggerText The text that the length of the result will be.
     * @returns {string} A string before the cursor with the length of triggerText..
     * @memberof EasyDoc
     */
    private getTextBeforeCursor(triggerText: string): string {
        const cursorPostition = this.document.selection.active;
        const cursorLine = this.document.document.lineAt(cursorPostition.line);

        const search = cursorLine.text.substring(
            cursorPostition.character - triggerText.length, cursorPostition.character,
        );

        return search;
    }
}
