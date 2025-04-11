const fs = require('fs');
const path = require('path');
const { 
  extractDateFromContent, 
  extractTitle, 
  extractTags, 
  formatDate, 
  groupEntriesByMonth, 
  formatMonthHeader,
  preserveTemplatePortion
} = require('../rebuildMemoryLog');

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn(),
    rename: jest.fn(),
    writeFile: jest.fn(),
  },
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

describe('Memory Log Rebuild Script', () => {
  describe('extractDateFromContent', () => {
    it('should extract date from content with proper format', () => {
      const content = `
        ### Issue: Test Issue
        **Date:** 2023-05-15
        **Tags:** #test #example
      `;
      
      const result = extractDateFromContent(content);
      expect(result).toEqual(new Date('2023-05-15'));
    });
    
    it('should return null if no date is found', () => {
      const content = `
        ### Issue: Test Issue
        **Status:** In Progress
      `;
      
      const result = extractDateFromContent(content);
      expect(result).toBeNull();
    });
  });
  
  describe('extractTitle', () => {
    it('should extract title from content', () => {
      const content = `
        ### Issue: Test Issue Title
        **Date:** 2023-05-15
      `;
      
      const result = extractTitle(content, 'MRTMLY-001-example-file.md');
      expect(result).toBe('Test Issue Title');
    });
    
    it('should fall back to formatted filename if title not found in content', () => {
      const content = `
        **Date:** 2023-05-15
        **Tags:** #test
      `;
      
      const result = extractTitle(content, 'MRTMLY-001-example-file-name.md');
      expect(result).toBe('Example File Name');
    });
  });
  
  describe('extractTags', () => {
    it('should extract tags from content', () => {
      const content = `
        ### Issue: Test Issue
        **Date:** 2023-05-15
        **Tags:** #test #example #debugging
      `;
      
      const result = extractTags(content);
      expect(result).toEqual(['#test', '#example', '#debugging']);
    });
    
    it('should return empty array if no tags found', () => {
      const content = `
        ### Issue: Test Issue
        **Date:** 2023-05-15
        **Status:** In Progress
      `;
      
      const result = extractTags(content);
      expect(result).toEqual([]);
    });
  });
  
  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      const result = formatDate(date);
      expect(result).toBe('2023-05-15');
    });
  });
  
  describe('groupEntriesByMonth', () => {
    it('should group entries by month', () => {
      const entries = [
        { date: new Date('2023-05-15'), id: '001' },
        { date: new Date('2023-05-20'), id: '002' },
        { date: new Date('2023-06-10'), id: '003' },
      ];
      
      const result = groupEntriesByMonth(entries);
      expect(Object.keys(result)).toEqual(['2023-05', '2023-06']);
      expect(result['2023-05'].length).toBe(2);
      expect(result['2023-06'].length).toBe(1);
    });
  });
  
  describe('formatMonthHeader', () => {
    it('should format month header correctly', () => {
      expect(formatMonthHeader('2023-05')).toBe('## May 2023');
      expect(formatMonthHeader('2022-12')).toBe('## December 2022');
    });
  });
  
  describe('preserveTemplatePortion', () => {
    it('should preserve content up to the end of template markdown block', () => {
      const content = `
# Memory Log

This document tracks solutions and approaches.

## Memory Template
\`\`\`markdown
Template content
here
\`\`\`

## Memory Index
- Entry 1
- Entry 2
      `;
      
      const result = preserveTemplatePortion(content);
      expect(result).toContain('# Memory Log');
      expect(result).toContain('## Memory Template');
      expect(result).toContain('Template content');
      expect(result).toContain('```');
      expect(result).not.toContain('## Memory Index');
      expect(result).not.toContain('- Entry 1');
    });
  });
});
