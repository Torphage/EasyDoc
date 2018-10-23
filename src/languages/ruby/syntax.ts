import * as vs from 'vscode';
import { WorkShop } from '../workshop';
import { RubyParse } from './parse';
import { SyntaxVariable, CustomTypes } from '../../types';


export class Ruby extends WorkShop {
    protected parse: RubyParse;

    constructor(syntaxFile: string, customTypes: CustomTypes) {
        super(syntaxFile, customTypes);
        this.parse = new RubyParse();
    }

    getFunctionLines(rows: string): string[] {
        if (this.config.commentAboveTarget) {
            let functionLine = this.position.line + 1;
            let functionLineString = rows.split('\n').splice(functionLine);
            return functionLineString;
        } else {
            let functionLine = this.position.line - 1;
            let functionLineString = rows.split('\n').splice(functionLine);
            return functionLineString;
        }
    }
    
    correctlyPlacedFunction(functionLine: string): boolean {
        let regex = /^\s*def\s/g;
        if (regex.exec(functionLine) !== null) {
            return true;
        } else {
            return false;
        }
    }

    getVariables(): SyntaxVariable {
        let variables: SyntaxVariable = {
            "args.var": this.parse.parseParams(this.block)
        }
        return variables;
    }

    getCurrentLine(syntaxText: string, index: number): string {
        let leftOfCurrentPos = syntaxText.slice(0, index);
        let leftIndex = leftOfCurrentPos.lastIndexOf('\n');

        let rightOfCurrentPos = syntaxText.slice(index);
        let rightIndex = rightOfCurrentPos.indexOf('\n');
        
        if (rightIndex !== -1) {
            let fullLine = syntaxText.substring(leftIndex, leftOfCurrentPos.length + rightIndex);
            return fullLine.trim();
        } else {
            let fullLine = syntaxText.substring(leftOfCurrentPos.length + 2);
            return fullLine.trim();
        }
    }

    getCurrentColumn(index: number): number {
        let leftOfCurrentPos = this.syntaxFile.slice(0, index);
        let leftIndex = leftOfCurrentPos.lastIndexOf('\n');
        let currentColumn = leftOfCurrentPos.length - leftIndex;
        return currentColumn;
    }
}