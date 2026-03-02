# Text Editor Testing Suite Guide

This document serves as the practical guide for writing tests using the text editor testing utilities.

## Overview

Our testing suite provides a complete set of utilities to help you effectively test your ProseMirror-based components:

- Schema setup for testing
- Editor state and view creation
- Content generation
- Command testing
- Event simulation
- Mocks and helpers

## Available Utilities

### 1. Schema Setup

- `createTestSchema()` - Creates a standard ProseMirror schema with all needed marks and nodes
- `createCustomTestSchema(options)` - Creates a custom schema with specified extensions

```typescript
// Create a standard schema with all marks and nodes
const schema = createTestSchema();

// Create a custom schema with only specific features
const customSchema = createCustomTestSchema({
  addLists: true,         // Add ordered and bullet list support
  addStrikethrough: true, // Add strikethrough mark
  addUnderline: false     // Skip underline mark
});
```

### 2. Editor State Utilities

- `createEditorState(content?, schema?, plugins?)` - Creates an editor state with optional content
- `createEditorStateWithSelection(content, from, to, schema?, plugins?)` - Creates an editor state with a specific selection
- `setTextSelection(state, from, to?)` - Sets a text selection on an existing state

```typescript
// Create an empty editor state
const emptyState = createEditorState();

// Create state with HTML content
const state = createEditorState('<p>This is <strong>bold</strong> text.</p>');

// Create state with selection (from position 5 to 10)
const stateWithSelection = createEditorStateWithSelection(
  '<p>Select this text</p>', 
  5, 
  10
);

// Add a text selection to an existing state
const newState = setTextSelection(state, 1, 5);
```

### 3. Editor View Utilities

- `createEditorView(state?, dispatchSpy?, parentElement?)` - Creates a ProseMirror editor view with optional dispatch spy
- `createDispatchSpy(autoUpdate?)` - Creates a Jest spy function for tracking dispatch calls
- `cleanupEditorView(view, container?)` - Properly destroys an editor view to prevent memory leaks
- `mockProseMirrorDOMEnvironment()` - Sets up the DOM environment for ProseMirror in Node.js

```typescript
// Create a view with state
const { view, container } = createEditorView(state);

// Create a view with dispatch tracking
const dispatchSpy = createDispatchSpy(true); // autoUpdate=true
const { view: viewWithSpy } = createEditorView(state, dispatchSpy);

// Create a view with custom parent element
const parent = document.createElement('div');
const { view: viewWithParent } = createEditorView(state, null, parent);

// Clean up after testing
cleanupEditorView(view, container);

// Mock DOM environment for Node.js tests
const cleanup = mockProseMirrorDOMEnvironment();
// ... test code ...
cleanup(); // Restore original environment
```

### 4. Content Generation

- `createDocWithText(text, schema?)` - Creates a document with plain text
- `createDocWithHTML(html, schema?)` - Creates a document from HTML string
- `createDocWithFormattedText(text, marks, schema?)` - Creates a document with marked text
- `createDocWithBulletList(items, schema?)` - Creates a document with a bullet list
- `createDocWithHeading(text, level?, schema?)` - Creates a document with a heading
- `createDocWithBlockquote(text, schema?)` - Creates a document with a blockquote
- `createDocWithCodeBlock(code, schema?)` - Creates a document with a code block

```typescript
// Create documents with different content types
const textDoc = createDocWithText('Simple text');
const htmlDoc = createDocWithHTML('<p>HTML <em>content</em></p>');

// Create a document with formatted text
const formattedDoc = createDocWithFormattedText('Bold and italic text', [
  { type: 'strong', attrs: {} },           // Apply to all text
  { type: 'em', attrs: {}, from: 0, to: 4 } // Only apply to "Bold"
]);

// Create various structured documents
const listDoc = createDocWithBulletList(['Item 1', 'Item 2', 'Item 3']);
const headingDoc = createDocWithHeading('Section Title', 2); // h2
const quoteDoc = createDocWithBlockquote('Famous quote here');
const codeDoc = createDocWithCodeBlock('function test() { return true; }');
```

### 5. Command Testing

- `testCommand(command, state, expected)` - Tests a command and verifies the result
- `getCommandResult(command, state)` - Gets the result of applying a command
- `testCommandWithView(command, state, expected)` - Tests a command that requires view context
- `createCommandTester(command)` - Creates a reusable tester for a specific command

