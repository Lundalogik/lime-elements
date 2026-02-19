import { render, h } from '@stencil/vitest';

describe('limel-tab-panel', () => {
    it('renders the component with tabs', async () => {
        const tabs = [
            { id: 'foo', active: true, text: 'Foo' },
            { id: 'bar', text: 'Bar' },
        ];
        const { root, waitForChanges } = await render(
            <limel-tab-panel tabs={tabs}>
                <div id="foo">Foo</div>
                <div id="bar">Bar</div>
            </limel-tab-panel>
        );
        await waitForChanges();

        // Tab bar should be rendered
        const tabBar = root.shadowRoot.querySelector('limel-tab-bar');
        expect(tabBar).toBeTruthy();

        // Active tab's content should be visible, inactive hidden
        const fooDiv = root.querySelector('#foo') as HTMLElement;
        const barDiv = root.querySelector('#bar') as HTMLElement;
        expect(fooDiv.style.display).toEqual('');
        expect(barDiv.style.display).toEqual('none');
    });

    it('updates display when new tabs are given', async () => {
        const tabs = [
            { id: 'foo', active: true, text: 'Foo' },
            { id: 'bar', text: 'Bar' },
        ];
        const { root, waitForChanges, setProps } = await render(
            <limel-tab-panel tabs={tabs}>
                <div id="foo">Foo</div>
                <div id="bar">Bar</div>
            </limel-tab-panel>
        );
        await waitForChanges();

        const newTabs = [
            { id: 'foo', text: 'Foo' },
            { id: 'bar', text: 'Bar', active: true },
        ];
        setProps({ tabs: newTabs });
        await waitForChanges();

        const fooDiv = root.querySelector('#foo') as HTMLElement;
        const barDiv = root.querySelector('#bar') as HTMLElement;
        expect(fooDiv.style.display).toEqual('none');
        expect(barDiv.style.display).toEqual('');
    });
});
