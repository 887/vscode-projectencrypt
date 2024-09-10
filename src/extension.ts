// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as encrypted from './encrypted_file';

//https://code.visualstudio.com/api/references/activation-events#onStartupFinished

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-projectencrypt" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-projectencrypt.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode ProjectEncrypt!');
	});

	context.subscriptions.push(disposable);

	// Register an event listener for when an editor is opened
	const editorOpenListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (editor) {
			// Your code to run when an editor is opened
			vscode.window.showInformationMessage(`Editor opened: ${editor.document.fileName}`);
		}
	});

	context.subscriptions.push(editorOpenListener);

	// Register an event listener for before a document is saved
	const documentWillSaveListener = vscode.workspace.onWillSaveTextDocument((event) => {
		// Your code to run before a document is saved
		vscode.window.showInformationMessage(`Document will be saved: ${event.document.fileName}`);
	});

	context.subscriptions.push(documentWillSaveListener);

	// Register an event listener for after a document is saved
	const documentDidSaveListener = vscode.workspace.onDidSaveTextDocument((document) => {
		// Your code to run after a document is saved
		vscode.window.showInformationMessage(`Document saved: ${document.fileName}`);
	});

	context.subscriptions.push(documentDidSaveListener);

	
}

// This method is called when your extension is deactivated
export function deactivate() {}
