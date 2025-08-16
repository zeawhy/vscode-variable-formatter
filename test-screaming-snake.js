// Test file for SCREAMING_SNAKE_CASE functionality

class VariableFormatter {
    extractWords(variableName) {
        const wordSeparators = /[_\-\s]+/;
        let words = variableName.split(wordSeparators).filter(word => word.length > 0);
        
        const result = [];
        for (const word of words) {
            const camelCaseWords = this.splitCamelCase(word);
            result.push(...camelCaseWords);
        }
        
        return result.map(word => word.toLowerCase());
    }

    splitCamelCase(word) {
        const matches = word.match(/[A-Z]*[a-z]+|[A-Z]+(?=[A-Z][a-z]|\b)|[A-Z](?=[a-z])|[a-z]+|[0-9]+/g);
        return matches || [word];
    }

    toScreamingSnakeCase(words) {
        return words.map(word => word.toUpperCase()).join('_');
    }

    convertToScreamingSnakeCase(variableName) {
        const words = this.extractWords(variableName);
        return this.toScreamingSnakeCase(words);
    }
}

// Test cases
const formatter = new VariableFormatter();

const testCases = [
    'myVariable',
    'MyVariable', 
    'my_variable',
    'my-variable',
    'API_KEY',
    'getUserData',
    'XMLHttpRequest',
    'HTML5Parser',
    'user_id',
    'MAX_RETRY_COUNT'
];

console.log('🧪 Testing SCREAMING_SNAKE_CASE conversion:');
console.log('=' .repeat(50));

testCases.forEach(testCase => {
    const result = formatter.convertToScreamingSnakeCase(testCase);
    console.log(`${testCase.padEnd(20)} → ${result}`);
});

console.log('\n✅ SCREAMING_SNAKE_CASE tests completed!');