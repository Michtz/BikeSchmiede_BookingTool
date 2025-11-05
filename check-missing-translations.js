#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = './src/i18n/locales';
const SOURCE_DIRS = ['./src'];
const LANGUAGES = ['de', 'en', 'fr'];

// Get all translation keys from a translation file
function getAllTranslationKeys(obj, prefix = '') {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllTranslationKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Get all source files using Node.js instead of shell commands
function getAllSourceFiles() {
  const files = [];

  function traverseDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip node_modules and other common directories to ignore
          if (
            ![
              'node_modules',
              '.git',
              '.next',
              'dist',
              'build',
              'i18n',
            ].includes(entry.name)
          ) {
            traverseDir(fullPath);
          }
        } else if (entry.isFile()) {
          // Check if it's a source file
          if (/\.(tsx?|jsx?)$/.test(entry.name)) {
            files.push(fullPath);
          }
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }

  for (const srcDir of SOURCE_DIRS) {
    if (fs.existsSync(srcDir)) {
      traverseDir(srcDir);
    }
  }

  return files;
}

// Extract translation keys from code files
function extractTranslationKeysFromCode() {
  const keys = new Set();
  const files = getAllSourceFiles();

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    try {
      const content = fs.readFileSync(file, 'utf8');

      // Look for t('key'), t("key"), t(\`key\`) - more specific patterns
      const patterns = [
        /\bt\(\s*['"]([^'"]+)['"]\s*\)/g,
        /\bt\(\s*\`([^\`]+)\`\s*\)/g,
      ];

      patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const key = match[1];

          // Filter out false positives
          if (isValidTranslationKey(key)) {
            keys.add(key);
          }
        }
      });
    } catch (error) {
      console.warn(`Could not read file ${file}: ${error.message}`);
    }
  }

  return Array.from(keys).sort();
}

// Check if a key looks like a valid translation key
function isValidTranslationKey(key) {
  // Skip keys with variables/interpolation
  if (key.includes('{{') || key.includes('${') || key.includes('`')) {
    return false;
  }

  // Skip single characters or very short keys
  if (key.length <= 2) {
    return false;
  }

  // Skip keys that look like file paths
  if (key.includes('@/') || key.includes('./') || key.includes('../')) {
    return false;
  }

  // Skip keys that look like URLs or routes
  if (key.startsWith('http') || key.startsWith('api/') || key.startsWith('/')) {
    return false;
  }

  // Skip keys that look like variable names (camelCase without dots)
  if (/^[a-z][a-zA-Z0-9]*$/.test(key) && !key.includes('.')) {
    return false;
  }

  // Skip keys with namespaces that don't match our structure
  if (key.includes(':') && !key.startsWith('common:')) {
    return false;
  }

  // Accept keys that look like proper translation keys (contain dots or are known patterns)
  return key.includes('.') || key.startsWith('common:') || /^[a-z]+$/.test(key);
}

function checkTranslationsExist(codeKeys, translations) {
  const missingKeys = [];

  // Helper function to check if a key path exists in translations
  function keyExists(keyPath) {
    const parts = keyPath.split('.');
    let current = translations;

    for (const part of parts) {
      if (
        current &&
        typeof current === 'object' &&
        current[part] !== undefined
      ) {
        current = current[part];
      } else {
        return false;
      }
    }
    return true;
  }

  for (const key of codeKeys) {
    let found = false;

    // Check for namespace format (e.g., "common:products.categories.tamper")
    if (key.includes(':')) {
      const [namespace, keyPath] = key.split(':', 2);

      // For "common:" namespace, check the root level without the namespace
      if (namespace === 'common') {
        found = keyExists(keyPath);
      }
    } else {
      // Check regular dot notation
      found = keyExists(key);
    }

    if (!found) {
      missingKeys.push(key);
    }
  }

  return missingKeys;
}

function main() {
  console.log('🔍 Checking for missing translations...\n');

  // Extract translation keys from code
  const codeKeys = extractTranslationKeysFromCode();
  console.log(`📊 Found ${codeKeys.length} translation keys in code\n`);

  if (codeKeys.length === 0) {
    console.log('ℹ️  No translation keys found in code.');
    return;
  }

  const results = {};

  // Check each language
  for (const lang of LANGUAGES) {
    const translationFile = path.join(LOCALES_DIR, lang, 'common.json');

    if (!fs.existsSync(translationFile)) {
      console.warn(`⚠️  Translation file not found: ${translationFile}`);
      continue;
    }

    console.log(`🔍 Checking ${lang.toUpperCase()} translations...`);

    const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
    const missingKeys = checkTranslationsExist(codeKeys, translations, lang);

    results[lang] = {
      total: codeKeys.length,
      missing: missingKeys.length,
      missingKeys: missingKeys,
    };

    if (missingKeys.length > 0) {
      console.log(
        `❌ Missing ${missingKeys.length} translations in ${lang.toUpperCase()}:`,
      );
      missingKeys.forEach((key) => {
        console.log(`   • ${key}`);
      });
    } else {
      console.log(`✅ All translations exist in ${lang.toUpperCase()}`);
    }
    console.log('');
  }

  // Summary
  console.log('📊 Summary:');
  for (const [lang, result] of Object.entries(results)) {
    console.log(
      `   ${lang.toUpperCase()}: ${result.total - result.missing}/${result.total} translations (${result.missing} missing)`,
    );
  }

  // Save missing keys to files for each language
  for (const [lang, result] of Object.entries(results)) {
    if (result.missingKeys.length > 0) {
      const outputFile = `missing-translations-${lang}.json`;
      fs.writeFileSync(outputFile, JSON.stringify(result.missingKeys, null, 2));
      console.log(
        `\n📄 Missing ${lang.toUpperCase()} keys saved to: ${outputFile}`,
      );
    }
  }

  // Check for keys that exist in code but nowhere in translations
  const allTranslationKeys = new Set();
  for (const lang of LANGUAGES) {
    const translationFile = path.join(LOCALES_DIR, lang, 'common.json');
    if (fs.existsSync(translationFile)) {
      const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
      const langKeys = getAllTranslationKeys(translations);
      langKeys.forEach((key) => allTranslationKeys.add(key));
    }
  }

  // Helper function to check if a key exists (handling namespaces)
  function keyExistsInTranslations(key) {
    if (key.includes(':')) {
      const [namespace, keyPath] = key.split(':', 2);
      if (namespace === 'common') {
        return allTranslationKeys.has(keyPath);
      }
    }
    return allTranslationKeys.has(key);
  }

  const orphanKeys = codeKeys.filter((key) => !keyExistsInTranslations(key));
  if (orphanKeys.length > 0) {
    console.log(`\n🚨 Keys used in code but missing in ALL translation files:`);
    orphanKeys.forEach((key) => {
      console.log(`   • ${key}`);
    });

    fs.writeFileSync(
      'orphan-translation-keys.json',
      JSON.stringify(orphanKeys, null, 2),
    );
    console.log(`\n📄 Orphan keys saved to: orphan-translation-keys.json`);
  }
}

if (require.main === module) {
  main();
}
