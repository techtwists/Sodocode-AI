import * as vscode from "vscode";
import { editDone} from "./editDoc";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "extension.generateSodocodeai",
      async () => {
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title:'Sodocode AI',
          cancellable:false
        },async(progress, token)=>{
          progress.report({message: "Generating..."});
          await editDone();
        })
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
