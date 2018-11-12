import * as fs from "fs";
import * as path from "path";
import * as vs from "vscode";
import { Format } from "./format";

class EasyDoc {
    private config: vs.WorkspaceConfiguration;
    private document: vs.TextEditor;
    private dir: string;

    constructor() {
        this.config = vs.workspace.getConfiguration("EasyDoc");
        this.document = vs.window.activeTextEditor;
        this.dir = vs.extensions.getExtension("Torphage.easydoc").extensionPath;
    }

    // Checks whenever the triggertext
    public checkDoc(onEnter): void {
        const packageFiles = this.getPackageJSON().contributes.configuration.properties;
        console.log(packageFiles)
        const syntaxDir: string[] = packageFiles["EasyDoc.dir"].default;

        let cancel: boolean;

        for (const dir of syntaxDir) {

            let dirPath: string;

            if (dir.startsWith("./")) {
                dirPath = `${this.dir}${dir.slice(1)}`;
            } else {
                dirPath = dir;
            }

            const customFiles = this.dirSync(dirPath);

            for (const fileName of customFiles) {
                const configName = `EasyDoc.${fileName}`;

                if (!(configName in packageFiles)) {
                    this.addConfig(fileName);
                }

                const fileConfig: any = this.config.get(fileName);
                const triggerText = fileConfig.triggerString;

                if ((this.getEditorText(triggerText) === triggerText)) {
                    const filePath = `${dirPath}/${fileName}.txt`;

                    const format = new Format(filePath, fileConfig);
                    format.createDoc();

                    cancel = true;
                    break;
                }
            }

            if (cancel) {
                break;
            }
        }
    }

    // https://gist.github.com/kethinov/6658166
    private dirSync(dir: string): string[] {
        let filelist = [];

        fs.readdirSync(dir).forEach((file) => {
            const dirFile = path.join(dir, file);

            if (dirFile.includes(".")) {
                filelist = [...filelist, path.basename(dirFile, ".txt")];
            }
        });

        return filelist;
    }

    private getPackageJSON(): any {
        const json = JSON.parse(fs.readFileSync(`${this.dir}/package.json`, "utf-8"));

        return json;
    }

    // Dynamically adds configuration to the package.json, only do this to be able
    // to add configurations to the vscode config file instead of having my own
    private addConfig(fileName): void {
        const packageJSON = this.getPackageJSON();

        packageJSON.contributes.configuration.properties["EasyDoc." + fileName] = {
            default: {
                commentAboveTarget: false,
                docType: "function",
                triggerString: "$$$",
            },
            type: "object",
        };

        fs.writeFile(this.dir + "/package.json", JSON.stringify(packageJSON, null, 4), (err) => {
            if (err) {
                return;
            }
        });
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

export { EasyDoc };
