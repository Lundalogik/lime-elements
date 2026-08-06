import { Component, Prop, h, Event, EventEmitter, Watch } from '@stencil/core';
import { Languages } from '../../date-picker/date.types';
import translate from '../../../global/translations';
import { ESCAPE } from '../../../util/keycodes';
import { DEFAULT_HIGHLIGHT_COLOR } from '../prosemirror-adapter/plugins/highlight/highlight-mark';

/**
 * This component is a menu for selecting highlight color in the text editor.
 * It allows the user to choose a color for text highlighting.
 *
 * @exampleComponent limel-example-highlight-color-menu
 * @beta
 * @private
 */
@Component({
    tag: 'limel-text-editor-highlight-color-menu',
    shadow: true,
    styleUrl: 'editor-highlight-color-menu.scss',
})
export class TextEditorHighlightColorMenu {
    /**
     * The selected color
     */
    @Prop({ reflect: true })
    public color: string = DEFAULT_HIGHLIGHT_COLOR;

    /**
     * Defines the language for translations.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Open state of the highlight-color-menu dialog
     */
    @Prop({ reflect: true })
    public isOpen: boolean = false;

    /**
     * Emitted when the menu is closed from inside the component.
     * (*Not* emitted when the consumer sets the `open`-property to `false`.)
     */
    @Event()
    private cancel: EventEmitter<void>;

    /**
     * Emitted when a color is applied from inside the component. Picking a
     * color applies it immediately, so this always follows a `colorChange`.
     */
    @Event()
    private save: EventEmitter<void>;

    /**
     * Emitted when the user selects a new color
     */
    @Event()
    private colorChange: EventEmitter<string>;

    private colorPicker: HTMLLimelColorPickerElement;

    public connectedCallback() {
        this.setupGlobalHandlers();
    }

    public disconnectedCallback() {
        this.teardownGlobalHandlers();
    }

    public componentDidLoad() {
        this.focusOnColorPicker();
    }

    @Watch('isOpen')
    protected watchIsOpen(isOpen: boolean) {
        if (isOpen) {
            this.focusOnColorPicker();
        }
    }

    private setupGlobalHandlers() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    private teardownGlobalHandlers() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Focuses the picker once when the menu appears. Focusing on later
     * renders would steal focus from the picker's manual color input,
     * which re-renders the menu on every keystroke.
     */
    private focusOnColorPicker() {
        if (this.isOpen && this.colorPicker) {
            setTimeout(() => {
                this.colorPicker?.focus();
            }, 100);
        }
    }

    public render() {
        return (
            <div class="color-picker-container">
                <limel-color-picker
                    value={this.color}
                    label={this.getTranslation(
                        'editor-highlight-color-menu.color'
                    )}
                    tooltipLabel={this.getTranslation(
                        'editor-highlight-color-menu.tooltip'
                    )}
                    helperText={this.getTranslation(
                        'editor-highlight-color-menu.helper'
                    )}
                    manualInputCommit="enter"
                    onChange={this.handleColorChange}
                    ref={(el) =>
                        (this.colorPicker = el as HTMLLimelColorPickerElement)
                    }
                />
            </div>
        );
    }

    private getTranslation = (key: string) => {
        return translate.get(key, this.language);
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        if (!this.isOpen) {
            return;
        }

        if (event.key === ESCAPE) {
            event.stopPropagation();
            event.preventDefault();
            this.handleCancel();
        }
    };

    private handleColorChange = (event: CustomEvent<string>) => {
        this.colorChange.emit(event.detail);
        this.save.emit();
    };

    private handleCancel = () => {
        this.cancel.emit();
    };
}
