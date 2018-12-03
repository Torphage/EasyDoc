import * as fs from "fs";
import * as path from "path";
import * as vs from "vscode";

export class Config {
    public config = vs.workspace.getConfiguration("EasyDoc");
    public dir = vs.extensions.getExtension("Torphage.easydoc").extensionPath;
    public packageFiles = this.getPackageJSON();

    // https://gist.github.com/kethinov/6658166
    public dirSync(dir: string): string[] {
        let filelist = [];

        fs.readdirSync(dir).forEach((file) => {
            const dirFile = path.join(dir, file);

            if (dirFile.includes(".")) {
                filelist = [...filelist, path.basename(dirFile, ".txt")];
            }
        });

        return filelist;
    }

    public getPackageJSON(): any {
        const json = JSON.parse(fs.readFileSync(`${this.dir}/package.json`, "utf-8"));

        return json;
    }

    // Dynamically adds configuration to the package.json, only do this to be able
    // to add configurations to the vscode config file instead of having my own
    public addConfig(config: any, fileName: string): void {
        const packageJSON = this.getPackageJSON();

        config = {
            default: {
                alignIndentation: true,
                commentAboveTarget: false,
                docType: "function",
                triggerString: "$$$",
            },
            type: "object",
        };

        fs.writeFile(this.dir + "/package.json", JSON.stringify(this.packageFiles, null, 4), (err) => {
            if (err) {
                return;
            }
        });
    }

    public getMissingKeys(fileConfig: any): string[] {
        const ConfigKeys: any = {
            alignIndentation: true,
            commentAboveTarget: false,
            docType: "function",
            triggerString: "$$$",
        };

        const missingKeys = [];

        for (const key in ConfigKeys) {
            if (!(Object.keys(fileConfig.default).includes(key))) {
                missingKeys.push({
                    keyName: key,
                    keyValue: ConfigKeys[key],
                });
            }
        }

        return missingKeys;
    }

    public addMissingKeys(fileConfig: any, missingKeys: any[]): void {
        for (const key of missingKeys) {
            fileConfig.default[key.keyName] = key.keyValue;
        }

        this.writeToPackage();
    }

    public removeConfigWithRemovalOfFile(syntaxDir: string[]): void {
        const packageJSON = this.getPackageJSON();
        const configs = packageJSON.contributes.configuration.properties;

        const allFiles = this.allFilesInDirs(syntaxDir);

        for (const key in configs) {
            if (!(allFiles.includes(key.replace("EasyDoc.", ""))) && key !== "EasyDoc.dir") {
                delete configs[key];
            }
        }

        this.writeToPackage();
    }

    public allFilesInDirs(dirs: string[]) {
        const allFiles: string[] = [];

        for (const dir of dirs) {
            let dirPath: string;

            if (dir.startsWith("./")) {
                dirPath = `${this.dir}${dir.slice(1)}`;
            } else {
                dirPath = dir;
            }

            const customFiles = this.dirSync(dirPath);

            for (const fileName of customFiles) {

                allFiles.push(fileName);
            }
        }

        return allFiles;
    }

    public writeToPackage(): void {
        fs.writeFile(this.dir + "/package.json", JSON.stringify(this.packageFiles, null, 4), (err) => {
            if (err) {
                return;
            }
        });
    }
}
