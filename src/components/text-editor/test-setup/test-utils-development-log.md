# Text Editor Testing Suite Progress Log

This document tracks the implementation progress of the text editor testing suite.

## Planned Implementation

### Core Testing Utilities

- [x] Schema Setup
  - [x] `createTestSchema()` - Creates a ProseMirror schema with all needed marks and nodes
  - [x] `createCustomTestSchema(options)` - Creates a custom schema with specified extensions

- [x] Editor State Utilities
  - [x] `createEditorState(content?, schema?, plugins?)` - Creates an editor state with optional content
  - [x] `createEditorStateWithSelection(content, from, to, schema?, plugins?)` - Creates an editor state with a specific selection
  - [x] `setTextSelection(state, from, to?)` - Sets a text selection on an existing state
  - [x] `createDocumentWithText(text?, schema?)` - Creates a simple document with text

- [x] Editor View Utilities
  - [x] `createEditorView(state?, dispatchSpy?, parentElement?)` - Creates a ProseMirror editor view with an optional dispatch spy
  - [x] `createDispatchSpy(autoUpdate?)` - Creates a Jest spy function for tracking dispatch calls
  - [x] `cleanupEditorView(view, container?)` - Properly destroys an editor view to prevent memory leaks
  - [x] `mockProseMirrorDOMEnvironment()` - Sets up the DOM environment for ProseMirror in Node.js

- [ ] Content Generation
  - [ ] `createDocWithText(text, schema?)` - Creates a document with plain text
  - [ ] `createDocWithHTML(html, schema?)` - Creates a document from HTML string
  - [ ] `createDocWithFormattedText(text, marks, schema?)` - Creates a document with marked text

- [ ] Command Testing
  - [ ] `testCommand(command, state, expected)` - Tests a command and verifies the result
  - [ ] `getCommandResult(command, state)` - Gets the result of applying a command

- [ ] Mocks
  - [x] `createDispatchSpy()` - Creates a Jest spy for the dispatch function
  - [ ] `createMockEditorView()` - Creates a mocked editor view 

- [x] Selection Helpers (Implemented in Editor State Utilities)
  - [x] `setTextSelection(state, from, to)` - Creates a text selection

- [ ] Event Simulation
  - [ ] `simulateKeyPress(view, key, modifiers?)` - Simulates a key press on the editor
  - [ ] `simulatePaste(view, content, mimeType?)` - Simulates pasting content

## Completed Implementations

### Schema Setup (2023-08-18)

Implemented in `test-schema-setup.ts`:

1. **createTestSchema()**
   - Created a standardized ProseMirror schema for testing the text editor
   - Includes all basic nodes and marks from prosemirror-schema-basic
   - Added list nodes using prosemirror-schema-list
   - Added custom marks like strikethrough and underline

2. **createCustomTestSchema(options)**
   - Implemented a more flexible schema creation function
   - Allows tests to specify which schema features they need
   - Supports custom marks and nodes
   - Options include: addLists, addStrikethrough, addUnderline, customMarks, customNodes

### Editor State Utilities (2023-08-18)

Implemented in `test-editor-state.ts`:

1. **createEditorState(content?, schema?, plugins?)**
   - Creates a basic editor state for testing
   - Accepts optional HTML content string
   - Uses the test schema by default, or accepts a custom schema
   - Supports adding plugins for more complex testing scenarios

2. **createEditorStateWithSelection(content, from, to, schema?, plugins?)**
   - Creates an editor state with a specific text selection
   - Requires content and selection positions
   - Allows for testing selection-based commands and functionality

3. **setTextSelection(state, from, to?)**
   - Utility to create a new state with modified text selection
   - Works with existing editor states
   - Simplifies testing of selection changes

4. **createDocumentWithText(text?, schema?)**
   - Simplified utility for creating a basic document with text
   - Creates a single paragraph with the provided text
   - Useful for simple test cases

### Editor View Utilities (2023-08-19)

Implemented in `test-editor-view.ts`:

1. **createEditorView(state?, dispatchSpy?, parentElement?)**
   - Creates a ProseMirror editor view for testing
   - Accepts an optional state, dispatch spy, and parent element
   - Creates and configures all required DOM elements
   - Returns both the view and its container for easy cleanup

2. **createDispatchSpy(autoUpdate?)**
   - Creates a Jest mock function for tracking dispatch calls
   - Optionally updates the view's state automatically
   - Allows tests to verify that commands are dispatching the right transactions

3. **cleanupEditorView(view, container?)**
   - Properly cleans up the editor view to prevent memory leaks
   - Destroys the view and removes DOM elements
   - Should be called in test afterEach/cleanup

4. **mockProseMirrorDOMEnvironment()**
   - Sets up a minimal DOM environment for ProseMirror if testing in Node.js
   - Creates mock window and document objects with required methods
   - Returns a cleanup function to restore the original environment

## Implementation Notes

- The editor view utilities handle DOM creation and cleanup, which is essential for avoiding memory leaks in tests
- The dispatch spy makes it easy to test commands and verify the transactions they create
- DOM mocking allows tests to run in environments without a full DOM implementation
- All utilities are designed to work together, creating a consistent testing experience
