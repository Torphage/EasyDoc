import { ISyntaxType, ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";

export class ErrorHandler {
    private customTypes = new CustomSyntax();

    private vars: ISyntaxVariable;

    constructor(vars: ISyntaxVariable) {
        this.vars = vars;
    }

    public handle(text: string): string {
        let block: ISyntaxType;

        do {
            block = this.getErrorBlocks(text)[0];
            if (block === undefined) { break; }

            const variables = this.customTypes.getSyntax(block.text, "variables");
            let generateBlock = true;

            const beforeBlock = text.substr(0, block.start);
            const actualBlock = block.text.slice(2, -2);
            const afterBlock = text.substr(block.start + block.length);

            for (const variable of variables) {
                const varName = this.getVarName(variable.text);
                if (this.vars[varName] !== undefined) { continue; }

                if (["PARAMS", "PARAMS_TEMPLATE"].includes(varName)) {
                    text = `${beforeBlock}${afterBlock}`;
                    generateBlock = false;
                    break;
                }
            }
            if (generateBlock) {
                text = `${beforeBlock}${actualBlock}${afterBlock}`;
            }
        } while (true);

        return text;
    }

    private getErrorBlocks(text: string): ISyntaxType[] {
        const regex = /\$\|((.|\s)*?\|\$)/g;
        const match = this.customTypes.matchRegex(text, regex);

        return match;
    }

    private getVarName(variable: string): string {
        const splitted = variable.slice(2, -1).split(".")[0].split("(");

        return splitted[splitted.length - 1].split(")")[0].replace(/\)/, "");
    }
}
