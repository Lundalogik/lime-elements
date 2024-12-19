/* eslint-disable multiline-ternary */
import { Component, h, State, Element, Watch } from '@stencil/core';
import {
    LimelMenuListCustomEvent,
    MenuItem,
    TextEditor,
    TriggerEventDetail,
    TriggerCharacter,
    TriggerMap,
    CustomElementDefinition,
} from '@limetech/lime-elements';
import {
    ARROW_DOWN,
    ARROW_UP,
    ENTER,
    ESCAPE,
    TAB,
} from '../../../util/keycodes';

/**
 * Trigger Maps
 *
 * Trigger maps are a way to define a set of triggers, their corresponding
 * custom elements and mapping data to properties of the custom element.
 *
 * :::note
 * The trigger map is used to insert the custom element into the text editor
 * :::
 */
@Component({
    tag: 'limel-example-text-editor-using-trigger-maps',
    shadow: true,
    styleUrl: 'text-editor-custom-triggers.scss',
})
export class TextEditorUsingTriggerMaps {
    @State()
    private value: string = '';

    @State()
    private isPickerOpen: boolean = false;

    @State()
    private query: string = '';

    @State()
    private items: Array<MenuItem<number>> = [
        { text: 'Wolverine', value: 1, icon: 'wolf', selected: true },
        { text: 'Captain America', value: 2, icon: 'captain_america' },
        { text: 'Superman', value: 3, icon: 'superman' },
        { text: 'Tony Stark', value: 4, icon: 'iron_man' },
        { text: 'Batman', value: 5, icon: 'batman_old' },
    ];

    @State()
    private customElements: CustomElementDefinition[] = [];

    @State()
    private registeredTriggers: TriggerCharacter[] = [];

    private triggerFunction?: TextEditor;
    private triggerChar: TriggerCharacter | undefined;

    @Element()
    private host: HTMLLimelPopoverElement;

    private triggerMap: TriggerMap = {
        '@': {
            customElement: {
                tagName: 'limel-chip',
                attributes: ['text', 'icon'],
            },
            mapAttributes: (item: MenuItem<number>) => ({
                text: item.text,
                icon: item.icon,
            }),
        },
        '#': {
            customElement: {
                tagName: 'limel-header',
                attributes: [
                    'icon',
                    'heading',
                    'subheading',
                    'subheadingDivider',
                    'supportingText',
                ],
            },
            mapAttributes: (item: MenuItem<number>) => ({
                icon: item.icon,
                heading: item.text,
                subheading: 'Subheading',
                subheadingDivider: '<->',
                supportingText: 'supporting text',
            }),
        },
    };

    @Watch('isPickerOpen')
    protected watchOpen() {
        this.setupEventHandlers();
    }

    public componentWillLoad() {
        this.setupEventHandlers();
        this.setCustomElementsAndTriggers();
    }

    public render() {
        return [
            this.renderPicker(),
            <limel-text-editor
                style={{ display: 'block' }}
                value={this.value}
                triggers={this.registeredTriggers}
                customElements={this.customElements}
                onTriggerStart={this.handleTriggerStart}
                onTriggerStop={this.handleTriggerStop}
                onTriggerChange={this.handleTriggerChange}
                onChange={this.handleChange}
            />,
        ];
    }

    private renderPicker() {
        if (!this.isPickerOpen) {
            return;
        }

        const filteredItems = this.getFilteredItems();

        return (
            <limel-popover
                open={this.isPickerOpen}
                openDirection="top-start"
                onClose={this.handleTriggerStop}
            >
                {filteredItems.length === 0
                    ? this.renderEmptyMessage()
                    : this.renderList(filteredItems)}
            </limel-popover>
        );
    }

    private renderList(items: Array<MenuItem<number>>) {
        return (
            <limel-menu-list
                items={items}
                onInteract={this.handleListInteraction}
            />
        );
    }

    private renderEmptyMessage() {
        return <div style={{ padding: '0.5rem' }}>No matches found.</div>;
    }

