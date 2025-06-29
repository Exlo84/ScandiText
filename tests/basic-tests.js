/**
 * Basic tests for Nordisk Tekstredigering
 * Focuses on core functionality for manual language workflows
 * @author GitHub Copilot
 */

// Import modules for testing
import { TextAnalyzer } from '../js/textAnalyzer.js';
import { TextTransforms } from '../js/textTransforms.js';

/**
 * Simple test framework
 */
class SimpleTest {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async runAll() {
        console.log('🧪 Starting core functionality tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFn();
                this.results.push({ name: test.name, status: 'PASS' });
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.push({ name: test.name, status: 'FAIL', error: error.message });
                console.log(`❌ ${test.name}: ${error.message}`);
            }
        }

        this.printSummary();
    }

    printSummary() {
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        
        console.log('\n📊 Test Summary:');
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Total: ${this.results.length}`);
        
        if (failed > 0) {
            console.log('\n❌ Failed tests:');
            this.results.filter(r => r.status === 'FAIL').forEach(r => {
                console.log(`  - ${r.name}: ${r.error}`);
            });
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertTrue(condition, message) {
        if (!condition) {
            throw new Error(message || 'Expected condition to be true');
        }
    }
}

// Create test instance
const test = new SimpleTest();

/**
 * Core Text Analysis Tests
 */
test.test('TextAnalyzer - Word counting', () => {
    const analyzer = new TextAnalyzer();
    
    test.assertEqual(analyzer.countWords(''), 0, 'Empty text should have 0 words');
    test.assertEqual(analyzer.countWords('hei'), 1, 'Single word should count as 1');
    test.assertEqual(analyzer.countWords('hei verden'), 2, 'Two words should count as 2');
    test.assertEqual(analyzer.countWords('  hei   verden  '), 2, 'Extra spaces should be ignored');
    test.assertEqual(analyzer.countWords('sammensatte-ord'), 1, 'Hyphenated words count as 1');
});

test.test('TextAnalyzer - Sentence counting', () => {
    const analyzer = new TextAnalyzer();
    
    test.assertEqual(analyzer.countSentences(''), 0, 'Empty text should have 0 sentences');
    test.assertEqual(analyzer.countSentences('Hei.'), 1, 'Single sentence should count as 1');
    test.assertEqual(analyzer.countSentences('Hei. Hvordan har du det?'), 2, 'Two sentences should count as 2');
    test.assertEqual(analyzer.countSentences('Hei! Hvordan har du det? Bra.'), 3, 'Multiple punctuation should work');
});

test.test('TextAnalyzer - Paragraph counting', () => {
    const analyzer = new TextAnalyzer();
    
    test.assertEqual(analyzer.countParagraphs(''), 0, 'Empty text should have 0 paragraphs');
    test.assertEqual(analyzer.countParagraphs('Hei verden'), 1, 'Single paragraph should count as 1');
    test.assertEqual(analyzer.countParagraphs('Første avsnitt\n\nAndre avsnitt'), 2, 'Two paragraphs should count as 2');
});

test.test('TextAnalyzer - Full analysis', () => {
    const analyzer = new TextAnalyzer();
    const text = 'Dette er en test. Den har to setninger.\n\nDette er et nytt avsnitt.';
    const result = analyzer.analyzeText(text);
    
    test.assertTrue(result.wordCount > 0, 'Should count words');
    test.assertTrue(result.sentenceCount > 0, 'Should count sentences');
    test.assertTrue(result.paragraphCount > 0, 'Should count paragraphs');
    test.assertTrue(result.averageWordsPerSentence > 0, 'Should calculate average words per sentence');
    test.assertTrue(result.readabilityScore >= 0, 'Should calculate readability score');
});

/**
 * Text Transformation Tests
 */
test.test('TextTransforms - Case transformations', () => {
    const transforms = new TextTransforms();
    
    test.assertEqual(transforms.toUpperCase('hei verden'), 'HEI VERDEN', 'Should convert to uppercase');
    test.assertEqual(transforms.toLowerCase('HEI VERDEN'), 'hei verden', 'Should convert to lowercase');
    test.assertEqual(transforms.toTitleCase('hei verden'), 'Hei Verden', 'Should convert to title case');
});

test.test('TextTransforms - Smart capitalization', () => {
    const transforms = new TextTransforms();
    
    const result = transforms.intelligentCapitalization('dette er en test. ny setning her.');
    test.assertTrue(result.startsWith('Dette'), 'Should capitalize first word');
    test.assertTrue(result.includes('. Ny'), 'Should capitalize after periods');
});

test.test('TextTransforms - Nordic character handling', () => {
    const transforms = new TextTransforms();
    
    // Test that Nordic characters are preserved in normal operations
    const nordicText = 'æøå ÆØÅ äöü ÄÖÜ';
    test.assertEqual(transforms.toUpperCase('æøå'), 'ÆØÅ', 'Should handle Nordic uppercase');
    test.assertEqual(transforms.toLowerCase('ÆØÅ'), 'æøå', 'Should handle Nordic lowercase');
    
    // Test Nordic character conversion when needed
    const converted = transforms.convertNordicChars(nordicText);
    test.assertTrue(converted.length > 0, 'Should convert Nordic characters when requested');
});

test.test('TextTransforms - Text cleaning', () => {
    const transforms = new TextTransforms();
    
    const messy = '  Dette   er   en    rotete  tekst  \n\n\n  med  for  mye  mellomrom  ';
    const clean = transforms.cleanText(messy);
    
    test.assertTrue(clean.length < messy.length, 'Should reduce text length by cleaning');
    test.assertTrue(!clean.startsWith(' '), 'Should not start with space');
    test.assertTrue(!clean.endsWith(' '), 'Should not end with space');
    test.assertTrue(!clean.includes('   '), 'Should not have multiple consecutive spaces');
});

/**
 * Edge Cases and Robustness Tests
 */
test.test('Edge cases - Empty inputs', () => {
    const analyzer = new TextAnalyzer();
    const transforms = new TextTransforms();
    
    // All methods should handle empty strings gracefully
    test.assertEqual(analyzer.countWords(''), 0, 'Empty string should return 0 words');
    test.assertEqual(analyzer.countSentences(''), 0, 'Empty string should return 0 sentences');
    test.assertEqual(analyzer.countParagraphs(''), 0, 'Empty string should return 0 paragraphs');
    
    test.assertEqual(transforms.toUpperCase(''), '', 'Empty string should remain empty');
    test.assertEqual(transforms.toLowerCase(''), '', 'Empty string should remain empty');
    test.assertEqual(transforms.cleanText(''), '', 'Empty string should remain empty');
});

test.test('Edge cases - Very long text', () => {
    const analyzer = new TextAnalyzer();
    
    // Test with long text
    const longText = 'ord '.repeat(1000).trim();
    test.assertEqual(analyzer.countWords(longText), 1000, 'Should handle long text correctly');
});

test.test('Nordic language specifics - Compound words', () => {
    const analyzer = new TextAnalyzer();
    
    // Test compound words (common in Nordic languages)
    const text = 'barnehagebygget tekstbehandlingsprogram datamaskinskjerm';
    const result = analyzer.analyzeText(text);
    
    test.assertEqual(result.wordCount, 3, 'Should count compound words correctly');
    test.assertTrue(result.characterCount > result.wordCount * 5, 'Compound words should increase character count significantly');
});

// Run all tests
test.runAll().catch(console.error);

// Export for potential reuse
export { test, SimpleTest };
