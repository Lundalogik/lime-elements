import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { ProsemirrorAdapter } from './prosemirror-adapter';

let page: SpecPage;

describe('prosemirror-adapter', () => {
    let editor: HTMLElement;

    beforeEach(async () => {
        page = await newSpecPage({
            components: [ProsemirrorAdapter],
            template: () => <limel-prosemirror-adapter />,
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
