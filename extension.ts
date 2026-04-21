import * as vscode from 'vscode';
import { parseJsonToAsserts } from './src/converter';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.hurlConverterJsonToAssert', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor - open a .hurl file first');
      return;
    }

    const input = await vscode.window.showInputBox({
      prompt: 'Paste JSON here',
      placeHolder: '{"key": "value"}',
    });

    if (!input || input.trim() === '') {
      return;
    }

    try {
      const output = parseJsonToAsserts(input);
      const position = editor.selection.active;
      await editor.edit((editBuilder) => {
        editBuilder.insert(position, output);
      });
      vscode.window.showInformationMessage('Asserts generated!');
    } catch (error) {
      vscode.window.showErrorMessage(`Invalid JSON: ${(error as Error).message}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}