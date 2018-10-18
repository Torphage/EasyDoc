import * as vs from 'vscode';
import { WorkShop } from '../workshop';
import { RubyParse } from './parse';
import { stringify } from 'querystring';

export class Ruby extends WorkShop {
    protected parse: RubyParse;

    constructor() {
        super();
        this.parse = new RubyParse();
    }

    getFunctionLine(row: string): number {
        if (this.config.commentAboveTarget) {
            let functionLine = this.position.line + 1;
            return functionLine;
        } else {
            let functionLine = this.position.line - 1;
            return functionLine;
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

    getBlock(rows: string[]): string[] {
        let blockStarts = [
            'begin',
            'def',
            'if',
            'case',
            'unless',
            'do',
            'class',
            'module',
        ];
        let numOfBlocks = 0;
        let functionRows: Array<string> = [];
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < blockStarts.length; j++) {
                let matchBlockStart = new RegExp("^\\s*" + blockStarts[j] + "\\s").test(rows[i]);
                let matchEnd = new RegExp("^\\s*end").test(rows[i]);
                if (matchBlockStart) {
                    numOfBlocks++;
                    break;
                }
                if (matchEnd) {
                    numOfBlocks--;
                    break;
                }
            }
            functionRows.push(rows[i]);
            if (numOfBlocks === 0) {
                break;
            }    
        }
        return functionRows;
    }
}