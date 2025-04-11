const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readDirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const renameAsync = promisify(fs.rename);

const MEMORIES_DIR = path.join(__dirname, '..', 'docs', 'logged_memories');
const MEMORY_LOG_PATH = path.join(__dirname, '..', 'docs', 'MEMORY_LOG.md');

/**
 * Extract date from file content
 * @param {string} content - File content
 * @returns {Date|null} - Extracted date or null if not found
 */
function extractDateFromContent(content) {
  const dateMatch = content.match(/\*\*Date:\*\* (\d{4}-\d{2}-\d{2})/);
  if (dateMatch && dateMatch[1]) {
    return new Date(dateMatch[1]);
  }
  return null;
}

/**
 * Extract title/description from file content or filename
 * @param {string} content - File content
 * @param {string} filename - Original filename
 * @returns {string} - Descriptive title for the memory log entry
 */
function extractTitle(content, filename) {
  // Try to extract from content first
  const titleMatch = content.match(/### Issue:[ \t]*(MRTMLY-\d+:)?[ \t]*([^\n]+)/);
  if (titleMatch && titleMatch[2]) {
    return titleMatch[2].trim();
  }
  
  // Fall back to filename
  const filenameWithoutId = filename.replace(/MRTMLY-\d+[-]?/, '').replace(/\.md$/, '');
  return filenameWithoutId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Extract tags from file content
 * @param {string} content - File content
 * @returns {string[]} - Array of tags
 */
function extractTags(content) {
  const tagMatch = content.match(/\*\*Tags:\*\* ([^\n]+)/);
  if (tagMatch && tagMatch[1]) {
    return tagMatch[1].trim().split(' ');
  }
  return [];
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Group entries by month in format "YYYY-MM"
 * @param {Array} entries - Memory log entries
 * @returns {Object} - Entries grouped by month
 */
function groupEntriesByMonth(entries) {
  const grouped = {};
  
  entries.forEach(entry => {
    const month = entry.date.toISOString().substring(0, 7); // YYYY-MM
    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(entry);
  });
  
  return grouped;
}

/**
 * Format a month header for the memory log
 * @param {string} monthStr - Month string in format "YYYY-MM"
 * @returns {string} - Formatted month header
 */
function formatMonthHeader(monthStr) {
  const [year, month] = monthStr.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthName = monthNames[parseInt(month, 10) - 1];
  return `## ${monthName} ${year}`;
}

/**
 * Preserve the content up to the end of the template markdown block
 * @param {string} content - Full memory log content
 * @returns {string} - Content up to the end of template
 */
function preserveTemplatePortion(content) {
  // Find the end of the memory template section (after the closing triple backticks)
  const templateEndMatch = content.match(/## Memory Template[\s\S]*?```(?:markdown)?[\s\S]*?```/);
  
  if (templateEndMatch) {
    const endIndex = templateEndMatch.index + templateEndMatch[0].length;
    return content.substring(0, endIndex) + '\n\n';
  }
  
  // If pattern not found, return a sensible default
  return '# Memory Log\n\n*Error: Could not find template section.*\n\n';
}

/**
 * Main function to rebuild memory log
 */
async function rebuildMemoryLog() {
  try {
    console.log('Starting memory log rebuild process...');
    
    // Read existing memory log to preserve template portion
    let originalContent = '';
    try {
      originalContent = await readFileAsync(MEMORY_LOG_PATH, 'utf-8');
      console.log('Successfully read original memory log file');
    } catch (error) {
      console.error('Could not read original memory log:', error.message);
      console.log('Will use default template');
    }
    
    const templatePortion = preserveTemplatePortion(originalContent);
    
    // 1. Read all files in the memory log directory
    const files = await readDirAsync(MEMORIES_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`Found ${mdFiles.length} memory log entries`);
    
    // 2. Process each file to extract metadata
    const entries = await Promise.all(mdFiles.map(async (filename) => {
      const filePath = path.join(MEMORIES_DIR, filename);
      const content = await readFileAsync(filePath, 'utf-8');
      const stats = await statAsync(filePath);
      
      // Extract date from content or fall back to file creation date
      const contentDate = extractDateFromContent(content);
      const fileDate = stats.birthtime || stats.mtime;
      const date = contentDate || fileDate;
      
      const title = extractTitle(content, filename);
      const tags = extractTags(content);
      
      return {
        originalFilename: filename,
        title,
        date,
        tags,
        content,
        filePath
      };
    }));
    
    // 3. Sort entries by date
    entries.sort((a, b) => a.date - b.date);
    
    // 4. Rename files with sequential IDs
    const renamedEntries = await Promise.all(entries.map(async (entry, index) => {
      const id = (index + 1).toString().padStart(3, '0');
      
      // Extract descriptive part from original filename or generate from title
      let descriptivePart = entry.originalFilename
        .replace(/MRTMLY-\d+[-]?/, '')
        .replace(/\.md$/, '');
      
      if (!descriptivePart) {
        descriptivePart = entry.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      
      const newFilename = `MRTMLY-${id}-${descriptivePart}.md`;
      const newFilePath = path.join(MEMORIES_DIR, newFilename);
      
      // Only rename if necessary
      if (entry.originalFilename !== newFilename) {
        console.log(`Renaming: ${entry.originalFilename} -> ${newFilename}`);
        await renameAsync(entry.filePath, newFilePath);
      }
      
      return {
        ...entry,
        id,
        newFilename,
        newFilePath
      };
    }));
    
    // 5. Generate new MEMORY_LOG.md content
    console.log('Generating new MEMORY_LOG.md content...');
    
    // Start with the preserved template portion
    let logContent = templatePortion;
    
    // Add section for memory index
    logContent += `## Memory Index\n\n`;
    
    // Add all entries by ID for quick reference
    renamedEntries.forEach(entry => {
      const tagStr = entry.tags.length > 0 ? ` ${entry.tags.join(' ')}` : '';
      logContent += `- [MRTMLY-${entry.id}: ${entry.title}](/docs/logged_memories/${entry.newFilename})${tagStr}\n`;
    });
    
    logContent += '\n';
    
    // Add entries grouped by month
    const entriesByMonth = groupEntriesByMonth(renamedEntries);
    const sortedMonths = Object.keys(entriesByMonth).sort().reverse();
    
    sortedMonths.forEach(month => {
      logContent += `${formatMonthHeader(month)}\n\n`;
      
      entriesByMonth[month].forEach(entry => {
        const dateStr = formatDate(entry.date);
        const tagStr = entry.tags.length > 0 ? ` ${entry.tags.join(' ')}` : '';
        
        logContent += `- [MRTMLY-${entry.id}: ${entry.title}](/docs/logged_memories/${entry.newFilename}) - ${dateStr}${tagStr}\n`;
      });
      
      logContent += '\n';
    });
    
    // 6. Write new MEMORY_LOG.md
    await writeFileAsync(MEMORY_LOG_PATH, logContent);
    
    // 7. Remove the incorrect memory log file at the root if it exists
    const rootMemoryLogPath = path.join(__dirname, '..', 'MEMORY_LOG.md');
    try {
      await fs.promises.access(rootMemoryLogPath);
      // If no error, the file exists
      await fs.promises.unlink(rootMemoryLogPath);
      console.log('Removed incorrect memory log file at project root');
    } catch (e) {
      // File doesn't exist, which is fine
    }
    
    console.log(`Memory Log rebuild complete! Processed ${renamedEntries.length} entries.`);
    console.log('The new MEMORY_LOG.md has been generated in the docs directory.');
  } catch (error) {
    console.error('Error rebuilding memory log:', error);
  }
}

// Run the rebuild function
rebuildMemoryLog();
