'use strict';
import * as vs from 'vscode';
import { EasyDoc } from './easydoc';


export function activate(context: vs.ExtensionContext) {
    context.subscriptions.push(
        vs.commands.registerCommand('extension.EasyDoc', () => {
            vs.window.showInformationMessage('EasyDoc is active!');
            let easydoc = new EasyDoc();
            easydoc.createDoc()
        })
    )
}

export function deactivate() {
}