export function copy(variable: any): any {
    let clone: any;

    if (typeof variable === "string") {
        clone = variable.split("").join("");
    } else {
        clone = Object.assign([], variable)
    }
    return clone;
}