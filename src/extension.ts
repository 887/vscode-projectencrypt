// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as encrypted from './encrypted_file';

//https://code.visualstudio.com/api/references/activation-events#onStartupFinished

//todo: 
//use bcrypt for the master password, save the bcrypt params in the settings
//https://en.wikipedia.org/wiki/Bcrypt

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-projectencrypt" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// Command to create a header
	const createHeaderDisposable = vscode.commands.registerCommand('vscode-projectencrypt.createHeader', () => {
		vscode.window.showInformationMessage('Hello World from vscode ProjectEncrypt!');
	});
	context.subscriptions.push(createHeaderDisposable);

	// Command to create an encryption key
	const createEncryptionKeyDisposable = vscode.commands.registerCommand('vscode-projectencrypt.createEncryptionKey', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Encryption Key Created!');
	});
	context.subscriptions.push(createEncryptionKeyDisposable);

	// Command to display the encryption key
	const displayEncryptionKeyDisposable = vscode.commands.registerCommand('vscode-projectencrypt.displayEncryptionKey', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Encryption Key: [Your Key Here]');
	});
	context.subscriptions.push(displayEncryptionKeyDisposable);

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

	// Create a configuration section for the extension
	const config = vscode.workspace.getConfiguration('vscode-projectencrypt');

	// Function to update the configuration
	function updateConfig(key: string, value: any) {
		config.update(key, value, vscode.ConfigurationTarget.Global)
			.then(() => {
				vscode.window.showInformationMessage(`Configuration updated: ${key} = ${value}`);
			}, (error) => {
				vscode.window.showErrorMessage(`Error updating configuration: ${error}`);
			});
	}

	function validateKeyValuePairs() {
		const config = vscode.workspace.getConfiguration('vscode-projectencrypt');
		const keys = Object.keys(config);
		for (const key of keys) {
			const value = config.get(key);
			// Add your validation logic here
			if (typeof value !== 'string' || value.trim() === '') {
				vscode.window.showErrorMessage(`Invalid configuration: ${key} must be a non-empty string`);
				return false;
			}
		}
		vscode.window.showInformationMessage('All configuration key-value pairs are valid.');
		return true;
	}

	function editKeyValuePairs() {
		const config = vscode.workspace.getConfiguration('vscode-projectencrypt');
		const keys = Object.keys(config);
		for (const key of keys) {
			const value = config.get(key);
			// Add your validation logic here
			if (typeof value !== 'string' || value.trim() === '') {
				vscode.window.showErrorMessage(`Invalid configuration: ${key} must be a non-empty string`);
				return false;
			}
		}
		vscode.window.showInformationMessage('All configuration key-value pairs are valid.');
		return true;
	}

	// Register the onSave method
	vscode.workspace.onWillSaveTextDocument((event) => {
		if (!validateKeyValuePairs()) {
			event.waitUntil(Promise.reject(new Error('Invalid configuration key-value pairs')));
		}
	});

	// Register the onEdit method
	vscode.workspace.onDidChangeTextDocument((event) => {
		if (!editKeyValuePairs()) {
			vscode.window.showErrorMessage('Invalid configuration key-value pairs');
		}
	});

	// Register the beforeEdit method
	vscode.workspace.onWillSaveTextDocument((event) => {
		if (!modifyKeyValuePairsBeforeEdit()) {
			event.waitUntil(Promise.reject(new Error('Invalid configuration key-value pairs before edit')));
		}
	});

	function modifyKeyValuePairsBeforeEdit() {
		const config = vscode.workspace.getConfiguration('vscode-projectencrypt');
		const keys = Object.keys(config);
		for (const key of keys) {
			const value = config.get(key);
			// Add your modification logic here
			if (typeof value !== 'string' || value.trim() === '') {
				vscode.window.showErrorMessage(`Invalid configuration: ${key} must be a non-empty string`);
				return false;
			}
			// Example modification: append a suffix to each value
			config.update(key, `${value}_modified`, vscode.ConfigurationTarget.Global);
		}
		vscode.window.showInformationMessage('Configuration key-value pairs modified before edit.');
		return true;
	}

	// Register the onSave method
	vscode.workspace.onWillSaveTextDocument((event) => {
		if (!validateKeyValuePairs()) {
			event.waitUntil(Promise.reject(new Error('Invalid configuration key-value pairs')));
		}
	});

	// Example usage: update a configuration setting
	updateConfig('exampleKey', 'exampleValue');

	// Register configuration settings
	vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('vscode-projectencrypt')) {
			const updatedConfig = vscode.workspace.getConfiguration('vscode-projectencrypt');
			vscode.window.showInformationMessage(`Configuration changed: ${JSON.stringify(updatedConfig)}`);
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
