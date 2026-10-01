import { SourceElement } from './collect-elements';
import { substituteCustomElements } from './substitute-custom-elements';

/**
 * Record an element by the markup it was written as, the way the parser
 * would: `end` just past the closing tag when there is one, otherwise
 * just past the start tag.
 * @param source
 * @param tagName
 * @param written
 * @param from
 */
function at(
    source: string,
    tagName: string,
    written: string,
    from = 0
): SourceElement {
    const start = source.indexOf(written, from);
    if (start === -1) {
        throw new Error(`${written} is not in ${source}`);
    }

    return {
        tagName: tagName,
        start: start,
        end: start + written.length,
        closed: written.endsWith(`</${tagName}>`),
        html: written,
    };
}

const byTag =
    (markdown: Record<string, string>) =>
    (element: SourceElement): Promise<string> =>
        Promise.resolve(markdown[element.tagName]);

describe('substituteCustomElements', () => {
    it('replaces an element with what it stands for', async () => {
        const source = '<test-record id="1" /> is your guy';

        const result = await substituteCustomElements(
            source,
            [at(source, 'test-record', '<test-record id="1" />')],
            byTag({ 'test-record': '[Pelle](https://crm/1)' })
        );

        expect(result).toBe('[Pelle](https://crm/1) is your guy');
    });

    it('replaces the whole of an element written with a closing tag', async () => {
        const source = 'See <test-record id="1">ignored</test-record>.';

        const result = await substituteCustomElements(
            source,
            [
                at(
                    source,
                    'test-record',
                    '<test-record id="1">ignored</test-record>'
                ),
            ],
            byTag({ 'test-record': '[Pelle](https://crm/1)' })
        );

        expect(result).toBe('See [Pelle](https://crm/1).');
    });

    it('keeps every other character of the source', async () => {
        const source = '# Hi\n\n<test-record id="1"/>\n\n- a\n- b\n';

        const result = await substituteCustomElements(
            source,
            [at(source, 'test-record', '<test-record id="1"/>')],
            byTag({ 'test-record': 'X' })
        );

        expect(result).toBe('# Hi\n\nX\n\n- a\n- b\n');
    });

    it('asks each element for itself', async () => {
        const source = 'A <test-record id="1"/> B <test-record id="2"/>';
        const represent = vi.fn((element: SourceElement) =>
            Promise.resolve(element.html.includes('id="1"') ? 'one' : 'two')
        );

        const result = await substituteCustomElements(
            source,
            [
                at(source, 'test-record', '<test-record id="1"/>'),
                at(source, 'test-record', '<test-record id="2"/>'),
            ],
            represent
        );

        expect(result).toBe('A one B two');
        expect(represent).toHaveBeenCalledTimes(2);
    });

    it('splices in written order when elements were recorded in another order', async () => {
        // A footnote definition is written first but rendered last, so the
        // parser records its element after the body's.
        const source =
            'Note[^1].\n\n[^1]: See <limel-chip>foot</limel-chip> here.\n\nBody <limel-badge>body</limel-badge> end.';

        const result = await substituteCustomElements(
            source,
            [
                at(source, 'limel-badge', '<limel-badge>body</limel-badge>'),
                at(source, 'limel-chip', '<limel-chip>foot</limel-chip>'),
            ],
            byTag({ 'limel-badge': 'BADGE', 'limel-chip': 'CHIP' })
        );

        expect(result).toBe(
            'Note[^1].\n\n[^1]: See CHIP here.\n\nBody BADGE end.'
        );
    });

    it('leaves an element written inside another one to its parent', async () => {
        const source =
            '<limel-callout>before <limel-chip>chip</limel-chip> after</limel-callout> tail';
        const represent = vi.fn(byTag({ 'limel-callout': 'CALLOUT' }));

        const result = await substituteCustomElements(
            source,
            [
                at(
                    source,
                    'limel-callout',
                    '<limel-callout>before <limel-chip>chip</limel-chip> after</limel-callout>'
                ),
                at(source, 'limel-chip', '<limel-chip>chip</limel-chip>'),
            ],
            represent
        );

        expect(result).toBe('CALLOUT tail');
        expect(represent).toHaveBeenCalledTimes(1);
    });

    it('returns the source unchanged when no elements were recorded', async () => {
        const source = '<test-record id="1"/>';

        await expect(
            substituteCustomElements(source, [], byTag({}))
        ).resolves.toBe(source);
    });

    it('rejects when an element cannot describe itself', async () => {
        const source = '<test-record id="1"/>';

        await expect(
            substituteCustomElements(
                source,
                [at(source, 'test-record', '<test-record id="1"/>')],
                () => Promise.reject(new Error('load failed'))
            )
        ).rejects.toThrow('load failed');
    });
});
