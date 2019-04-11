/**
 * Handles everything about EasyDoc's configurations, both the ones found by vscode and
 * the ones found in package.json.
 */

 /**
  * EasyDoc.
  */
import * as fs from "fs";
import * as path from "path";
import * as vs from "vscode";
import { IPackage } from "./interfaces";

/**
 * Handle the configuration. This includes reading the configurations files, add configurations,
 * update configurations, removing old configurations and etc.
 *
 * @export
 * @class Config
 */
export class Config {

    /**
     * The configurations for EasyDoc found by vscode settings.
     */
    public config = vs.workspace.getConfiguration("EasyDoc");

    /**
     * The absolute directory of where the extension is installed.
     */
    public dir = vs.extensions.getExtension("Torphage.easydoc").extensionPath;

    /**
     * The configurations for EasyDoc found in package.json.
     */
    public packageFiles: IPackage;

    /**
     * Creates an instance of Config.
     *
     * @memberof Config
     */
    constructor() {
        this.getPackageJSON();
    }

    /**
     * Get the array of files found within a directory with the file extension ".txt".
     *
     * @param {string} dir The directory to search in.
     * @returns {string[]} The files within the directory.
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
     * Read the `package.json` file and stores it in [[Config.packageFiles]].
     *
     * @memberof Config
     */
    public getPackageJSON(): void {
        const json: IPackage = JSON.parse(fs.readFileSync(`${this.dir}/package.json`, "utf-8"));

        this.packageFiles = json;
    }

    /**
     * Dynamically add configurationa to the package.json, only do this to be able
     * to add configurations to the vscode config file instead of having my own.
     *
     * @param {string} configName The name of the configuration to be added.
     * @memberof Config
     */
    public addConfig(configName: string): void {
        this.packageFiles.contributes.configuration.properties[configName] = {
            type: "object",
            default: {
                commentAboveTarget: false,
                docType: "function",
                triggerString: "$$$",
            },
        };

        this.writeToPackage();
    }

    /**
     * Get keys not found in the current configurations that should be added.
     *
     * @param {string} fileConfig The configuration name that should get its keys up to date.
     * @returns {Array<{ keyName: string, keyValue: string }>} A list of missing keys.
     * @memberof Config
     */
    public getMissingKeys(fileConfig: string): Array<{ keyName: string, keyValue: string }> {
        const ConfigKeys: any = {
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
     * @param {string} fileConfig The configuration that keys should be added into.
     * @param {Array<{ keyName: string, keyValue: string }>} missingKeys The keys that should be added.
     * @memberof Config
     */
    public addMissingKeys(fileConfig: string, missingKeys: Array<{ keyName: string, keyValue: string }>): void {
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
        const configs = this.packageFiles.contributes.configuration.properties;

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
        fs.writeFileSync(this.dir + "/package.json", JSON.stringify(this.packageFiles, null, 4));

        this.getPackageJSON();
    }
}
