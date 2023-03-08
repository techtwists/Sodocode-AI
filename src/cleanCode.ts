import * as vscode from "vscode";
import { generateCodeFromPseudocode } from "./openai";

export async function codeAI():Promise<string>{
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No editor is active");
    return '';
  }

  const selection = editor.selection;
  const pseudocode = editor.document.getText(selection);
  if (pseudocode == "") {
    vscode.window.showErrorMessage("Selected text empty!");
    return '';
  }

  const getCode = await generateCodeFromPseudocode(pseudocode);
  const codeclean1 = getCode.replace(/&lt;/g, "<");
  const codeclean2 = codeclean1.replace(/&gt;/g, ">");
  const codeclean3 = codeclean2.replace(/\r\n\r\n/g, "\n");
  const code = codeclean3.replace(/\r\n/g, "\n");

  return code;
}
