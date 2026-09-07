## Table of Contents  
1. [Developing further on the Rich Text Editor](#developing-further-on-the-rich-text-editor)
    - [Schema](#schema)
    - [Extending the Schema](#extending-the-schema)
    - [Editor State and View](#editor-state-and-view)
2. [Plugins](#plugins)
3. [The Menu Command Factory](#the-menu-command-factory)
    - [Key Components and Functions](#key-components-and-functions)
    - [Command Active States](#command-active-states)

## Developing further on the Rich Text Editor

### Schema

> **_ProseMirror documentation describes the schema in this way:_**  
> A document schema. Holds [node](https://prosemirror.net/docs/ref/#model.NodeType) and [mark](https://prosemirror.net/docs/ref/#model.MarkType) type objects for the nodes and marks that may occur in conforming documents, and provides functionality for creating and deserializing such documents.  
> When given, the type parameters provide the names of the nodes and marks in this schema.

Each ProseMirror [document](https://prosemirror.net/docs/guide/#doc) has a [schema](https://prosemirror.net/docs/ref/#model.Schema) associated with it. 
There is a package with a basic schema available. ProseMirror also allows you to define your own schemas or extend the basic schema.

### Extending the Schema
We've extended the basic schema by adding the Strikethrough mark.

We define the strikethrough Mark in the `menu-schema-extender` to specify how it should be parsed from and serialized to the DOM. This definition includes the tags and styles that represent the strikethrough in the HTML.

```typescript
import { MarkSpec } from 'prosemirror-model';

export const strikethrough: MarkSpec = {
    parseDOM: [
        { tag: 's' },
        { tag: 'del' },
        { tag: 'strike' },
        { style: 'text-decoration=line-through' },
    ],
    toDOM: () => {
        return ['s', 0];
    },
};
```

Then we append the mark to schema spec in the `initializeSchema` function in the `prosemirror-adapter`. 
```typescript
private initializeSchema() {
    return new Schema({
        nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
        marks: schema.spec.marks.append({
            strikethrough: strikethrough,
        }),
    });
}
```

We define the strikethrough Mark to specify how it should be parsed from and serialized to the DOM. This is necessary because marks often have specific HTML representations and need custom parsing and serialization logic.

When initializing the Schema, we use the addListNodes method to add list-related nodes like ordered lists, bullet lists, and list items. This method is a convenience function provided by the ProseMirror schema-list module. It automatically adds these node types to the schema with appropriate content expressions. By specifying strings like 'paragraph block*' and 'block', we define the structure and nesting rules for these list nodes. This approach leverages the predefined list structures and simplifies schema management.  
For more detailed information on how ProseMirror distinguishes between nodes and marks, see [here](./node-vs-mark-types.md). 

### Editor State and View

The view component
A ProseMirror [editor view](https://prosemirror.net/docs/ref/#view.EditorView) is a user interface component that displays an [editor state]((https://prosemirror.net/docs/guide/#state)) to the user, and allows them to perform editing actions on it.

The definition of editing actions used by the core view component is rather narrow—it handles direct interaction with the editing surface, such as typing, clicking, copying, pasting, and dragging, but not much beyond that. This means that things like displaying a menu, or even providing a full set of key bindings, lie outside of the responsibility of the core view component, and have to be arranged through [plugins](#plugins).

In our implementation the initialization is handled within the ProseMirror adapter and broken up into separate functions that are called from the initializeTextEditor function.
- Read more from prosemirror documentation about [The Editor State](https://prosemirror.net/docs/guide/#state), [The View Component](https://prosemirror.net/docs/guide/#view)

```typescript
private async initializeTextEditor() {
        this.schema = this.initializeSchema();
        const initialDoc = await this.parseInitialContent();
        this.menuCommandFactory = new MenuCommandFactory(this.schema);
        this.view = new EditorView(
            this.host.shadowRoot.querySelector('#editor'),
            {
                state: this.createEditorState(initialDoc),
                dispatchTransaction: this.handleTransaction,
            },
        );

        if (this.value) {
            this.updateView(this.value);
        }
    }
```

We create a new [EditorView](https://prosemirror.net/docs/ref/#view) after initializing the [schema](https://prosemirror.net/docs/ref/#schema-basic) and parsing any content that the component may contain (the text editor can be used within form fields, and said form fields may contain data).

We create an [EditorState](https://prosemirror.net/docs/ref/#state) object for the view.

State changes are managed by [Transactions](https://prosemirror.net/docs/ref/#state.Transaction) and in our Editor state we assign our own `handleTransaction` function to be called on `dispatchTransaction` [see documentation](https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction). This allows us to be in control of how and when the state is updated and transactions are applied.  

As per the dispatchTransaction documentation, to update the state we first create a new state that has had the transaction applied. We then call the updateState method which updates our editor view with the new state.
> **_NOTE:_**
The state of a ProseMirror Editor is a persistent data structure--it isn't updated but rather a new state value is computed from an old one using the apply method.  

The typescript definition for the state.tr is as follows:  
> (property) EditorState.tr: [Transaction](https://prosemirror.net/docs/ref/#state.Transaction)  

In much of the implentation in the menu-command factory you'll often see a dispatch() function into which we pass state.tr before calling a separate method.  

On this state we can call a [Transform](https://prosemirror.net/docs/ref/#transform.Transform) method such as **insert** or **replaceWith** depending on the use case as in the following examples:  
> dispatch(state.tr.insert(from, newLink));  
- (method) Transform.insert(pos: number, content: Fragment | Node | readonly Node[]): Transaction  
- Insert the given content at the given position.
  
> dispatch(state.tr.replaceWith(from, to, newLink));  
- (method) Transform.replaceWith(from: number, to: number, content: Node | Fragment | readonly Node[]): Transaction  
- Replace the given range with the given content, which may be a fragment, node, or array of nodes.

At the surface level we simply create a new EditorState and apply the transaction to it, then call the updateState method to apply the new state. An example of this is in the `handleTransaction` function within the [prosemirror-adapter](../prosemirror-adapter/prosemirror-adapter.tsx#L331-L332).

```typescript
private handleTransaction = (transaction: Transaction) => {
    const newState = this.view.state.apply(transaction);
    this.view.updateState(newState);

    // The `suppressChangeEvent` is used to stop a change event emitting when the view has been updated with a value from a consumer.
    if (this.suppressChangeEvent) {
        return;
    }

    if (transaction.getMeta('pointer')) {
        return;
    }

    this.change.emit(
        this.contentConverter.serialize(this.view, this.schema),
    );
};
```

## Plugins

Prosemirror has a comprehensive [Plugin System](https://prosemirror.net/docs/ref/#state.Plugin_System) that we can leverage to customise functionality. This can be very useful for handling special interactions within the text editor as well as allowing for good encapsulation.

Here's a basic example of using the plugin system. 
We create a custom plugin, this should be housed in it's own file, in the `plugins` folder:

```typescript
const handleItemClick = (value: string) => {
    ...handle event here
}

export const createItemInteractionPlugin = () => {
    return new Plugin({
        key: itemInteractionPluginKey,
        props: {
            handleDOMEvents: {
                // name of custom event to handle
                myItemClick: (view, event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { value } = event.detail;

                    // .... recommend using a try/catch for handling events
                    try {
                        handleItemClick(value);
                    } catch(error) {
                        ...handle error
                    }

                    // return true to show event was handled
                    return true;
                },
            },
        },
    });
};
```

In the `prosemirror-adapter` we create our own create our custom event and dispatch it to the view (the Editor view):

```typescript
const myEvent = new CustomEvent('myItemClick', {
    detail: event.detail,
});
this.view.dom.dispatchEvent(myEvent);
```

The functionality for this specific interaction is now handled within that plugin.  

> For a more detailed look at how we're using the Prosemirror Plugin system see our implementation of a custom plugin for [menu state tracking](./menu-state-tracking.md).  
See [here](https://prosemirror.net/docs/ref/version/0.20.0.html#view.EditorProps) for other default events that can be handled


## The Menu Command Factory

The **MenuCommandFactory** is designed to manage text formatting and structural commands within the editor. It achieves this by mapping commands to specific editor actions, handling various node and mark types, and implementing conditions for different states of the editor. The menu is implemented using our own `action-bar`. This gives us a high level of flexibility but also means that we don't get much functionality from ProseMirror "for free" so to speak. We use built-in functionality from ProseMirror but we have to construct our own commands.

We might need to determine whether or not we need to `wrap` a `node`, or `text selection` within a certain `type`, for example, it could be a `list` or `blockQuote`. Perhaps instead, we need to `lift` the `text selection` out of a `code block` and reset the block to a `paragraph`.

#### Key Components and Functions

1. **Command Mapping**:
   The `commandMapping` object maps editor commands (like bold, italic, header levels) to their corresponding command functions. Each entry in this mapping is a function that takes the schema and optional parameters and returns a `CommandWithActive`.

2. **CommandWithActive Interface**:
   This extends the basic ProseMirror `Command` interface to include an `active` method. This method determines if the command is active based on the current editor state.

3. **Setting Active Methods**:
   - `setActiveMethodForMark`: Determines if a mark (e.g., bold, italic) is active in the current selection.
   - `setActiveMethodForNode`: Checks if a node (e.g., heading, blockquote) is active in the current selection.
   - `setActiveMethodForWrap`: Determines if a wrapping node (e.g., list) is active in the current selection.

4. **Command Creation**:
   - **Mark Commands**:
     - `createToggleMarkCommand`: Toggles a mark type on or off.
     - `createInsertLinkCommand`: Inserts a link, wrapping selected text or inserting new text.
   - **Node Commands**:
     - `createSetNodeTypeCommand`: Sets a node type, optionally with specific attributes like heading level.
     - `createWrapInCommand`: Wraps a selection in a node type.
   - **List Commands**:
     - `createListCommand`: Toggles a list type by wrapping or lifting out of the list.

5. **Utility Functions**:
   - `getAttributes`: Fetches attributes for specific marks, such as links.
   - `toggleBlockType`: Toggles a block type, optionally wrapping the selection.

6. **MenuCommandFactory Methods**:
   - `getCommand`: Retrieves a command function based on the given mark type and optional link details.
   - `buildKeymap`: Builds a keymap for editor commands, mapping keyboard shortcuts to command functions.

Read more about the [menu-command factory](./menu-command.md)
