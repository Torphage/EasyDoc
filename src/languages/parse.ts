import * as vs from 'vscode';


export abstract class BaseParse {
    constructor() { }

    abstract parseBlock(rows: string[]): string[];
    abstract parseName(rows: string[]): string;
    abstract parseParams(row: string[]): string[];
}