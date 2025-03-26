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
   ```typescript
   // In MenuCommandFactory.buildKeymap()
   buildKeymap() {
     return {
       // Existing shortcuts...
       'Mod-B': this.getCommand(EditorMenuTypes.Bold),
       'Mod-I': this.getCommand(EditorMenuTypes.Italic),
       
       // New list shortcuts
       'Mod-Shift-8': this.getCommand(EditorMenuTypes.BulletList),
       'Mod-Shift-9': this.getCommand(EditorMenuTypes.OrderedList),
       
       // Rest of existing shortcuts...
     };
   }
   ```

3. **Integration:**
   - Ensure shortcuts work with existing command structure
   - Add appropriate tests for shortcut functionality

## Phase 1 Integration Plan

1. **New Files to Create:**
   - `src/components/text-editor/prosemirror-adapter/plugins/list-key-handler.ts` - Key handler plugin for list-specific keys
   - `src/components/text-editor/prosemirror-adapter/menu/menu-command-utils/list-item-utils.ts` - Utilities for list item operations

2. **Files to Modify:**
   - `src/components/text-editor/prosemirror-adapter/menu/menu-commands.ts` - Update keyboard shortcuts
   - `src/components/text-editor/prosemirror-adapter/prosemirror-adapter.ts` - Register the new key handler plugin

3. **Testing Strategy:**
   - Create comprehensive tests for each key operation
   - Test edge cases (empty lists, nested lists, etc.)
   - Ensure existing functionality isn't broken

4. **Expected Challenges:**
   - Handling cursor position after operations
   - Managing selection across list boundaries
   - Ensuring proper nesting of lists

## Next Steps After Phase 1

Once Phase 1 is complete, we'll proceed to:

1. Implement Markdown-style list creation (Phase 2)
2. Add automatic list continuation (Phase 2)
3. Enhance list attributes and styling (Phase 3) 
