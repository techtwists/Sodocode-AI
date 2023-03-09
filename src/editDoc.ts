import { stringify } from "querystring";
import * as vscode from "vscode";
import { codeAI } from "./cleanCode";

export async function editDone() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No editor is active");
    return;
  }

  const selection = editor.selection;
  const pseudocode = editor.document.getText(selection);
  if (pseudocode == "") {
    vscode.window.showErrorMessage("Selected text empty!");
    return;
  }
  const getCode = await codeAI();
  const getTypeSpeed = vscode.workspace.getConfiguration().get("sodocode-ai.typeSpeed") as number;
  let typeSpeed =0 ;
  if(getTypeSpeed <=0){
    typeSpeed =0
  }else if(getTypeSpeed >= 100){
    typeSpeed =100
  }else{
    typeSpeed = getTypeSpeed;
  }

  for (let i = 0; i < getCode.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, typeSpeed));
    const insertChatater = getCode[i];
    const lastLine = editor.document.lineCount - 1;
    const lastPosition = editor.document.lineAt(lastLine).range.end;
    await editor.edit((editBuilder) => {
      editBuilder.insert(lastPosition, insertChatater);
    });
  }
}
