import { EditorState, TextSelection } from 'prosemirror-state';
import { builders, MarkBuilder, NodeBuilder } from 'prosemirror-test-builder';
import { buildEditorSchema } from '../../editor-config';
import { getSelectionHighlightColor } from './highlight-plugin';

type TaggedNode = ReturnType<NodeBuilder>;

describe('getSelectionHighlightColor', () => {
    const schema = buildEditorSchema({
        customElements: [],
        contentType: 'html',
        language: 'en',
    });

    const builder = builders(schema, {
        p: { nodeType: 'paragraph' },
        highlight: { markType: 'highlight', color: '#fff176' },
    });
    const doc = builder.doc as NodeBuilder;
    const p = builder.p as NodeBuilder;
    const highlight = builder.highlight as MarkBuilder;

    const createState = (taggedDoc: TaggedNode): EditorState =>
        EditorState.create({
            doc: taggedDoc,
            selection:
                'b' in taggedDoc.tag
                    ? TextSelection.create(
                          taggedDoc,
                          taggedDoc.tag.a,
                          taggedDoc.tag.b
                      )
                    : TextSelection.create(taggedDoc, taggedDoc.tag.a),
        });

    it('returns the color for a caret on highlighted text', () => {
        const state = createState(doc(p(highlight('high<a>lighted'))));

        expect(getSelectionHighlightColor(state)).toBe('#fff176');
    });

    it('returns null for a caret on plain text', () => {
        const state = createState(doc(p('pl<a>ain')));

        expect(getSelectionHighlightColor(state)).toBeNull();
    });

    it('returns the color for a range partially covering a highlight', () => {
        const state = createState(
            doc(p('pl<a>ain ', highlight('high<b>lighted')))
        );

        expect(getSelectionHighlightColor(state)).toBe('#fff176');
    });

    it('prefers a stored highlight mark over the marks at the caret', () => {
        const initial = createState(doc(p('pl<a>ain')));
        const storedMark = schema.marks.highlight.create({
            color: '#00ff00',
        });
        const state = initial.apply(initial.tr.setStoredMarks([storedMark]));

        expect(getSelectionHighlightColor(state)).toBe('#00ff00');
    });
});
