import { substituteCustomElements } from './substitute-custom-elements';

const WHITELIST = [
    { tagName: 'limel-chip', attributes: ['text'] },
    { tagName: 'test-record', attributes: ['id'] },
];

function represent(element: Element | null, markdown: string) {
    (element as any).toMarkdown = () => Promise.resolve(markdown);
}

describe('substituteCustomElements', () => {
    let root: HTMLDivElement;

    beforeEach(() => {
        root = document.createElement('div');
    });

    it('replaces a self-closing element with what it stands for', async () => {
        root.innerHTML =
            '<p><test-record id="1"></test-record> is your guy</p>';
        represent(root.querySelector('test-record'), '[Pelle](https://crm/1)');

        const result = await substituteCustomElements(
            '<test-record id="1" /> is your guy',
            root,
            WHITELIST
        );

        expect(result).toBe('[Pelle](https://crm/1) is your guy');
    });

    it('replaces an element written with a closing tag, content included', async () => {
        root.innerHTML = '<test-record id="1">ignored</test-record>';
        represent(root.querySelector('test-record'), '[Pelle](https://crm/1)');

        const result = await substituteCustomElements(
            'See <test-record id="1">ignored</test-record>.',
            root,
            WHITELIST
        );

        expect(result).toBe('See [Pelle](https://crm/1).');
    });

    it('replaces an open tag written alone', async () => {
        root.innerHTML = '<test-record id="1"> now</test-record>';
        represent(root.querySelector('test-record'), '[Pelle](https://crm/1)');

        const result = await substituteCustomElements(
            'See <test-record id="1"> now',
            root,
            WHITELIST
        );

        expect(result).toBe('See [Pelle](https://crm/1) now');
    });

    it('pairs elements with occurrences by tag name and order', async () => {
        root.innerHTML =
            '<test-record id="1"></test-record>' +
            '<limel-chip text="x"></limel-chip>' +
            '<test-record id="2"></test-record>';
        const [first, second] = root.querySelectorAll('test-record');
        represent(first, 'one');
        represent(second, 'two');
        represent(root.querySelector('limel-chip'), 'chip');

        const result = await substituteCustomElements(
            'A <test-record id="1"/> B <limel-chip text="x"/> C <test-record id="2"/>',
            root,
            WHITELIST
        );

        expect(result).toBe('A one B chip C two');
    });

    it('removes every occurrence of a tag whose counts disagree', async () => {
        root.innerHTML =
            '<test-record id="1"></test-record>' +
            '<limel-chip text="x"></limel-chip>';
        represent(root.querySelector('test-record'), 'WRONG');
        represent(root.querySelector('limel-chip'), 'chip');

        const result = await substituteCustomElements(
            '<test-record id="1"/> and <test-record id="2"/> with <limel-chip text="x"/>',
            root,
            WHITELIST
        );

        expect(result).toBe(' and  with chip');
    });

    it('uses the light-DOM text of an element that cannot describe itself when written with a closing tag', async () => {
        root.innerHTML = '<limel-chip text="x">Label</limel-chip>!';

        const result = await substituteCustomElements(
            '<limel-chip text="x">Label</limel-chip>!',
            root,
            WHITELIST
        );

        expect(result).toBe('Label!');
    });

    it('contributes nothing for an element that cannot describe itself when written self-closing', async () => {
        root.innerHTML = '<limel-chip text="x"> rest</limel-chip>';

        const result = await substituteCustomElements(
            '<limel-chip text="x"/> rest',
            root,
            WHITELIST
        );

        expect(result).toBe(' rest');
    });

    it('leaves elements outside the whitelist alone', async () => {
        root.innerHTML = '<other-thing></other-thing> and <b>bold</b>';
        represent(root.querySelector('other-thing'), 'NOT USED');

        const source = '<other-thing/> and <b>bold</b>';

        await expect(
            substituteCustomElements(source, root, WHITELIST)
        ).resolves.toBe(source);
    });

    it('does not match a tag that only starts with a whitelisted name', async () => {
        root.innerHTML = '<limel-chip-extra></limel-chip-extra>';

        const source = '<limel-chip-extra/>';

        await expect(
            substituteCustomElements(source, root, WHITELIST)
        ).resolves.toBe(source);
    });

    it('matches tag names regardless of case', async () => {
        root.innerHTML = '<test-record id="1"></test-record>';
        represent(root.querySelector('test-record'), 'Pelle');

        const result = await substituteCustomElements(
            '<TEST-RECORD id="1"></TEST-RECORD>',
            root,
            WHITELIST
        );

        expect(result).toBe('Pelle');
    });

    it('returns the source unchanged when nothing was rendered into', async () => {
        const source = '<test-record id="1"/>';

        await expect(
            substituteCustomElements(source, null, WHITELIST)
        ).resolves.toBe(source);
    });

    it('returns the source unchanged for an empty whitelist', async () => {
        root.innerHTML = '<test-record id="1"></test-record>';
        represent(root.querySelector('test-record'), 'Pelle');

        const source = '<test-record id="1"/>';

        await expect(substituteCustomElements(source, root, [])).resolves.toBe(
            source
        );
    });

    it('rejects when an element cannot describe itself in time', async () => {
        root.innerHTML = '<test-record id="1"></test-record>';
        (root.querySelector('test-record') as any).toMarkdown = () =>
            Promise.reject(new Error('load failed'));

        await expect(
            substituteCustomElements('<test-record id="1"/>', root, WHITELIST)
        ).rejects.toThrow('load failed');
    });
});
