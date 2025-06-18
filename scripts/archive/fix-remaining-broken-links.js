#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing remaining broken links...');

// Get list of actual memory log files
const memoryLogDir = './docs/logged_memories';
const actualFiles = fs.readdirSync(memoryLogDir)
  .filter(file => file.startsWith('MRTMLY-') && file.endsWith('.md'))
  .sort();

console.log(`Found ${actualFiles.length} actual memory log files`);

// Create mapping of what people might be looking for vs what actually exists
const fixes = [
  // Analysis files referring to wrong MRTMLY-185
  {
    pattern: /MRTMLY-185-additional-cleanup-candidates\.md/g,
    replacement: 'MRTMLY-185-component-props-interface-optimization.md',
    files: [
      './docs/analysis/beta-features-status.md',
      './docs/analysis/test-helpers-usage.md', 
      './docs/analysis/draft-docs-status.md',
      './docs/analysis/deprecated-utils-usage.md'
    ]
  },
  
  // Migration files with wrong path structure
  {
    pattern: /\[MRTMLY-133-additional-cleanup-candidates\]\(\.\/logged_memories\/MRTMLY-133-additional-cleanup-candidates\.md\)/g,
    replacement: '[MRTMLY-133-additional-cleanup-candidates](../logged_memories/MRTMLY-133-additional-cleanup-candidates.md)',
    files: [
      './docs/migration/deprecated-utils-migration-plan.md',
      './docs/migration/documentation-completion-plan.md',
      './docs/migration/test-helpers-migration-plan.md',
      './docs/migration/beta-features-decision-matrix.md'
    ]
  },

  // Fix wrong reference in MRTMLY-137
  {
    pattern: /\[MRTMLY-002\]\(\.\/MRTMLY-184-removal-of-one-off-scripts\.md\)/g,
    replacement: '[MRTMLY-132](./MRTMLY-132-removal-of-one-off-scripts.md)',
    files: ['./docs/logged_memories/MRTMLY-137-removal-of-additional-one-off-scripts.md']
  },

  // Fix wrong reference in MRTMLY-091
  {
    pattern: /\[MRTMLY-035\]\(\.\/MRTMLY-035-activity-order-summary-tests\.md\)/g,
    replacement: '[MRTMLY-090](./MRTMLY-090-activity-order-summary-tests.md)',
    files: ['./docs/logged_memories/MRTMLY-091-activity-order-test-expansion.md']
  },

  // Fix IMPLEMENTED_CHANGES.md references
  {
    pattern: /MRTMLY-012-service-worker-refactoring\.md/g,
    replacement: 'MRTMLY-012-service-worker-test-fixes-original.md',
    files: ['./docs/IMPLEMENTED_CHANGES.md']
  },

  // Fix dev-guides path
  {
    pattern: /\.\.\/dev-guides\/TIME_UTILITIES_GUIDE\.md/g,
    replacement: './dev-guides/TIME_UTILITIES_GUIDE.md',
    files: ['./docs/IMPLEMENTED_CHANGES.md']
  },

  // Fix wrong memory log path
  {
    pattern: /\/docs\/logged_memories\/MRTMLY-001-timeutils-refactoring\.md/g,
    replacement: './logged_memories/MRTMLY-130-timeutils-refactoring.md',
    files: ['./docs/IMPLEMENTED_CHANGES.md']
  }
];

