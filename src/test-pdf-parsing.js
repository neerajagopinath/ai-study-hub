// Test script to verify PDF parsing works correctly
// This can be run in the browser console to test the parsing logic

import { parsePDF } from './lib/documentParser.js'

// Test function to verify PDF parsing
async function testPDFParsing(file) {
  console.log('Testing PDF parsing with file:', file.name)
  
  try {
    const result = await parsePDF(file)
    console.log('✅ PDF parsing successful!')
    console.log('Text length:', result.text.length)
    console.log('Sample text:', result.text.substring(0, 200))
    console.log('Metadata:', result.metadata)
    
    // Check if we got readable text (not binary)
    const isReadable = /[a-zA-Z]{3,}/.test(result.text) && !result.text.includes('R /')
    console.log('Is readable text:', isReadable)
    
    return result
  } catch (error) {
    console.error('❌ PDF parsing failed:', error)
    return null
  }
}

// Export for use in browser console
window.testPDFParsing = testPDFParsing
console.log('PDF parsing test function loaded. Use: testPDFParsing(fileObject)')
