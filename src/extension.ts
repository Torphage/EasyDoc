/**
 * The entry point of the extension. vscode will look here for when to start the
 * extension. Activasion events are also handled here.
 */

/**
 * EasyDoc.
 */
"use strict";
import * as vs from "vscode";
import { EasyDoc } from "./easydoc";

/**
 * The entry point of the extension. The command "extension.EasyDoc" and onDidChangeTextDocument
 * are added as subscriptions to the extension via the context sent as an argument.
 *
 * @export
 * @param {vs.ExtensionContext} context A collection of utilities private to the extension.
 * This parameter must be provided as the first parameter to the activate-call in order for the extension to work.
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
 * Read the chenges to the text document and determines if Enter was pressed by checking if a newline was added.
 *
 * @param {vs.TextDocumentChangeEvent} event The text document change event. All the changes to the document
 * are stored here.
 * @returns {boolean} If true if Enter was pressed, otherwise false.
 */
function generateOnEnter(event: vs.TextDocumentChangeEvent): boolean {
    if (vs.window.activeTextEditor.document !== event.document) { return; }
    if (event.contentChanges[0].rangeLength !== 0) { return; }

    if (event.contentChanges[0].text.replace(/ |\t|\r/g, "") === "\n") {
        return true;
    }

    return false;
}
