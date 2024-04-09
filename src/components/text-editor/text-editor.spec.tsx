import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { TextEditor } from './text-editor';

let page: SpecPage;

describe('limel-text-editor', () => {
    let editor: HTMLElement;

    beforeEach(async () => {
        page = await newSpecPage({
            components: [TextEditor],
            template: () => <limel-text-editor />,
        });

        editor = page.root.shadowRoot.querySelector('#editor');
    });

    it('should render the component', () => {
        expect(editor).toBeTruthy();
        expect(
            editor.querySelector('.ProseMirror-menubar-wrapper'),
        ).toBeTruthy();
    });
});
