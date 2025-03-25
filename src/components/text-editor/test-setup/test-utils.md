# Text Editor Testing Utilities

This directory contains utility functions and setup code to help test the text editor component and its related components.

## Core Testing Utilities

1. **Schema Setup**
   - `createTestSchema()` - Creates a ProseMirror schema with all needed marks and nodes
   - `createCustomTestSchema(options)` - Creates a custom schema with specified extensions

A. **Analysis**
   - Examine text editor for mark/node usage
   - Review existing schema configuration

B. **Dependencies**
   - Identify required ProseMirror packages
   - Determine schema construction method

C. **Design**
   - Define function signature
   - Plan schema structure with nodes/marks

D. **Implementation**
   - Create base schema
   - Add list nodes (ordered, bullet)
   - Add custom marks (strikethrough, etc.)
   - Add any custom nodes

E. **Validation**
   - Ensure schema includes all testing elements
   - Add schema configuration validation

F. **Documentation**
   - Document function usage and returned schema
   - Add examples

G. **Integration**
   - Ensure compatibility with other test utilities
   - Verify consistency with production schema

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

6. **Mocks**
   - `createDispatchSpy()` - Creates a Jest spy for the dispatch function
   - `createMockEditorView()` - Creates a mocked editor view 
   - `mockProseMirrorDOMEnvironment()` - Sets up the DOM environment for ProseMirror

7. **Selection Helpers**
   - `setTextSelection(state, from, to)` - Creates a text selection
   - `setNodeSelection(state, pos)` - Creates a node selection

8. **Event Simulation**
   - `simulateKeyPress(view, key, modifiers?)` - Simulates a key press on the editor
   - `simulatePaste(view, content, mimeType?)` - Simulates pasting content

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
```
