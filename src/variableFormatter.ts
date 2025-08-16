import * as vscode from 'vscode';

export type NamingConvention = 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'SCREAMING_SNAKE_CASE';

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
     * Preview variable formatting with before/after comparison
     */
    public async previewVariableFormatting(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
            vscode.window.showErrorMessage('Please select a variable name to preview formatting');
            return;
        }

        // Validate if the selected text is a valid variable name
        if (!this.isValidVariableName(selectedText)) {
            vscode.window.showErrorMessage('Selected text is not a valid variable name');
            return;
        }

        // Generate all possible conversions
        const conversions = {
            'camelCase': this.convertToConvention(selectedText, 'camelCase'),
            'PascalCase': this.convertToConvention(selectedText, 'PascalCase'),
            'snake_case': this.convertToConvention(selectedText, 'snake_case'),
            'kebab-case': this.convertToConvention(selectedText, 'kebab-case'),
            'SCREAMING_SNAKE_CASE': this.convertToConvention(selectedText, 'SCREAMING_SNAKE_CASE')
        };

        // Create preview options
        const previewOptions = Object.entries(conversions).map(([convention, converted]) => ({
            label: `${convention}: ${converted}`,
            description: converted === selectedText ? '(no change)' : `${selectedText} → ${converted}`,
            convention: convention as NamingConvention,
            converted: converted
        }));

        const selectedOption = await vscode.window.showQuickPick(previewOptions, {
            placeHolder: `Preview formatting for "${selectedText}" - Select to apply`,
            matchOnDescription: true
        });

        if (selectedOption && selectedOption.converted !== selectedText) {
            // Apply the selected conversion
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, selectedOption.converted);
            });
            
            vscode.window.showInformationMessage(
                `Applied ${selectedOption.convention}: ${selectedText} → ${selectedOption.converted}`
            );
        }
    }

    /**
     * Format all variables in the current file
     */
    public async formatAllVariablesInFile(convention: NamingConvention): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const text = document.getText();
        const variableMatches = this.findAllVariables(text);

        if (variableMatches.length === 0) {
            vscode.window.showInformationMessage('No variables found in the current file');
            return;
        }

        const result = await vscode.window.showWarningMessage(
            `Found ${variableMatches.length} variables. Convert all to ${convention}?`,
            'Yes', 'No'
        );

        if (result !== 'Yes') {
            return;
        }

        let changedCount = 0;
        await editor.edit(editBuilder => {
            // Process matches in reverse order to maintain correct positions
            variableMatches.reverse().forEach(match => {
                const originalVariable = match.text;
                const formattedVariable = this.convertToConvention(originalVariable, convention);
                
                if (formattedVariable !== originalVariable) {
                    const startPos = document.positionAt(match.start);
                    const endPos = document.positionAt(match.end);
                    const range = new vscode.Range(startPos, endPos);
                    editBuilder.replace(range, formattedVariable);
                    changedCount++;
                }
            });
        });

        vscode.window.showInformationMessage(`Converted ${changedCount} variables to ${convention}`);
    }

    /**
     * Format multiple selected variables
     */
    public async formatMultipleSelections(convention: NamingConvention): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selections = editor.selections;
        if (selections.length <= 1) {
            // Fall back to single selection formatting
            return this.formatSelectedVariable(convention);
        }

        let changedCount = 0;
        const invalidSelections: string[] = [];

        await editor.edit(editBuilder => {
            // Process selections in reverse order to maintain correct positions
            selections.slice().reverse().forEach((selection, index) => {
                const selectedText = editor.document.getText(selection);
                
                if (!selectedText || !this.isValidVariableName(selectedText)) {
                    invalidSelections.push(`Selection ${selections.length - index}`);
                    return;
                }

                const formattedVariable = this.convertToConvention(selectedText, convention);
                
                if (formattedVariable !== selectedText) {
                    editBuilder.replace(selection, formattedVariable);
                    changedCount++;
                }
            });
        });

        if (invalidSelections.length > 0) {
            vscode.window.showWarningMessage(
                `Invalid variable names in: ${invalidSelections.join(', ')}`
            );
        }

        if (changedCount > 0) {
            vscode.window.showInformationMessage(
                `Converted ${changedCount} variables to ${convention}`
            );
        } else {
            vscode.window.showInformationMessage(
                `All selected variables are already in ${convention} format`
            );
        }
    }

    /**
     * Check if a string is a valid variable name
     */
    private isValidVariableName(text: string): boolean {
        return this.variableRegex.test(text.trim());
    }

    /**
     * Find all variables in the given text
     */
    private findAllVariables(text: string): Array<{text: string, start: number, end: number}> {
        const matches: Array<{text: string, start: number, end: number}> = [];
        const variablePattern = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
        
        let match;
        while ((match = variablePattern.exec(text)) !== null) {
            const variableName = match[0];
            
            // Skip JavaScript/TypeScript keywords and common reserved words
            if (!this.isReservedWord(variableName) && this.isValidVariableName(variableName)) {
                matches.push({
                    text: variableName,
                    start: match.index,
                    end: match.index + variableName.length
                });
            }
        }
        
        return matches;
    }

    /**
     * Check if a word is a reserved keyword
     */
    private isReservedWord(word: string): boolean {
        const reservedWords = new Set([
            // JavaScript/TypeScript keywords
            'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch',
            'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
            'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final',
            'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import',
            'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new',
            'null', 'package', 'private', 'protected', 'public', 'return', 'short',
            'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
            'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while',
            'with', 'yield', 'async', 'of', 'from', 'as', 'any', 'unknown', 'never',
            'object', 'string', 'number', 'bigint', 'symbol', 'undefined',
            // Common built-in objects and functions
            'console', 'window', 'document', 'Array', 'Object', 'String', 'Number',
            'Boolean', 'Date', 'RegExp', 'Error', 'JSON', 'Math', 'parseInt', 'parseFloat',
            'isNaN', 'isFinite', 'encodeURI', 'decodeURI', 'setTimeout', 'setInterval'
        ]);
        
        return reservedWords.has(word.toLowerCase());
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
            case 'SCREAMING_SNAKE_CASE':
                return this.toScreamingSnakeCase(words);
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
     * Convert words to SCREAMING_SNAKE_CASE
     */
    private toScreamingSnakeCase(words: string[]): string {
        return words.map(word => word.toUpperCase()).join('_');
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