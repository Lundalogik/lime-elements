import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import { EditorTextLink } from '../prosemirror-adapter/menu/types';
import { Languages } from '../../date-picker/date.types';
import translate from '../../../global/translations';
import { LimelInputFieldCustomEvent } from '../../../components';
import { ENTER, ESCAPE } from '../../../util/keycodes';

/**
 * This component is a menu for editing a link in the text editor.
 * It allows the user to input the text and url for the link.
 * @beta
 * @private
 */
@Component({
    tag: 'limel-text-editor-link-menu',
    shadow: true,
    styleUrl: 'editor-link-menu.scss',
})
export class TextEditorLinkMenu {
    /**
     * The link
     */
    @Prop({ reflect: true })
    public link: EditorTextLink;

    /**
     * Defines the language for translations.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Open state of the link-menu dialog
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
     * Emitted when the user inputs new values for the link
     */
    @Event()
    private linkChange: EventEmitter<EditorTextLink>;

    private textInput: HTMLLimelInputFieldElement;
    private saveButton: HTMLLimelButtonElement;

    public connectedCallback() {
        this.setupGlobalHandlers();
    }

    public disconnectedCallback() {
        this.teardownGlobalHandlers();
    }

    private setupGlobalHandlers() {
        if (this.isOpen) {
            document.addEventListener('keyup', this.handleCancel);
        }
    }

    private teardownGlobalHandlers() {
        document.removeEventListener('keyup', this.handleCancel);
    }

    public componentDidLoad() {
        this.focusOnTextInput();
    }

    private focusOnTextInput() {
        if (this.textInput) {
            const inputField = this.textInput.shadowRoot.querySelector('input');
            if (inputField) {
                requestAnimationFrame(() => {
                    inputField.focus();
                });
            }
        }
    }

    public render() {
        const isValid = this.isValid(this.link.href);

        return [
            <limel-input-field
                label={this.getTranslation('editor-link-menu.text')}
                value={this.link?.text || ''}
                leadingIcon="text_cursor"
                onChange={this.handleLinkTitleChange}
                onKeyDown={this.handleKeyDown}
                ref={(el) =>
                    (this.textInput = el as HTMLLimelInputFieldElement)
                }
            />,
            <limel-input-field
                label={this.getTranslation('editor-link-menu.link')}
                value={this.link?.href || ''}
                type="text"
                leadingIcon="-lime-text-link"
                trailingIcon="external_link"
                invalid={!isValid}
                onChange={this.handleLinkValueChange}
                onAction={this.handleLinkInputAction}
                onKeyDown={this.handleKeyDown}
            />,
            <div class="actions">
                <limel-button
                    label={this.getTranslation('cancel')}
                    onClick={this.handleCancel}
                />
                <limel-button
                    primary={true}
                    label={this.getTranslation('save')}
                    disabled={!isValid}
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

    private isValid = (href: string): boolean => {
        try {
            new URL(href);
        } catch {
            return false;
        }

        return true;
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== ENTER) {
            return;
        }

        if (this.saveButton) {
            this.saveButton.focus();
        }

        event.preventDefault();
        if (this.isValid(this.link?.href)) {
            this.handleSave(event);
        }
    };

    private handleCancel = (event: MouseEvent | KeyboardEvent) => {
        if (event instanceof KeyboardEvent && event.key !== ESCAPE) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        this.cancel.emit();
    };

    private handleSave = (event: MouseEvent | KeyboardEvent) => {
        event.stopPropagation();

        this.save.emit();
    };

    private handleLinkInputAction = (
        event: LimelInputFieldCustomEvent<void>
    ) => {
        window.open(this.link.href, '_blank');
        event.stopPropagation();
    };

    private handleLinkTitleChange = (event: CustomEvent<string>) => {
        this.emitLinkChange(event.detail, this.link?.href);
    };

    private handleLinkValueChange = (event: CustomEvent<string>) => {
        const href = event.detail;

        this.emitLinkChange(this.link?.text, href);
    };

    private emitLinkChange = (text: string, href: string) => {
        const newLink: EditorTextLink = {
            text: text,
            href: href,
        };

        this.linkChange.emit(newLink);
    };
}
