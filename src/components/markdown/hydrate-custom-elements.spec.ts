vi.mock('./safe-url-protocols', () => ({
    SAFE_PROTOCOLS_BY_PROPERTY: new Map<string, Set<string>>([
        ['href', new Set(['http', 'https', 'irc', 'ircs', 'mailto', 'xmpp'])],
        ['src', new Set(['http', 'https'])],
        ['cite', new Set(['http', 'https'])],
        ['longDesc', new Set(['http', 'https'])],
    ]),
}));

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

    describe('URL sanitization', () => {
        it('allows https hrefs', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"https://example.com"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            const chip = container.querySelector('limel-chip');
            expect((chip as any).link).toEqual({
                href: 'https://example.com',
            });
        });

        it('allows http hrefs', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"http://example.com"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            const chip = container.querySelector('limel-chip');
            expect((chip as any).link).toEqual({
                href: 'http://example.com',
            });
        });

        it('allows mailto hrefs', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"mailto:user@example.com"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            const chip = container.querySelector('limel-chip');
            expect((chip as any).link).toEqual({
                href: 'mailto:user@example.com',
            });
        });

        it('allows relative hrefs', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"object/deal/1001"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            const chip = container.querySelector('limel-chip');
            expect((chip as any).link).toEqual({
                href: 'object/deal/1001',
            });
        });

        it('removes javascript: hrefs', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"javascript:alert(1)","target":"_blank"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            const chip = container.querySelector('limel-chip');
            expect((chip as any).link).toEqual({ target: '_blank' });
        });

        it('removes data: hrefs', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"data:text/html,<script>alert(1)</script>"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            const chip = container.querySelector('limel-chip');
            expect((chip as any).link).toEqual({});
        });

        it('removes unsafe hrefs in nested objects', () => {
            container.innerHTML =
                '<my-comp data=\'{"child":{"href":"javascript:void(0)"}}\'></my-comp>';

            hydrateCustomElements(container, [
                { tagName: 'my-comp', attributes: ['data'] },
            ]);

            const comp = container.querySelector('my-comp');
            expect((comp as any).data).toEqual({ child: {} });
        });

        it('removes unsafe hrefs in arrays of objects', () => {
            container.innerHTML =
                '<my-comp items=\'[{"href":"javascript:x"},{"href":"https://safe.com"}]\'></my-comp>';

            hydrateCustomElements(container, [
                { tagName: 'my-comp', attributes: ['items'] },
            ]);

            const comp = container.querySelector('my-comp');
            expect((comp as any).items).toEqual([
                {},
                { href: 'https://safe.com' },
            ]);
        });

        it('does not touch non-URL properties', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"https://ok.com","target":"_blank","text":"Click"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            const chip = container.querySelector('limel-chip');
            expect((chip as any).link).toEqual({
                href: 'https://ok.com',
                target: '_blank',
                text: 'Click',
            });
        });

        it('sanitizes src properties with unsafe protocols', () => {
            container.innerHTML =
                '<my-comp data=\'{"src":"javascript:alert(1)"}\'></my-comp>';

            hydrateCustomElements(container, [
                { tagName: 'my-comp', attributes: ['data'] },
            ]);

            const comp = container.querySelector('my-comp');
            expect((comp as any).data).toEqual({});
        });

        it('allows src properties with safe protocols', () => {
            container.innerHTML =
                '<my-comp data=\'{"src":"https://example.com/image.png"}\'></my-comp>';

            hydrateCustomElements(container, [
                { tagName: 'my-comp', attributes: ['data'] },
            ]);

            const comp = container.querySelector('my-comp');
            expect((comp as any).data).toEqual({
                src: 'https://example.com/image.png',
            });
        });

        it('is case-insensitive for protocol checks', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"JAVASCRIPT:alert(1)"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            const chip = container.querySelector('limel-chip');
            expect((chip as any).link).toEqual({});
        });

        it('logs a warning when an unsafe URL is removed', () => {
            const warnSpy = vi
                .spyOn(console, 'warn')
                .mockImplementation(() => {});

            container.innerHTML =
                '<limel-chip link=\'{"href":"javascript:alert(1)"}\'></limel-chip>';

            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);

            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining('Removed unsafe URL')
            );

            warnSpy.mockRestore();
        });

        it('allows protocol-relative URLs', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"//example.com"}\'></limel-chip>';
            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);
            expect((container.querySelector('limel-chip') as any).link).toEqual(
                {
                    href: '//example.com',
                }
            );
        });

        it('allows hash-only links', () => {
            container.innerHTML =
                '<limel-chip link=\'{"href":"#section"}\'></limel-chip>';
            hydrateCustomElements(container, [
                { tagName: 'limel-chip', attributes: ['link'] },
            ]);
            expect((container.querySelector('limel-chip') as any).link).toEqual(
                {
                    href: '#section',
                }
            );
        });
    });
});
