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
}