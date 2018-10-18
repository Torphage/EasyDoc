import * as vs from 'vscode';
import * as fs from 'fs';


export abstract class WorkShop {
    protected document: vs.TextDocument;
    protected position: vs.Position;
    protected config: any;
    protected parse: any;
    
    constructor() {
        this.document = vs.window.activeTextEditor.document;
        this.position = vs.window.activeTextEditor.selection.active;
    }

    public generate(customTypes: any, docType: any, config: any): void {
        this.config = config;
        let documentPath = this.document.fileName;
        let documentRows = fs.readFileSync(documentPath, 'utf-8');
        switch (docType) {
            case 'function':
                this.generateFunction(documentRows);
        }
    }

    private generateFunction(docRows: string): void {
        let functionLine = this.getFunctionLine(docRows);
        let functionLineString = docRows.split('\n').splice(functionLine)
        let correctlyPlacedFunction = this.correctlyPlacedFunction(functionLineString[0]);
        if (!correctlyPlacedFunction) {
            return;
        }
        let block = this.getBlock(functionLineString);
        console.log(block);
        let rows = this.parse.parseFunction(docRows, functionLine);
        let params = this.parse.parseParams(rows);
    }

    abstract getFunctionLine(row: string): number;
    abstract correctlyPlacedFunction(row: string): boolean;
    abstract getBlock(rows: string[]): string[];
}