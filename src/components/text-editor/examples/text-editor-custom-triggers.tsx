import {
    Button,
    LimelListCustomEvent,
    ListItem,
} from '@limetech/lime-elements';
import {
    Component,
    h,
    State,
    Element,
    Event,
    EventEmitter,
    Watch,
} from '@stencil/core';
import { createRandomString } from 'src/util/random-string';
import { portalContains } from '../../portal/contains';
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
 * In this example we pass either a text or a `limel-chip` representing some chosen user
 * in a mention like situation.
 */
@Component({
    tag: 'limel-example-text-editor-triggers',
    shadow: true,
    styleUrl: 'text-editor-custom-triggers.scss',
})
export class TextEditorCustomTriggersExample {
    constructor() {
        this.portalId = createRandomString();
        this.handleClick = this.handleClick.bind(this);
    }
    @State()
    private value: string = '';

    @State()
    private triggerState: string = '';

    @State()
    private inputText: string = '';

    @State()
    private isPickerOpen: boolean = false;

    @State()
    private textEditorElement: HTMLElement;

    @State()
    private insertMode: 'text' | 'chip' = 'text';

    @State()
    private items: Array<ListItem<number>> = [
        { text: 'Wolverine', value: 1, icon: 'wolf', selected: true },
        { text: 'Captain America', value: 2, icon: 'captain_america' },
        { text: 'Superman', value: 3, icon: 'superman' },
        { text: 'Tony Stark', value: 4, icon: 'iron_man' },
        { text: 'Batman', value: 5, icon: 'batman_old' },
    ];

    @State()
    private visibleItems: Array<ListItem<number>>;

    @Element()
    private host: HTMLLimelPopoverElement;

    /**
     * Emits an event when the component is closing
     */
    @Event()
    private close: EventEmitter<void>;

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
    ];

    private portalId: string;

    private triggerFunction?: TextEditor;

    @Watch('isPickerOpen')
    protected watchOpen() {
        this.setupEventHandlers();
    }

    @Watch('inputText')
    protected watchInputText() {
        if (this.isPickerOpen) {
            this.visibleItems = this.items.filter((item: ListItem<number>) =>
                item.text.toLowerCase().includes(this.inputText),
            );
        }
    }
    public componentWillLoad() {
        this.visibleItems = this.items;
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (this.isPickerOpen) {
            this.host.addEventListener('click', this.handleClick, {
                capture: true,
            });
            this.host.addEventListener('keydown', this.handleKeyPress, {
                capture: true,
            });
        } else {
            this.host.removeEventListener('click', this.handleClick, {
                capture: true,
            });
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
            const selectedItem: ListItem | undefined = this.visibleItems.find(
                (item) => item.selected,
            );

            if (selectedItem) {
                this.insertItem(selectedItem);
            }
        }

        if (event.key === ESCAPE) {
            this.close.emit();
            this.isPickerOpen = false;
            // @TODO: close the trigger session
        }
    };

    private moveSelection = (
        direction: typeof ARROW_UP | typeof ARROW_DOWN,
    ) => {
        const increment = direction === ARROW_DOWN ? 1 : -1;
        const numberOfItems = this.visibleItems.length;
        const currentSelectionIndex = this.visibleItems.findIndex(
            (item) => item.selected,
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
        let selectedItemId = undefined;
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
            <limel-text-editor
                style={{ display: 'block' }}
                ref={(el) => (this.textEditorElement = el)}
                value={this.value}
                customElements={[
                    { tagName: 'limel-chip', attributes: ['text', 'icon'] },
                ]}
                triggers={['@']}
                onTriggerStart={this.handleTriggerStart}
                onTriggerStop={this.handleTriggerStop}
                onTriggerChange={this.handleTriggerChange}
                onChange={this.handleChange}
            />,
            <limel-example-controls>
                Insert mode:
                <limel-button-group
                    class="mode"
                    value={this.insertModeButtons}
                    onChange={this.handleInsertModeChange}
                />
                <div class="value">
                    <limel-example-value
                        label="Action"
                        value={this.triggerState}
                    />
                    <limel-example-value
                        label="Tag value"
                        value={this.inputText}
                    />
                </div>
            </limel-example-controls>,
            this.renderPicker(),
            <limel-example-value value={this.value} />,
        ];
    }

    private renderPicker = () => {
        if (!this.isPickerOpen) {
            return;
        }

        const dropdownZIndex = getComputedStyle(this.host).getPropertyValue(
            '--dropdown-z-index',
        );

        return [
            <limel-portal
                containerStyle={{
                    'background-color': 'rgb(var(--contrast-100))',
                    'border-radius': '0.5rem',
                    'box-shadow': 'var(--shadow-depth-16)',
                    'z-index': dropdownZIndex,
                }}
                containerId={this.portalId}
                visible={this.isPickerOpen}
                openDirection="bottom-start"
                inheritParentWidth={true}
                anchor={this.textEditorElement}
            >
                {this.renderList(this.visibleItems)}
            </limel-portal>,
        ];
    };

    private renderList = (items: Array<ListItem<number>>) => {
        if (items.length === 0) {
            return (
                <div style={{ padding: '0.5rem' }}>
                    Couldn't find. Not a hero yet! 🥲
                </div>
            );
        }

        return (
            <limel-list
                items={items}
                onChange={this.handleListChange}
                type="selectable"
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
        this.inputText = '';
        this.isPickerOpen = false;
    };

    private handleTriggerChange = (event: CustomEvent<TriggerEventDetail>) => {
        this.inputText = event.detail.value.toLowerCase();
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private handleClick(event: MouseEvent) {
        const element: HTMLElement = event.target as HTMLElement;
        const clickedInside = portalContains(this.host, element);
        if (this.isPickerOpen && !clickedInside) {
            event.stopPropagation();
            event.preventDefault();
            this.isPickerOpen = false;
            this.close.emit();
        }
    }

    private handleListChange = (
        event: LimelListCustomEvent<ListItem<number>>,
    ) => {
        if (event.detail.selected) {
            this.insertItem(event.detail);
        }
    };

    private handleInsertModeChange = (event: CustomEvent<Button>) => {
        this.insertMode = event.detail.title as any;
    };

    private insertItem = (item: ListItem) => {
        this.removeAllSelections();
        this.visibleItems = this.items;
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
