# List Functionality for Text Editor

This document outlines the current state and planned functionality for lists in the text editor component.

## Current State

The text editor currently supports basic list functionality:

1. **Creating Lists**
   - Creating bullet lists (`ul`)
   - Creating ordered lists (`ol`)
   - Converting paragraphs to list items

2. **Toggling Lists**
   - Converting between bullet and ordered lists
   - Converting list items back to paragraphs

3. **Nested Lists**
   - Basic support for creating nested lists
   - Can create a nested list by selecting text within a list item

4. **Menu Integration**
   - Menu buttons for bullet list and ordered list
   - Active state tracking for lists (highlighting buttons when cursor is in a list)

## Planned Features

1. **Enhanced List Creation**
   - [x] Keyboard shortcuts for creating lists (e.g., `Mod-Shift-8` for bullet lists, `Mod-Shift-9` for ordered lists)
   - [ ] Markdown-style auto-conversion (typing `* ` or `1. ` at the start of a line)
   - [ ] Support for creating lists with multiple selection ranges

2. **List Manipulation**
   - [x] Indenting and outdenting list items (Tab/Shift+Tab)
   - [ ] Splitting list items (Enter within a list item)
   - [ ] Joining list items (Backspace at the start of a list item)
   - [ ] Moving list items up and down

3. **Nested Lists Improvements**
   - [ ] Better visual indicators for nested lists
   - [ ] Support for multiple levels of nesting
   - [ ] Improved handling of selection across nested list boundaries

4. **List Attributes**
   - [ ] Support for custom list markers
   - [ ] List item numbering options (numbers, letters, roman numerals)
   - [ ] Start attribute for ordered lists

5. **Accessibility Improvements**
   - [ ] ARIA attributes for lists
   - [ ] Keyboard navigation between list items
   - [ ] Screen reader announcements for list operations

## Implementation Considerations

1. **Schema**
   - The lists are implemented using ProseMirror's schema-list module
   - List items can contain paragraphs and other block content
   - Nested lists are allowed via the content expression in the schema

2. **Commands**
   - Current implementation uses `toggleList` for basic list creation
   - Need to implement commands for indenting/outdenting list items
   - Need to enhance selection handling across list boundaries

3. **Key Bindings**
   - Add keyboard shortcuts for all list operations
   - Ensure compatibility with existing shortcuts

4. **Testing**
   - Create comprehensive tests for all list operations
   - Test nested list behavior thoroughly
   - Test edge cases (empty lists, lists with mixed content)

5. **User Experience**
   - Ensure intuitive behavior for list creation and manipulation
   - Provide visual feedback for list operations
   - Consider adding tooltips or contextual help

## Technical Approach

1. **ProseMirror Plugins**
   - Implement a custom key handling plugin for list-specific shortcuts
   - Consider a plugin for automatic list creation (Markdown style)

2. **Command Enhancements**
   - Extend `createListCommand` to handle more complex operations
   - Implement indent/outdent commands using ProseMirror's lift and sink operations

3. **Schema Enhancements**
   - Review and possibly extend the list schema to support additional attributes
   - Ensure proper styling for nested lists

4. **Input Rules**
   - Implement input rules for Markdown-style list creation
   - Support for automatically continuing lists when pressing Enter 
