import * as vscode from 'vscode';
import { VariableFormatter } from './variableFormatter';

export function activate(context: vscode.ExtensionContext) {
    const formatter = new VariableFormatter();

    // Register commands
    const formatToCamelCase = vscode.commands.registerCommand('variable-formatter.formatToCamelCase', () => {
        formatter.formatSelectedVariable('camelCase');
    });

    const formatToPascalCase = vscode.commands.registerCommand('variable-formatter.formatToPascalCase', () => {
        formatter.formatSelectedVariable('PascalCase');
    });

    const formatToSnakeCase = vscode.commands.registerCommand('variable-formatter.formatToSnakeCase', () => {
        formatter.formatSelectedVariable('snake_case');
    });

    const formatToKebabCase = vscode.commands.registerCommand('variable-formatter.formatToKebabCase', () => {
        formatter.formatSelectedVariable('kebab-case');
    });

    const formatVariable = vscode.commands.registerCommand('variable-formatter.formatVariable', async () => {
        const convention = await vscode.window.showQuickPick([
            { label: 'camelCase', description: 'Convert to camelCase (e.g., myVariable)' },
            { label: 'PascalCase', description: 'Convert to PascalCase (e.g., MyVariable)' },
            { label: 'snake_case', description: 'Convert to snake_case (e.g., my_variable)' },
            { label: 'kebab-case', description: 'Convert to kebab-case (e.g., my-variable)' }
        ], {
            placeHolder: 'Select naming convention'
        });

        if (convention) {
            formatter.formatSelectedVariable(convention.label as any);
        }
    });

    context.subscriptions.push(
        formatToCamelCase,
        formatToPascalCase,
        formatToSnakeCase,
        formatToKebabCase,
        formatVariable
    );

    // Show activation message
    vscode.window.showInformationMessage('Variable Formatter is now active!');
}

export function deactivate() {}