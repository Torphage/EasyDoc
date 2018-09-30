import * as vs from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


class EasyDoc {
    config: any;
    document: vs.TextDocument;

    constructor() {
        this.config = vs.workspace.getConfiguration("EasyDoc");
        this.document = vs.window.activeTextEditor.document;
    }

    public createDoc() {
        let dir = vs.extensions.getExtension('Torphage.easydoc').extensionPath + '/templates';
        let customFiles = this.dirSync(dir);
        customFiles.forEach(files => {
            let trigger = this.config.get(files)
            this.getEditorText(3);
            // if (trigger.length) {
                
            // }
        });
        console.log(customFiles);  
    }

    // https://gist.github.com/kethinov/6658166
    private dirSync(dir, filelist = []) {
        fs.readdirSync(dir).forEach(file => {
            const dirFile = path.join(dir, file);
            if (dirFile.includes('.')) filelist = [...filelist, path.basename(dirFile, '.txt')]
        });
        return filelist;
    }

    private getEditorText(length: number) {
        let regex = new RegExp('(\###)')
        let test = this.document.getWordRangeAtPosition(this.document.positionAt(2), regex);
        console.log(test);
        // this.document.getText(3)
    }
}


export { EasyDoc }