import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import { Languages } from '../../date-picker/date.types';
import translate from '../../../global/translations';
import { ENTER, ESCAPE } from '../../../util/keycodes';

/**
 * This component is a menu for selecting highlight color in the text editor.
 * It allows the user to choose a color for text highlighting.
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
    public color: string = 'rgb(var(--color-yellow-light))';

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
     * Emitted when the menu is saved from inside the component.
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

    public componentDidRender() {
        this.focusOnColorPicker();
    }

    private setupGlobalHandlers() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    private teardownGlobalHandlers() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    private focusOnColorPicker() {
        if (this.isOpen && this.colorPicker) {
            // Focus the color picker when the menu opens
            setTimeout(() => {
                this.colorPicker?.focus();
            }, 100);
        }
    }

    public render() {
        return [
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
                    onChange={this.handleColorChange}
                    ref={(el) =>
                        (this.colorPicker = el as HTMLLimelColorPickerElement)
                    }
                />
            </div>,
            <div class="actions">
                <limel-button
                    label={this.getTranslation('cancel')}
                    onClick={this.handleCancel}
                />
                <limel-button
                    primary={true}
                    label={this.getTranslation('save')}
                    onClick={this.handleSave}
                    ref={(el) =>
                        (this.saveButton = el as HTMLLimelButtonElement)
                    }
                    slot="button"
                />
            </div>,
        ];
    }

    private getTranslation = (key: string) => {
        return translate.get(key, this.language);
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        if (!this.isOpen) {
            return;
        }

        if (event.key === ESCAPE) {
            this.handleCancel();
        } else if (event.key === ENTER) {
            this.handleSave();
        }
    };

    private handleColorChange = (event: CustomEvent<string>) => {
        this.colorChange.emit(event.detail);
    };

    private handleCancel = () => {
        this.cancel.emit();
    };

    private handleSave = () => {
        this.save.emit();
    };
}
