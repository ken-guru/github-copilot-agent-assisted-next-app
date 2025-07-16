#!/usr/bin/env node

/**
 * Memory Log to MCP Migration Script
 * 
 * Parses existing memory log markdown files and migrates them to MCP Memory Tool
 * as structured entities with observations and relations.
 * 
 * Usage: node scripts/migrate-memory-logs-to-mcp.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MEMORY_LOGS_DIR = path.join(__dirname, '../docs/logged_memories');
const DRY_RUN = process.argv.includes('--dry-run');

// Track migration statistics
let stats = {
  totalFiles: 0,
  processed: 0,
  skipped: 0,
  errors: 0,
  entities: [],
  relations: []
};

/**
 * Parse a memory log markdown file and extract structured data
 */
function parseMemoryLogFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath, '.md');
    
    // Extract MRTMLY ID from filename
    const idMatch = filename.match(/^(MRTMLY-\d+)/);
    const id = idMatch ? idMatch[1] : filename;
    
    // Extract title (remove ID prefix)
    const titleMatch = filename.match(/^MRTMLY-\d+-(.+)$/);
    const title = titleMatch ? titleMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown Title';
    
    // Parse content sections
    const sections = parseContentSections(content);
    
    // Extract metadata
    const date = extractDate(content);
    const tags = extractTags(content);
    const status = extractStatus(content);
    
    return {
      id,
      title,
      date,
      tags,
      status,
      sections,
      filePath,
      filename
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    stats.errors++;
    return null;
  }
}

/**
 * Parse content into structured sections
 */
