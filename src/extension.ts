import * as vscode from "vscode";
import * as path from "path";
import axios from "axios";

// Function to send selected text to ChatGPT API
async function generateCodeFromPseudocode(
  pseudocode: string,
  documentType?: string
): Promise<string> {
  if (!documentType) {
    const fileName = vscode.window.activeTextEditor?.document.fileName;
    const fileExtension = fileName ? path.extname(fileName).substr(1) : "";
    if (!fileExtension) {
      vscode.window.showErrorMessage("Document has no type!");
      return "";
    }
    documentType = fileExtension.toUpperCase();
  }

  const getAPI = vscode.workspace.getConfiguration().get("sodocode-ai.apiKey");
  const apiKey = `${getAPI}`;
  const prompt = `write this "${pseudocode}" to in ${documentType}`;
  const response = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const chatGptUrl = "https://api.openai.com/v1/completions";
  const params = {
    prompt: prompt,
    model: "code-davinci-002",
    max_tokens: 512,
    temperature: 0.5,
    n: 1,
    stop: "/n",
  };

  const code = await response
    .post(chatGptUrl, params)
    .then((result) => {
      return result.data.choices[0].text.replace("+", "");
    })
    .catch((err) => {
      if (!err.response.data.error.message) {
        vscode.window.showErrorMessage(
          "Error: " + "Something wrong or try again later!"
        );
        return "";
      }
      const message = err.response.data.error.message;
      vscode.window.showErrorMessage("Error: " + message);
      return "";
    });

  return code;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "extension.generateSodocodeai",
      async () => {
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

        const code = await generateCodeFromPseudocode(pseudocode);

        editor.edit((editBuilder) => {
          if (code != "") {
            editBuilder.replace(selection, code);
          }
        });
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