```typescript
// Test if a command can be applied
const result = getCommandResult(toggleMark(schema.marks.strong), state);
expect(result.canApply).toBe(true);

// Test a command with expectations
testCommand(toggleMark(schema.marks.strong), state, {
  shouldApply: true,                         // Command should apply
  docChanged: true,                          // Document should change
  selectionChanged: false,                   // Selection should not change
  storedMarksChanged: false                  // Stored marks should not change
});

// Create a reusable command tester
const testBold = createCommandTester(toggleMark(schema.marks.strong));
testBold(state1, { shouldApply: true });
testBold(state2, { shouldApply: false });

// Test a command that requires view context
testCommandWithView(someViewCommand, state, {
  shouldApply: true,
  // other expectations...
});
```

### 6. Mocks

- `createDispatchSpy()` - Creates a Jest spy for the dispatch function
- `mockProseMirrorDOMEnvironment()` - Sets up the DOM environment for ProseMirror

```typescript
// Create a dispatch spy with auto-updating state
const dispatchSpy = createDispatchSpy(true);
const { view } = createEditorView(state, dispatchSpy);

// Execute a command that should dispatch
someCommand(view.state, view.dispatch, view);

// Verify dispatch was called
expect(dispatchSpy).toHaveBeenCalled();

// Get the latest state after updates
const updatedState = dispatchSpy.state;
```

### 7. Selection Helpers

- `setTextSelection(state, from, to)` - Creates a text selection
- `setNodeSelection(state, pos)` - Creates a node selection (planned)

```typescript
// Create a state with a selection
let state = createEditorState('<p>Select this text</p>');

// Apply a text selection from position 3 to 9
state = setTextSelection(state, 3, 9);
expect(state.selection.from).toBe(3);
expect(state.selection.to).toBe(9);
```

### 8. Event Simulation

- `simulateKeyPress(view, key, modifiers?)` - Simulates a key press on the editor
- `simulatePaste(view, content)` - Simulates pasting content into the editor
- `simulateClick(view, clientX, clientY, options?)` - Simulates a mouse click
- `simulateDragAndDrop(view, startX, startY, endX, endY, dragData?)` - Simulates drag and drop

```typescript
// Simulate keyboard shortcuts
simulateKeyPress(view, 'b', { ctrl: true }); // Ctrl+B for bold
simulateKeyPress(view, 'z', { ctrl: true }); // Ctrl+Z for undo
simulateKeyPress(view, 'Tab'); // Tab key

// Simulate paste with both text and HTML
simulatePaste(view, {
  text: 'Plain text',
  html: '<p><strong>Formatted</strong> HTML</p>'
});

// Simulate mouse interactions
simulateClick(view, 100, 150); // Click at x=100, y=150
simulateDragAndDrop(view, 50, 50, 200, 50); // Drag from x=50 to x=200
```

## Common Testing Patterns

### Basic Test Setup

```typescript
import { 
  createTestSchema, 
  createEditorState, 
  createEditorView,
  cleanupEditorView 
} from '../test-setup/test-utils';

describe('Text Editor', () => {
  let schema, state, view, container;
  
  beforeEach(() => {
    schema = createTestSchema();
    state = createEditorState('<p>Test content</p>', schema);
    const result = createEditorView(state);
    view = result.view;
    container = result.container;
  });
  
  afterEach(() => {
    cleanupEditorView(view, container);
  });
  
  it('should render content correctly', () => {
    expect(view.dom.textContent).toContain('Test content');
  });
});
```

### Testing Commands

```typescript
import {
  createTestSchema,
  createEditorStateWithSelection,
  testCommand
} from '../test-setup/test-utils';
import { toggleMark } from 'prosemirror-commands';

describe('Bold Command', () => {
  let schema;
  
  beforeEach(() => {
    schema = createTestSchema();
  });
  
  it('should apply bold to selected text', () => {
    // Create state with text selection
    const state = createEditorStateWithSelection('<p>Test content</p>', 1, 5);
    
    // Test the bold command
    const boldMark = schema.marks.strong;
    testCommand(toggleMark(boldMark), state, {
      shouldApply: true,
      docChanged: true
    });
  });
  
  it('should toggle off bold when already applied', () => {
    // Create state with bold text and selection
    const state = createEditorStateWithSelection(
      '<p><strong>Test</strong> content</p>', 
      1, 5
    );
    
    // Test the bold command (should toggle off)
    const boldMark = schema.marks.strong;
    testCommand(toggleMark(boldMark), state, {
      shouldApply: true,
      docChanged: true
    });
    
    // Verify bold was removed (use the resulting state from testCommand)
    // ...
  });
});
```

### Testing Keyboard Shortcuts

