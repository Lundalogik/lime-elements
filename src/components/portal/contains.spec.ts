import { portalContains } from './contains';

describe('portalContains', () => {
    let element: HTMLElement;
    let child: HTMLElement;

    beforeEach(async () => {
        class TestComponent extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
        }
        customElements.define('test-component', TestComponent);
        await customElements.whenDefined('test-component');
    });

    describe('when child is a descendant', () => {
        beforeEach(() => {
            element = document.createElement('span');
            child = document.createElement('span');

            element.appendChild(child);
        });

        it('returns true', () => {
            expect(portalContains(element, child)).toBe(true);
        });
    });

    describe('when child is not a descendant', () => {
        beforeEach(() => {
            element = document.createElement('span');
            child = document.createElement('span');
        });

        it('returns false', () => {
            expect(portalContains(element, child)).toBe(false);
        });
    });

    describe('when child is a descendant in a shadowRoot', () => {
        beforeEach(() => {
            element = document.createElement('test-component');
            child = document.createElement('span');

            element.shadowRoot.appendChild(child);
        });

        it('returns true', () => {
            expect(portalContains(element, child)).toBe(true);
        });
    });

    describe('when child is a descendant in a portal', () => {
        beforeEach(async () => {
            // This test duplicates some of the implementation from the
            // limel-portal component. The reason behind this is because the
            // `assignedElements` method does not seem to exist when running
            // the tests, so the portal content will never be moved to the
            // portal container. This mock implementation is so that we can
            // still test that the `portalContains` still works when elements
            // are inside a portal

            element = document.createElement('test-component');
            const portal = document.createElement('div');
            element.shadowRoot.appendChild(portal);

            const container = document.createElement('div');
            container.classList.add('limel-portal--container');
            Object.assign(container, {
                portalSource: portal,
            });

            const containerContent = document.createElement('test-component');
            container.appendChild(containerContent);

            child = document.createElement('span');
            containerContent.shadowRoot.appendChild(child);
        });

        it('returns true', () => {
            expect(portalContains(element, child)).toBe(true);
        });
    });
});
