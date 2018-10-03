import * as vs from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Format } from './format';


class EasyDoc {
    config: vs.WorkspaceConfiguration;
    document: vs.TextEditor;
    dir: string;

    constructor() {
        this.config = vs.workspace.getConfiguration('EasyDoc');
        this.document = vs.window.activeTextEditor;
        this.dir = vs.extensions.getExtension('Torphage.easydoc').extensionPath;
    }
    
    public checkDoc() {
        let customFiles = this.dirSync(this.dir + '/templates');
        customFiles.forEach(fileName => {
            let packageFiles = this.getPackageJSON().contributes.configuration.properties;
            if (!('EasyDoc.' + fileName in packageFiles)) {
                this.writeConfig(fileName)
            }
            let fileConfig: any = this.config.get(fileName);
            let triggerText = fileConfig.triggerString;
            if (this.getEditorText(triggerText) === triggerText) {
                console.log(triggerText);
                let filePath = path.join(this.dir + '/templates', fileName + '.txt');
                let format = new Format(filePath, fileConfig);
                format.createDoc();
            }
        });
    }

    // https://gist.github.com/kethinov/6658166
    private dirSync(dir: string): string[] {
        let filelist = [];
        fs.readdirSync(dir).forEach(file => {
            const dirFile = path.join(dir, file);
            if (dirFile.includes('.')) filelist = [...filelist, path.basename(dirFile, '.txt')]
        });
        return filelist;
    }

    private getPackageJSON(): any {
        let json = JSON.parse(fs.readFileSync(this.dir + '/package.json', 'utf-8'));
        return json;
    }

    private writeConfig(fileName) {
        let packageJSON = this.getPackageJSON();
        packageJSON.contributes.configuration.properties['EasyDoc.' + fileName] = {
            "type": "object",
            "default": {
                "triggerString": "$$$",
                "docType": "function"
            }
        };

        fs.writeFile(this.dir + '/package.json', JSON.stringify(packageJSON, null, 4), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }

    private getEditorText(triggerText: string): string {
        let cursorPostition = this.document.selection.active;
        let cursorLine = this.document.document.lineAt(cursorPostition['line']);
        let search = cursorLine['text'].substring(cursorPostition['character'] - triggerText.length, cursorPostition['character']);
        return search;
    }
}


export { EasyDoc }