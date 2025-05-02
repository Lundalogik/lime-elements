import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { FormComponent } from '../form/form.types';
import { Languages } from '../date-picker/date.types';
import { createRandomString } from '../../util/random-string';
import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';
import {
    TriggerCharacter,
    TriggerEventDetail,
    ImageInserter,
    EditorImage,
    EditorMetadata,
} from './text-editor.types';
import { EditorUiType } from './types';

/**
 * A rich text editor that offers a rich text editing experience with markdown support,
 * in the sense that you can easily type markdown syntax and see the rendered
 * result as rich text in real-time. For instance, you can type `# Hello, world!`
 * and see it directly turning to a heading 1 (an `<h1>` HTML element).
 *
 * Naturally, you can use standard keyboard hotkeys such as <kbd>Ctrl</kbd> + <kbd>B</kbd>
 * to toggle bold text, <kbd>Ctrl</kbd> + <kbd>I</kbd> to toggle italic text, and so on.
 *
 * @exampleComponent limel-example-text-editor-basic
 * @exampleComponent limel-example-text-editor-as-form-component
 * @exampleComponent limel-example-text-editor-with-markdown
 * @exampleComponent limel-example-text-editor-with-html
 * @exampleComponent limel-example-text-editor-with-tables
 * @exampleComponent limel-example-text-editor-with-inline-images-file-storage
 * @exampleComponent limel-example-text-editor-with-inline-images-base64
 * @exampleComponent limel-example-text-editor-allow-resize
 * @exampleComponent limel-example-text-editor-size
 * @exampleComponent limel-example-text-editor-ui
 * @exampleComponent limel-example-text-editor-custom-element
 * @exampleComponent limel-example-text-editor-triggers
 * @exampleComponent limel-example-text-editor-composite
 * @beta
 */
@Component({
    tag: 'limel-text-editor',
    shadow: { delegatesFocus: true },
    styleUrl: 'text-editor.scss',
})
export class TextEditor implements FormComponent<string> {
    /** The type of content that the editor should handle and emit, defaults to `markdown`
     *
     * Assumed to be set only once, so not reactive to changes
     */
    @Prop()
    public contentType: 'markdown' | 'html' = 'markdown';

    /**
     * Defines the language for translations.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Set to `true` to disable the field.
     * Use `disabled` to indicate that the field can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the field may become enabled again.
     */
    @Prop({ reflect: true })
    public disabled?: boolean = false;

    /**
     * Set to `true` to make the component read-only.
     * Use `readonly` when the field is only there to present the data it holds,
     * and will not become possible for the current user to edit.
     * :::note
     * Consider that it might be better to use `limel-markdown`
     * instead of `limel-text-editor` when the goal is visualizing data.
     * :::
     */
    @Prop({ reflect: true })
    public readonly?: boolean = false;

    /**
     * Optional helper text to display below the input field when it has focus
     */
    @Prop({ reflect: true })
    public helperText?: string;

    /**
     * The placeholder text shown inside the input field,
     * when the field is empty.
     */
    @Prop({ reflect: true })
    public placeholder?: string;

    /**
     * The label of the editor
     */
    @Prop({ reflect: true })
    public label?: string;

    /**
     * Set to `true` to indicate that the current value of the editor is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid?: boolean = false;

    /**
     * Description of the text inside the editor as markdown
     */
    @Prop({ reflect: true })
    public value: string;

    /**
     * A list of custom elements
     *
     * Any `CustomElement` that should be used inside the text editor needs
     * to be defined here.
     *
     * @private
     * @alpha
     */
    @Prop()
    public customElements: CustomElementDefinition[] = [];

    /**
     * A set of trigger characters
     *
     * Defining a character here will enable trigger events to be sent if the
     * character is detected in the editor.
     *
     * @private
     * @alpha
     */
    @Prop()
    public triggers: TriggerCharacter[] = [];

    /**
     * Set to `true` to indicate that the field is required.
     *
     * :::important
     * An empty but required field is not automatically considered invalid.
     * You must make sure to check the validity of the field on your own,
     * and properly handle the `invalid` state.
     * :::
     */
    @Prop({ reflect: true })
    public required?: boolean = false;

    /**
     * Set to `true` to allow the user to vertically resize the editor.
     * Set to `false` to disable the resize functionality.
     */
    @Prop({ reflect: true })
    public allowResize: boolean = true;

