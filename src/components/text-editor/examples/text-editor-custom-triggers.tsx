import {
    Button,
    LimelMenuListCustomEvent,
    MenuItem,
} from '@limetech/lime-elements';
import { Component, h, State, Element, Watch } from '@stencil/core';
import {
    ARROW_DOWN,
    ARROW_UP,
    ENTER,
    ESCAPE,
    TAB,
} from '../../../util/keycodes';
import { TextEditor, TriggerEventDetail } from '../text-editor.types';

/**
 * Custom triggers
 *
 * A trigger is a character or sequence of characters that if typed in the text editor
 * will initiate a trigger session. The session is initialized with a `triggerStart`
 * event. Subsequent characters written after the trigger sequence will be sent in a
 * `triggerChange` event. When the focus is removed from the trigger a `triggerStop`
 * event will be sent.
 *
 * The `triggerStart` event contains a `TextEditorInserter` object containing functions
 * to manipulate the state of the text editor around the trigger. Using any of the
 * supplied methods will effectivly replace the trigger content in the text editor with
 * the content of choice.
 *
 * In this example we pass either plain text, HTML string, or a `limel-chip`
 * representing some chosen user in a mention like situation.
 *
 * :::note
 * Changing the contentType resets the text editor with an empty value.
 */
@Component({
    tag: 'limel-example-text-editor-triggers',
    shadow: true,
    styleUrl: 'text-editor-custom-triggers.scss',
})
export class TextEditorCustomTriggersExample {
    @State()
    private value: string = '';

    @State()
    private triggerState: string = '';

    @State()
    private tagValue: string = '';

    @State()
    private isPickerOpen: boolean = false;

    @State()
    private insertMode: 'text' | 'chip' | 'html' = 'text';

    @State()
    private contentType: 'markdown' | 'html' = 'markdown';

    @State()
    private items: Array<MenuItem<number>> = [
        { text: 'Wolverine', value: 1, icon: 'wolf', selected: true },
        { text: 'Captain America', value: 2, icon: 'captain_america' },
        { text: 'Superman', value: 3, icon: 'superman' },
        { text: 'Tony Stark', value: 4, icon: 'iron_man' },
        { text: 'Batman', value: 5, icon: 'batman_old' },
    ];

    @State()
    private visibleItems: Array<MenuItem<number>>;

    @Element()
    private host: HTMLLimelPopoverElement;

    private insertModeButtons: Button[] = [
        {
            id: '1',
            title: 'text',
            selected: true,
        },
        {
            id: '2',
            title: 'chip',
        },
        {
            id: '3',
            title: 'html',
        },
    ];

    private contentTypeButtons: Button[] = [
        {
            id: '1',
            title: 'markdown',
            selected: true,
        },
        {
            id: '2',
            title: 'html',
        },
    ];

    private triggerFunction?: TextEditor;

    @Watch('isPickerOpen')
    protected watchOpen() {
        this.setupEventHandlers();
    }

    @Watch('tagValue')
    protected watchTagValue() {
        if (this.isPickerOpen) {
            this.visibleItems = this.items.filter((item: MenuItem<number>) =>
                item.text.toLowerCase().includes(this.tagValue)
            );
        }
    }
    public componentWillLoad() {
        this.visibleItems = this.items;
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (this.isPickerOpen) {
            this.host.addEventListener('keydown', this.handleKeyPress, {
                capture: true,
            });
        } else {
            this.host.removeEventListener('keydown', this.handleKeyPress, {
                capture: true,
            });
        }
    }

    private handleKeyPress = (event: KeyboardEvent) => {
        const capturedKeys = [ESCAPE, ARROW_UP, ARROW_DOWN, ENTER, TAB];
        if (capturedKeys.includes(event.key)) {
            event.stopPropagation();
            event.preventDefault();
        }

        if (event.key === ARROW_DOWN || event.key === ARROW_UP) {
            this.moveSelection(event.key);
        }

        if (event.key === ENTER || event.key === TAB) {
            const selectedItem: MenuItem | undefined = this.visibleItems.find(
                (item) => item.selected
            );

            if (selectedItem) {
                this.insertItem(selectedItem);
            }
        }

        if (event.key === ESCAPE) {
            this.isPickerOpen = false;
            this.triggerFunction?.stopTrigger();
        }
    };

