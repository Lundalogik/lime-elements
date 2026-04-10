import { morphChildren } from './morph-dom';

describe('morphChildren', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.append(container);
    });

    afterEach(() => {
        container.remove();
    });

    it('sets initial content on an empty container', () => {
        morphChildren(container, '<p>Hello</p>');
        expect(container.innerHTML).toBe('<p>Hello</p>');
    });

    it('updates changed text content', () => {
        container.innerHTML = '<p>Hello</p>';
        morphChildren(container, '<p>Hello World</p>');
        expect(container.innerHTML).toBe('<p>Hello World</p>');
    });

    it('preserves an unchanged DOM node instance', () => {
        container.innerHTML = '<p>First</p><p>Second</p>';
        const secondP = container.querySelectorAll('p')[1];

        morphChildren(container, '<p>First</p><p>Second</p><p>Third</p>');

        expect(container.querySelectorAll('p')[1]).toBe(secondP);
    });

    it('preserves a custom element when surrounding text changes', () => {
        container.innerHTML =
            '<p>Before</p><my-widget data-x="1"></my-widget><p>After</p>';
        const widget = container.querySelector('my-widget');

        morphChildren(
            container,
            '<p>Updated</p><my-widget data-x="1"></my-widget><p>After</p><p>New</p>'
        );

        expect(container.querySelector('my-widget')).toBe(widget);
    });

    it('preserves a custom element when its attributes change', () => {
        container.innerHTML =
            '<p>Hello</p><my-chip link=\'{"href":"old"}\' text="A"></my-chip>';
        const chip = container.querySelector('my-chip');

        morphChildren(
            container,
            '<p>Hello</p><my-chip link=\'{"href":"new","target":"_blank"}\' text="A"></my-chip>'
        );

        const updatedChip = container.querySelector('my-chip');
        expect(updatedChip).toBe(chip);
        expect(updatedChip.getAttribute('link')).toBe(
            '{"href":"new","target":"_blank"}'
        );
    });

    it('preserves custom elements with complex JSON attributes', () => {
        const json = '{"href":"https://example.com","text":"Example"}';
        container.innerHTML = `<p>Text</p><my-chip link='${json}'></my-chip>`;
        const chip = container.querySelector('my-chip');

        morphChildren(
            container,
            `<p>Updated text</p><my-chip link='${json}'></my-chip>`
        );

        expect(container.querySelector('my-chip')).toBe(chip);
        expect(container.querySelector('my-chip').getAttribute('link')).toBe(
            json
        );
    });

    it('handles node removal', () => {
        container.innerHTML = '<p>One</p><p>Two</p><p>Three</p>';
        morphChildren(container, '<p>One</p><p>Three</p>');
        expect(container.children.length).toBe(2);
        expect(container.innerHTML).toBe('<p>One</p><p>Three</p>');
    });

    it('distinguishes multiple same-tag custom elements by attributes', () => {
        container.innerHTML =
            '<my-chip text="A"></my-chip><my-chip text="B"></my-chip>';
        const chipB = container.querySelectorAll('my-chip')[1];

        morphChildren(
            container,
            '<my-chip text="A"></my-chip><my-chip text="B"></my-chip><my-chip text="C"></my-chip>'
        );

        expect(container.querySelectorAll('my-chip')[1]).toBe(chipB);
        expect(
            container.querySelectorAll('my-chip')[1].getAttribute('text')
        ).toBe('B');
    });

    it('recreates custom element when new content is inserted before it', () => {
        // morphdom matches nodes positionally, so inserting a new sibling
        // before a custom element causes it to be recreated. This is a
        // known limitation — the element is still rendered correctly, but
        // it loses its DOM identity (and thus any internal state).
        container.innerHTML = '<p>Intro</p><my-chip text="Keep"></my-chip>';
        const chip = container.querySelector('my-chip');

        morphChildren(
            container,
            '<p>Intro</p><p>New paragraph</p><my-chip text="Keep"></my-chip>'
        );

        const updatedChip = container.querySelector('my-chip');
        expect(updatedChip).not.toBe(chip);
        expect(updatedChip.getAttribute('text')).toBe('Keep');
    });

    it('handles empty new HTML', () => {
        container.innerHTML = '<p>Content</p>';
        morphChildren(container, '');
        expect(container.innerHTML).toBe('');
    });

    it('does not replace the container element itself', () => {
        const parent = container.parentNode;
        const originalContainer = container;
        container.innerHTML = '<p>Old</p>';
        morphChildren(container, '<p>New</p>');
        expect(container).toBe(originalContainer);
        expect(container.parentNode).toBe(parent);
    });

    it('handles rapid successive updates preserving custom element identity', () => {
        // Simulates the streaming scenario where value changes every ~50ms.
        // The custom element must be preserved (same DOM node) across all
        // updates — recreating it would cause lifecycle churn and flickering.
        morphChildren(
            container,
            '<p>Initial</p><my-chip text="Persistent"></my-chip>'
        );
        const originalChip = container.querySelector('my-chip');

        for (let i = 0; i < 20; i++) {
            morphChildren(
                container,
                `<p>Update ${i}</p><my-chip text="Persistent"></my-chip>`
            );
        }

        expect(container.querySelector('p').textContent).toBe('Update 19');
        expect(container.querySelector('my-chip')).toBe(originalChip);
    });
});
