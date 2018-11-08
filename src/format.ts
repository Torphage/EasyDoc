import * as fs from "fs";
import * as vs from "vscode";
import * as languages from "./languages/export";

export class Format {
    private syntaxFile: string;
    private snippetConfig: any;
    private document: vs.TextDocument;
    private workShop: languages.WorkShop;

    constructor(filePath: string, snippetConfig: any) {
        this.syntaxFile = fs.readFileSync(filePath, "utf-8");
        this.snippetConfig = snippetConfig;
        this.document = vs.window.activeTextEditor.document;
    }

    public createDoc(): void {
        const languageID = this.document.languageId;
        const docType = this.snippetConfig.docType;

        switch (languageID) {
            case "ruby":
                this.workShop = new languages.Ruby(this.syntaxFile);
                break;

            case "python":
                this.workShop = new languages.Python(this.syntaxFile);
                break;

            case "haskell":
                this.workShop = new languages.Haskell(this.syntaxFile);
                break;
        }

        this.workShop.generate(docType, this.snippetConfig);
    }
}
