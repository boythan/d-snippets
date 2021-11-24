"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const snippets = require("../snippets/snippets.json");
const tsSnippets = require("../snippets/ts-snippets.json");
const jsSnippets = require("../snippets/js-snippets.json");
const dCompSnippets = require("../snippets/d-component-snippets.json");
const convertSnippetArrayToString = (snippetArray) => snippetArray.join("\n");
function activate(context) {
    const { commands: { registerCommand }, window: { showQuickPick, activeTextEditor }, } = vscode;
    const disposable = registerCommand("extension.dSnippetSearch", async () => {
        const reactSnippets = Object.entries(snippets);
        const typescriptSnippets = Object.entries(tsSnippets);
        const javascriptSnippets = Object.entries(jsSnippets);
        const dComponentSnippets = Object.entries(dCompSnippets);
        const snippetsArray = reactSnippets
            .concat(typescriptSnippets)
            .concat(dComponentSnippets)
            .concat(javascriptSnippets);
        const items = snippetsArray.map(([shortDescription, { prefix, body, description }], index) => {
            const value = typeof prefix === "string" ? prefix : prefix[0];
            return {
                id: index,
                description: description || shortDescription,
                label: value,
                value,
                body,
            };
        });
        const options = {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: "Search snippet",
        };
        const snippet = (await showQuickPick(items, options)) || {
            body: "",
        };
        const body = typeof snippet.body === "string"
            ? snippet.body
            : convertSnippetArrayToString(snippet.body);
        if (activeTextEditor) {
            activeTextEditor.insertSnippet(new vscode.SnippetString(body));
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map