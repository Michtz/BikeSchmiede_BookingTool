#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = './src/i18n/locales';
const LANGUAGES = ['de', 'en', 'fr'];

function sortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }
  
  const sorted = {};
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    sorted[key] = sortObjectKeys(obj[key]);
  }
  
  return sorted;
}

function sortTranslationFile(filePath) {
  try {
    console.log(`Sorting: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    const sorted = sortObjectKeys(translations);
    
    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n');
    console.log(`✓ Sorted: ${filePath}`);
  } catch (error) {
    console.error(`Error sorting ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🔄 Sorting translation files...\n');
  
  for (const lang of LANGUAGES) {
    const filePath = path.join(LOCALES_DIR, lang, 'common.json');
    
    if (fs.existsSync(filePath)) {
      sortTranslationFile(filePath);
    } else {
      console.warn(`⚠️  File not found: ${filePath}`);
    }
  }
  
  console.log('\n✅ Translation files sorting completed!');
}

if (require.main === module) {
  main();
}

module.exports = { sortObjectKeys, sortTranslationFile };