// Component documentation fixes - these reference old numbering
const componentFixes = [
  // ProgressBar.md
  {
    file: './docs/components/ProgressBar.md',
    fixes: [
      {
        pattern: /MRTMLY-030-progress-bar-theme-testing\.md/g,
        replacement: 'MRTMLY-086-progress-bar-theme-testing.md'
      },
      {
        pattern: /MRTMLY-024-progress-bar-visibility\.md/g,
        replacement: 'MRTMLY-110-progress-bar-visibility.md'
      },
      {
        pattern: /MRTMLY-022-progress-element-repositioning\.md/g,
        replacement: 'MRTMLY-150-progress-element-repositioning.md'
      },
      {
        pattern: /MRTMLY-001-progress-bar-mobile-layout\.md/g,
        replacement: 'MRTMLY-106-progress-bar-mobile-layout.md'
      }
    ]
  },

  // Summary.md  
  {
    file: './docs/components/Summary.md',
    fixes: [
      {
        pattern: /MRTMLY-185-summary-test-refactor\.md/g,
        replacement: 'MRTMLY-080-summary-test-refactor.md'
      },
      {
        pattern: /MRTMLY-002-summary-status-message-fix\.md/g,
        replacement: 'MRTMLY-144-summary-status-message-fix.md'
      },
      {
        pattern: /MRTMLY-019-summary-activity-order\.md/g,
        replacement: 'MRTMLY-148-summary-activity-order.md'
      },
      {
        pattern: /MRTMLY-041-unused-variable-summary-component\.md/g,
        replacement: 'MRTMLY-153-unused-variable-summary-component.md'
      }
    ]
  },

  // Timeline.md
  {
    file: './docs/components/Timeline.md',
    fixes: [
      {
        pattern: /MRTMLY-013-timeline-break-visualization\.md/g,
        replacement: 'MRTMLY-146-timeline-break-visualization.md'
      },
      {
        pattern: /MRTMLY-014-timeline-memory-leak\.md/g,
        replacement: 'MRTMLY-147-timeline-memory-leak.md'
      },
      {
        pattern: /MRTMLY-015-timeline-test-suite-memory-leak\.md/g,
        replacement: 'MRTMLY-083-timeline-test-suite-memory-leak.md'
      },
      {
        pattern: /MRTMLY-017-timeline-calculation-test\.md/g,
        replacement: 'MRTMLY-085-timeline-calculation-test.md'
      }
    ]
  },

  // ActivityManager.md
  {
    file: './docs/components/ActivityManager.md',
    fixes: [
      {
        pattern: /MRTMLY-019-summary-activity-order\.md/g,
        replacement: 'MRTMLY-148-summary-activity-order.md'
      },
      {
        pattern: /MRTMLY-035-activity-order-summary-tests\.md/g,
        replacement: 'MRTMLY-090-activity-order-summary-tests.md'
      }
    ]
  },

  // OfflineIndicator.md
  {
    file: './docs/components/OfflineIndicator.md',
    fixes: [
      {
        pattern: /MRTMLY-009-offline-indicator-layout\.md/g,
        replacement: 'MRTMLY-108-offline-indicator-layout.md'
      }
    ]
  }
];

// Apply fixes
let totalFixes = 0;

fixes.forEach(fix => {
  fix.files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      content = content.replace(fix.pattern, fix.replacement);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed links in ${filePath}`);
        totalFixes++;
      }
    }
  });
});

// Apply component fixes
componentFixes.forEach(component => {
  if (fs.existsSync(component.file)) {
    let content = fs.readFileSync(component.file, 'utf8');
    const originalContent = content;
    
    component.fixes.forEach(fix => {
      content = content.replace(fix.pattern, fix.replacement);
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(component.file, content);
      console.log(`✅ Fixed component links in ${component.file}`);
      totalFixes++;
    }
  }
});

// Fix broken reference definitions in MRTMLY-161 and MRTMLY-039
const fixBrokenReferences = () => {
  // MRTMLY-161
  const file161 = './docs/logged_memories/MRTMLY-161-offline-cache-and-config-errors.md';
  if (fs.existsSync(file161)) {
    let content = fs.readFileSync(file161, 'utf8');
    content = content.replace(
      /\[rel="stylesheet"\]\(\[BROKEN REFERENCE: href\]\)/g,
      'rel="stylesheet" href="..."'
    );
    fs.writeFileSync(file161, content);
    console.log(`✅ Fixed broken references in ${file161}`);
    totalFixes++;
  }

  // MRTMLY-039
  const file039 = './docs/logged_memories/MRTMLY-039-service-worker-lifecycle-tests.md';
  if (fs.existsSync(file039)) {
    let content = fs.readFileSync(file039, 'utf8');
    content = content.replace(
      /\[0\]\(\[BROKEN REFERENCE: [01]\]\)/g,
      '(code snippet referenced above)'
    );
    fs.writeFileSync(file039, content);
    console.log(`✅ Fixed broken references in ${file039}`);
    totalFixes++;
  }
};

fixBrokenReferences();

console.log(`\n🎉 Applied ${totalFixes} link fixes across multiple files`);
console.log('🔄 Re-run the link checker to verify all fixes');
