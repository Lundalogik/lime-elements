import { portalContains } from './contains';

function createElementWithShadow(tag: string) {
    const el = document.createElement(tag);
    el.attachShadow({ mode: 'open' });

    return el;
}

describe('portalContains', () => {
    let element: HTMLElement;
    let child: HTMLElement;

    describe('when child is a descendant', () => {
        beforeEach(() => {
            element = document.createElement('span');
            child = document.createElement('span');

            element.append(child);
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
            element = createElementWithShadow('div');
            child = document.createElement('span');

            element.shadowRoot.append(child);
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

            element = createElementWithShadow('div');
            const portal = document.createElement('div');
            element.shadowRoot.append(portal);

            const container = document.createElement('div');
            container.classList.add('limel-portal--container');
            Object.assign(container, {
                portalSource: portal,
            });

            const containerContent = createElementWithShadow('div');
            container.append(containerContent);

            child = document.createElement('span');
            containerContent.shadowRoot.append(child);
        });

        it('returns true', () => {
            expect(portalContains(element, child)).toBe(true);
        });
    });
});
