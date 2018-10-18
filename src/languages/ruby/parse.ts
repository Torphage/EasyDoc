import { BaseParse } from '../parse';


export class RubyParse extends BaseParse {
    private blockStarts: string[];
    
    constructor() {
        super();
        this.blockStarts = [
            'begin',
            'def',
            'if',
            'case',
            'unless',
            'do',
            'class',
            'module'
        ];
    }

    parseBlock(rows: string[]): string[] {
        let numOfBlocks = 0;
        let functionRows: Array<string> = [];
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < this.blockStarts.length; j++) {
                let matchBlockStart = new RegExp("^\\s*" + this.blockStarts[j] + "\\s").test(rows[i]);
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

    parseName(rows: string[]): string {
        let row = rows[0];
        for (let i = 0; i < this.blockStarts.length; i++) {
            let regex = new RegExp("^\\s*" + this.blockStarts[i] + "\\s(\\w*)");
            let match = regex.exec(row);
            if (match !== null) {
                return match[1];
            }
        }
    }

    parseParams(rows: string[]): string[] {
        let regex = new RegExp(/(?:class|def)\s\w*(?:\(|\s)(?!\()([^\)]+)*/, 'g');
        let match = regex.exec(rows[0])[1];
        let params = match.replace(/\s/g, '').split(',');
        return params;
    }
}