# Text Editor Testing Suite Guide

This directory contains utility functions and setup code to help test the text editor component and its ProseMirror-based internals.

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
- `setNodeSelection(state, pos)` - Sets a node selection at the given position

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

// Select a node (pos must be immediately before the node)
const nodeState = setNodeSelection(state, 0);
```

### 3. Editor View Utilities

- `createEditorView(state?, dispatchSpy?, parentElement?)` - Creates a ProseMirror editor view with optional dispatch spy
- `cleanupEditorView(view, container?)` - Properly destroys an editor view to prevent memory leaks
- `createDispatchSpy(view, autoUpdate?)` - Creates a spy that tracks dispatch calls on an existing view (from `mock-factories`)
- `createMockEditorView(state?)` - Creates a lightweight mock EditorView without real DOM mounting (from `mock-factories`)

```typescript
// Create a view with state
const { view, container } = createEditorView(state);

// Create a dispatch spy that auto-updates view state
const dispatchSpy = createDispatchSpy(view);

// Create a view with custom parent element
const parent = document.createElement('div');
const { view: viewWithParent } = createEditorView(state, undefined, parent);

// Clean up after testing
cleanupEditorView(view, container);
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
  { type: 'strong' },
  { type: 'em' },
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
expect(result.result).toBe(true);

// Test a command with expectations
testCommand(toggleMark(schema.marks.strong), state, {
  shouldApply: true,
});

// Create a reusable command tester
const testBold = createCommandTester(toggleMark(schema.marks.strong));
testBold(state1, { shouldApply: true });
testBold(state2, { shouldApply: false });

// Test a command that requires view context
testCommandWithView(someViewCommand, state, {
  shouldApply: true,
});
```

### 6. Event Simulation

- `simulateKeyPress(view, key, modifiers?)` - Simulates a key press on the editor
- `simulatePaste(view, content)` - Simulates pasting content into the editor

```typescript
// Simulate keyboard shortcuts
simulateKeyPress(view, 'b', { ctrl: true }); // Ctrl+B for bold
simulateKeyPress(view, 'z', { ctrl: true }); // Ctrl+Z for undo
simulateKeyPress(view, 'Tab'); // Tab key

// Simulate paste (text only — HTML paste is not supported in jsdom)
simulatePaste(view, {
  text: 'Plain text',
});
```

## Examples

See the `.spec.ts` files in this directory for working, tested examples of each utility.

## Best Practices

1. **Setup and Cleanup**
   - Always clean up editor views after tests to prevent memory leaks
   - Create schema once per test suite when possible
   - Use `beforeEach` and `afterEach` for consistent setup and cleanup

2. **Content Creation**
   - Use the appropriate content generation utility for your test case
   - Use HTML strings for complex document structures

3. **Command Testing**
   - Test commands in isolation with `testCommand` when possible
   - Test both positive and negative cases (when command should and shouldn't apply)
   - Verify document structure after command application

4. **Event Handling**
   - For keyboard shortcut tests, ensure the selection is set up correctly before simulating keys
   - `simulatePaste` only supports text content in jsdom — use e2e tests for HTML paste

5. **State Management**
   - Editor state is immutable — always use transactions
   - Use `view.dispatch(tr)` to update the view's state
   - Use `dispatchSpy` with `autoUpdate=true` to track state changes

6. **Debugging Tips**
   - `JSON.stringify(view.state.doc.toJSON())` to view document structure
   - `view.state.selection` to check selection ranges
