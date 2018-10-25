import * as vs from 'vscode';
import * as fs from 'fs';
import * as languages from './languages/export';
import { SyntaxTypes, CustomTypes } from './types';
import { CustomSyntax } from './syntax';



export class Format {
    private syntaxFile: string;
    private snippetConfig: any;
    private document: vs.TextDocument;
    private workShop: languages.WorkShop;
    private syntax: CustomSyntax;

    constructor(filePath: string, snippetConfig: any) {
        this.syntaxFile = fs.readFileSync(filePath, 'utf-8');
        this.snippetConfig = snippetConfig;
        this.document = vs.window.activeTextEditor.document;
        this.syntax = new CustomSyntax();
    }

    public createDoc(): void {
        let languageID = this.document.languageId;
        let docType = this.snippetConfig.docType;
        switch (languageID) {
            case 'ruby':
                this.workShop = new languages.Ruby(this.syntaxFile);
        }
        this.workShop.generate(docType, this.snippetConfig)
    }
}