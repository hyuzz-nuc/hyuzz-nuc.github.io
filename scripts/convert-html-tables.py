#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Convert HTML tables to Markdown tables in Hugo blog posts"""

import re
import os

def convert_html_table_to_markdown(table_html):
    """Convert a single HTML table to Markdown format"""
    # Extract all rows
    rows = re.findall(r'<tr>(.*?)</tr>', table_html, re.DOTALL)
    
    if not rows:
        return table_html
    
    markdown_lines = []
    
    for i, row in enumerate(rows):
        # Extract cells (td or th)
        cells = re.findall(r'<t[dh]>(.*?)</t[dh]>', row, re.DOTALL)
        
        if not cells:
            continue
        
        # Clean cell content
        cleaned_cells = []
        for cell in cells:
            # Remove <br/> tags
            cell = re.sub(r'<br\s*/?>', '', cell)
            # Trim whitespace
            cell = cell.strip()
            # Escape pipe characters
            cell = cell.replace('|', '\\|')
            cleaned_cells.append(cell)
        
        # Build markdown row
        markdown_lines.append('| ' + ' | '.join(cleaned_cells) + ' |')
        
        # Add separator after header row
        if i == 0:
            separator = '| ' + ' | '.join(['---'] * len(cleaned_cells)) + ' |'
            markdown_lines.append(separator)
    
    return '\n'.join(markdown_lines)

def convert_file(filepath):
    """Convert all HTML tables in a file to Markdown"""
    print(f"Processing: {filepath}")
    
    if not os.path.exists(filepath):
        print(f"  File not found, skipping")
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all HTML tables
    tables = re.findall(r'<table>.*?</table>', content, re.DOTALL)
    
    if not tables:
        print(f"  No HTML tables found")
        return
    
    print(f"  Found {len(tables)} table(s)")
    
    # Replace each table
    for table in tables:
        markdown_table = convert_html_table_to_markdown(table)
        content = content.replace(table, markdown_table)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  [OK] Converted")

def main():
    files = [
        r"E:\hugo\my-blog\content\posts\JHipster + Spring Boot 微服务架构完整指南.md",
        r"E:\hugo\my-blog\content\posts\数据库选型指南.md"
    ]
    
    for filepath in files:
        convert_file(filepath)
    
    print("\nAll files processed!")

if __name__ == '__main__':
    main()
