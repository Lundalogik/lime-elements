import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { ProsemirrorAdapter } from './prosemirror-adapter';

let page: SpecPage;

describe('prosemirror-adapter', () => {
    let editor: HTMLElement;

    beforeEach(async () => {
        // Mock console.warn to avoid the warning message in the test output
        // The warning happens because we initialize the editor in the
        // componentDidLoad lifecycle method, which triggers extra rerenders.
        // TODO: Can we avoid setting up the editor in componentDidLoad?
        const consoleWarnSpy = jest
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        page = await newSpecPage({
            components: [ProsemirrorAdapter],
            template: () => <limel-prosemirror-adapter />,
        });
        // Fail if there are unexpected warnings
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        jest.restoreAllMocks();

        editor = page.root.shadowRoot.querySelector('#editor');
    });

    it('should render the component', () => {
        expect(editor).toBeTruthy();
    });
});
