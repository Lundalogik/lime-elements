import { EditorView } from 'prosemirror-view';
import { closeHistory } from 'prosemirror-history';
import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
    pressKey,
    typeText,
} from './test/editor-test-harness';
import './test/editor-doc-matcher';
import { EditorMenuTypes } from './menu/types';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;
const heading = b.heading;
const blockquote = b.blockquote;
const orderedList = b.ordered_list;
const bulletList = b.bullet_list;
const listItem = b.list_item;
const codeBlock = b.code_block;

describe('input rules through the real stack', () => {
    let view: EditorView;
    let cleanup: () => void;

    beforeEach(() => {
        ({ view, cleanup } = mountView(createEditorTestState(harness)));
    });

    afterEach(() => cleanup());

    it.each([1, 2, 3, 4, 5, 6])(
        '"%i hashes + space" at block start becomes that heading level',
        (level) => {
            typeText(view, `${'#'.repeat(level)} Title`);
            expect(view.state.doc).toEqualDoc(
                doc(heading({ level: level }, 'Title'))
            );
        }
    );

    it('"> " at block start wraps in a blockquote', () => {
        typeText(view, '> quote');
        expect(view.state.doc).toEqualDoc(doc(blockquote(p('quote'))));
    });

    it('"1. " at block start starts an ordered list', () => {
        typeText(view, '1. item');
        expect(view.state.doc).toEqualDoc(
            doc(orderedList(listItem(p('item'))))
        );
    });

    it('"3. " starts an ordered list numbered from three', () => {
        typeText(view, '3. third');
        expect(view.state.doc).toEqualDoc(
            doc(orderedList({ order: 3 }, listItem(p('third'))))
        );
    });

    it.each(['-', '*', '+'])(
        '"%s " at block start starts a bullet list',
        (bullet) => {
            typeText(view, `${bullet} item`);
            expect(view.state.doc).toEqualDoc(
                doc(bulletList(listItem(p('item'))))
            );
        }
    );

    it('three backticks start a code block', () => {
        typeText(view, '```hello');
        expect(view.state.doc).toEqualDoc(doc(codeBlock('hello')));
    });

    it('straight double quotes become smart quotes', () => {
        typeText(view, '"x"');
        expect(view.state.doc).toEqualDoc(doc(p('“x”')));
    });

    it('straight single quotes become smart quotes', () => {
        typeText(view, "'x'");
        expect(view.state.doc).toEqualDoc(doc(p('‘x’')));
    });

    it('three dots become an ellipsis', () => {
        typeText(view, '...');
        expect(view.state.doc).toEqualDoc(doc(p('…')));
    });

    it('a double hyphen becomes an em dash', () => {
        typeText(view, 'a--');
        expect(view.state.doc).toEqualDoc(doc(p('a—')));
    });

    it('Backspace reverts an input-rule transform to the literal text', () => {
        typeText(view, '# ');
        expect(view.state.doc).toEqualDoc(doc(heading({ level: 1 })));

        pressKey(view, { key: 'Backspace', keyCode: 8 });
        expect(view.state.doc).toEqualDoc(doc(p('# ')));
    });

    it('"# " away from the block start stays literal text', () => {
        typeText(view, 'x# y');
        expect(view.state.doc).toEqualDoc(doc(p('x# y')));
    });

    it('undo and redo step through a typing and command sequence', () => {
        typeText(view, 'hi');
        view.dispatch(closeHistory(view.state.tr));

        harness.factory.getCommand(EditorMenuTypes.Blockquote)(
            view.state,
            view.dispatch
        );
        view.dispatch(closeHistory(view.state.tr));

        typeText(view, '!');
        expect(view.state.doc).toEqualDoc(doc(blockquote(p('hi!'))));

        pressKey(view, { key: 'z', keyCode: 90, mod: true });
        expect(view.state.doc).toEqualDoc(doc(blockquote(p('hi'))));

        pressKey(view, { key: 'z', keyCode: 90, mod: true });
        expect(view.state.doc).toEqualDoc(doc(p('hi')));

        pressKey(view, { key: 'z', keyCode: 90, mod: true });
        expect(view.state.doc).toEqualDoc(doc(p()));

        pressKey(view, { key: 'z', keyCode: 90, mod: true, shiftKey: true });
        expect(view.state.doc).toEqualDoc(doc(p('hi')));
    });
});
