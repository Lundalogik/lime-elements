# ProseMirror Menu Commands Functionality Analysis

## Current Command Types
From `EditorMenuTypes`:
1. Text Formatting
   - Bold (`strong`)
   - Italic (`em`)
   - Strikethrough (`strikethrough`)
   - Code (`code`)

2. Block Formatting
   - Headers (levels 1-3)
   - Blockquote
   - Code Block

3. Lists
   - Bullet List
   - Ordered List

4. Links
   - Link insertion/editing

## Current Command Implementations

### Core Command Functions
1. `createToggleMarkCommand`: Handles inline formatting (bold, italic, etc.)
2. `createInsertLinkCommand`: Manages link creation and editing
3. `createSetNodeTypeCommand`: Handles block-level formatting (headers, code blocks)
4. `createWrapInCommand`: Manages wrapping content (blockquotes)
5. `createListCommand`: Handles list operations
6. `toggleNodeType`: Core function for toggling block types

### Helper Functions
1. `isExternalLink`: Validates if a link is external
2. `isValidUrl`: Validates URL format
3. `setActiveMethodForNode`: Sets active state for node commands
4. `setActiveMethodForWrap`: Sets active state for wrap commands
5. `setActiveMethodForMark`: Sets active state for mark commands

## Required Test Coverage

### Text Formatting Tests
- [ ] Toggle bold on/off
- [ ] Toggle italic on/off
- [ ] Toggle strikethrough on/off
- [ ] Toggle inline code on/off
- [ ] Multiple marks on same text
- [ ] Empty selection handling

### Block Formatting Tests
- [ ] Convert to/from headers (all levels)
- [ ] Toggle blockquote
- [ ] Toggle code block
- [ ] Nested block handling

### List Tests (Current)
- [x] Convert paragraph to bullet list
- [ ] Convert paragraph to ordered list
- [x] Toggle between bullet and ordered lists
- [x] Toggle list off back to paragraph
- [x] Multiple line selections
- [x] Nested lists
- [x] Active state tracking

### Link Tests
- [ ] Create new link
- [ ] Edit existing link
- [ ] Remove link
- [ ] External vs internal link handling
- [ ] Copy-paste link functionality

### Edge Cases
- [ ] Empty document handling
- [ ] Mixed content selection
- [ ] Nested structure preservation
- [ ] Command chaining (e.g., bold inside list)
- [ ] Selection preservation after command execution

## Notes
1. All commands must preserve existing functionality
2. Active state tracking must be maintained
3. Commands should handle both single and multiple selections
4. Keyboard shortcuts must continue working
5. Command factory pattern must be preserved
