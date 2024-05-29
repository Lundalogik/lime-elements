import { EditorView } from 'prosemirror-view';
import {
    Plugin,
    PluginView,
    EditorState,
    Transaction,
} from 'prosemirror-state';
import { Searcher } from 'src/components/picker/searcher.types';
import { EditorPlugins } from '../plugins';
import {
    LimeObjectSelectorPlugin,
    LimeObjectSelectorPluginTrigger,
} from './types';
import { PickerValue } from 'src/components/picker/value.types';
import { ListItem } from 'src/components/list/list-item.types';

export type pluginFactory<T extends EditorPlugins> = (plugin: T) => Plugin;

/**
 * The limeobject selector plugin lets you search for limeobjects and insert them into the editor
 *
 * @param plugin The plugin to use
 * @returns The Prosemirror plugin
 */
export const limeobjectSelectorPlugin: pluginFactory<
    LimeObjectSelectorPlugin
> = (plugin: LimeObjectSelectorPlugin): Plugin => {
    const { searcher } = plugin.getProps();
    const key = plugin.getPluginKey();

    return new Plugin({
        view: () => {
            return new LimeobjectSelector(searcher);
        },
        key: key,
    });
};

class LimeobjectSelector implements PluginView {
    private container: ParentNode;
    private picker: HTMLLimelLimeobjectSelectorPickerElement;
    private state: 'closed' | 'opening' | 'open' = 'closed';
    private currentTrigger: LimeObjectSelectorPluginTrigger | null = null;

    constructor(
        private searcher: (
            trigger: LimeObjectSelectorPluginTrigger,
        ) => Searcher,
    ) {}

    public update(view: EditorView, lastState: EditorState): void {
        this.setContainer(view);
        const state = view.state;
        let deleteTriggerTr: Transaction;

        switch (this.state) {
            case 'closed':
                this.currentTrigger = this.getTriggerChar(state, lastState);

                if (!this.currentTrigger) {
                    return;
                }

                deleteTriggerTr = state.tr.delete(
                    state.selection.from - 1,
                    state.selection.from,
                );

                this.state = 'opening';

                view.dispatch(deleteTriggerTr);

                break;
            case 'opening':
                this.openPicker(view, this.currentTrigger);
                this.state = 'open';

                break;
            case 'open':
                this.closePicker();
                this.state = 'closed';

                break;
            default:
                return;
        }
    }

    private setContainer(view: EditorView): void {
        if (this.container) {
            return;
        }

        this.container = view.dom.parentNode;
    }

    private getTriggerChar(
        state: EditorState,
        lastState: EditorState,
    ): LimeObjectSelectorPluginTrigger | null {
        if (state && lastState.doc.eq(state.doc)) {
            return;
        }

        if (!state.selection.empty || !lastState.selection.empty) {
            return;
        }

        if (state.selection.from !== lastState.selection.from + 1) {
            return;
        }

        const lastChar = state.doc.textBetween(
            state.selection.from - 1,
            state.selection.from,
            '',
        );

        if (!this.isTriggerChar(lastChar)) {
            return null;
        }

        return lastChar;
    }

    private isTriggerChar(
        char: string,
    ): char is LimeObjectSelectorPluginTrigger {
        return char === '!' || char === '@';
    }

    private openPicker(
        view: EditorView,
        trigger: LimeObjectSelectorPluginTrigger,
    ): void {
        this.picker = document.createElement(
            'limel-limeobject-selector-picker',
        );

        const start = view.coordsAtPos(view.state.selection.from);
        const end = view.coordsAtPos(view.state.selection.to);
        const top =
            start.top -
            view.dom.parentElement.getBoundingClientRect().height -
            (view.dom.parentElement.nextSibling as any).getBoundingClientRect()
                .height;
        const left =
            // eslint-disable-next-line no-magic-numbers
            Math.max((start.left + end.left) / 2 - 100, 0);

        this.picker.offset = {
            top: `${top}px`,
            left: `${left}px`,
        };

        this.picker.onChange = (event: CustomEvent<ListItem<PickerValue>>) => {
            const href = event.detail.value;
            const title = event.detail.text;

            const linkMark = view.state.schema.marks.link.create({
                href: href,
                title: title,
            });

            const textNode = view.state.schema.text(title);

            const tr = view.state.tr
                .replaceSelectionWith(textNode)
                .addMark(
                    view.state.selection.from,
                    view.state.selection.from + textNode.nodeSize,
                    linkMark,
                );

            this.closePicker();
            this.state = 'closed';

            view.dispatch(tr);
        };

        this.picker.searcher = this.searcher(trigger);

        this.container.appendChild(this.picker);
    }

    private closePicker(): void {
        this.picker.remove();
    }

    public destroy(): void {
        this.closePicker();
    }
}
