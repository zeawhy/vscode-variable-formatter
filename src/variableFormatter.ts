import * as vscode from 'vscode';

export type NamingConvention = 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case';

export class VariableFormatter {
    private readonly variableRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    private readonly wordSeparators = /[_\-\s]+/;

    /**
     * Format the currently selected variable in the active editor
     */
    public async formatSelectedVariable(convention: NamingConvention): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
            vscode.window.showErrorMessage('Please select a variable name to format');
            return;
        }

        // Validate if the selected text is a valid variable name
        if (!this.isValidVariableName(selectedText)) {
            vscode.window.showErrorMessage('Selected text is not a valid variable name');
            return;
        }

        const formattedVariable = this.convertToConvention(selectedText, convention);
        
        if (formattedVariable === selectedText) {
            vscode.window.showInformationMessage(`Variable is already in ${convention} format`);
            return;
        }

        // Replace the selected text with the formatted variable
        await editor.edit(editBuilder => {
            editBuilder.replace(selection, formattedVariable);
        });

        vscode.window.showInformationMessage(`Variable formatted to ${convention}: ${formattedVariable}`);
    }

    /**
     * Check if a string is a valid variable name
     */
    private isValidVariableName(text: string): boolean {
        return this.variableRegex.test(text.trim());
    }

    /**
     * Convert a variable name to the specified naming convention
     */
    private convertToConvention(variableName: string, convention: NamingConvention): string {
        const words = this.extractWords(variableName);
        
        switch (convention) {
            case 'camelCase':
                return this.toCamelCase(words);
            case 'PascalCase':
                return this.toPascalCase(words);
            case 'snake_case':
                return this.toSnakeCase(words);
            case 'kebab-case':
                return this.toKebabCase(words);
            default:
                return variableName;
        }
    }

    /**
     * Extract words from a variable name (handles camelCase, PascalCase, snake_case, kebab-case)
     */
    private extractWords(variableName: string): string[] {
        // First, split by common separators (underscore, hyphen, space)
        let words = variableName.split(this.wordSeparators).filter(word => word.length > 0);
        
        // Then, split camelCase and PascalCase
        const result: string[] = [];
        for (const word of words) {
            const camelCaseWords = this.splitCamelCase(word);
            result.push(...camelCaseWords);
        }
        
        return result.map(word => word.toLowerCase());
    }

    /**
     * Split camelCase or PascalCase words
     */
    private splitCamelCase(word: string): string[] {
        // Split on uppercase letters, but keep consecutive uppercase letters together
        const matches = word.match(/[A-Z]*[a-z]+|[A-Z]+(?=[A-Z][a-z]|\b)|[A-Z](?=[a-z])|[a-z]+|[0-9]+/g);
        return matches || [word];
    }

    /**
     * Convert words to camelCase
     */
    private toCamelCase(words: string[]): string {
        if (words.length === 0) return '';
        
        const firstWord = words[0].toLowerCase();
        const restWords = words.slice(1).map(word => this.capitalize(word));
        
        return firstWord + restWords.join('');
    }

    /**
     * Convert words to PascalCase
     */
    private toPascalCase(words: string[]): string {
        return words.map(word => this.capitalize(word)).join('');
    }

    /**
     * Convert words to snake_case
     */
    private toSnakeCase(words: string[]): string {
        return words.map(word => word.toLowerCase()).join('_');
    }

    /**
     * Convert words to kebab-case
     */
    private toKebabCase(words: string[]): string {
        return words.map(word => word.toLowerCase()).join('-');
    }

    /**
     * Capitalize the first letter of a word
     */
    private capitalize(word: string): string {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    /**
     * Get the recommended naming convention for a given language
     */
    public getRecommendedConvention(languageId: string): NamingConvention {
        const conventionMap: { [key: string]: NamingConvention } = {
            'javascript': 'camelCase',
            'typescript': 'camelCase',
            'java': 'camelCase',
            'csharp': 'PascalCase',
            'python': 'snake_case',
            'rust': 'snake_case',
            'c': 'snake_case',
            'cpp': 'snake_case',
            'css': 'kebab-case',
            'scss': 'kebab-case',
            'less': 'kebab-case',
            'html': 'kebab-case'
        };

        return conventionMap[languageId] || 'camelCase';
    }
}