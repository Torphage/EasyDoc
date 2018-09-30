import * as vs from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


class EasyDoc {
    config: any;

    constructor() {
        this.config = vs.workspace.getConfiguration('autoDocstring');
    }

    public createDoc() {
        let dir = vs.extensions.getExtension('Torphage.easydoc').extensionPath + '/templates';

        let customFiles = this.dirSync(dir);
        console.log(customFiles);   
    }

    // https://gist.github.com/kethinov/6658166
    private dirSync(dir, filelist = []) {
        fs.readdirSync(dir).forEach(file => {
            const dirFile = path.join(dir, file);
            if (dirFile.includes('.')) filelist = [...filelist, path.basename(dirFile)]
        });
        return filelist;
    }
}


export { EasyDoc }