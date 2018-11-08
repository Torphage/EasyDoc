"use strict";
import * as vs from "vscode";
import { EasyDoc } from "./easydoc";

export function activate(context: vs.ExtensionContext) {
    context.subscriptions.push(
        vs.commands.registerCommand("extension.EasyDoc", () => {
            const easydoc = new EasyDoc();
            easydoc.checkDoc(false);
        }),
    );

    context.subscriptions.push(
        vs.workspace.onDidChangeTextDocument(
            (event) => {
                if (generateOnEnter(event)) {
                    const easydoc = new EasyDoc();
                    easydoc.checkDoc(true);
                }
            },
        ),
    );
}

function generateOnEnter(event: vs.TextDocumentChangeEvent): boolean {
    if (event.contentChanges[0].text.replace(/ |\t|\r/g, "\n")) {
        return true;
    }

    return false;
}
