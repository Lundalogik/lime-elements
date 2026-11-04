### Marks vs. Nodes

In ProseMirror, the concepts of `NodeType` and `MarkType` are central to understanding how the document model is structured and manipulated.

#### NodeType
- **Purpose**: Represent the document structure (e.g., paragraphs, headings, lists).
- **Specification**: Defined using `NodeSpec`, including content, attributes, parsing, and serialization rules.
- **Usage**: Nodes are the building blocks of the document. They contain content, can have attributes, and are organized hierarchically to form the document structure.
- **Attributes**: Nodes can have attributes like a heading level or the source URL of an image.
- **Content**: Nodes can contain other nodes (e.g., a list contains list items, which in turn contain paragraphs).
- **Schema Definition**: Nodes are defined in the schema with specifications for their content, attributes, and how they should be rendered and parsed from the DOM.
- [**Prosemirror Documentation - NodeType**](https://prosemirror.net/docs/ref/#model.NodeType)
- **Example**:
  ```typescript
  import { NodeSpec } from 'prosemirror-model';

  const paragraph: NodeSpec = {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() { return ["p", 0]; }
  };
  ```
- **Common Node Types**: `doc`, `paragraph`, `heading`, `list_item`, `ordered_list`, `bullet_list`, `table`, `image`, `text`.

#### MarkType
- **Purpose**: Style or annotate inline content (e.g., bold, italic, link, strikethrough).
- **Specification**: Defined using `MarkSpec` with parsing and serialization rules.
- **Usage**: Marks are used to style or annotate text. They do not change the structure of the document but add additional meaning or formatting to the content within nodes.
- **Attributes**: Marks can have attributes like the URL of a link or the language of a code snippet.
- **Schema Definition**: Marks are defined in the schema with specifications for their attributes and how they should be rendered and parsed from the DOM.
- [**Prosemirror Documentation - MarkType**](https://prosemirror.net/docs/ref/#model.MarkType)
- **Example**:
  ```typescript
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
- **Common Mark Types**: `link`, `em` (emphasis/italic), `strong` (bold), `code`, `strikethrough`.

### How They Are Used Together
- **Schema**: Both `NodeType` and `MarkType` are defined in the schema to determine what kinds of nodes and marks are allowed in the document and how they interact with each other.
- **Applying Marks**: Marks are applied to text within nodes to add styling or annotation without altering the document structure.
- **DOM Representation**: Both nodes and marks have specifications for how they are parsed from and serialized to the DOM, ensuring that the document can be accurately rendered and edited in a web browser.

### Example of Schema Initialization
Here’s how you might initialize a schema that includes both node and mark types that have been customized:

```typescript
import { Schema } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import { strikethrough, paragraph } from './menu-schema-extender';

private initializeSchema() {
    return new Schema({
        nodes: addListNodes({
            ...schema.spec.nodes,
            paragraph: paragraph,
        }, 'paragraph block*', 'block'),
        marks: schema.spec.marks.append({
            strikethrough: strikethrough,
        }),
    });
}
```

In this schema:
- **Nodes**: The document can contain blocks (like paragraphs), which can contain inline content (like text).
- **Marks**: Text within nodes can be annotated with marks like links and strong emphasis (bold).

For more detailed information on nodes and marks, refer to the [ProseMirror documentation](https://prosemirror.net/docs/ref/version/0.20.0.html).

[back to main document](editor-development.md#editor-state-and-view)
