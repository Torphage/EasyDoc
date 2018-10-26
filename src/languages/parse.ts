export abstract class BaseParse {

    public abstract parseBlock(rows: string[]): string[];
    public abstract parseName(rows: string[]): string;
    public abstract parseParams(row: string[]): string[];
}
