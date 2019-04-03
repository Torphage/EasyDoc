/**
 * Handles everything about EasyDoc's configurations.
 */
import * as fs from "fs";
import * as path from "path";
import * as vs from "vscode";

/**
 * Handle the configuration. Reading the configurations files, add configurations,
 * updates configurations, etc.
 *
 * @export
 * @class Config
 */
export class Config {
    public config = vs.workspace.getConfiguration("EasyDoc");
    public dir = vs.extensions.getExtension("Torphage.easydoc").extensionPath;
    public packageFiles = this.getPackageJSON();

    /**
     * Get list of files in a given directory. Source was found on https://gist.github.com/kethinov/6658166
     *
     * @param {string} dir The directory to search for files in.
     * @returns {string[]} An array of files within gthe given directory.
     * @memberof Config
     */
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

    /**
     * Get the package.json as object. Used to get the configurations stored here.
     *
     * @returns {*} Package.json as an object.
     * @memberof Config
     */
    public getPackageJSON(): any {
        const json = JSON.parse(fs.readFileSync(`${this.dir}/package.json`, "utf-8"));

        return json;
    }

    /**
     * Dynamically adds configuration to the package.json, only do this to be able
     * to add configurations to the vscode config file instead of having my own.
     *
     * @param {*} configName The name of the configuration to be added.
     * @memberof Config
     */
    public addConfig(configName: any): void {
        this.packageFiles.contributes.configuration.properties[configName] = {
            type: "object",
            default: {
                alignIndentation: true,
                commentAboveTarget: false,
                docType: "function",
                triggerString: "$$$",
            },
        };

        fs.writeFile(this.dir + "/package.json", JSON.stringify(this.packageFiles, null, 4), (err) => {
            if (err) {
                return;
            }
        });
    }

    /**
     * Get keys not found in the current configurations that should be added.
     *
     * @param {string} fileConfig The configuration name that should get its keys up to date.
     * @returns {any[]} A list of missing keys.
     * @memberof Config
     */
    public getMissingKeys(fileConfig: string): any[] {
        const ConfigKeys: any = {
            alignIndentation: true,
            commentAboveTarget: false,
            docType: "function",
            triggerString: "$$$",
        };

        const missingKeys = [];

        const config = this.packageFiles.contributes.configuration.properties[fileConfig].default;
        for (const key in ConfigKeys) {
            if (!(Object.keys(config).includes(key))) {
                missingKeys.push({
                    keyName: key,
                    keyValue: ConfigKeys[key],
                });
            }
        }

        return missingKeys;
    }

    /**
     * Add the missing keys to a specific configuration.
     *
     * @param {*} fileConfig The configuration that keys should be added into.
     * @param {any[]} missingKeys The keys that should be added.
     * @memberof Config
     */
    public addMissingKeys(fileConfig: any, missingKeys: any[]): void {
        for (const key of missingKeys) {
            this.packageFiles.contributes.configuration.properties[fileConfig].default[key.keyName] = key.keyValue;
        }

        this.writeToPackage();
    }

    /**
     * If a file have been removed, remove the configuration inside package.json to avoid storing unused configuratios.
     *
     * @param {string[]} syntaxDir The directories where the template filse is located.
     * @memberof Config
     */
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

    /**
     * Get all the files withing multiple directories. Some custom checks have been added.
     *
     * @param {string} dirs The directories to search in.
     * @returns {string[]} A list of all total files within the directories.
     * @memberof Config
     */
    public allFilesInDirs(dirs: string[]): string[] {
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

    /**
     * Update package.json with the locally changed package.json object.
     *
     * @memberof Config
     */
    public writeToPackage(): void {
        fs.writeFile(this.dir + "/package.json", JSON.stringify(this.packageFiles, null, 4), (err) => {
            if (err) {
                return;
            }
        });
    }
}
