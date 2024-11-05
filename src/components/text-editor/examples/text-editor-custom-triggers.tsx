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
import { ESCAPE } from '../../../util/keycodes';
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
        this.globalClickListener = this.globalClickListener.bind(this);
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

    @Element()
    private host: HTMLLimelPopoverElement;

    /**
     * Emits an event when the component is closing
     */
    @Event()
    private close: EventEmitter<void>;

    @Watch('isPickerOpen')
    protected watchOpen() {
        this.setupGlobalHandlers();
    }

    public componentWillLoad() {
        this.setupGlobalHandlers();
    }

    private setupGlobalHandlers() {
        if (this.isPickerOpen) {
            document.addEventListener('click', this.globalClickListener, {
                capture: true,
            });
            document.addEventListener('keyup', this.handleGlobalKeyPress);
        } else {
            document.removeEventListener('click', this.globalClickListener);
            document.removeEventListener('keyup', this.handleGlobalKeyPress);
        }
    }

    private handleGlobalKeyPress = (event: KeyboardEvent) => {
        if (event.key !== ESCAPE) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        this.close.emit();
    };

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
    private items: Array<ListItem<number>> = [
        { text: 'Wolverine', value: 1, icon: 'wolf' },
        { text: 'Captain America', value: 2, icon: 'captain_america' },
        { text: 'Superman', value: 3, icon: 'superman' },
        { text: 'Tony Stark', value: 4, icon: 'iron_man' },
        { text: 'Batman', value: 5, icon: 'batman_old' },
    ];

    private triggerFunction?: TextEditor;

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

    private renderPicker = () => {
        if (!this.isPickerOpen) {
            return;
        }

        const items = this.items.filter((item: ListItem<number>) =>
            item.text.toLowerCase().includes(this.inputText),
        );

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
                {this.renderList(items)}
            </limel-portal>,
        ];
    };

    private globalClickListener(event: MouseEvent) {
        const element: HTMLElement = event.target as HTMLElement;
        const clickedInside = portalContains(this.host, element);
        if (this.isPickerOpen && !clickedInside) {
            event.stopPropagation();
            event.preventDefault();
            this.isPickerOpen = false;
            this.close.emit();
        }
    }

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

    private handleListChange = (
        event: LimelListCustomEvent<ListItem<number>>,
    ) => {
        if (this.insertMode === 'text') {
            this.triggerFunction.insert('@' + event.detail.text);

            return;
        }

        this.triggerFunction.insert({
            node: {
                tagName: 'limel-chip',
                attributes: {
                    icon: event.detail.icon,
                    text: event.detail.text,
                },
            },
        });
    };

    private handleInsertModeChange = (event: CustomEvent<Button>) => {
        this.insertMode = event.detail.title as any;
    };
}