```typescript
import {
  createTestSchema,
  createEditorState,
  createEditorView,
  setTextSelection,
  simulateKeyPress,
  cleanupEditorView
} from '../test-setup/test-utils';

describe('Keyboard Shortcuts', () => {
  let schema, view, container;
  
  beforeEach(() => {
    schema = createTestSchema();
    const state = createEditorState('<p>Test content</p>', schema);
    const result = createEditorView(state);
    view = result.view;
    container = result.container;
  });
  
  afterEach(() => {
    cleanupEditorView(view, container);
  });
  
  it('should apply bold with Ctrl+B', () => {
    // Set selection
    const newState = setTextSelection(view.state, 1, 5);
    view.dispatch(newState.tr);
    
    // Simulate Ctrl+B
    simulateKeyPress(view, 'b', { ctrl: true });
    
    // Verify result
    const textNode = view.state.doc.nodeAt(1);
    const hasBold = textNode.marks.some(mark => mark.type.name === 'strong');
    expect(hasBold).toBe(true);
  });
  
  it('should create a list when pressing Tab in a list item', () => {
    // Set up a list state
    const listState = createEditorState(
      '<ul><li><p>First item</p></li><li><p>Second item</p></li></ul>'
    );
    
    // Update view with list state
    view.updateState(listState);
    
    // Set cursor in second list item
    const pos = 25; // Position inside second list item
    view.dispatch(view.state.tr.setSelection(
      TextSelection.create(view.state.doc, pos)
    ));
    
    // Simulate Tab key
    simulateKeyPress(view, 'Tab');
    
    // Verify the second item was indented
    const listDepth = findListDepth(view.state, pos);
    expect(listDepth).toBe(2); // Now nested
  });
});

// Helper function to find list depth
function findListDepth(state, pos) {
  let depth = 0;
  let node = state.doc.resolve(pos).node(0);
  // Implementation details...
  return depth;
}
```

### Testing Paste Handling

```typescript
import {
  createEditorState,
  createEditorView,
  simulatePaste,
  cleanupEditorView
} from '../test-setup/test-utils';

describe('Paste Handling', () => {
  let view, container;
  
  beforeEach(() => {
    const state = createEditorState('<p>Existing content</p>');
    const result = createEditorView(state);
    view = result.view;
    container = result.container;
    
    // Position cursor at end of paragraph
    const endPos = 17;
    view.dispatch(view.state.tr.setSelection(
      TextSelection.create(view.state.doc, endPos)
    ));
  });
  
  afterEach(() => {
    cleanupEditorView(view, container);
  });
  
  it('should handle plain text paste', () => {
    simulatePaste(view, { text: 'Pasted text' });
    
    expect(view.state.doc.textContent).toBe('Existing contentPasted text');
  });
  
  it('should handle HTML paste', () => {
    simulatePaste(view, { 
      text: 'Pasted text with bold',
      html: 'Pasted text with <strong>bold</strong>'
    });
    
    expect(view.state.doc.textContent).toBe('Existing contentPasted text with bold');
    
    // Check if "bold" has the strong mark
    const textPos = view.state.doc.textContent.indexOf('bold');
    const nodeWithMark = view.state.doc.nodeAt(textPos);
    const hasBold = nodeWithMark.marks.some(mark => mark.type.name === 'strong');
    expect(hasBold).toBe(true);
  });
});
```

### Testing Lists

```typescript
import {
  createTestSchema,
  createDocWithBulletList,
  createEditorState,
  createEditorView,
  simulateKeyPress,
  cleanupEditorView
} from '../test-setup/test-utils';
import { wrapInList } from 'prosemirror-schema-list';

describe('List Functionality', () => {
  let schema, view, container;
  
  beforeEach(() => {
    schema = createTestSchema();
    const listItems = ['First item', 'Second item', 'Third item'];
    const doc = createDocWithBulletList(listItems, schema);
    const state = createEditorState(doc);
    const result = createEditorView(state);
    view = result.view;
    container = result.container;
  });
  
  afterEach(() => {
    cleanupEditorView(view, container);
  });
  
  it('should indent list item on Tab', () => {
    // Position cursor in second list item
    const secondItemPos = findPositionInListItem(view.state, 1);
    view.dispatch(view.state.tr.setSelection(
      TextSelection.create(view.state.doc, secondItemPos)
    ));
    
    // Simulate Tab
    simulateKeyPress(view, 'Tab');
    
    // Verify second item is now a sublist of first item
    const listStructure = getListStructure(view.state);
    expect(listStructure).toEqual({
      items: [
        { text: 'First item', children: [
          { text: 'Second item', children: [] }
        ]},
        { text: 'Third item', children: [] }
      ]
    });
  });
  
  it('should outdent list item on Shift+Tab', () => {
    // First, indent second item
    const secondItemPos = findPositionInListItem(view.state, 1);
    view.dispatch(view.state.tr.setSelection(
      TextSelection.create(view.state.doc, secondItemPos)
    ));
    simulateKeyPress(view, 'Tab');
    
    // Then outdent it with Shift+Tab
    simulateKeyPress(view, 'Tab', { shift: true });
    
    // Verify structure is back to flat list
    const listStructure = getListStructure(view.state);
    expect(listStructure).toEqual({
      items: [
        { text: 'First item', children: [] },
        { text: 'Second item', children: [] },
        { text: 'Third item', children: [] }
      ]
    });
  });
  
  // Helper functions
  function findPositionInListItem(state, itemIndex) {
    // Implementation to find cursor position in specific list item
    return 0; // Placeholder
  }
  
  function getListStructure(state) {
    // Implementation to extract list structure
    return { items: [] }; // Placeholder
  }
});
```

