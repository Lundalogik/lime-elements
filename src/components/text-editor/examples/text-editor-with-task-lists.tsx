import { Component, h, State } from '@stencil/core';
/**
 * Task list example
 *
 * This example demonstrates the task list functionality in the text editor.
 * You can create interactive checkbox lists that can be toggled and managed.
 */
@Component({
    tag: 'limel-example-text-editor-with-task-lists',
    shadow: true,
})
export class TextEditorTaskListExample {
    @State()
    private value: string = `# Task List Example

Here's an example with task lists:

- [ ] First unchecked task
- [x] This task is completed
- [ ] Another unchecked task
- [ ] Task with some **bold** text

You can click the checkbox button in the toolbar to create more task lists!

## Regular list for comparison

- Regular bullet point
- Another bullet point
- Third bullet point

## Keyboard shortcuts
- **Enter**: Create new list item
- **Tab**: Indent list item (nest deeper)
- **Shift+Tab**: Outdent list item (nest shallower)
`;

    public render() {
        return [
            <limel-text-editor
                key="task-list-editor"
                value={this.value}
                onChange={this.handleChange}
                contentType="markdown"
            />,
            <limel-example-value key="task-list-value" value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
