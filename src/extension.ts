"use strict";
import * as vs from "vscode";
import { EasyDoc } from "./easydoc";

export function activate(context: vs.ExtensionContext) {
    context.subscriptions.push(
        vs.commands.registerCommand("extension.EasyDoc", () => {
            vs.window.showInformationMessage("EasyDoc is active!");
            const easydoc = new EasyDoc();
            easydoc.checkDoc();
        }),
    );
}