    private setCustomElementsAndTriggers = () => {
        this.customElements = Object.values(this.triggerMap).map(
            (item) => item.customElement as CustomElementDefinition,
        );

        this.registeredTriggers = Object.keys(
            this.triggerMap,
        ) as TriggerCharacter[];
    };

    private setupEventHandlers = () => {
        if (this.isPickerOpen) {
            this.host.addEventListener('keydown', this.handleKeyPress, {
                capture: true,
            });
        } else {
            this.host.removeEventListener('keydown', this.handleKeyPress, {
                capture: true,
            });
        }
    };

    private handleKeyPress = (event: KeyboardEvent) => {
        if (!this.isPickerOpen || !this.triggerChar) {
            return;
        }

        const capturedKeys = [ESCAPE, ARROW_UP, ARROW_DOWN, ENTER, TAB];
        if (!capturedKeys.includes(event.key)) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const handlers = {
            [ESCAPE]: this.cancelTrigger,
            [ENTER]: this.selectHighlightedItem,
            [TAB]: this.selectHighlightedItem,
            [ARROW_DOWN]: this.moveSelection,
            [ARROW_UP]: this.moveSelection,
        };

        const handler = handlers[event.key];
        if (handler) {
            handler(event);
        }
    };

    private moveSelection = (event: KeyboardEvent) => {
        const increment =
            (event.key as typeof ARROW_DOWN | typeof ARROW_UP) === ARROW_DOWN
                ? 1
                : -1;
        const numberOfItems = this.items.length;
        const currentIndex = this.items.findIndex((item) => item.selected);

        const newIndex =
            (currentIndex + increment + numberOfItems) % numberOfItems;

        this.updateSelection(newIndex);
    };

    private updateSelection = (newIndex: number) => {
        this.items = this.items.map((item) => ({ ...item, selected: false }));

        const filteredItems = this.getFilteredItems();
        const selectedItem = filteredItems[newIndex];

        if (selectedItem) {
            this.items = this.items.map((item) =>
                item.value === selectedItem.value
                    ? { ...item, selected: true }
                    : item,
            );
        }
    };

    private selectHighlightedItem = () => {
        const selectedItem = this.getFilteredItems().find(
            (item) => item.selected,
        );
        if (!selectedItem) {
            return;
        }

        this.insertItem(selectedItem);
    };

    private getFilteredItems = (): Array<MenuItem<number>> => {
        const query = this.query.trim();
        if (!query) {
            return this.items;
        }

        return this.items.filter((item) =>
            item.text.toLowerCase().includes(query),
        );
    };

    private cancelTrigger = () => {
        this.isPickerOpen = false;
        this.triggerFunction?.stopTrigger();
        this.resetTrigger();
    };

    private handleTriggerStart = (event: CustomEvent<TriggerEventDetail>) => {
        this.triggerFunction = event.detail.textEditor;
        this.triggerChar = event.detail.trigger;
        this.isPickerOpen = true;
    };

    private handleTriggerStop = () => {
        this.resetTrigger();
    };

    private handleTriggerChange = (event: CustomEvent<TriggerEventDetail>) => {
        this.query = event.detail.value.toLowerCase();
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private resetTrigger = () => {
        this.query = '';
        this.triggerChar = undefined;
        this.isPickerOpen = false;
    };

    private insertItem = (item: MenuItem) => {
        const definition =
            this.triggerChar && this.triggerMap[this.triggerChar];
        if (!definition || !this.triggerFunction) {
            return;
        }

        // Insert as a chip using the trigger definition
        this.triggerFunction.insert({
            node: {
                tagName: definition.customElement.tagName,
                attributes: definition.mapAttributes(item),
            },
            children: [this.triggerChar + item.text],
        });

        this.triggerFunction.stopTrigger();
        this.resetTrigger();
    };

    private handleListInteraction = (
        event: LimelMenuListCustomEvent<MenuItem<number>>,
    ) => {
        this.insertItem(event.detail);
    };
}
