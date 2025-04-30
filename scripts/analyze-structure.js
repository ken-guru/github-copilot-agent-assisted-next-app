/**
 * Project Structure Analysis Script
 * 
 * This script analyzes the current project structure and outputs a report
 * that can be used for the restructuring process.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'docs', 'project-structure', 'structure-report.md');
const HISTORY_PATH = path.join(PROJECT_ROOT, 'docs', 'project-structure', 'structure-history');

// Ensure history directory exists
if (!fs.existsSync(HISTORY_PATH)) {
  fs.mkdirSync(HISTORY_PATH, { recursive: true });
}

// Directories to exclude from analysis
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
];

// Directories to analyze separately for special reporting
const SPECIAL_DIRS = [
  { path: 'public', analyze: true, includeFiles: true },
  { path: 'src/app', analyze: true, includeFiles: true },
];

// File extensions to categorize
const COMPONENT_EXTS = ['.jsx', '.tsx'];
const UTILITY_EXTS = ['.js', '.ts'];
const STYLE_EXTS = ['.css', '.scss', '.sass', '.less'];
const CONFIG_EXTS = ['.json', '.config.js', '.config.ts'];
const TEST_EXTS = ['.test.js', '.test.jsx', '.test.ts', '.test.tsx', '.spec.js', '.spec.jsx', '.spec.ts', '.spec.tsx'];

// Next.js special files
const NEXTJS_SPECIAL_FILES = [
  'page.tsx', 'page.jsx', 'page.js',
  'layout.tsx', 'layout.jsx', 'layout.js',
  'loading.tsx', 'loading.jsx', 'loading.js',
  'error.tsx', 'error.jsx', 'error.js',
  'not-found.tsx', 'not-found.jsx', 'not-found.js',
  'route.ts', 'route.js'
];

// Results storage
const components = [];
const utilities = [];
const routes = [];
const nextSpecialFiles = [];
const configs = [];
const styles = [];
const tests = [];
const otherFiles = [];

// Progress tracking
const structureSnapshot = {
  timestamp: new Date().toISOString(),
  components: 0,
  utilities: 0,
  routes: 0,
  nextSpecialFiles: 0,
  configs: 0,
  styles: 0,
  tests: 0,
  otherFiles: 0,
  componentsByFolder: {},
  utilitiesByFolder: {},
  routesByFolder: {},
  analyzedDirectories: []
};

/**
 * Check if a path should be excluded from analysis
 */
function shouldExclude(currentPath) {
  return EXCLUDE_DIRS.some(dir => currentPath.includes(`/${dir}/`));
}

/**
 * Calculate directory depth for organization analytics
 */
function calculateDepth(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  return relativePath.split(path.sep).length - 1;
}

/**
 * Get folder structure for a file
 */
function getFolderStructure(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  const parts = relativePath.split(path.sep);
  return parts.slice(0, -1).join('/');
}

/**
 * Check if file is a Next.js special file
 */
function isNextSpecialFile(filePath) {
  const fileName = path.basename(filePath);
  return NEXTJS_SPECIAL_FILES.some(pattern => fileName === pattern);
}

/**
 * Check if file is in App Router structure
 */
function isInAppRouter(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  return relativePath.startsWith('src/app/') || relativePath.startsWith('app/');
}

/**
 * Categorize a file based on its extension and path
 */
function categorizeFile(filePath) {
  const ext = path.extname(filePath);
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  const fileName = path.basename(filePath);
  const folderStructure = getFolderStructure(filePath);
  
  // Track file by folder for organization analysis
  function addToFolderCount(collection, folder) {
    if (!structureSnapshot[collection][folder]) {
      structureSnapshot[collection][folder] = 0;
    }
    structureSnapshot[collection][folder]++;
  }
  
  // Check for tests first (because they might also match other patterns)
  if (TEST_EXTS.some(testExt => fileName.endsWith(testExt)) || relativePath.includes('/__tests__/')) {
    tests.push(relativePath);
    structureSnapshot.tests++;
    return;
  }
  
  // Check for Next.js special files
  if (isNextSpecialFile(filePath)) {
    nextSpecialFiles.push(relativePath);
    structureSnapshot.nextSpecialFiles++;
    
    // Also count as a route if it's in app structure
    if (isInAppRouter(filePath)) {
      routes.push(relativePath);
      structureSnapshot.routes++;
      addToFolderCount('routesByFolder', folderStructure);
    }
    return;
  }
  
  // Check for components
  if (COMPONENT_EXTS.includes(ext)) {
    // Check for routing components in app directory
    if (isInAppRouter(filePath) && 
        (fileName.includes('page.') || 
         fileName.includes('layout.') || 
         fileName.includes('loading.') ||
         fileName.includes('error.'))) {
      routes.push(relativePath);
      structureSnapshot.routes++;
      addToFolderCount('routesByFolder', folderStructure);
    } else {
      components.push(relativePath);
      structureSnapshot.components++;
      addToFolderCount('componentsByFolder', folderStructure);
    }
    return;
  }
  
  // Check for utilities
  if (UTILITY_EXTS.includes(ext) && !relativePath.includes('scripts/')) {
    utilities.push(relativePath);
    structureSnapshot.utilities++;
    addToFolderCount('utilitiesByFolder', folderStructure);
    return;
  }
  
  // Check for styles
  if (STYLE_EXTS.includes(ext)) {
    styles.push(relativePath);
    structureSnapshot.styles++;
    return;
  }
  
  // Check for config files
  if (CONFIG_EXTS.includes(ext) || relativePath.includes('.config.')) {
    configs.push(relativePath);
    structureSnapshot.configs++;
    return;
  }
  
  // Other files
  otherFiles.push(relativePath);
  structureSnapshot.otherFiles++;
}

