import { DOMParser, Mark, Node as ProseMirrorNode } from 'prosemirror-model';
import { buildEditorSchema } from '../../editor-config';
import { canonicalizeColor, DEFAULT_HIGHLIGHT_COLOR } from './highlight-mark';

describe('canonicalizeColor', () => {
    it('keeps a hex color as lowercase hex', () => {
        expect(canonicalizeColor('#fff176')).toBe('#fff176');
    });

    it('normalizes rgb() notation to hex', () => {
        expect(canonicalizeColor('rgb(255, 241, 118)')).toBe('#fff176');
    });

    it('normalizes a named color to hex', () => {
        expect(canonicalizeColor('yellow')).toBe('#ffff00');
    });

    it('returns null for `transparent`', () => {
        expect(canonicalizeColor('transparent')).toBeNull();
    });

    it('returns null for an empty string', () => {
        expect(canonicalizeColor('')).toBeNull();
    });

    it('returns null for a markup-injection attempt', () => {
        expect(canonicalizeColor('yellow"><img src=x onerror=x>')).toBeNull();
    });

    it('returns null for a fully transparent rgba color', () => {
        expect(canonicalizeColor('rgba(0, 0, 0, 0)')).toBeNull();
    });

    it('keeps the alpha channel of a semi-transparent rgba color', () => {
        expect(canonicalizeColor('rgba(255, 0, 0, 0.5)')).toBe(
            'rgba(255, 0, 0, 0.5)'
        );
    });
});

describe('highlight mark parseDOM', () => {
    const schema = buildEditorSchema({
        customElements: [],
        contentType: 'html',
        language: 'en',
    });

    const parseHTML = (html: string): ProseMirrorNode => {
        const container = document.createElement('div');
        container.innerHTML = html;

        return DOMParser.fromSchema(schema).parse(container);
    };

    const getFirstTextMarks = (doc: ProseMirrorNode): readonly Mark[] =>
        doc.firstChild.firstChild.marks;

    const getHighlightMark = (doc: ProseMirrorNode): Mark | undefined =>
        getFirstTextMarks(doc).find(
            (mark) => mark.type === schema.marks.highlight
        );

    it('parses <mark> without a style as the default highlight color', () => {
        const doc = parseHTML('<p><mark>glow</mark></p>');

        const mark = getHighlightMark(doc);
        expect(mark).toBeDefined();
        expect(mark.attrs.color).toBe(DEFAULT_HIGHLIGHT_COLOR);
    });

    it('parses <mark> with an rgb background as the canonical hex color', () => {
        const doc = parseHTML(
            '<p><mark style="background-color: rgb(255, 0, 0)">glow</mark></p>'
        );

        const mark = getHighlightMark(doc);
        expect(mark).toBeDefined();
        expect(mark.attrs.color).toBe('#ff0000');
    });

    it('does not turn a transparent-background span into a highlight', () => {
        const doc = parseHTML(
            '<p><span style="background-color: transparent">text</span></p>'
        );

        expect(getHighlightMark(doc)).toBeUndefined();
    });

    it('turns a background-colored span into a highlight', () => {
        const doc = parseHTML(
            '<p><span style="background-color: yellow">text</span></p>'
        );

        const mark = getHighlightMark(doc);
        expect(mark).toBeDefined();
        expect(mark.attrs.color).toBe('#ffff00');
    });

    it('does not turn a span with an unparseable background into a highlight', () => {
        const doc = parseHTML(
            '<p><span style="background-color: bogus(1)">text</span></p>'
        );

        expect(getHighlightMark(doc)).toBeUndefined();
    });
});