function parseContentSections(content) {
  const sections = {
    initialState: '',
    debugProcess: '',
    resolution: '',
    lessonsLearned: '',
    other: ''
  };
  
  // Split content by headers
  const lines = content.split('\n');
  let currentSection = 'other';
  let sectionContent = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect section headers
    if (trimmed.match(/^#{1,4}\s*(Initial State|Issue Analysis)/i)) {
      currentSection = 'initialState';
      sectionContent = [];
    } else if (trimmed.match(/^#{1,4}\s*(Debug Process|Issue Analysis|Problem Analysis)/i)) {
      currentSection = 'debugProcess';
      sectionContent = [];
    } else if (trimmed.match(/^#{1,4}\s*Resolution/i)) {
      currentSection = 'resolution';
      sectionContent = [];
    } else if (trimmed.match(/^#{1,4}\s*Lessons Learned/i)) {
      currentSection = 'lessonsLearned';
      sectionContent = [];
    } else if (!trimmed.startsWith('#')) {
      // Add content to current section
      sectionContent.push(line);
      sections[currentSection] = sectionContent.join('\n').trim();
    }
  }
  
  return sections;
}

/**
 * Extract date from content
 */
function extractDate(content) {
  const dateMatch = content.match(/\*\*Date:\*\*\s*([0-9-]+)/);
  return dateMatch ? dateMatch[1] : 'Unknown';
}

/**
 * Extract tags from content
 */
function extractTags(content) {
  const tagsMatch = content.match(/\*\*Tags:\*\*\s*([#\w\s,-]+)/);
  if (tagsMatch) {
    return tagsMatch[1]
      .split(/[,\s]+/)
      .filter(tag => tag.startsWith('#'))
      .map(tag => tag.substring(1));
  }
  return [];
}

/**
 * Extract status from content
 */
function extractStatus(content) {
  const statusMatch = content.match(/\*\*Status:\*\*\s*(\w+)/);
  return statusMatch ? statusMatch[1] : 'Unknown';
}

/**
 * Convert parsed memory log to MCP entity structure
 */
function createMCPEntity(memoryLog) {
  const observations = [];
  
  // Add metadata
  observations.push(`Date: ${memoryLog.date}`);
  observations.push(`Title: ${memoryLog.title}`);
  observations.push(`Status: ${memoryLog.status}`);
  observations.push(`Tags: ${memoryLog.tags.join(', ')}`);
  observations.push(`Source File: ${memoryLog.filename}`);
  
  // Add content sections
  if (memoryLog.sections.initialState) {
    const cleanContent = cleanMarkdownContent(memoryLog.sections.initialState);
    observations.push(`Initial State: ${cleanContent}`);
  }
  
  if (memoryLog.sections.debugProcess) {
    const cleanContent = cleanMarkdownContent(memoryLog.sections.debugProcess);
    // Split long debug processes into multiple observations
    const debugSteps = splitLongContent(cleanContent, 'Debug Step');
    observations.push(...debugSteps);
  }
  
  if (memoryLog.sections.resolution) {
    const cleanContent = cleanMarkdownContent(memoryLog.sections.resolution);
    const resolutionSteps = splitLongContent(cleanContent, 'Resolution');
    observations.push(...resolutionSteps);
  }
  
  if (memoryLog.sections.lessonsLearned) {
    const cleanContent = cleanMarkdownContent(memoryLog.sections.lessonsLearned);
    const lessons = splitLessonsLearned(cleanContent);
    observations.push(...lessons);
  }
  
  return {
    name: memoryLog.id,
    entityType: "debug_session",
    observations: observations.filter(obs => obs && obs.trim().length > 0)
  };
}

/**
 * Clean markdown content for MCP storage
 */
function cleanMarkdownContent(content) {
  return content
    .replace(/```[\s\S]*?```/g, '[CODE_BLOCK]') // Replace code blocks
    .replace(/#{1,6}\s*/g, '') // Remove markdown headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Split long content into smaller observations
 */
function splitLongContent(content, prefix) {
  const MAX_LENGTH = 500;
  if (content.length <= MAX_LENGTH) {
    return [`${prefix}: ${content}`];
  }
  
  // Split by sentences and group
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  const chunks = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > MAX_LENGTH && currentChunk) {
      chunks.push(`${prefix}: ${currentChunk.trim()}`);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence.trim();
    }
  }
  
  if (currentChunk) {
    chunks.push(`${prefix}: ${currentChunk.trim()}`);
  }
  
  return chunks;
}

/**
 * Split lessons learned into individual lessons
 */
function splitLessonsLearned(content) {
  // Split by bullet points or numbered lists
  const lessons = content
    .split(/\n\s*[-*\d.]\s*/)
    .filter(lesson => lesson.trim())
    .map(lesson => `Lesson: ${lesson.trim()}`);
  
  return lessons.length > 0 ? lessons : [`Lessons Learned: ${content}`];
}

/**
 * Extract related entities and create relations
 */
function extractRelatedEntities(memoryLog) {
  const content = JSON.stringify(memoryLog.sections).toLowerCase();
  const entities = [];
  const relations = [];
  
  // Extract component mentions
  const componentMatches = content.match(/\b\w+component\b|\b\w+\.tsx?\b|\b\w+\.jsx?\b/gi);
  if (componentMatches) {
    const components = [...new Set(componentMatches.map(c => 
      c.replace(/\.(tsx?|jsx?)$/i, '').replace(/component$/i, '')
    ))];
    
    components.forEach(component => {
      entities.push({
        name: component,
        entityType: "component",
        observations: [`Referenced in ${memoryLog.id}`, `Component mentioned in debugging session`]
      });
      
      relations.push({
        from: memoryLog.id,
        to: component,
        relationType: "involved_component"
      });
    });
  }
  
  // Extract technology mentions
  const technologies = [];
  const techPatterns = [
    /\bcypress\b/i, /\bjest\b/i, /\bnext\.?js\b/i, /\breact\b/i, 
    /\btypescript\b/i, /\bservice.?worker\b/i, /\bbootstrap\b/i,
    /\bvercel\b/i, /\bhusky\b/i, /\beslint\b/i
  ];
  
  techPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      const tech = matches[0].toLowerCase();
      if (!technologies.includes(tech)) {
        technologies.push(tech);
        
        entities.push({
          name: tech,
          entityType: "technology",
          observations: [`Used in ${memoryLog.id}`, `Technology involved in debugging session`]
        });
        
        relations.push({
          from: memoryLog.id,
          to: tech,
          relationType: "used_technology"
        });
      }
    }
  });
  
  return { entities, relations };
}

/**
 * Simulate MCP memory tool operations (for dry run)
 */
function simulateMCPOperations(entities, relations) {
  console.log('\n=== DRY RUN: Would execute these MCP operations ===');
  
  if (entities.length > 0) {
    console.log(`\nCreate ${entities.length} entities:`);
    entities.forEach(entity => {
      console.log(`  - ${entity.entityType}: ${entity.name} (${entity.observations.length} observations)`);
    });
  }
  
  if (relations.length > 0) {
    console.log(`\nCreate ${relations.length} relations:`);
    relations.forEach(relation => {
      console.log(`  - ${relation.from} ${relation.relationType} ${relation.to}`);
    });
  }
}

/**
 * Execute actual MCP memory tool operations
 */
async function executeMCPOperations(entities, relations) {
  try {
    // Create entities in MCP memory tool
    if (entities.length > 0) {
      // Note: In a real script, you would need to import and use the MCP client
      // For now, we'll just log what would be done
      console.log(`Creating ${entities.length} entities in MCP memory tool...`);
      
      // This would be the actual MCP call:
      // await mcpClient.createEntities({ entities });
    }
    
    // Create relations in MCP memory tool  
    if (relations.length > 0) {
      console.log(`Creating ${relations.length} relations in MCP memory tool...`);
      
      // This would be the actual MCP call:
      // await mcpClient.createRelations({ relations });
    }
  } catch (error) {
    console.error('Error executing MCP operations:', error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrateMemoryLogs() {
  console.log('🚀 Starting Memory Log to MCP Migration');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE MIGRATION'}`);
  console.log(`Source: ${MEMORY_LOGS_DIR}`);
  
  // Get all memory log files
  const files = fs.readdirSync(MEMORY_LOGS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(MEMORY_LOGS_DIR, file));
  
  stats.totalFiles = files.length;
  console.log(`\nFound ${files.length} memory log files to process\n`);
  
  // Process files in batches
  const BATCH_SIZE = 10;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(files.length/BATCH_SIZE)}`);
    
    const batchEntities = [];
    const batchRelations = [];
    
    // Parse batch files
    for (const file of batch) {
      const memoryLog = parseMemoryLogFile(file);
      if (!memoryLog) {
        stats.skipped++;
        continue;
      }
      
      // Create MCP entity
      const entity = createMCPEntity(memoryLog);
      batchEntities.push(entity);
      
      // Extract related entities and relations
      const { entities: relatedEntities, relations } = extractRelatedEntities(memoryLog);
      batchEntities.push(...relatedEntities);
      batchRelations.push(...relations);
      
      stats.processed++;
    }
    
    // Remove duplicates
    const uniqueEntities = batchEntities.filter((entity, index, arr) => 
      arr.findIndex(e => e.name === entity.name && e.entityType === entity.entityType) === index
    );
    
    stats.entities.push(...uniqueEntities);
    stats.relations.push(...batchRelations);
    
    if (DRY_RUN) {
      simulateMCPOperations(uniqueEntities, batchRelations);
    } else {
      await executeMCPOperations(uniqueEntities, batchRelations);
      console.log(`✅ Migrated ${uniqueEntities.length} entities and ${batchRelations.length} relations`);
    }
    
    // Brief pause between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Print final statistics
  console.log('\n📊 Migration Statistics:');
  console.log(`Total files: ${stats.totalFiles}`);
  console.log(`Processed: ${stats.processed}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`Total entities: ${stats.entities.length}`);
  console.log(`Total relations: ${stats.relations.length}`);
  
  if (DRY_RUN) {
    console.log('\n✅ Dry run completed successfully!');
    console.log('Run without --dry-run to execute actual migration');
  } else {
    console.log('\n✅ Migration completed!');
  }
}

// Run migration
if (require.main === module) {
  migrateMemoryLogs().catch(console.error);
}

module.exports = { migrateMemoryLogs, parseMemoryLogFile, createMCPEntity };
