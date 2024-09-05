import { Component, Prop, h, Event, EventEmitter, State } from '@stencil/core';
import { ListSeparator } from '../../list/list-item.types';
import { MenuItem } from '../../menu/menu.types';
import { ESCAPE } from '../../../util/keycodes';

/**
 * Text editor picker
 * This component displays a list of items that will be displayed in a popover,
 * in connection with the text editor's user interface.
 *
 * This popover is triggered and opened, when the end-user types a certain character.
 * The list is unfiltered first, but as the end-user types more characters, the list
 * gets filtered to only show items that match the user's input.
 *
 * Pressing <kbd>Ecs</kbd> will dismiss the popover, allowing the end-user to
 * continue typing without being forced to select something from the list.
 *
 * Selecting an item from the list will insert the item into the text editor's content,
 * visualizing it as a chip.
 *
 * @private
 */
@Component({
    tag: 'limel-text-editor-picker',
    shadow: true,
    styleUrl: 'text-editor-picker.scss',
})
export class TextEditorPicker {
    /**
     * List of items to display
     */
    @Prop()
    public items: Array<MenuItem | ListSeparator> = [];

    /**
     * Open state of the link-menu dialog
     */
    @Prop({ reflect: true })
    public open: boolean = false;

    /**
     * Emitted when the menu is closed from inside the component.
     * (*Not* emitted when the consumer sets the `open`-property to `false`.)
     */
    @Event()
    private cancel: EventEmitter<void>;

    @Event()
    private itemSelected: EventEmitter<MenuItem>;

    @State()
    private selectedItem: MenuItem<any> | ListSeparator;

    public connectedCallback() {
        this.setupGlobalHandlers();
        document.addEventListener('picker-scroll', this.handlePickerScroll);
    }

    public disconnectedCallback() {
        this.teardownGlobalHandlers();
        document.removeEventListener('picker-scroll', this.handlePickerScroll);
    }

    private setupGlobalHandlers() {
        if (this.open) {
            document.addEventListener('keyup', this.handleCancel);
        }
    }

    private teardownGlobalHandlers() {
        document.removeEventListener('keyup', this.handleCancel);
    }

    public render() {
        return [
            <limel-menu-list
                class="has-interactive-items"
                type="menu"
                items={this.items}
                onSelect={this.onSelect}
            />,
        ];
    }

    private handleCancel = (event: MouseEvent | KeyboardEvent) => {
        if (event instanceof KeyboardEvent && event.key !== ESCAPE) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        this.cancel.emit();
    };

    private handlePickerScroll = (event: CustomEvent) => {
        event.stopPropagation();
        const direction = event.detail.direction;
        const currentIndex = this.items.findIndex(
            (item) => item === this.selectedItem,
        );
        if (direction === 'up' && currentIndex > 0) {
            this.selectedItem = this.items[currentIndex - 1];
        } else if (
            direction === 'down' &&
            currentIndex < this.items.length - 1
        ) {
            this.selectedItem = this.items[currentIndex + 1];
        }
    };

    private onSelect = (event: CustomEvent<any>) => {
        event.stopPropagation();
        this.itemSelected.emit(event.detail);
    };
}
