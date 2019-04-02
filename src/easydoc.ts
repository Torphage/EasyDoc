import * as path from "path";
import * as vs from "vscode";
import { Config } from "./config";
import { Format } from "./format";

export class EasyDoc {
    private config: vs.WorkspaceConfiguration;
    private document: vs.TextEditor;
    private dir: string;

    constructor() {
        this.config = vs.workspace.getConfiguration("EasyDoc");
        this.document = vs.window.activeTextEditor;
        this.dir = vs.extensions.getExtension("Torphage.easydoc").extensionPath;
    }

    // Checks whenever the triggertext
    public async checkDoc(onEnter: boolean): Promise<any> {
        const syntaxDir: string[] = this.config.dir;

        const config = new Config();
        config.removeConfigWithRemovalOfFile(syntaxDir);

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

                if ((this.getEditorText(triggerText) === triggerText)) {
                    const filePath = path.join(dirPath, `${fileName}.txt`);

                    const format = new Format(filePath, fileConfig, onEnter);
                    format.createDoc();

                    return;
                }
            }
        }
    }

    private fixConfig(config: any, fileName: string): any {
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
     * Initialize and shows a QuickPick menu. This QuickPick will
     * show different files withing the dir attribute of config.
     * @param {Config} config he configuration of EasyDoc.
     * @returns {Thenable<string>} A promise that resolves to the selection.
     */
    private quickPick(config: Config): Thenable<string> {
        const items = this.getAllItems(config);
        const pick = vs.window.showQuickPick(items);
        return pick;
    }

    /**
     * Get every file's name and diretory inside a given dir based on the configuration.
     * @param {Config} config The configuration of EasyDoc.
     * @returns {string[]} List of file's name and directory.
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
     * @param {string} triggerText The text that the length of the result will be.
     * @returns {string} A string before the cursor with the length of triggerText..
     */
    private getEditorText(triggerText: string): string {
        const cursorPostition = this.document.selection.active;
        const cursorLine = this.document.document.lineAt(cursorPostition.line);

        const search = cursorLine.text.substring(
            cursorPostition.character - triggerText.length, cursorPostition.character,
        );

        return search;
    }
}
