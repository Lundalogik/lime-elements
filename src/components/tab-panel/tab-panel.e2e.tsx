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
        await setProps({ tabs: newTabs });
        await waitForChanges();

        const fooDiv = root.querySelector('#foo') as HTMLElement;
        const barDiv = root.querySelector('#bar') as HTMLElement;
        expect(fooDiv.style.display).toEqual('none');
        expect(barDiv.style.display).toEqual('');
    });

    describe('the tabs', () => {
        const tabs = [
            { id: 'foo', active: true, text: 'Foo' },
            { id: 'bar', text: 'Bar' },
        ];

        const renderPanel = async (orientation?: 'horizontal' | 'vertical') => {
            const { root, waitForChanges } = await render(
                <limel-tab-panel
                    style={{ width: '40rem', height: '20rem' }}
                    tabs={tabs}
                    orientation={orientation}
                >
                    <div id="foo">Foo</div>
                    <div id="bar">Bar</div>
                </limel-tab-panel>
            );
            await waitForChanges();

            return {
                panel: root,
                waitForChanges: waitForChanges,
                bar: root.shadowRoot.querySelector('limel-tab-bar'),
                content: root.querySelector('#foo'),
            };
        };

        it('are above the content, unless asked otherwise', async () => {
            const { bar, content } = await renderPanel();

            expect(bar.orientation).toBe('horizontal');
            expect(bar.getBoundingClientRect().bottom).toBeLessThanOrEqual(
                content.getBoundingClientRect().top
            );
        });

        it('are in a column to the left of the content, as tall as the panel, in a vertical panel', async () => {
            const { panel, bar, content } = await renderPanel('vertical');

            expect(bar.orientation).toBe('vertical');
            expect(bar.getBoundingClientRect().right).toBeLessThanOrEqual(
                content.getBoundingClientRect().left
            );
            expect(bar.getBoundingClientRect().height).toBe(
                panel.getBoundingClientRect().height
            );
        });

        it('are as wide as the panel says, in a vertical panel', async () => {
            const { panel, bar, waitForChanges } =
                await renderPanel('vertical');
            expect(bar.getBoundingClientRect().width).toBe(160);

            panel.style.setProperty('--tab-bar-vertical-width', '12rem');
            await waitForChanges();

            expect(bar.getBoundingClientRect().width).toBe(192);
        });

        it('are no wider than the panel says, in a horizontal panel', async () => {
            const { panel, waitForChanges } = await renderPanel();
            panel.tabs = [
                {
                    id: 'foo',
                    active: true,
                    text: 'A label that goes on and on, far beyond any reasonable length',
                },
            ];

            panel.style.setProperty(
                '--tab-bar-horizontal-tab-max-width',
                '8rem'
            );
            await waitForChanges();

            const tab = panel.shadowRoot
                .querySelector('limel-tab-bar')
                .shadowRoot.querySelector('button[role="tab"]');
            expect(tab.getBoundingClientRect().width).toBe(128);
        });

        it('follow when the orientation changes', async () => {
            const { panel, bar, waitForChanges } = await renderPanel();

            panel.orientation = 'vertical';
            await waitForChanges();

            expect(bar.orientation).toBe('vertical');
        });
    });
});