/**
 * Recursively scan a directory and categorize files
 */
async function scanDirectory(dirPath) {
  // Check for excluded paths
  const relativePath = path.relative(PROJECT_ROOT, dirPath);
  if (shouldExclude(dirPath)) {
    return;
  }
  
  // Special handling for specific directories
  const specialDir = SPECIAL_DIRS.find(dir => relativePath === dir.path);
  if (specialDir && !specialDir.analyze) {
    return;
  }
  
  // Track analyzed directory
  structureSnapshot.analyzedDirectories.push(relativePath || '(root)');
  
  try {
    const files = await readdir(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        await scanDirectory(filePath);
      } else {
        // Check if this is a special directory that should include files
        const specialDirForPath = SPECIAL_DIRS.find(dir => relativePath.startsWith(dir.path));
        if (specialDirForPath && !specialDirForPath.includeFiles) {
          continue;
        }
        
        categorizeFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

/**
 * Generate a directory tree structure
 */
async function generateDirectoryTree(startPath, level = 0, prefix = '') {
  if (shouldExclude(startPath)) {
    return '';
  }
  
  try {
    const stats = await stat(startPath);
    const relativePath = path.relative(PROJECT_ROOT, startPath);
    const name = path.basename(startPath);
    
    if (!stats.isDirectory()) {
      return `${prefix}${name}\n`;
    }
    
    let result = level === 0 ? '' : `${prefix}${name}/\n`;
    
    const files = await readdir(startPath);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(startPath, file);
      
      const isLast = i === files.length - 1;
      const newPrefix = level === 0 ? '' : `${prefix}${isLast ? '    ' : '│   '}`;
      const branchPrefix = `${prefix}${isLast ? '└── ' : '├── '}`;
      
      const subtree = await generateDirectoryTree(filePath, level + 1, newPrefix);
      result += subtree.replace(/^/m, branchPrefix);
    }
    
    return result;
  } catch (error) {
    console.error(`Error generating tree for ${startPath}:`, error);
    return '';
  }
}

/**
 * Check for Next.js best practices compliance
 */
async function analyzeNextJsCompliance() {
  const analysis = {
    hasAppRouter: false,
    hasPagesRouter: false,
    hasProperRootLayout: false,
    missingSpecialFiles: [],
    compliance: {}
  };
  
  // Check for App Router
  analysis.hasAppRouter = fs.existsSync(path.join(PROJECT_ROOT, 'src', 'app')) || 
                          fs.existsSync(path.join(PROJECT_ROOT, 'app'));
  
  // Check for Pages Router
  analysis.hasPagesRouter = fs.existsSync(path.join(PROJECT_ROOT, 'src', 'pages')) || 
                            fs.existsSync(path.join(PROJECT_ROOT, 'pages'));
  
  // Check for proper root layout
  const appPath = fs.existsSync(path.join(PROJECT_ROOT, 'src', 'app')) ? 
                  path.join(PROJECT_ROOT, 'src', 'app') : 
                  (fs.existsSync(path.join(PROJECT_ROOT, 'app')) ? path.join(PROJECT_ROOT, 'app') : null);
  
  if (appPath) {
    analysis.hasProperRootLayout = fs.existsSync(path.join(appPath, 'layout.tsx')) || 
                                 fs.existsSync(path.join(appPath, 'layout.jsx')) || 
                                 fs.existsSync(path.join(appPath, 'layout.js'));
    
    // Check for other special files
    const expectedFiles = ['page', 'error', 'loading', 'not-found'];
    for (const file of expectedFiles) {
      const exists = fs.existsSync(path.join(appPath, `${file}.tsx`)) || 
                    fs.existsSync(path.join(appPath, `${file}.jsx`)) || 
                    fs.existsSync(path.join(appPath, `${file}.js`));
      
      if (!exists) {
        analysis.missingSpecialFiles.push(file);
      }
    }
  }
  
  // Overall compliance check
  analysis.compliance = {
    directoryStructure: analysis.hasAppRouter && !analysis.hasPagesRouter ? "Good" : 
                        (analysis.hasAppRouter && analysis.hasPagesRouter ? "Hybrid" : "Legacy"),
    specialFiles: analysis.missingSpecialFiles.length === 0 ? "Complete" : "Missing Files",
    routingPattern: analysis.hasProperRootLayout ? "Correct" : "Incomplete",
    overallScore: analysis.hasAppRouter && analysis.hasProperRootLayout && analysis.missingSpecialFiles.length === 0 ? 
                 "Good" : "Needs Improvement"
  };
  
  return analysis;
}

/**
 * Save a snapshot of the current structure for comparison
 */
async function saveStructureSnapshot() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const snapshotPath = path.join(HISTORY_PATH, `structure-snapshot-${timestamp}.json`);
  
  fs.writeFileSync(snapshotPath, JSON.stringify(structureSnapshot, null, 2));
  console.log(`Structure snapshot saved at ${snapshotPath}`);
  
  return snapshotPath;
}

/**
 * Compare current snapshot with previous one if available
 */
async function compareWithPreviousSnapshot() {
  try {
    // Find the most recent snapshot
    const files = fs.readdirSync(HISTORY_PATH);
    const snapshots = files
      .filter(file => file.startsWith('structure-snapshot-'))
      .sort()
      .reverse();
    
    if (snapshots.length <= 1) {
      return null; // Not enough snapshots for comparison
    }
    
    const previousSnapshotPath = path.join(HISTORY_PATH, snapshots[1]);
    const previousSnapshot = JSON.parse(fs.readFileSync(previousSnapshotPath, 'utf8'));
    
    // Calculate differences
    const diff = {
      components: structureSnapshot.components - previousSnapshot.components,
      utilities: structureSnapshot.utilities - previousSnapshot.utilities,
      routes: structureSnapshot.routes - previousSnapshot.routes,
      nextSpecialFiles: structureSnapshot.nextSpecialFiles - previousSnapshot.nextSpecialFiles,
      styles: structureSnapshot.styles - previousSnapshot.styles,
      tests: structureSnapshot.tests - previousSnapshot.tests,
      newFolders: structureSnapshot.analyzedDirectories
        .filter(dir => !previousSnapshot.analyzedDirectories.includes(dir)),
      removedFolders: previousSnapshot.analyzedDirectories
        .filter(dir => !structureSnapshot.analyzedDirectories.includes(dir))
    };
    
    return {
      previousTimestamp: previousSnapshot.timestamp,
      currentTimestamp: structureSnapshot.timestamp,
      diff
    };
  } catch (error) {
    console.error('Error comparing snapshots:', error);
    return null;
  }
}

/**
 * Generate compliance recommendations
 */
function generateRecommendations(complianceAnalysis) {
  const recommendations = [];
  
  if (complianceAnalysis.compliance.directoryStructure === "Hybrid") {
    recommendations.push('- **Resolve Hybrid Structure**: Migrate completely to App Router and remove Pages Router components');
  }
  
  if (complianceAnalysis.compliance.directoryStructure === "Legacy") {
    recommendations.push('- **Implement App Router**: Set up the App Router architecture and migrate from Pages Router');
  }
  
  if (!complianceAnalysis.hasProperRootLayout) {
    recommendations.push('- **Add Root Layout**: Create a root layout.tsx file that includes html and body tags');
  }
  
  if (complianceAnalysis.missingSpecialFiles.length > 0) {
    recommendations.push(`- **Add Special Files**: Create missing files: ${complianceAnalysis.missingSpecialFiles.join(', ')}`);
  }
  
  if (structureSnapshot.componentsByFolder) {
    // Find folders with too many components
    const crowdedFolders = Object.entries(structureSnapshot.componentsByFolder)
      .filter(([folder, count]) => count > 5 && !folder.includes('/'))
      .map(([folder]) => folder);
      
    if (crowdedFolders.length > 0) {
      recommendations.push(`- **Organize Components**: Consider grouping components in ${crowdedFolders.join(', ')} by feature or type`);
    }
  }
  
  return recommendations;
}

/**
 * Generate the analysis report
 */
async function generateReport(snapshotPath, comparison, complianceAnalysis) {
  const tree = await generateDirectoryTree(PROJECT_ROOT);
  const recommendations = generateRecommendations(complianceAnalysis);
  
  let comparisonSection = '';
  if (comparison) {
    comparisonSection = `
## Structure Changes Since Last Analysis
- Components: ${comparison.diff.components > 0 ? '+' + comparison.diff.components : comparison.diff.components}
- Utilities: ${comparison.diff.utilities > 0 ? '+' + comparison.diff.utilities : comparison.diff.utilities}
- Routes: ${comparison.diff.routes > 0 ? '+' + comparison.diff.routes : comparison.diff.routes}
- Style files: ${comparison.diff.styles > 0 ? '+' + comparison.diff.styles : comparison.diff.styles}
- Test files: ${comparison.diff.tests > 0 ? '+' + comparison.diff.tests : comparison.diff.tests}

### Folder Changes
- New folders: ${comparison.diff.newFolders.length > 0 ? comparison.diff.newFolders.join(', ') : 'None'}
- Removed folders: ${comparison.diff.removedFolders.length > 0 ? comparison.diff.removedFolders.join(', ') : 'None'}
`;
  }
  
  const report = `# Project Structure Analysis Report
Generated on: ${new Date().toISOString()}

## Next.js Best Practices Compliance

- **App Router Implementation**: ${complianceAnalysis.hasAppRouter ? '✅ Present' : '❌ Missing'}
- **Pages Router Usage**: ${!complianceAnalysis.hasPagesRouter ? '✅ Not used' : '⚠️ Still present'}
- **Root Layout**: ${complianceAnalysis.hasProperRootLayout ? '✅ Proper implementation' : '❌ Missing or incomplete'}
- **Special Files**: ${complianceAnalysis.missingSpecialFiles.length === 0 ? '✅ All present' : `❌ Missing: ${complianceAnalysis.missingSpecialFiles.join(', ')}`}

**Overall Structure Compliance**: ${complianceAnalysis.compliance.overallScore}

## Recommendations for Improvement
${recommendations.length > 0 ? recommendations.join('\n') : '- Structure follows best practices, no critical changes needed'}
${comparisonSection}

## Directory Tree
\`\`\`
${tree}
\`\`\`

## Components (${components.length})
${components.map(c => `- ${c}`).join('\n')}

## Next.js Special Files (${nextSpecialFiles.length})
${nextSpecialFiles.map(f => `- ${f}`).join('\n')}

## Route Components (${routes.length})
${routes.map(r => `- ${r}`).join('\n')}

## Utilities (${utilities.length})
${utilities.map(u => `- ${u}`).join('\n')}

## Styles (${styles.length})
${styles.map(s => `- ${s}`).join('\n')}

## Tests (${tests.length})
${tests.length > 20 ? '(Showing first 20 files)' : ''}
${tests.slice(0, 20).map(t => `- ${t}`).join('\n')}
${tests.length > 20 ? `...and ${tests.length - 20} more test files` : ''}

## Configuration Files (${configs.length})
${configs.map(c => `- ${c}`).join('\n')}

## Other Files (${otherFiles.length})
${otherFiles.length > 20 ? '(Showing first 20 files)' : ''}
${otherFiles.slice(0, 20).map(o => `- ${o}`).join('\n')}
${otherFiles.length > 20 ? `...and ${otherFiles.length - 20} more files` : ''}

## Component Organization Analysis
${Object.entries(structureSnapshot.componentsByFolder)
  .sort(([,a], [,b]) => b - a)
  .map(([folder, count]) => `- ${folder}: ${count} component${count > 1 ? 's' : ''}`)
  .join('\n')}

## Next Steps
1. Review the component organization and identify which components should be moved or reorganized
2. Analyze the routing structure and plan migration to Next.js App Router conventions
3. Plan reorganization of utility functions into appropriate directories
4. Document planned changes in the STRUCTURE_ANALYSIS.md file

---
This report was generated automatically. Previous snapshots are available in the structure history folder.
`;

  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the report
  fs.writeFileSync(OUTPUT_PATH, report);
  console.log(`Analysis report generated at ${OUTPUT_PATH}`);
}

// Main function
async function main() {
  console.log('Starting project structure analysis...');
  await scanDirectory(PROJECT_ROOT);
  
  const complianceAnalysis = await analyzeNextJsCompliance();
  const snapshotPath = await saveStructureSnapshot();
  const comparison = await compareWithPreviousSnapshot();
  
  await generateReport(snapshotPath, comparison, complianceAnalysis);
  console.log('Analysis complete!');
}

main().catch(console.error);
