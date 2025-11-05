#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = './src/i18n/locales';
const REFERENCE_LOCALE = 'en';

function getAllKeys(obj, prefix = '') {
  let keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

function loadTranslations(locale) {
  const filePath = path.join(LOCALES_DIR, locale, 'common.json');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Translation file not found: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function findMissingKeys(referenceKeys, compareKeys, locale) {
  const missing = referenceKeys.filter(key => !compareKeys.includes(key));
  
  if (missing.length > 0) {
    console.log(`\n❌ ${locale.toUpperCase()}: ${missing.length} fehlende Übersetzungen:`);
    missing.forEach(key => console.log(`  - ${key}`));
  } else {
    console.log(`\n✅ ${locale.toUpperCase()}: Alle Übersetzungen vollständig`);
  }
  
  return missing;
}

function findExtraKeys(referenceKeys, compareKeys, locale) {
  const extra = compareKeys.filter(key => !referenceKeys.includes(key));
  
  if (extra.length > 0) {
    console.log(`\n⚠️  ${locale.toUpperCase()}: ${extra.length} zusätzliche Schlüssel (nicht in ${REFERENCE_LOCALE}):`);
    extra.forEach(key => console.log(`  - ${key}`));
  }
  
  return extra;
}

function main() {
  try {
    console.log(`🔍 Überprüfe Übersetzungen basierend auf ${REFERENCE_LOCALE.toUpperCase()}...`);
    
    // Lade Referenz-Übersetzungen
    const referenceTranslations = loadTranslations(REFERENCE_LOCALE);
    const referenceKeys = getAllKeys(referenceTranslations);
    
    console.log(`📚 Referenz (${REFERENCE_LOCALE}): ${referenceKeys.length} Schlüssel gefunden`);
    
    // Finde alle verfügbaren Locales
    const availableLocales = fs.readdirSync(LOCALES_DIR)
      .filter(item => fs.statSync(path.join(LOCALES_DIR, item)).isDirectory());
    
    console.log(`🌍 Zu überprüfende Sprachen: ${availableLocales.join(', ')}`);
    
    let totalMissing = 0;
    let totalExtra = 0;
    
    // Überprüfe jede Sprache
    for (const locale of availableLocales) {
      const translations = loadTranslations(locale);
      const keys = getAllKeys(translations);
      
      console.log(`\n📖 ${locale.toUpperCase()}: ${keys.length} Schlüssel gefunden`);
      
      if (locale === REFERENCE_LOCALE) {
        console.log(`\n📝 ${locale.toUpperCase()}: Referenz-Sprache (wird nicht verglichen)`);
        continue;
      }
      
      const missing = findMissingKeys(referenceKeys, keys, locale);
      const extra = findExtraKeys(referenceKeys, keys, locale);
      
      totalMissing += missing.length;
      totalExtra += extra.length;
    }
    
    // Zusammenfassung
    console.log('\n' + '='.repeat(50));
    console.log('📊 ZUSAMMENFASSUNG:');
    console.log(`   Referenz-Sprache: ${REFERENCE_LOCALE} (${referenceKeys.length} Schlüssel)`);
    console.log(`   Überprüfte Sprachen: ${availableLocales.length}`);
    console.log(`   Fehlende Übersetzungen gesamt: ${totalMissing}`);
    console.log(`   Zusätzliche Schlüssel gesamt: ${totalExtra}`);
    
    if (totalMissing === 0 && totalExtra === 0) {
      console.log('\n🎉 Alle Übersetzungen sind synchron!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Es gibt Unterschiede in den Übersetzungen.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Fehler:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getAllKeys, loadTranslations, findMissingKeys, findExtraKeys };