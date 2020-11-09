import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';
import { Tab } from '../tab-bar/tab.types';

describe('tab-panel', () => {
    let page: E2EPage;
    let tabPanel: E2EElement;
    let tabs: Tab[] = [];

    beforeEach(async () => {
        page = await newE2EPage();
        await page.setContent(`
            <limel-tab-panel>
                <div id="foo">Foo</div>
                <div id="bar">Bar</div>
            </limel-tab-panel>
        `);
        tabs = [
            {
                id: 'foo',
                active: true,
                text: 'Foo',
            },
            {
                id: 'bar',
                text: 'Bar',
            },
        ];
        tabPanel = await page.find('limel-tab-panel');
        tabPanel.setProperty('tabs', tabs);

        await page.waitForChanges();
    });

    it('renders the component', () => {
        expect(tabPanel).toEqualHtml(`
            <limel-tab-panel class="hydrated">
                <mock:shadow-root>
                    <div class="tab-panel">
                        <limel-tab-bar class="hydrated"></limel-tab-bar>
                        <div class="tab-content">
                            <slot></slot>
                        </div>
                    </div>
                </mock:shadow-root>
                <div id="foo">Foo</div>
                <div id="bar" style="display: none;">Bar</div>
            </limel-tab-panel>
        `);
    });

    describe('when new tabs are given', () => {
        beforeEach(async () => {
            tabs = [
                {
                    id: 'cat',
                    text: 'Cat',
                },
                {
                    id: 'dog',
                    text: 'Dog',
                    active: true,
                },
            ];

            await page.$eval('body', (body) => {
                let element = body.querySelector('#foo');
                element.id = 'cat';
                element.textContent = 'Cat';

                element = body.querySelector('#bar');
                element.id = 'dog';
                element.textContent = 'Dog';
            });
            await page.waitForChanges();

            tabPanel.setProperty('tabs', tabs);
            await page.waitForChanges();
        });

        it('sets the correct display on the panels', () => {
            expect(tabPanel).toEqualHtml(`
                <limel-tab-panel class="hydrated">
                    <mock:shadow-root>
                        <div class="tab-panel">
                            <limel-tab-bar class="hydrated"></limel-tab-bar>
                            <div class="tab-content">
                                <slot></slot>
                            </div>
                        </div>
                    </mock:shadow-root>
                    <div id="cat" style="display: none;">Cat</div>
                    <div id="dog">Dog</div>
                </limel-tab-panel>
            `);
        });
    });
});
