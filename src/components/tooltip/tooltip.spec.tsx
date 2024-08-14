jest.mock('./tooltipTimer', () => {
    return {
        TooltipTimer: jest
            .fn()
            .mockImplementation((showCallback, hideCallback) => {
                return {
                    showAfterDelay: jest.fn(() => showCallback()),
                    hide: jest.fn(() => hideCallback()),
                };
            }),
    };
});

import { h } from '@stencil/core';
import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { Portal } from '../portal/portal';
import { TooltipBasicExample } from './examples/tooltip-basic';
import { Tooltip } from './tooltip';

let page: SpecPage;
let tooltip: HTMLLimelTooltipElement;
let content: HTMLLimelTooltipContentElement;
let portal: HTMLLimelPortalElement;
let anchor: HTMLAnchorElement;

describe('limel-tooltip', () => {
    beforeEach(async () => {
        const element = document.createElement('div');
        Object.getPrototypeOf(element).showPopover = () => {};
        Object.getPrototypeOf(element).hidePopover = () => {};

        page = await newSpecPage({
            components: [Tooltip, TooltipBasicExample, Portal],
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
        content.removeAttribute('id');
    });

    test('the component renders', () => {
        expect(tooltip).toEqualHtml(`
            <limel-tooltip
                element-id="tooltip-test"
                label="Description"
                maxlength="50"
                open-direction="top"
            >
                <mock:shadow-root>
                    <div class="trigger-anchor">
                        <limel-portal open-direction="top" position="absolute" style="pointer-events: none;">
                            <mock:shadow-root>
                                <div popover="manual" style="max-height: 752px;">
                                    <slot></slot>
                                </div>
                            </mock:shadow-root>

                            <limel-tooltip-content
                                aria-hidden
                                label="Description"
                                maxlength="50"
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

    test('aria-hidden is set when the owner element is NOT hovered', () => {
        expect(content).toHaveAttribute('aria-hidden');
    });

    test('aria-hidden is removed when the owner element is hovered', async () => {
        const event = new MouseEvent('mouseover');
        anchor.dispatchEvent(event);
        await page.waitForChanges();

        expect(content).not.toHaveAttribute('aria-hidden');
    });

    test('limel-portal is opened when the owner element is hovered', async () => {
        const event = new MouseEvent('mouseover');
        anchor.dispatchEvent(event);
        await page.waitForChanges();

        expect(portal.visible).toBeTruthy();
    });
});
