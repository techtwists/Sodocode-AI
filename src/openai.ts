import * as vscode from "vscode";
import * as path from "path";
import axios from "axios";

export async function generateCodeFromPseudocode(
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
  const getTemp = vscode.workspace.getConfiguration().get("sodocode-ai.temperature");
  const temp = getTemp;
  const getToken = vscode.workspace.getConfiguration().get("sodocode-ai.maxToken");
  const token = getToken;
  const prompt = `${pseudocode}`;
  const response = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const model = [
    "code-davinci-002",
  ];
  const chatGptUrl = "https://api.openai.com/v1/completions";
  const params = {
    model: model[0],
    prompt: prompt,
    temperature: temp,
    max_tokens: token,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["//","</code>","#","/*","<!--"],
  };

  const code = await response
    .post(chatGptUrl, params)
    .then((result) => {
      return result.data.choices[0].text;
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
