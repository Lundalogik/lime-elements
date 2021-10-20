import { h } from '@stencil/core';
import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { Portal } from '../portal/portal';
import { TooltipExample } from './examples/tooltip';
import { Tooltip } from './tooltip';

let page: SpecPage;
let tooltip: HTMLLimelTooltipElement;
let content: HTMLLimelTooltipContentElement;
let portal: HTMLLimelPortalElement;
let anchor: HTMLAnchorElement;

beforeEach(async () => {
    page = await newSpecPage({
        components: [Tooltip, TooltipExample, Portal],
        template: () => {
            return (
                <div>
                    <a id="tooltip-test">Testing tooltip</a>
                    <limel-tooltip
                        elementId="tooltip-test"
                        label="Description"
                    />
                </div>
            );
        },
    });
    anchor = page.body.querySelector('a');
    tooltip = page.body.querySelector('limel-tooltip');
    content = tooltip.shadowRoot.querySelector('limel-tooltip-content');
    portal = tooltip.shadowRoot.querySelector('limel-portal');
    portal.removeAttribute('containerid');
    content.removeAttribute('id');
});

test('the component renders', () => {
    expect(tooltip).toEqualHtml(`
        <limel-tooltip>
            <mock:shadow-root>
                <div class="trigger-anchor">
                    <limel-portal>
                        <mock:shadow-root>
                            <slot></slot>
                        </mock:shadow-root>

                        <limel-tooltip-content
                            aria-hidden
                            label="Description"
                            role="tooltip"
                        ></limel-tooltip-content>
                    </limel-portal>
                </div>
            </mock:shadow-root>
        </limel-tooltip>
    `);
});

test('aria-describedby is set on the anchor', () => {
    expect(anchor.getAttribute('aria-describedby')).toBeTruthy();
});

test('aria-hidden is removed when the owner element is hovered', async () => {
    const event = new MouseEvent('mouseover');
    anchor.dispatchEvent(event);
    await page.waitForChanges();

    expect(content.getAttribute('aria-hidden')).toBeFalsy();
});

test('limel-portal is opened when the owner element is hovered', async () => {
    const event = new MouseEvent('mouseover');
    anchor.dispatchEvent(event);
    await page.waitForChanges();

    expect(portal.visible).toBeTruthy();
});
