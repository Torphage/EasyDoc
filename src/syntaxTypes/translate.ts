export class VariableTranslator {
    private text: string;
    private varName: string;
    private varValue: string;

    constructor(text: string, varName: string, varValue: any) {
        this.text = text.replace(/(\s)/g, "");
        this.varName = varName;
        this.varValue = varValue;
    }

    public translate(): any {
        let advancedSyntax: RegExpMatchArray;
        let varName = this.copy(this.varValue);
        let text: string = this.copy(this.text);

        do {
            advancedSyntax = this.isAdvancedSyntax(text);

            if (advancedSyntax === null) {
                break;
            }

            const splitted = text.split(this.varName);

            if (splitted[1][0] === ".") {
                const regex = /^\.\w*/g;
                const property = splitted[1].match(regex)[0].slice(1);

                varName = this.handleProperty(property, varName);

                text = text.replace(`${this.varName}.${property}`, this.varName);
            }
            if (splitted[1][0] === ")") {
                const func = this.text.substring(
                    splitted[0].slice(0, -1).lastIndexOf("(") + 1, splitted[1].indexOf(")") + splitted[0].length - 1);

                varName = this.handleFunction(func, varName);

                text = text.replace(`${func}(${this.varName})`, this.varName);
            }
        } while (advancedSyntax);

        return varName;
    }

    private isAdvancedSyntax(text: string): RegExpMatchArray {
        const regex = /([.()])/g;
        const result = text.match(regex);

        return result;
    }

    private handleFunction(func: string, value: any): any {
        let returnValue: any = value;

        if (value.constructor === Array) {
            switch (func) {
                case "reverse":
                    returnValue = value.reverse();
                    break;

                case "align":
                    const maxValue = Math.max(...(value.map((el) => el.length)));
                    const temp = [...value].map((n) => maxValue - n.length);
                    returnValue = [];
                    temp.forEach((n) => {
                        returnValue.push(" ".repeat(n));
                    });
                    break;
            }
        } else {
            switch (func) {
                case "reverse":
                    returnValue = value.split("").reverse().join("");
                    break;
            }
        }

        return returnValue;
    }

    private handleProperty(prop: string, value: any): any {
        let returnValue: any;

        if (value.constructor === Array) {
            switch (prop) {
                case "length":
                    returnValue = value.length;
                    break;

                case "each_length":
                    returnValue = [...value].map((n) => n.length);
                    break;
            }
        } else {
            switch (prop) {
                case "length":
                    returnValue = String(value.length);
                    console.log(value)
                    console.log(returnValue)
                    break;
            }
        }

        return returnValue;
    }

    private copy(variable: any): any {
        let clone: any;

        if (typeof variable === "string") {
            clone = variable.split("").join("");
        } else {
            clone = Object.assign([], variable)
        }
        return clone;
    }
}
