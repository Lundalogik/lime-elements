# List Functionality Implementation Plan

This document outlines the detailed implementation plan for enhancing the list functionality in the text editor component.

## Core Development Principles

> **CRITICAL RULE: All existing functionality MUST be maintained throughout implementation.**

In implementing new list features, we must adhere to the following principles:

1. **Preserve All Existing Behavior**
   - Current list creation/toggling functionality must continue to work
   - Existing keyboard shortcuts must remain functional
   - Current nested list behavior must be preserved
   - Menu integration and active state tracking must be maintained

2. **Backward Compatibility**
   - New features should complement existing ones, not replace them
   - Changes should be additive rather than destructive
   - All tests for existing functionality must continue to pass

3. **Incremental Implementation**
   - Each feature should be implemented and tested independently
   - After each change, ensure regression tests pass before proceeding
   - Document any unexpected behaviors or edge cases discovered

## Implementation Plan

The implementation will proceed in the following phases:

### Phase 1: Key Navigation and Manipulation

- [x] Implement Tab/Shift+Tab for indenting/outdenting list items
- [x] Enhance Enter behavior within lists for proper splitting
- [x] Improve Backspace behavior at the start of list items for joining
- [x] Add keyboard shortcuts for bullet and ordered lists

### Phase 2: Automatic List Creation

- [ ] Implement Markdown-style list creation with input rules
- [ ] Add continue list behavior when pressing Enter at the end of a list item
- [ ] Support for converting existing text to lists with shortcuts

### Phase 3: List Attributes and Advanced Features

- [ ] Add support for list item numbering options
- [ ] Implement custom list markers
- [ ] Enhance nested list styling and behavior
- [ ] Add ARIA attributes for accessibility

## Phase 1: Key Navigation and Manipulation

### 1. Tab/Shift+Tab for Indenting/Outdenting List Items

**Implementation Approach:**

1. **Create Key Handlers:**
   - Implement a custom key handler for the Tab and Shift+Tab keys within lists
   - Utilize ProseMirror's `sinkListItem` and `liftListItem` commands from `prosemirror-schema-list`

2. **Implementation Details:**
   ```typescript
   // In a new key handler plugin
   handleTab(view, event) {
     const { state } = view;
     // Check if cursor is in a list item
     if (isInListItem(state)) {
       // Sink the list item (indent)
       if (sinkListItem(schema.nodes.list_item)(state, view.dispatch)) {
         return true;
       }
     }
     return false;
   }
   
   handleShiftTab(view, event) {
     const { state } = view;
     // Check if cursor is in a list item
     if (isInListItem(state)) {
       // Lift the list item (outdent)
       if (liftListItem(schema.nodes.list_item)(state, view.dispatch)) {
         return true;
       }
     }
     return false;
   }
   ```

3. **Helper Functions:**
   - Create an `isInListItem` function to check if the cursor is within a list item
   - Create a utility to handle selection across multiple list items

### 2. Enhanced Enter Behavior Within Lists

**Implementation Approach:**

1. **Split List Items:**
   - Override the Enter key behavior within lists
   - Implement `splitListItem` command to properly split the current list item
   - Handle empty list items (create a new paragraph outside the list)

2. **Implementation Details:**
   ```typescript
   handleEnter(view, event) {
     const { state } = view;
     const { selection } = state;
     const { $from, empty } = selection;
     
     // Check if cursor is in a list item
     if (isInListItem(state)) {
       // If the list item is empty, exit the list
       if (isEmptyListItem(state)) {
         return liftListItem(schema.nodes.list_item)(state, view.dispatch);
       }
       
       // Otherwise split the list item
       return splitListItem(schema.nodes.list_item)(state, view.dispatch);
     }
     
     return false;
   }
   ```

3. **Helper Functions:**
   - Create an `isEmptyListItem` function to check if the current list item is empty
   - Implement proper handling of cursor position after splitting

### 3. Improved Backspace Behavior

**Implementation Approach:**

1. **Join List Items:**
   - Override the Backspace key at the start of a list item
   - Use `joinBackward` and custom logic to properly join list items
   - Handle special cases (e.g., joining with non-list content)

2. **Implementation Details:**
   ```typescript
   handleBackspace(view, event) {
     const { state } = view;
     const { selection } = state;
     const { $from, empty } = selection;
     
     // Check if cursor is at the start of a list item
     if (isAtStartOfListItem(state)) {
       // If previous node is a list item, join them
       if (canJoinWithPrevious(state)) {
         return joinBackward(state, view.dispatch);
       }
       
       // If not, lift the list item out
       return liftListItem(schema.nodes.list_item)(state, view.dispatch);
     }
     
     return false;
   }
   ```

3. **Helper Functions:**
   - Create an `isAtStartOfListItem` function to check if the cursor is at the start of a list item
   - Create a `canJoinWithPrevious` function to check if the current list item can be joined with the previous node

### 4. Keyboard Shortcuts for Lists

**Implementation Approach:**

1. **Add Shortcuts:**
   - Add `Mod-Shift-8` for bullet lists
   - Add `Mod-Shift-9` for ordered lists
   - Update the keymap in `MenuCommandFactory.buildKeymap()`

2. **Implementation Details:**
   ```
