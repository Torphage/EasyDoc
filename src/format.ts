import * as fs from "fs";
import * as vs from "vscode";
import * as languages from "./languages/export";

export class Format {
    private syntaxFile: string;
    private snippetConfig: any;
    private onEnter: boolean;
    private document: vs.TextDocument;
    private workShop: languages.WorkShop;

    constructor(filePath: string, snippetConfig: any, onEnter: boolean) {
        this.syntaxFile = fs.readFileSync(filePath, "utf-8");
        this.snippetConfig = snippetConfig;
        this.onEnter = onEnter;
        this.document = vs.window.activeTextEditor.document;
    }

    public createDoc(): void {
        const languageID = this.document.languageId;
        const docType = this.snippetConfig.docType;

        switch (languageID) {
            case "cpp":
                this.workShop = new languages.Cpp(this.syntaxFile);
                break;

            case "haskell":
                this.workShop = new languages.Haskell(this.syntaxFile);
                break;

            case "javascript":
                this.workShop = new languages.Javascript(this.syntaxFile);
                break;

            case "python":
                this.workShop = new languages.Python(this.syntaxFile);
                break;

            case "ruby":
                this.workShop = new languages.Ruby(this.syntaxFile);
                break;

            case "typescript":
                this.workShop = new languages.Typescript(this.syntaxFile);
                break;

            default:
                this.workShop = new languages.Base(this.syntaxFile);
                break;
        }

        this.workShop.generate(docType, this.snippetConfig, this.onEnter);
    }
}
