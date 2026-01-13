import { NodeView } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';

export class TaskListItemView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    checkbox: HTMLInputElement;
    private getPos: () => number;
    private view: any;

    constructor(node: ProseMirrorNode, view: any, getPos: () => number) {
        this.getPos = getPos;
        this.view = view;

        // Create the list item element
        this.dom = document.createElement('li');
        this.dom.className = 'task-list-item';

        // Create the checkbox
        this.checkbox = document.createElement('input');
        this.checkbox.type = 'checkbox';
        this.checkbox.checked = node.attrs.checked;

        // Create content container
        this.contentDOM = document.createElement('div');
        this.contentDOM.className = 'task-list-item-content';

        // Assemble the DOM
        this.dom.append(this.checkbox);
        this.dom.append(this.contentDOM);

        // Add click handler for checkbox
        this.checkbox.addEventListener('click', this.handleCheckboxClick);
    }

    private handleCheckboxClick = (event: Event) => {
        // Don't prevent default - let the checkbox toggle naturally
        const newChecked = (event.target as HTMLInputElement).checked;
        const pos = this.getPos();
        const tr = this.view.state.tr.setNodeMarkup(pos, null, {
            checked: newChecked,
        });
        this.view.dispatch(tr);
    };

    update(node: ProseMirrorNode): boolean {
        if (node.type.name !== 'task_list_item') {
            return false;
        }
        this.checkbox.checked = node.attrs.checked;
        return true;
    }

    stopEvent(event: Event): boolean {
        // Allow checkbox clicks to be handled by our custom handler
        return event.target === this.checkbox;
    }

    destroy(): void {
        this.checkbox.removeEventListener('click', this.handleCheckboxClick);
    }
}

export const createTaskListItemNodeView = (
    node: ProseMirrorNode,
    view: any,
    getPos: () => number
) => {
    return new TaskListItemView(node, view, getPos);
};
