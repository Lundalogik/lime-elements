# Text Editor Testing Utilities

This directory contains utility functions and setup code to help test the text editor component and its related components.

## Core Testing Utilities

1. **Schema Setup**
   - `createTestSchema()` - Creates a ProseMirror schema with all needed marks and nodes
   - `createCustomTestSchema(options)` - Creates a custom schema with specified extensions

2. **Editor State Utilities**
   - `createEditorState(content?, schema?)` - Creates an editor state with optional content
   - `createEditorStateWithSelection(content, from, to, schema?)` - Creates an editor state with a specific selection

3. **Editor View Utilities**
   - `createEditorView(state, dispatchSpy?)` - Creates a ProseMirror editor view with an optional dispatch spy
   - `cleanupEditorView(view)` - Properly destroys an editor view to prevent memory leaks

4. **Content Generation**
   - `createDocWithText(text, schema?)` - Creates a document with plain text
   - `createDocWithHTML(html, schema?)` - Creates a document from HTML string
   - `createDocWithFormattedText(text, marks, schema?)` - Creates a document with marked text

5. **Command Testing**
   - `testCommand(command, state, expected)` - Tests a command and verifies the result
   - `getCommandResult(command, state)` - Gets the result of applying a command
   - `testCommandWithView(command, state, expected)` - Tests a command that requires view context
   - `createCommandTester(command)` - Creates a reusable tester for a specific command

6. **Mocks**
   - `createDispatchSpy()` - Creates a Jest spy for the dispatch function
   - `createMockEditorView()` - Creates a mocked editor view 
   - `mockProseMirrorDOMEnvironment()` - Sets up the DOM environment for ProseMirror

7. **Selection Helpers**
   - `setTextSelection(state, from, to)` - Creates a text selection
   - `setNodeSelection(state, pos)` - Creates a node selection

8. **Event Simulation**
   - `simulateKeyPress(view, key, modifiers?)` - Simulates a key press on the editor
   - `simulatePaste(view, content)` - Simulates pasting content into the editor
   - `simulateClick(view, clientX, clientY, options?)` - Simulates a mouse click
   - `simulateDragAndDrop(view, startX, startY, endX, endY, dragData?)` - Simulates drag and drop

## Usage Example

```typescript
import { 
  createTestSchema, 
  createEditorState, 
  createEditorView,
  simulateKeyPress,
  cleanupEditorView 
} from '../test-setup/test-utils';

describe('Text Editor', () => {
  let schema, state, view;
  
  beforeEach(() => {
    schema = createTestSchema();
    state = createEditorState('<p>Test content</p>', schema);
    view = createEditorView(state);
  });
  
  afterEach(() => {
    cleanupEditorView(view);
  });
  
  it('should apply bold formatting with keyboard shortcut', () => {
    // Setup test case
    // Simulate keypress
    // Assert results
  });
});
```

## Command Testing Example

```typescript
import {
  createEditorState,
  testCommand,
  createCommandTester
} from '../test-setup/test-utils';
import { toggleMark } from 'prosemirror-commands';

describe('Text Editor Commands', () => {
  it('should toggle bold mark when applicable', () => {
    // Create state with selected text
    const state = createEditorStateWithSelection('<p>Test content</p>', 1, 5);
    
    // Get the bold mark from schema
    const boldMark = state.schema.marks.strong;
    const toggleBold = toggleMark(boldMark);
    
    // Test the command
    testCommand(toggleBold, state, {
      shouldApply: true,
      // Additional expectations if needed
    });
  });
  
  it('should test multiple states with the same command', () => {
    // Create a reusable tester for a command
    const testToggleBold = createCommandTester(toggleMark(schema.marks.strong));
    
    // Test with different states
    testToggleBold(state1, { shouldApply: true });
    testToggleBold(state2, { shouldApply: false });
  });
});
```

## Event Simulation Example

```typescript
import {
  createEditorState,
  createEditorView,
  simulateKeyPress,
  simulatePaste,
  cleanupEditorView
} from '../test-setup/test-utils';

describe('Text Editor Event Handling', () => {
  let view, container;
  
  beforeEach(() => {
    const state = createEditorState('<p>Test content</p>');
    const result = createEditorView(state);
    view = result.view;
    container = result.container;
  });
  
  afterEach(() => {
    cleanupEditorView(view, container);
  });
  
  it('should handle Ctrl+B keyboard shortcut', () => {
    // Select some text first
    // ...
    
    // Simulate pressing Ctrl+B for bold
    simulateKeyPress(view, 'b', { ctrl: true });
    
    // Verify text is now bold
    // ...
  });
  
  it('should handle paste events correctly', () => {
    // Simulate pasting HTML content
    simulatePaste(view, {
      text: 'Plain text version',
      html: '<p>Formatted <strong>HTML</strong> content</p>'
    });
    
    // Verify pasted content was properly processed
    // ...
  });
});
```
