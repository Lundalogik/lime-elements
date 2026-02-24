import { hydrateCustomElements } from './hydrate-custom-elements';

describe('hydrateCustomElements', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('parses JSON object attributes into JS properties', () => {
        container.innerHTML =
            '<limel-chip text="GitHub" link=\'{"href":"https://github.com","target":"_blank"}\'></limel-chip>';
        const chip = container.querySelector('limel-chip');

        hydrateCustomElements(container, [
            { tagName: 'limel-chip', attributes: ['text', 'link'] },
        ]);

        expect((chip as any).link).toEqual({
            href: 'https://github.com',
            target: '_blank',
        });
    });

    it('parses JSON array attributes into JS properties', () => {
        container.innerHTML =
            '<my-list items=\'[{"id":1},{"id":2}]\'></my-list>';
        const list = container.querySelector('my-list');

        hydrateCustomElements(container, [
            { tagName: 'my-list', attributes: ['items'] },
        ]);

        expect((list as any).items).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('leaves plain string attributes untouched', () => {
        container.innerHTML = '<limel-chip text="Hello"></limel-chip>';
        const chip = container.querySelector('limel-chip');

        hydrateCustomElements(container, [
            { tagName: 'limel-chip', attributes: ['text'] },
        ]);

        // String attributes are not set as properties
        expect(chip.getAttribute('text')).toBe('Hello');
    });

    it('handles invalid JSON gracefully', () => {
        container.innerHTML =
            "<limel-chip link='{not valid json}'></limel-chip>";

        hydrateCustomElements(container, [
            { tagName: 'limel-chip', attributes: ['link'] },
        ]);

        // Property should not be set as a parsed object
        const chip = container.querySelector('limel-chip');
        expect(typeof (chip as any).link).not.toBe('object');
    });

    it('does nothing when container is null', () => {
        expect(() => {
            hydrateCustomElements(null, [
                { tagName: 'limel-chip', attributes: ['text'] },
            ]);
        }).not.toThrow();
    });

    it('does nothing when whitelist is empty', () => {
        container.innerHTML = '<limel-chip link=\'{"href":"x"}\'></limel-chip>';

        hydrateCustomElements(container, []);

        // Property should still be the raw string, not a parsed object
        const chip = container.querySelector('limel-chip');
        expect(typeof (chip as any).link).not.toBe('object');
    });

    it('converts kebab-case attribute names to camelCase properties', () => {
        container.innerHTML =
            '<my-comp menu-items=\'[{"text":"A"}]\'></my-comp>';
        const comp = container.querySelector('my-comp');

        hydrateCustomElements(container, [
            { tagName: 'my-comp', attributes: ['menu-items'] },
        ]);

        expect((comp as any).menuItems).toEqual([{ text: 'A' }]);
    });

    it('only processes whitelisted elements', () => {
        container.innerHTML = `
            <limel-chip link='{"href":"x"}'></limel-chip>
            <evil-comp link='{"href":"y"}'></evil-comp>
        `;

        hydrateCustomElements(container, [
            { tagName: 'limel-chip', attributes: ['link'] },
        ]);

        const chip = container.querySelector('limel-chip');
        const evil = container.querySelector('evil-comp');
        expect((chip as any).link).toEqual({ href: 'x' });
        expect((evil as any).link).toBeUndefined();
    });

    it('decodes &#x22; HTML entities in JSON attributes', () => {
        // Use setAttribute directly so the HTML parser does NOT decode
        // entities — this exercises the tryParseJson fallback path.
        const chip = document.createElement('limel-chip');
        chip.setAttribute(
            'link',
            '{&#x22;href&#x22;:&#x22;https://github.com&#x22;}'
        );
        container.append(chip);

        hydrateCustomElements(container, [
            { tagName: 'limel-chip', attributes: ['link'] },
        ]);

        expect((chip as any).link).toEqual({
            href: 'https://github.com',
        });
    });

    it('decodes &quot; HTML entities in JSON attributes', () => {
        const chip = document.createElement('limel-chip');
        chip.setAttribute(
            'link',
            '{&quot;href&quot;:&quot;https://github.com&quot;}'
        );
        container.append(chip);

        hydrateCustomElements(container, [
            { tagName: 'limel-chip', attributes: ['link'] },
        ]);

        expect((chip as any).link).toEqual({
            href: 'https://github.com',
        });
    });

    it('only processes whitelisted attributes', () => {
        container.innerHTML =
            '<limel-chip text="Hi" link=\'{"href":"x"}\' secret=\'{"key":"val"}\'></limel-chip>';

        hydrateCustomElements(container, [
            { tagName: 'limel-chip', attributes: ['text', 'link'] },
        ]);

        const chip = container.querySelector('limel-chip');
        expect((chip as any).link).toEqual({ href: 'x' });
        expect((chip as any).secret).toBeUndefined();
    });
});
