import { Component, Prop, h, Event, EventEmitter, State } from '@stencil/core';
import { EditorTextLink } from '../prosemirror-adapter/menu/types';
import { Languages } from '../../date-picker/date.types';
import translate from '../../../global/translations';
import {
    getHref,
    hasKnownProtocol,
    prependProtocol,
} from '../../../util/link-helper';
import { LimelInputFieldCustomEvent } from '../../../components';

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
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Open state of the dialog
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

    @State()
    private invalidLink: boolean = false;

    public render() {
        return [
            <limel-input-field
                label={this.getTranslation('editor-link-menu.text')}
                value={this.link?.text || ''}
                leadingIcon="text_cursor"
                onChange={this.handleLinkTitleChange}
            />,
            <limel-input-field
                label={this.getTranslation('editor-link-menu.link')}
                value={this.link?.href || ''}
                type="url"
                leadingIcon="-lime-text-link"
                trailingIcon="external_link"
                invalid={this.invalidLink}
                onChange={this.handleLinkValueChange}
                onAction={this.handleLinkInputAction}
            />,
            <div class="actions">
                <limel-button
                    label={this.getTranslation('cancel')}
                    onClick={this.handleCancel}
                    slot="button"
                />
                <limel-button
                    primary={true}
                    label={this.getTranslation('save')}
                    disabled={!this.link?.href || this.invalidLink}
                    onClick={this.handleSave}
                    slot="button"
                />
            </div>,
        ];
    }

    private getTranslation = (key: string) => {
        return translate.get(key, this.language);
    };

    private validateLink = (href: string): boolean => {
        if (!hasKnownProtocol(href)) {
            const formattedLink = prependProtocol(href);

            return !!getHref(formattedLink);
        }

        return !!getHref(href);
    };

    private handleCancel = (event: MouseEvent) => {
        this.cancel.emit();
        event.stopPropagation();
    };

    private handleSave = (event: MouseEvent | KeyboardEvent) => {
        this.save.emit();
        event.stopPropagation();
    };

    private handleLinkInputAction = (
        event: LimelInputFieldCustomEvent<void>,
    ) => {
        window.open(this.link.href, '_blank');
        event.stopPropagation();
    };

    private handleLinkTitleChange = (event: CustomEvent<string>) => {
        this.emitLinkChange(event.detail, this.link?.href);
    };

    private handleLinkValueChange = (event: CustomEvent<string>) => {
        const href = event.detail;
        const isValid = this.validateLink(href);

        this.invalidLink = !isValid;
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