    /**
     * Specifies the visual appearance of the editor.
     *
     * - `standard`: The default editor appearance with a full toolbar and
     *    standard layout.
     * - `minimal`: A compact editor appearance, ideal for limited space
     *    scenarios such as mobile devices. In this mode, the toolbar is hidden
     *    until the editor is focused.
     * - `no-toolbar`: A basic textarea appearance without any text styling toolbar.
     *    This mode is suitable for scenarios where you want to provide a simple
     *    text input without any visible formatting options; but still provide
     *    support for markdown syntax and rich text, using hotkeys or when pasting.
     */
    @Prop({ reflect: true })
    public ui?: EditorUiType = 'standard';

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    public change: EventEmitter<string>;

    /**
     * Dispatched when a image is pasted into the editor
     *
     * @private
     * @alpha
     */
    @Event()
    private readonly imagePasted: EventEmitter<ImageInserter>;

    /**
     * Dispatched when a image is removed from the editor
     *
     * @private
     * @alpha
     * @deprecated - This event is deprecated and will be removed in a future version.
     * Use the `metadataChange` event instead to track image removals.
     */
    @Event()
    private readonly imageRemoved: EventEmitter<EditorImage>;

    /**
     * Dispatched when the metadata of the editor changes
     *
     * @private
     * @alpha
     */
    @Event()
    private readonly metadataChange: EventEmitter<EditorMetadata>;

    /**
     * Dispatched if a trigger character is detected.
     *
     * @private
     * @alpha
     */
    @Event()
    public triggerStart: EventEmitter<TriggerEventDetail>;

    /**
     * Dispatched if a trigger session is ended. That is if the selection
     * goes outside the trigger input or if something is inserted using the
     * supplied `TextEditor` insert function.
     *
     * @private
     * @alpha
     */
    @Event()
    public triggerStop: EventEmitter<TriggerEventDetail>;

    /**
     * Dispatched if a input is changed during an active trigger.
     *
     * @private
     * @alpha
     */
    @Event()
    public triggerChange: EventEmitter<TriggerEventDetail>;

    private readonly helperTextId: string;
    private readonly editorId: string;

    public constructor() {
        this.helperTextId = createRandomString();
        this.editorId = createRandomString();
    }

    public render() {
        return (
            <Host>
                <limel-notched-outline
                    labelId={this.editorId}
                    label={this.label}
                    required={this.required}
                    invalid={this.invalid}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    hasValue={!!this.value}
                    hasFloatingLabel={true}
                >
                    {this.renderEditor()}
                    {this.renderPlaceholder()}
                </limel-notched-outline>
                {this.renderHelperLine()}
            </Host>
        );
    }

    private renderEditor() {
        if (this.readonly) {
            return (
                <limel-markdown
                    slot="content"
                    value={this.value}
                    aria-controls={this.helperTextId}
                    id={this.editorId}
                />
            );
        }

        return (
            <limel-prosemirror-adapter
                slot="content"
                aria-placeholder={this.placeholder}
                contentType={this.contentType}
                onChange={this.handleChange}
                onImagePasted={this.handleImagePasted}
                onImageRemoved={this.handleImageRemoved}
                onMetadataChange={this.handleMetadataChange}
                customElements={this.customElements}
                value={this.value}
                aria-controls={this.helperTextId}
                id={this.editorId}
                aria-disabled={this.disabled}
                aria-invalid={this.invalid}
                aria-required={this.required}
                language={this.language}
                triggerCharacters={this.triggers}
                disabled={this.disabled}
                ui={this.ui}
            />
        );
    }

    private renderPlaceholder() {
        if (!this.placeholder || this.value) {
            return;
        }

        return (
            <span class="placeholder" aria-hidden="true" slot="content">
                {this.placeholder}
            </span>
        );
    }

    private renderHelperLine = () => {
        if (!this.helperText) {
            return;
        }

        return (
            <limel-helper-line
                helperText={this.helperText}
                helperTextId={this.helperTextId}
                invalid={this.isInvalid()}
            />
        );
    };

    private isInvalid = () => {
        if (this.readonly) {
            // A readonly field can never be invalid.
            return false;
        }

        if (this.invalid) {
            return true;
        }
    };

    private handleChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.change.emit(event.detail);
    };

    private handleImagePasted = (event: CustomEvent<ImageInserter>) => {
        event.stopPropagation();
        this.imagePasted.emit(event.detail);
    };

    private handleMetadataChange = (event: CustomEvent<EditorMetadata>) => {
        event.stopPropagation();
        this.metadataChange.emit(event.detail);
    };

    private handleImageRemoved = (event: CustomEvent<EditorImage>) => {
        event.stopPropagation();
        // eslint-disable-next-line sonarjs/deprecation
        this.imageRemoved.emit(event.detail);
    };
}