    private moveSelection = (
        direction: typeof ARROW_UP | typeof ARROW_DOWN
    ) => {
        const increment = direction === ARROW_DOWN ? 1 : -1;
        const numberOfItems = this.visibleItems.length;
        const currentSelectionIndex = this.visibleItems.findIndex(
            (item) => item.selected
        );

        const selectionIndex =
            (currentSelectionIndex + increment + numberOfItems) % numberOfItems;

        this.removeAllSelections();
        this.setSelection(selectionIndex);
    };

    private removeAllSelections = () => {
        this.items = this.items.map((currentItem) => {
            currentItem.selected = false;

            return { ...currentItem };
        });
    };

    private setSelection = (selectionIndex: number) => {
        let selectedItemId;
        this.visibleItems = this.visibleItems.map((item, index) => {
            const isSelected = index === selectionIndex;

            if (isSelected) {
                selectedItemId = item.value;
            }

            return { ...item, selected: isSelected };
        });

        if (selectedItemId) {
            this.items[selectedItemId - 1].selected = true;
        }
    };

    public render() {
        return [
            <limel-example-controls>
                <label>
                    contentType:
                    <limel-button-group
                        class="mode"
                        value={this.contentTypeButtons}
                        onChange={this.handleContentTypeChange}
                    />
                </label>
            </limel-example-controls>,
            this.renderPicker(),
            <limel-text-editor
                style={{ display: 'block' }}
                value={this.value}
                customElements={[
                    { tagName: 'limel-chip', attributes: ['text', 'icon'] },
                ]}
                triggers={['@']}
                onTriggerStart={this.handleTriggerStart}
                onTriggerStop={this.handleTriggerStop}
                onTriggerChange={this.handleTriggerChange}
                onChange={this.handleChange}
                contentType={this.contentType}
                key={this.contentType}
            />,
            <limel-example-controls>
                <label>
                    Insert mode:
                    <limel-button-group
                        class="mode"
                        value={this.insertModeButtons}
                        onChange={this.handleInsertModeChange}
                    />
                </label>
                <div class="value">
                    <limel-example-value
                        label="Action"
                        value={this.triggerState}
                    />
                    <limel-example-value
                        label="Tag value"
                        value={this.tagValue}
                    />
                </div>
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private renderPicker = () => {
        return (
            <limel-popover
                open={this.isPickerOpen}
                openDirection="top-start"
                onClose={this.handleTriggerStop}
            >
                {this.renderList(this.visibleItems)}
            </limel-popover>
        );
    };

    private renderList = (items: Array<MenuItem<number>>) => {
        if (items.length === 0) {
            return (
                <div style={{ padding: '0.5rem' }}>
                    Couldn't find. Not a hero yet! 🥲
                </div>
            );
        }

        return (
            <limel-menu-list
                items={items}
                onInteract={this.handleListInteraction}
            />
        );
    };

    private handleTriggerStart = (event: CustomEvent<TriggerEventDetail>) => {
        this.triggerState = 'start';
        this.isPickerOpen = true;
        this.triggerFunction = event.detail.textEditor;
    };

    private handleTriggerStop = () => {
        this.triggerState = 'stop';
        this.tagValue = '';
        this.isPickerOpen = false;
    };

    private handleTriggerChange = (event: CustomEvent<TriggerEventDetail>) => {
        this.tagValue = event.detail.value.toLowerCase();
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private handleListInteraction = (
        event: LimelMenuListCustomEvent<MenuItem<number>>
    ) => {
        this.insertItem(event.detail);
    };

    private handleInsertModeChange = (event: CustomEvent<Button>) => {
        this.insertMode = event.detail.title as any;
    };

    private handleContentTypeChange = (event: CustomEvent<Button>) => {
        this.contentType = event.detail.title as any;
        this.value = '';
    };

    private insertItem = (item: MenuItem) => {
        this.removeAllSelections();
        this.visibleItems = this.items;

        if (this.insertMode === 'html') {
            this.triggerFunction
                .insertHtml(`<strong>${item.text}</strong>`)
                .then(() => console.log('HTML inserted successfully'))
                .catch((error) =>
                    console.error('Error inserting HTML:', error)
                );

            return;
        }

        if (this.insertMode === 'text') {
            this.triggerFunction.insert('@' + item.text);

            return;
        }

        this.triggerFunction.insert({
            node: {
                tagName: 'limel-chip',
                attributes: {
                    icon: item.icon,
                    text: item.text,
                },
            },
            children: ["I'm a teapot"],
        });
    };
}
