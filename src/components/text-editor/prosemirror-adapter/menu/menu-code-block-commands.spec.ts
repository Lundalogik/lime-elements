import { AllSelection, NodeSelection } from 'prosemirror-state';
import {
    createEditorTestHarness,
    createEditorTestState,
    runCommand,
    textSelection,
} from '../test/editor-test-harness';
import '../test/editor-doc-matcher';
import { EditorMenuTypes } from './types';
import { CommandWithActive } from './menu-commands';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;
const heading = b.heading;
const codeBlock = b.code_block;
const blockquote = b.blockquote;
const bulletList = b.bullet_list;
const listItem = b.list_item;
const horizontalRule = b.horizontal_rule;

const command = () =>
    harness.factory.getCommand(EditorMenuTypes.CodeBlock) as CommandWithActive;

describe('code block command behavior matrix', () => {
    describe('toggle on', () => {
        it('converts the caret paragraph to a code block', () => {
            const start = doc(p('hello'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(codeBlock('hello')));
        });

        it('converts a heading to a code block', () => {
            const start = doc(heading('title'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(codeBlock('title')));
        });

        it('merges selected paragraphs into one code block with one line per block', () => {
            const start = doc(p('aa'), p('bb'), p('cc'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 11)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(codeBlock('aa\nbb\ncc')));
        });

        it('merges a heading and a paragraph into one code block', () => {
            const start = doc(heading('title'), p('body'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 12)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(codeBlock('title\nbody')));
        });

        it('converts an empty paragraph to an empty code block', () => {
            const start = doc(p());
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(codeBlock()));
        });

        it('converts a paragraph inside a blockquote in place', () => {
            const start = doc(blockquote(p('quoted')));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 3)
            );

            expect(command().allowed(state)).toBe(true);

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(blockquote(codeBlock('quoted'))));
        });
    });

    describe('toggle off', () => {
        it('splits a code block into one paragraph per line', () => {
            const start = doc(codeBlock('a\nb\nc'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(p('a'), p('b'), p('c')));
        });

        it('keeps empty lines as empty paragraphs', () => {
            const start = doc(codeBlock('a\n\nb'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(p('a'), p(), p('b')));
        });

        it('turns an empty code block into an empty paragraph', () => {
            const start = doc(codeBlock());
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(p()));
        });

        it('toggles off every code block covered by the selection', () => {
            const start = doc(codeBlock('a'), codeBlock('b\nc'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 7)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(p('a'), p('b'), p('c')));
        });

        it('places the caret in the converted content', () => {
            const start = doc(codeBlock('a\nb'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 4)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.selection.empty).toBe(true);
            expect(next.selection.$from.parent.type.name).toBe('paragraph');
        });
    });

    describe('mixed selections', () => {
        it('unifies code blocks and paragraphs into one code block', () => {
            const start = doc(codeBlock('a\nb'), p('c'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2, 7)
            );

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(true);
            expect(next.doc).toEqualDoc(doc(codeBlock('a\nb\nc')));
        });
    });

    describe('applicability', () => {
        it('declines when the selection touches a list', () => {
            const start = doc(p('a'), bulletList(listItem(p('b'))));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 7)
            );

            expect(command().allowed(state)).toBe(false);

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });

        it('declines with the caret inside a list item', () => {
            const start = doc(bulletList(listItem(p('item'))));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 3)
            );

            expect(command().allowed(state)).toBe(false);

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });

        it('declines when the selection covers a horizontal rule', () => {
            const start = doc(p('above'), horizontalRule(), p('below'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 14)
            );

            expect(command().allowed(state)).toBe(false);

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });

        it('declines a node selection', () => {
            const start = doc(p('text'), horizontalRule());
            const state = createEditorTestState(
                harness,
                start,
                NodeSelection.create(start, 6)
            );

            expect(command().allowed(state)).toBe(false);

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });

        it('declines an all selection', () => {
            const start = doc(p('text'));
            const state = createEditorTestState(
                harness,
                start,
                new AllSelection(start)
            );

            expect(command().allowed(state)).toBe(false);

            const { state: next, handled } = runCommand(state, command());
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });
    });

    describe('active state', () => {
        it('reports active with the caret inside a code block', () => {
            const start = doc(codeBlock('code'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );

            expect(command().active(state)).toBe(true);
        });

        it('reports inactive with the caret in a paragraph', () => {
            const start = doc(p('text'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );

            expect(command().active(state)).toBe(false);
        });

        it('reports the state of the selection start in a mixed selection', () => {
            const start = doc(codeBlock('code'), p('text'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2, 9)
            );

            expect(command().active(state)).toBe(true);
        });
    });
});
