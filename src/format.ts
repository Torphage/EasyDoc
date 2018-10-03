import * as vs from 'vscode';
import * as fs from 'fs';


class Format {
    filePath: string;
    fileRows: string[];
    docRows: string[];
    config: vs.WorkspaceConfiguration;
    
    constructor(filePath: string, config: vs.WorkspaceConfiguration) {
        this.filePath = filePath;
        this.fileRows = fs.readFileSync(filePath, 'utf-8').split('\n');
        this.docRows = [];
        this.config = vs.workspace.getConfiguration("EasyDoc");
    }

    public createDoc() {
        for (let index = 0; index < this.fileRows.length; index++) {
            let row = this.fileRows[index];
            
            if (!row.includes('$')) {
                this.docRows.push(row)
            }
        }
    }
}

export { Format }