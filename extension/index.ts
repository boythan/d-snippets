import * as vscode from "vscode";

const snippets = require("../snippets/snippets.json");
const tsSnippets = require("../snippets/ts-snippets.json");
const jsSnippets = require("../snippets/js-snippets.json");
const dCompSnippets = require("../snippets/d-component-snippets.json");

type Snippet = {
  body: Array<string> | string;
  description: string;
  prefix: Array<string> | string;
};

const convertSnippetArrayToString = (snippetArray: Array<string>): string =>
  snippetArray.join("\n");

export function activate(context: vscode.ExtensionContext) {
  const {
    commands: { registerCommand },
    window: { showQuickPick, activeTextEditor },
  } = vscode;

  const disposable = registerCommand("extension.dSnippetSearch", async () => {
    const reactSnippets = Object.entries(snippets as Array<Snippet>);
    const typescriptSnippets = Object.entries(tsSnippets as Array<Snippet>);
    const javascriptSnippets = Object.entries(jsSnippets as Array<Snippet>);
    const dComponentSnippets = Object.entries(dCompSnippets as Array<Snippet>);
    const snippetsArray: Array<[string, Snippet]> = reactSnippets
      .concat(typescriptSnippets)
      .concat(dComponentSnippets)
      .concat(javascriptSnippets);

    const items = snippetsArray.map(
      ([shortDescription, { prefix, body, description }], index) => {
        const value = typeof prefix === "string" ? prefix : prefix[0];

        return {
          id: index,
          description: description || shortDescription,
          label: value,
          value,
          body,
        };
      }
    );

    const options = {
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: "Search snippet",
    };

    const snippet = (await showQuickPick(items, options)) || {
      body: "",
    };

    const body =
      typeof snippet.body === "string"
        ? snippet.body
        : convertSnippetArrayToString(snippet.body);

    if (activeTextEditor) {
      activeTextEditor.insertSnippet(new vscode.SnippetString(body));
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
