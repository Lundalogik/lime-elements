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

- [x] Content Generation
  - [x] `createDocWithText(text, schema?)` - Creates a document with plain text
  - [x] `createDocWithHTML(html, schema?)` - Creates a document from HTML string
  - [x] `createDocWithFormattedText(text, marks, schema?)` - Creates a document with marked text
  - [x] `createDocWithBulletList(items, schema?)` - Creates a document with a bullet list
  - [x] `createDocWithHeading(text, level?, schema?)` - Creates a document with a heading
  - [x] `createDocWithBlockquote(text, schema?)` - Creates a document with a blockquote
  - [x] `createDocWithCodeBlock(code, schema?)` - Creates a document with a code block

- [x] Command Testing
  - [x] `testCommand(command, state, expected)` - Tests a command and verifies the result
  - [x] `getCommandResult(command, state)` - Gets the result of applying a command
  - [x] `testCommandWithView(command, state, expected)` - Tests a command that requires view context
  - [x] `createCommandTester(command)` - Creates a reusable tester for a specific command

- [x] Mocks
  - [x] `createDispatchSpy()` - Creates a Jest spy for the dispatch function
  - [ ] `createMockEditorView()` - Creates a mocked editor view 

- [x] Selection Helpers (Implemented in Editor State Utilities)
  - [x] `setTextSelection(state, from, to)` - Creates a text selection

- [x] Event Simulation
  - [x] `simulateKeyPress(view, key, modifiers?)` - Simulates a key press on the editor
  - [x] `simulatePaste(view, content)` - Simulates pasting content
  - [x] `simulateClick(view, clientX, clientY, options?)` - Simulates a mouse click 
  - [x] `simulateDragAndDrop(view, startX, startY, endX, endY, dragData?)` - Simulates drag and drop

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

### Content Generation Utilities (2023-08-19)

Implemented in `test-content-generation.ts`:

1. **createDocWithText(text, schema?)**
   - Creates a document with plain text in a paragraph
   - Accepts optional schema
   - Provides basic content for simple tests

2. **createDocWithHTML(html, schema?)**
   - Creates a document by parsing HTML content
   - Supports complex HTML structures
   - Useful for testing HTML conversion

3. **createDocWithFormattedText(text, marks, schema?)**
   - Creates a document with text that has specific marks (formatting)
   - Accepts an array of mark specifications with types and attributes
   - Allows testing of complex formatting scenarios

4. **createDocWithBulletList(items, schema?)**
   - Creates a document containing a bullet list
   - Takes an array of strings as list items
   - Useful for testing list-related functionality

5. **createDocWithHeading(text, level?, schema?)**
   - Creates a document with a heading of specified level
   - Default level is 1 (H1)
   - Useful for testing heading-related commands

6. **createDocWithBlockquote(text, schema?)**
   - Creates a document with text in a blockquote
   - Useful for testing blockquote commands and rendering

7. **createDocWithCodeBlock(code, schema?)**
   - Creates a document with a code block
   - Useful for testing code block formatting and commands

### Command Testing Utilities (2023-08-20)

Implemented in `test-command-testing.ts`:

1. **getCommandResult(command, state)**
   - Gets the result of applying a ProseMirror command to a state
   - Returns a CommandResult with success status, transaction, and new state
   - Allows testing command applicability without side effects

2. **testCommand(command, state, expected)**
   - Tests a ProseMirror command and verifies its results
   - Checks whether the command is applicable as expected
   - Can verify document content and size after command application
   - Returns the CommandResult for further assertions

3. **testCommandWithView(command, state, expected)**
   - Tests commands that require an EditorView to function
   - Creates a temporary view for the command execution
   - Allows testing DOM-dependent commands
   - Returns both the result and the view for cleanup

4. **createCommandTester(command)**
   - Creates a reusable test function for a specific command
   - Allows testing the same command with different states
   - Simplifies test setup for command-focused tests

### Event Simulation Utilities (2023-08-20)

Implemented in `test-event-simulation.ts`:

1. **simulateKeyPress(view, key, modifiers?)**
   - Simulates key press events on the editor
   - Supports modifier keys (Shift, Ctrl, Alt, Meta)
   - Returns whether the event was handled by the editor
   - Useful for testing keyboard shortcuts and key bindings

2. **simulatePaste(view, content)**
   - Simulates clipboard paste events
   - Supports text, HTML, and file content types
   - Creates a proper ClipboardEvent with DataTransfer data
   - Allows testing of complex paste handling

3. **simulateClick(view, clientX, clientY, options?)**
   - Simulates mouse click events at specified coordinates
   - Supports different mouse buttons and click types (single, double)
   - Useful for testing cursor positioning and node selection

4. **simulateDragAndDrop(view, startX, startY, endX, endY, dragData?)**
   - Simulates full drag and drop operations
   - Dispatches the complete sequence of drag events (mousedown, dragstart, dragover, drop, mouseup)
   - Supports text and HTML drag data
   - Useful for testing drag-based interactions like node moving

## Implementation Notes

- Content generation utilities provide specialized methods for different content types
- All utilities integrate with the schema and state utilities
- The MarkSpec interface makes it easy to apply multiple marks to text content
- Added support for common block elements used in the text editor
- Each function follows the same pattern for consistency and ease of use
- Command testing utilities can test both standard commands and those requiring view context
- Event simulation utilities faithfully recreate browser events for accurate testing
