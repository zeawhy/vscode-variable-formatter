import * as vscode from 'vscode';
import { VariableFormatter } from './variableFormatter.js';

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

    const formatToScreamingSnakeCase = vscode.commands.registerCommand('variable-formatter.formatToScreamingSnakeCase', () => {
        formatter.formatSelectedVariable('SCREAMING_SNAKE_CASE');
    });

    const formatVariable = vscode.commands.registerCommand('variable-formatter.formatVariable', async () => {
        const convention = await vscode.window.showQuickPick([
            { label: 'camelCase', description: 'Convert to camelCase (e.g., myVariable)' },
            { label: 'PascalCase', description: 'Convert to PascalCase (e.g., MyVariable)' },
            { label: 'snake_case', description: 'Convert to snake_case (e.g., my_variable)' },
            { label: 'kebab-case', description: 'Convert to kebab-case (e.g., my-variable)' },
            { label: 'SCREAMING_SNAKE_CASE', description: 'Convert to SCREAMING_SNAKE_CASE (e.g., MY_VARIABLE)' }
        ], {
            placeHolder: 'Select naming convention'
        });

        if (convention) {
            formatter.formatMultipleSelections(convention.label as any);
        }
    });

    const formatAllVariables = vscode.commands.registerCommand('variable-formatter.formatAllVariables', async () => {
        const convention = await vscode.window.showQuickPick([
            { label: 'camelCase', description: 'Convert all variables to camelCase' },
            { label: 'PascalCase', description: 'Convert all variables to PascalCase' },
            { label: 'snake_case', description: 'Convert all variables to snake_case' },
            { label: 'kebab-case', description: 'Convert all variables to kebab-case' },
            { label: 'SCREAMING_SNAKE_CASE', description: 'Convert all variables to SCREAMING_SNAKE_CASE' }
        ], {
            placeHolder: 'Select naming convention for all variables'
        });

        if (convention) {
            formatter.formatAllVariablesInFile(convention.label as any);
        }
    });

    // Register the preview command
    const previewFormattingCommand = vscode.commands.registerCommand('variable-formatter.previewFormatting', async () => {
        await formatter.previewVariableFormatting();
    });

    context.subscriptions.push(
        formatToCamelCase,
        formatToPascalCase,
        formatToSnakeCase,
        formatToKebabCase,
        formatToScreamingSnakeCase,
        formatVariable,
        formatAllVariables,
        previewFormattingCommand
    );

    // Show activation message
    vscode.window.showInformationMessage('Variable Formatter is now active!');
}

export function deactivate() {}