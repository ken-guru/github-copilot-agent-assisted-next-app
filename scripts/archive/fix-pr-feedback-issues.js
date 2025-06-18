#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing ID/filename mismatches and incorrect references...\n');

// Define the fixes based on the feedback
const fixes = [
  // HIGH PRIORITY: ID/Filename mismatches
  {
    file: './docs/components/Timeline.md',
    description: 'Fix Timeline memory log ID mismatch',
    replacements: [
      {
        // The change history should reference the correct ID for the memory leak fix
        // Looking at our files, MRTMLY-147 is the timeline memory leak file
        pattern: '- **2025-03-15**: Fixed memory leak issues and timer cleanup (MRTMLY-014)',
        replacement: '- **2025-03-15**: Fixed memory leak issues and timer cleanup (MRTMLY-147)'
      }
    ]
  },
  
  {
    file: './docs/components/Summary.md',
    description: 'Fix Summary component memory log ID mismatches',
    replacements: [
      {
        // Fix MRTMLY-185 pointing to MRTMLY-080 file
        pattern: '[MRTMLY-185: Summary Component Test Suite Refactor](../logged_memories/MRTMLY-080-summary-test-refactor.md)',
        replacement: '[MRTMLY-080: Summary Component Test Suite Refactor](../logged_memories/MRTMLY-080-summary-test-refactor.md)'
      },
      {
        // Fix MRTMLY-002 pointing to MRTMLY-144 file
        pattern: '[MRTMLY-002: Summary Component Status Message Bug Fix](../logged_memories/MRTMLY-144-summary-status-message-fix.md)',
        replacement: '[MRTMLY-144: Summary Component Status Message Bug Fix](../logged_memories/MRTMLY-144-summary-status-message-fix.md)'
      },
      {
        // Fix MRTMLY-019 pointing to MRTMLY-148 file
        pattern: '[MRTMLY-019: Summary Activity Order Fix](../logged_memories/MRTMLY-148-summary-activity-order.md)',
        replacement: '[MRTMLY-148: Summary Activity Order Fix](../logged_memories/MRTMLY-148-summary-activity-order.md)'
      },
      {
        // Fix MRTMLY-041 pointing to MRTMLY-153 file
        pattern: '[MRTMLY-041: Unused Variable in Summary Component](../logged_memories/MRTMLY-153-unused-variable-summary-component.md)',
        replacement: '[MRTMLY-153: Unused Variable in Summary Component](../logged_memories/MRTMLY-153-unused-variable-summary-component.md)'
      }
    ]
  },

  {
    file: './docs/components/ProgressBar.md',
    description: 'Fix ProgressBar memory log ID mismatches',
    replacements: [
      {
        // Fix change history MRTMLY-030 reference - should match the actual file being referenced
        pattern: '- **2025-04-10**: Enhanced theme compatibility (MRTMLY-030)',
        replacement: '- **2025-04-10**: Enhanced theme compatibility (MRTMLY-086)'
      },
      {
        // Fix MRTMLY-030 pointing to MRTMLY-086 file
        pattern: '[MRTMLY-030: Progress Bar Theme Compatibility Testing](../logged_memories/MRTMLY-086-progress-bar-theme-testing.md)',
        replacement: '[MRTMLY-086: Progress Bar Theme Compatibility Testing](../logged_memories/MRTMLY-086-progress-bar-theme-testing.md)'
      }
    ]
  },

  {
    file: './docs/components/OfflineIndicator.md',
    description: 'Fix OfflineIndicator memory log ID mismatch',
    replacements: [
      {
        // Fix MRTMLY-009 pointing to MRTMLY-108 file
        pattern: '[MRTMLY-009: Offline Indicator Layout and Test Optimization](../logged_memories/MRTMLY-108-offline-indicator-layout.md)',
        replacement: '[MRTMLY-108: Offline Indicator Layout and Test Optimization](../logged_memories/MRTMLY-108-offline-indicator-layout.md)'
      }
    ]
  },

  {
    file: './docs/components/ActivityManager.md',
    description: 'Fix ActivityManager memory log ID mismatch',
    replacements: [
      {
        // Fix MRTMLY-019 pointing to MRTMLY-148 file
        pattern: '[MRTMLY-019: Summary Activity Order Fix](../logged_memories/MRTMLY-148-summary-activity-order.md)',
        replacement: '[MRTMLY-148: Summary Activity Order Fix](../logged_memories/MRTMLY-148-summary-activity-order.md)'
      }
    ]
  },

  // MEDIUM PRIORITY: Incorrect memory log references in analysis files
  {
    file: './docs/analysis/test-helpers-usage.md',
    description: 'Fix incorrect memory log reference (should link to test helpers, not component props)',
    replacements: [
      {
        // Need to find the actual test helpers memory log - let's check what exists
        pattern: '**Related Memory Log:** [MRTMLY-185](../logged_memories/MRTMLY-185-component-props-interface-optimization.md)',
        replacement: '**Related Memory Log:** [MRTMLY-133](../logged_memories/MRTMLY-133-additional-cleanup-candidates.md)'
      }
    ]
  },

  {
    file: './docs/analysis/draft-docs-status.md',
    description: 'Fix incorrect memory log reference (should link to draft docs, not component props)',
    replacements: [
      {
        pattern: '**Related Memory Log:** [MRTMLY-185](../logged_memories/MRTMLY-185-component-props-interface-optimization.md)',
        replacement: '**Related Memory Log:** [MRTMLY-133](../logged_memories/MRTMLY-133-additional-cleanup-candidates.md)'
      }
    ]
  },

  {
    file: './docs/analysis/deprecated-utils-usage.md',
    description: 'Fix incorrect memory log reference (should link to deprecated utils, not component props)',
    replacements: [
      {
        pattern: '**Related Memory Log:** [MRTMLY-185](../logged_memories/MRTMLY-185-component-props-interface-optimization.md)',
        replacement: '**Related Memory Log:** [MRTMLY-133](../logged_memories/MRTMLY-133-additional-cleanup-candidates.md)'
      }
    ]
  },

  {
    file: './docs/analysis/beta-features-status.md',
    description: 'Fix incorrect memory log reference (should link to beta features, not component props)',
    replacements: [
      {
        pattern: '**Related Memory Log:** [MRTMLY-185](../logged_memories/MRTMLY-185-component-props-interface-optimization.md)',
        replacement: '**Related Memory Log:** [MRTMLY-133](../logged_memories/MRTMLY-133-additional-cleanup-candidates.md)'
      }
    ]
  },

  // LOW PRIORITY: Layout link fix
  {
    file: './docs/components/ViewportConfiguration.md',
    description: 'Fix layout link to point to correct component doc',
    replacements: [
      {
        pattern: '- [Related: Layout Configuration](../README.md#layout-components)',
        replacement: '- [Related: Layout Configuration](./README.md#layout-components)'
      }
    ]
  }
];

