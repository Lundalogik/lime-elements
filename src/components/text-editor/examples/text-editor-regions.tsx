import { Component, Element, h, State } from '@stencil/core';
import { EditorRegion } from '../text-editor.types';

const REGIONS: EditorRegion[] = [{ name: 'signature', label: 'Signature' }];

/**
 * Regions
 *
 * A region is a named block of the document that keeps its identity through
 * the editor. Declare the names you use on the `regions` property, and mark
 * them in the value as `<div data-lime-region="name">`.
 *
 * The editor frames a region with its label so a writer can tell it apart
 * from the body, while its content stays fully editable. The label is drawn
 * by the editor and never becomes part of the value, which stays ordinary
 * HTML for anything that renders it later.
 *
 * `replaceRegion` swaps one region's content, leaving everything the user
 * has typed untouched.
 */
@Component({
    tag: 'limel-example-text-editor-regions',
    shadow: true,
})
export class TextEditorRegionsExample {
    @Element()
    private host: HTMLLimelExampleTextEditorRegionsElement;

    @State()
    private value: string =
        '<p>Thanks for getting back to me!</p>' +
        '<div data-lime-region="signature">' +
        '<p>Kind regards,<br />Robin</p>' +
        '</div>';

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                contentType="html"
                regions={REGIONS}
            />,
            <limel-example-controls>
                <limel-button
                    label="Replace signature"
                    onClick={this.replaceSignature}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private replaceSignature = async () => {
        const editor = this.host.shadowRoot.querySelector('limel-text-editor');
        await editor.replaceRegion(
            'signature',
            '<p>Best,<br />Robin — sent from a different account</p>'
        );
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
