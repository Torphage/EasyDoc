import { IParams } from "../interfaces";

export abstract class BaseParse {
    public blockStartIndex: number = 0;

    public abstract parseBlock(rows: string[]): string[];
    public abstract parseName(rows: string[]): string;
    public abstract parseParams(row: string[]): IParams;
}
