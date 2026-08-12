import { Node } from 'prosemirror-model';
import {
    createEditorTestHarness,
    createEditorTestState,
    createFakeView,
    FakeViewHolder,
    findPluginByKey,
    getLinkMark,
    parseHTML,
    textSelection,
} from './test/editor-test-harness';
import { linkPluginKey } from './plugins/link/link-plugin';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;

function createPasteEvent(text: string): ClipboardEvent {
    return {
        clipboardData: {
            getData: (type: string) => (type === 'text/plain' ? text : ''),
        },
        preventDefault: () => undefined,
    } as unknown as ClipboardEvent;
}

function paste(holder: FakeViewHolder, text: string): boolean {
    const linkPlugin = findPluginByKey(harness, linkPluginKey);

    return (linkPlugin.props.handlePaste as any)(
        holder.view,
        createPasteEvent(text)
    );
}

describe('link mark parsing', () => {
    it('reads all five attributes from a full anchor tag', () => {
        const parsed = parseHTML(
            harness.schema,
            '<p><a href="/x" title="t" target="_blank" rel="r" referrerpolicy="q">y</a></p>'
        );
        const mark = getLinkMark(parsed.firstChild.firstChild);

        expect(mark.attrs).toEqual({
            href: '/x',
            title: 't',
            target: '_blank',
            rel: 'r',
            referrerpolicy: 'q',
        });
    });

    it('defaults optional attributes to null', () => {
        const parsed = parseHTML(harness.schema, '<p><a href="/x">y</a></p>');
        const mark = getLinkMark(parsed.firstChild.firstChild);

        expect(mark.attrs.title).toBeNull();
        expect(mark.attrs.target).toBeNull();
        expect(mark.attrs.rel).toBeNull();
        expect(mark.attrs.referrerpolicy).toBeNull();
    });
});

describe('link plugin paste handling', () => {
    it.each([
        'https://other.example/page',
        'http://other.example/page',
        'mailto:someone@example.com',
        'tel:+46701234567',
        'www.example.com',
    ])('claims a paste containing %s', (url) => {
        const start = doc(p('x'));
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );

        expect(paste(holder, url)).toBe(true);
    });

    it.each(['plain text', ''])('declines a paste of %j', (text) => {
        const start = doc(p('x'));
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );

        expect(paste(holder, text)).toBe(false);
        expect(holder.current().doc.eq(start)).toBe(true);
    });

    it('normalizes a bare www URL to https and uses it as link text', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        paste(holder, 'www.example.com');

        const textNode = holder.current().doc.firstChild.firstChild;
        expect(textNode.text).toBe('https://www.example.com');
        expect(getLinkMark(textNode).attrs.href).toBe(
            'https://www.example.com'
        );
    });

    it('strips trailing backslashes from a pasted URL', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        paste(holder, 'https://other.example/page\\');

        const textNode = holder.current().doc.firstChild.firstChild;
        expect(getLinkMark(textNode).attrs.href).toBe(
            'https://other.example/page'
        );
    });

    it('keeps the selected text when pasting a single URL over a selection', () => {
        const start = doc(p('hello'));
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1, 6))
        );
        paste(holder, 'https://other.example/page');

        const next = holder.current().doc;
        expect(next.textContent).toBe('hello');
        expect(getLinkMark(next.firstChild.firstChild).attrs.href).toBe(
            'https://other.example/page'
        );
    });

    it('inserts the href as text when pasting a single URL at a cursor', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        paste(holder, 'https://other.example/page');

        expect(holder.current().doc.textContent).toBe(
            'https://other.example/page'
        );
    });

    it('replaces the selection when pasting a URL with surrounding text', () => {
        const start = doc(p('hello'));
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1, 6))
        );
        paste(holder, 'see https://other.example/ now');

        const next = holder.current().doc;
        expect(next.textContent).toBe('see https://other.example/ now');
        expect(next.textContent).not.toContain('hello');
    });

    it('turns newlines into hard breaks, preserving empty lines', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        paste(holder, 'https://a.example/\nb\n\nc');

        let hardBreaks = 0;
        holder.current().doc.descendants((node) => {
            if (node.type.name === 'hard_break') {
                hardBreaks++;
            }
        });

        expect(hardBreaks).toBe(3);
    });

    it('sets title to the href and external security attributes', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        paste(holder, 'https://other.example/page');

        const mark = getLinkMark(holder.current().doc.firstChild.firstChild);
        expect(mark.attrs.title).toBe('https://other.example/page');
        expect(mark.attrs.target).toBe('_blank');
        expect(mark.attrs.rel).toBe('noopener noreferrer');
    });

    it('gives a same-host URL no target and no security attributes', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        paste(holder, `http://${window.location.hostname}/page`);

        const mark = getLinkMark(holder.current().doc.firstChild.firstChild);
        expect(mark.attrs.target).toBeNull();
        expect(mark.attrs.rel).toBeNull();
    });
});

describe('link plugin selection callback', () => {
    function updateWith(
        callback: (text: string, href: string) => void,
        buildDoc: (builders: Record<string, any>) => Node,
        from: number,
        to?: number
    ): void {
        const spyHarness = createEditorTestHarness({
            onNewLinkSelection: callback,
        });
        const start = buildDoc(spyHarness.builders as Record<string, any>);
        const plugin = findPluginByKey(spyHarness, linkPluginKey);
        const holder = createFakeView(
            createEditorTestState(
                spyHarness,
                start,
                textSelection(start, from, to)
            )
        );
        const pluginView = (plugin.spec.view as any)(holder.view);
        pluginView.update(holder.view);
    }

    it('reports empty text and href at a plain-text cursor', () => {
        const callback = vi.fn();
        updateWith(
            callback,
            (builders) => builders.doc(builders.p('hello')),
            2
        );

        expect(callback).toHaveBeenCalledWith('', '');
    });

    it('reports the selected text and its link href', () => {
        const callback = vi.fn();
        updateWith(
            callback,
            (builders) =>
                builders.doc(
                    builders.p(
                        builders.link({ href: 'https://a.example/' }, 'ab')
                    )
                ),
            1,
            3
        );

        expect(callback).toHaveBeenCalledWith('ab', 'https://a.example/');
    });

    it('reports the last href when the selection spans two links', () => {
        const callback = vi.fn();
        updateWith(
            callback,
            (builders) =>
                builders.doc(
                    builders.p(
                        builders.link({ href: 'https://a.example/' }, 'ab'),
                        builders.link({ href: 'https://b.example/' }, 'cd')
                    )
                ),
            1,
            5
        );

        expect(callback).toHaveBeenCalledWith('abcd', 'https://b.example/');
    });
});
