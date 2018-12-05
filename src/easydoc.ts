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
    public async checkDoc(onEnter): Promise<any> {
        const syntaxDir: string[] = this.config.dir;

        const config = new Config();
        config.removeConfigWithRemovalOfFile(syntaxDir);

        if (!onEnter) {
            const choice = await this.quickPick(config);
            const fileConfig: any = this.config.get(choice.split("    ")[0]);

            const filePath = path.join(choice.split("    ")[1], `${choice.split("    ")[0]}.txt`);
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

                const localPackage = config.packageFiles.contributes.configuration.properties;
                const extensionName = `EasyDoc.${fileName}`;
                const fileConfig: any = this.config.get(fileName);

                if (!(extensionName in localPackage)) {
                    config.addConfig(localPackage[extensionName]);
                }

                const missingKeys = config.getMissingKeys(localPackage[extensionName]);

                if (missingKeys) {
                    config.addMissingKeys(localPackage[extensionName], missingKeys);
                }

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

    private async quickPick(config: Config) {
        const items = await this.getAllItems(config);
        const pick = await vs.window.showQuickPick(items);
        return pick;
    }

    private async getAllItems(config: Config): Promise<string[]> {
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

    private getEditorText(triggerText: string): string {
        const cursorPostition = this.document.selection.active;
        const cursorLine = this.document.document.lineAt(cursorPostition.line);

        const search = cursorLine.text.substring(
            cursorPostition.character - triggerText.length, cursorPostition.character,
        );

        return search;
    }
}
