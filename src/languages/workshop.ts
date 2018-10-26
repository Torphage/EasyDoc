import * as vs from 'vscode';
import * as fs from 'fs';
import { SyntaxVariable, DocumentationParts } from '../types';
import { CustomSyntax } from '../syntax';
import { Placeholder, Repeater, Variable } from '../syntaxTypes/export';



export abstract class WorkShop {
    protected syntaxFile: string;
    protected document: vs.TextDocument;
    protected position: vs.Position;
    protected config: any;
    protected parse: any;
    protected snippet: vs.SnippetString;
    protected block: string[];
    protected vars: SyntaxVariable;
    protected placeholderIndex: number;
    protected customTypes: CustomSyntax;
    protected placeholder: Placeholder;
    protected repeater: Repeater;
    protected variable: Variable;

    constructor(syntaxFile: string) {
        this.syntaxFile = syntaxFile;
        this.document = vs.window.activeTextEditor.document;
        this.position = vs.window.activeTextEditor.selection.active;
        this.block = [];
        this.placeholderIndex = 1;
        this.customTypes = new CustomSyntax()
        this.placeholder = new Placeholder()
        this.repeater = new Repeater()
    }
    
    public generate(docType: any, config: any): void {
        this.config = config;
        let documentRows = fs.readFileSync(this.document.fileName, 'utf-8');
        this.getDocParts(documentRows);
        this.vars = this.getVariables();
        this.variable = new Variable(this.vars);
        switch (docType) {
            case 'function':
                this.generateFunction(this.syntaxFile);
        }
    }

    private generateFunction(text: string): void {
        let snippet = this.repeater.applyType(text);
        snippet = this.variable.applyType(snippet.value);
        snippet = this.placeholder.applyType(snippet.value);

        let editor = vs.window.activeTextEditor;
        let line = this.position.line;
        let character = this.position.character - this.config.triggerString.length;
        let pos = new vs.Position(line, character);
        let selection = new vs.Selection(pos, this.position);
        vs.window.activeTextEditor.edit(builder => {
            builder.replace(selection, '')
        });

        editor.insertSnippet(snippet);
    }

    private getDocParts(docRows: string): DocumentationParts {
        let functionLineString = this.getFunctionLines(docRows);
        let correctlyPlacedFunction = this.correctlyPlacedFunction(functionLineString[0]);

        if (!correctlyPlacedFunction) {
            return;
        }
        this.block = this.parse.parseBlock(functionLineString);

        let parts = {
            name: this.parse.parseName(this.block),
            params: this.parse.parseParams(this.block),
        }
        return parts;
    }

    abstract getCurrentColumn(index: number): number;
    abstract getVariables(): SyntaxVariable;
    abstract getFunctionLines(row: string): string[];
    abstract correctlyPlacedFunction(row: string): boolean;
}