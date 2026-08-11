import { EditorState, TextSelection } from 'prosemirror-state';
import {
    builders,
    eq,
    MarkBuilder,
    NodeBuilder,
} from 'prosemirror-test-builder';
import { buildEditorSchema } from '../editor-config';
import { MenuCommandFactory } from './menu-commands';
import { EditorMenuTypes } from './types';
import { DEFAULT_HIGHLIGHT_COLOR } from '../plugins/highlight/highlight-mark';

type TaggedNode = ReturnType<NodeBuilder>;

describe('highlight command', () => {
    const schema = buildEditorSchema({
        customElements: [],
        contentType: 'html',
        language: 'en',
    });
    const factory = new MenuCommandFactory(schema);

    const builder = builders(schema, {
        p: { nodeType: 'paragraph' },
        pre: { nodeType: 'code_block' },
        yellow: { markType: 'highlight', color: DEFAULT_HIGHLIGHT_COLOR },
        red: { markType: 'highlight', color: '#ff0000' },
    });
    const doc = builder.doc as NodeBuilder;
    const p = builder.p as NodeBuilder;
    const pre = builder.pre as NodeBuilder;
    const yellow = builder.yellow as MarkBuilder;
    const red = builder.red as MarkBuilder;

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

    const getHighlightCommand = (color?: string) =>
        factory.getCommand(EditorMenuTypes.Highlight, { color: color });

    const applyCommand = (
        state: EditorState,
        color?: string
    ): { handled: boolean; state: EditorState } => {
        let next = state;
        const handled = getHighlightCommand(color)(state, (transaction) => {
            next = state.apply(transaction);
        });

        return { handled: handled, state: next };
    };

    it('adds the mark with the canonicalized color to a plain-text range', () => {
        const state = createState(doc(p('<a>hello<b>')));

        const result = applyCommand(state, 'rgb(255, 0, 0)');

        expect(result.handled).toBe(true);
        expect(eq(result.state.doc, doc(p(red('hello'))))).toBe(true);
    });

    describe('when no color is given', () => {
        const stubStoredColor = (color: string | null) => {
            vi.stubGlobal('localStorage', {
                getItem: () => color,
                setItem: () => {},
            });
        };

        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('uses the default color when no color is stored', () => {
            stubStoredColor(null);
            const state = createState(doc(p('<a>hello<b>')));

            const result = applyCommand(state);

            expect(result.handled).toBe(true);
            expect(eq(result.state.doc, doc(p(yellow('hello'))))).toBe(true);
        });

        it('uses the stored color when one is stored', () => {
            stubStoredColor('#ff0000');
            const state = createState(doc(p('<a>hello<b>')));

            const result = applyCommand(state);

            expect(result.handled).toBe(true);
            expect(eq(result.state.doc, doc(p(red('hello'))))).toBe(true);
        });

        it('reads the stored color at execution time, not at command creation', () => {
            stubStoredColor(null);
            const command = getHighlightCommand();
            stubStoredColor('#ff0000');
            const state = createState(doc(p('<a>hello<b>')));

            let next = state;
            const handled = command(state, (transaction) => {
                next = state.apply(transaction);
            });

            expect(handled).toBe(true);
            expect(eq(next.doc, doc(p(red('hello'))))).toBe(true);
        });
    });

    it('removes the mark when re-applying the color the range already has', () => {
        const state = createState(doc(p(red('<a>hello<b>'))));

        const result = applyCommand(state, '#ff0000');

        expect(result.handled).toBe(true);
        expect(eq(result.state.doc, doc(p('hello')))).toBe(true);
    });

    it('re-colors a highlighted range when applying a different color', () => {
        const state = createState(doc(p(yellow('<a>hello<b>'))));

        const result = applyCommand(state, '#ff0000');

        expect(result.handled).toBe(true);
        expect(eq(result.state.doc, doc(p(red('hello'))))).toBe(true);
    });

    it('adds a stored mark for a caret selection', () => {
        const state = createState(doc(p('hel<a>lo')));

        const result = applyCommand(state, '#ff0000');

        expect(result.handled).toBe(true);
        const storedMark = schema.marks.highlight.isInSet(
            result.state.storedMarks ?? []
        );
        expect(storedMark).toBeDefined();
        expect(storedMark.attrs.color).toBe('#ff0000');
    });

    it('returns false without dispatching for an invalid color', () => {
        const state = createState(doc(p('<a>hello<b>')));
        const dispatch = vi.fn();

        const handled = getHighlightCommand('not-a-color')(state, dispatch);

        expect(handled).toBe(false);
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('returns false for a selection inside a code block', () => {
        const state = createState(doc(pre('<a>code<b>')));
        const dispatch = vi.fn();

        const handled = getHighlightCommand('#ff0000')(state, dispatch);

        expect(handled).toBe(false);
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('marks the inline content of both paragraphs in a cross-paragraph range', () => {
        const state = createState(doc(p('he<a>llo'), p('wo<b>rld')));

        const result = applyCommand(state, '#ff0000');

        expect(result.handled).toBe(true);
        expect(
            eq(result.state.doc, doc(p('he', red('llo')), p(red('wo'), 'rld')))
        ).toBe(true);
    });
});