## Implementation Status

| Category | Utility | Status |
|----------|---------|--------|
| **Schema Setup** | `createTestSchema()` | ✅ Implemented |
| | `createCustomTestSchema(options)` | ✅ Implemented |
| **Editor State** | `createEditorState()` | ✅ Implemented |
| | `createEditorStateWithSelection()` | ✅ Implemented |
| | `setTextSelection()` | ✅ Implemented |
| **Editor View** | `createEditorView()` | ✅ Implemented |
| | `createDispatchSpy()` | ✅ Implemented |
| | `cleanupEditorView()` | ✅ Implemented |
| | `mockProseMirrorDOMEnvironment()` | ✅ Implemented |
| **Content Generation** | `createDocWithText()` | ✅ Implemented |
| | `createDocWithHTML()` | ✅ Implemented |
| | `createDocWithText()` | ✅ Implemented |
| | `createDocWithFormattedText()` | ✅ Implemented |
| | `createDocWithBulletList()` | ✅ Implemented |
| | `createDocWithHeading()` | ✅ Implemented |
| | `createDocWithBlockquote()` | ✅ Implemented |
| | `createDocWithCodeBlock()` | ✅ Implemented |
| **Command Testing** | `testCommand()` | ✅ Implemented |
| | `getCommandResult()` | ✅ Implemented |
| | `testCommandWithView()` | ✅ Implemented |
| | `createCommandTester()` | ✅ Implemented |
| **Mocks** | `createDispatchSpy()` | ✅ Implemented |
| | `createMockEditorView()` | ⏳ Planned |
| | `mockProseMirrorDOMEnvironment()` | ✅ Implemented |
| **Selection Helpers** | `setTextSelection()` | ✅ Implemented |
| | `setNodeSelection()` | ⏳ Planned |
| **Event Simulation** | `simulateKeyPress()` | ✅ Implemented |
| | `simulatePaste()` | ✅ Implemented |
| | `simulateClick()` | ✅ Implemented |
| | `simulateDragAndDrop()` | ✅ Implemented |

## Best Practices

1. **Setup and Cleanup**
   - Always clean up editor views after tests to prevent memory leaks
   - Create schema once per test suite when possible
   - Use `beforeEach` and `afterEach` for consistent setup and cleanup

2. **Content Creation**
   - Use the appropriate content generation utility for your test case
   - Create realistic content for more robust tests
   - Use HTML strings for complex document structures

3. **Command Testing**
   - Test commands in isolation with `testCommand` when possible
   - Test both positive and negative cases (when command should and shouldn't apply)
   - Verify document structure after command application

4. **Event Handling**
   - For keyboard shortcut tests, ensure the selection is set up correctly before simulating keys
   - When testing paste events, include both text and HTML variants
   - For mouse events, calculate positions relative to the document structure

5. **State Management**
   - Remember that editor state is immutable - always use transactions
   - Use `view.dispatch(tr)` to update the view's state
   - Use `dispatchSpy` with `autoUpdate=true` to track state changes

6. **Test Organization**
   - Group related tests logically
   - Test edge cases (empty documents, selections at boundaries)
   - Test interactions between features (e.g., how lists interact with other block types)

7. **Debugging Tips**
   - Use `console.log(JSON.stringify(view.state.doc.toJSON()))` to view document structure
   - Check selection ranges with `console.log(view.state.selection)`
   - Add debug elements to show editor content: `container.appendChild(view.dom)` 
