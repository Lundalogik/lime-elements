## Interacting with the prosemirror EditorView and EditorState to create the relevant commands:

### **Command Active States**:
- We've extended the Command class to have an `active` method that we can use to store information about whether a specific mark or node type is active in the current editor Selection range, or is in the state.storedMarks.
- This method is essential for updating the menu states accurately.

```typescript
export interface CommandWithActive extends Command {
    active?: (state: EditorState) => boolean;
}
```

#### The `active` method for different command types:
### - **Marks**: 
##### Checks if the mark type is present in the state. 

- **if (empty)**:
If there is no Selection we check the storedMarks in the state. This handles a case where the user might have set a mark (I.E: Bold, Italic) without selecting anything or writing any text.  
- **else**:
We look for the mark in the range of the Selection using `from, to` ([see here for more detailed information on the Selection class](https://prosemirror.net/docs/ref/version/0.20.0.html#state.Selection)).  
There could be multiple marks in different places in the editor, or some selections that have multiple marks on only some selections, for example:
this is a text snippet that has both **bold and also _italic on some_** part of the text

    ```typescript
    const setActiveMethodForMark = (
        command: CommandWithActive,
        markType: MarkType,
    ) => {
        command.active = (state) => {
            const { from, $from, to, empty } = state.selection;
            if (empty) {
                return !!markType.isInSet(state.storedMarks || $from.marks());
            } else {
                return state.doc.rangeHasMark(from, to, markType);
            }
        };
    };
    ```

### - **Nodes**: 
##### Checks if the node type is present in the current selection. 

- **if (nodeType.name === LevelMapping.Heading && level)**:
This additional check is for headings where a specific level might be required. We verify if the node's level attribute matches the provided level.

    ```typescript
    const setActiveMethodForNode = (
        command: CommandWithActive,
        nodeType: NodeType,
        level?: number,
    ) => {
        command.active = (state) => {
            const { $from } = state.selection;
            const node = $from.node($from.depth);

            if (node && node.type.name === nodeType.name) {
                if (nodeType.name === LevelMapping.Heading && level) {
                    return node.attrs.level === level;
                }

                return true;
            }

            return false;
        };
    };
    ```

### - **Wrapping Nodes**: 
##### Checks if the wrapping node type is present in the current selection.

- **Loop through the selection range**:
We iterate through each position within the selection range and check if any ancestor node of the current resolved position matches the node type. We need to ensure that wrapping nodes, which might not be at the direct selection point but wrap around the selection, are accurately detected.

    ```typescript
    const setActiveMethodForWrap = (
        command: CommandWithActive,
        nodeType: NodeType,
    ) => {
        command.active = (state) => {
            const { from, to } = state.selection;

            for (let pos = from; pos <= to; pos++) {
                const resolvedPos = state.doc.resolve(pos);
                for (let i = resolvedPos.depth; i > 0; i--) {
                    const node = resolvedPos.node(i);
                    if (node && node.type.name === nodeType.name) {
                        return true;
                    }
                }
            }

            return false;
        };
    };
    ```

**Code**:
```typescript
const createInsertLinkCommand: CommandFunction = (
    schema: Schema,
    _: EditorMenuTypes,
    link?: EditorTextLink,
): CommandWithActive => {
    const command: Command = (state, dispatch) => {
        const { from, to } = state.selection;
        if (from === to) {
            const linkMark = schema.marks.link.create({
                href: link.href,
                title: link.href,
                target: isExternalLink(link.href) ? '_blank' : null,
            });
            const linkText = link.text || link.href;
            const newLink = schema.text(linkText, [linkMark]);
            dispatch(state.tr.insert(from, newLink));
        } else {
            const linkMark = schema.marks.link.create({
                href: link.href,
                title: link.href,
                target: isExternalLink(link.href) ? '_blank' : null,
            });
            const selectedText = state.doc.textBetween(from, to, ' ');
            const newLink = schema.text(link.text || selectedText, [linkMark]);
            dispatch(state.tr.replaceWith(from, to, newLink));
        }
        return true;
    };

    setActiveMethodForMark(command, schema.marks.link);
    return command;
};
```

**Analysis**:
- **Flexibility**: Handles both insertion and replacement scenarios.
- **User-Friendly**: Automatically determines if the link should open in a new tab based on the URL.
- **State Management**: Ensures the command is aware of its active state, making it easier to integrate into the UI.

#### `toggleBlockType`

**Code**:
```typescript
const toggleBlockType = (schema, type, attrs = {}, wrap = false) => {
    const blockType = schema.nodes[type];
    const paragraphType = schema.nodes.paragraph;

    return (state, dispatch) => {
        const { $from, to } = state.selection;
        if (
            state.selection instanceof TextSelection &&
            $from.sameParent($from.doc.resolve(to))
        ) {
            if ($from.parent.type === blockType) {
                if (dispatch) {
                    dispatch(
                        state.tr.setBlockType($from.pos, to, paragraphType),
                    );
                }
                return true;
            } else {
                if (wrap) {
                    return wrapIn(blockType, attrs)(state, dispatch);
                } else {
                    return setBlockType(blockType, attrs)(state, dispatch);
                }
            }
        }
        return false;
    };
};
```

### Conclusion

Both `createInsertLinkCommand` and `toggleBlockType` encapsulate complex logic for interacting with the editor state and nodes, making it easier to manage content editing and formatting. Understanding these functions provides valuable insights into extending and customizing the editor's behavior.

We can invoke these more complex functions from within more basic functions such as `createSetNodeTypeCommand`.

#### Example: Set Node Type Command

```typescript
const createSetNodeTypeCommand = (
    schema: Schema,
    nodeType: string,
    level?: number,
): CommandWithActive => {
    const type: NodeType | undefined = schema.nodes[nodeType];
    if (!type) {
        throw new Error(`Node type "${nodeType}" not found in schema`);
    }

    let command: CommandWithActive;
    if (nodeType === LevelMapping.Heading && level) {
        command = toggleBlockType(schema, LevelMapping.Heading, { level });
    } else if (nodeType === EditorMenuTypes.CodeBlock) {
        command = toggleBlockType(schema, EditorMenuTypes.CodeBlock);
    } else {
        command = setBlockType(type);
    }

    setActiveMethodForNode(command, type, level);

    return command;
};
```
- **Purpose**: Sets a node type (e.g., heading, code block).
- **Logic**:
  - Retrieves the `nodeType` from the schema.
  - For headings, uses `toggleBlockType` with level attributes.
  - Sets the `active` method using `setActiveMethodForNode`.
  - `setBlockType` is a built-in ProseMirror method that simply sets the block to the current type.

### Handling Different Conditions

1. **Empty Selection vs. Non-Empty Selection**:
   - For mark commands, checks if the selection is empty to determine if the mark should be applied to stored marks or the selected range.

2. **Node Type Specific Logic**:
   - For nodes like headings, considers the level attribute.
   - For wrapping nodes (e.g., lists), uses `findWrapping` and `liftTarget` to handle wrapping and lifting logic.

3. **Command Execution and Dispatch**:
   - Commands interact with the `EditorState` and `Transaction` to update the document.
   - Use of dispatch functions to apply transformations and update the view.

#### Example: Toggle Mark Command

```typescript
const createToggleMarkCommand = (
    schema: Schema,
    markName: string,
    link?: EditorTextLink,
): CommandWithActive => {
    const markType: MarkType | undefined = schema.marks[markName];
    if (!markType) {
        throw new Error(`Mark "${markName}" not found in schema`);
    }

    const attrs = getAttributes(markName, link);

    const command: CommandWithActive = toggleMark(markType, attrs);
    setActiveMethodForMark(command, markType);

    return command;
};
```
- **Purpose**: Toggles a mark (e.g., bold, italic) on or off.
- **Logic**:
  - Retrieves the `markType` from the schema.
  - Uses `getAttributes` to fetch necessary attributes (e.g., link href).
  - Creates a `CommandWithActive` using `toggleMark`.
  - Sets the `active` method using `setActiveMethodForMark`.

[back to main document](editor-development.md)
