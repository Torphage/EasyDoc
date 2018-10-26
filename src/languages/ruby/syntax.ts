import * as vs from 'vscode';
import { WorkShop } from '../workshop';
import { RubyParse } from './parse';
import { SyntaxVariable, CustomTypes } from '../../types';


export class Ruby extends WorkShop {
    protected parse: RubyParse;

    constructor(syntaxFile: string) {
        super(syntaxFile);
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
            "NAME": this.parse.parseName(this.block),
            "PARAMS": this.parse.parseParams(this.block)
        }
        return variables;
    }

    getCurrentColumn(index: number): number {
        let leftOfCurrentPos = this.syntaxFile.slice(0, index);
        let leftIndex = leftOfCurrentPos.lastIndexOf('\n');
        let currentColumn = leftOfCurrentPos.length - leftIndex;
        return currentColumn;
    }
}