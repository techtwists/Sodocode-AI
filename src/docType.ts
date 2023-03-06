// write a typesript return current open document path in vscode extention and export it
import * as vscode from 'vscode';
export function getCurrentDocumentPath(): string {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active');
        return;
    }
    if (!editor.document.fileName.endsWith('.ts')) {
        vscode.window.showInformationMessage('No TypeScript file is open');
        return;
    }
    let fullPath = editor.document.fileName;
    return fullPath;
}