// Apply all fixes
let totalFixes = 0;
let filesModified = 0;

fixes.forEach(fix => {
  if (fs.existsSync(fix.file)) {
    let content = fs.readFileSync(fix.file, 'utf8');
    const originalContent = content;
    let fileModified = false;

    fix.replacements.forEach(replacement => {
      if (content.includes(replacement.pattern)) {
        content = content.replace(replacement.pattern, replacement.replacement);
        console.log(`✅ Fixed: ${replacement.pattern.substring(0, 60)}...`);
        totalFixes++;
        fileModified = true;
      } else {
        console.log(`⚠️  Pattern not found in ${fix.file}: ${replacement.pattern.substring(0, 40)}...`);
      }
    });

    if (fileModified) {
      fs.writeFileSync(fix.file, content);
      console.log(`📝 Updated: ${fix.file}`);
      filesModified++;
    }
  } else {
    console.log(`❌ File not found: ${fix.file}`);
  }
  console.log('');
});

console.log(`\n🎉 FIXES COMPLETED:`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total fixes applied: ${totalFixes}`);
console.log(`\n📋 Next steps:`);
console.log(`   1. Run link checker to verify fixes`);
console.log(`   2. Review component documentation for accuracy`);
console.log(`   3. Update any remaining references if needed`);
