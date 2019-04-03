/**
 * The start point of the extension.
 */
"use strict";
import * as vs from "vscode";
import { EasyDoc } from "./easydoc";

/**
 * Is called on activasion of the extension.
 *
 * @export
 * @param {vs.ExtensionContext} context The extension context.
 */
export function activate(context: vs.ExtensionContext): void {
    context.subscriptions.push(
        vs.commands.registerCommand("extension.EasyDoc", () => {
            const easydoc = new EasyDoc();
            easydoc.checkDoc(false);
        }),
        vs.workspace.onDidChangeTextDocument((event) => {
            if (generateOnEnter(event)) {
                const easydoc = new EasyDoc();
                easydoc.checkDoc(true);
            }
        }),
    );
}

/**
 * Detect if Enter was pressed.
 *
 * @param {vs.TextDocumentChangeEvent} event The text document change event, is
 * read to see if a new line was detected.
 * @returns {boolean} Returns if Enter was pressed.
 */
function generateOnEnter(event: vs.TextDocumentChangeEvent): boolean {
    if (vs.window.activeTextEditor.document !== event.document) { return; }
    if (event.contentChanges[0].rangeLength !== 0) { return; }

    if (event.contentChanges[0].text.replace(/ |\t|\r/g, "") === "\n") {
        return true;
    }

    return false;
}
