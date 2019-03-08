import * as vs from "vscode";

export class ContextKey {
    private name: string;
    private lastValue: boolean;

    constructor(name: string) {
        this.name = name;
    }

    public set(value: boolean): void {
        if (this.lastValue === value) {
            return;
        }
        this.lastValue = value;
        vs.commands.executeCommand("setContext", this.name, this.lastValue);
    }
}
