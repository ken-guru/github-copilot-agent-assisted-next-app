#!/usr/bin/env python3
import re
import os

def fix_timeline_test_file(file_path):
    """Fix Timeline test file to include ToastProvider wrapper"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Fix render( calls to include ToastProvider
    # Pattern to match render( followed by <Timeline ... />
    pattern = r'render\(\s*(<Timeline[^>]*(?:\s[^>]*)?>[\s\S]*?<\/Timeline>)\s*\);'
    
    def replacement(match):
        timeline_content = match.group(1)
        return f'render(\n      <ToastProvider>\n        {timeline_content}\n      </ToastProvider>\n    );'
    
    content = re.sub(pattern, replacement, content)
    
    # Also handle rerender cases
    pattern = r'rerender\(\s*(<Timeline[^>]*(?:\s[^>]*)?>[\s\S]*?<\/Timeline>)\s*\);'
    
    def rerender_replacement(match):
        timeline_content = match.group(1)
        return f'rerender(\n      <ToastProvider>\n        {timeline_content}\n      </ToastProvider>\n    );'
    
    content = re.sub(pattern, rerender_replacement, content)
    
    with open(file_path, 'w') as f:
        f.write(content)

# Fix the Timeline.breaks.test.tsx file
fix_timeline_test_file('/Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/src/components/__tests__/Timeline.breaks.test.tsx')
print("Fixed Timeline.breaks.test.tsx")
