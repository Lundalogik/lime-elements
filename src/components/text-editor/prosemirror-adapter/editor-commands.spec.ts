import { Mark, Node } from 'prosemirror-model';
import {
    createEditorTestHarness,
    createEditorTestState,
    runCommand,
    textSelection,
} from './editor-test-harness';
import './editor-doc-matcher';
import { EditorMenuTypes, editorMenuTypesArray } from './menu/types';
import { CommandWithActive } from './menu/menu-commands';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;
const blockquote = b.blockquote;
const codeBlock = b.code_block;
const bulletList = b.bullet_list;
const orderedList = b.ordered_list;
const listItem = b.list_item;
const heading = b.heading;
const strong = b.strong;

function getLinkMark(node: Node): Mark | undefined {
    return node.marks.find((mark) => mark.type.name === 'link');
}

describe('menu commands against the real schema', () => {
    describe('mark commands', () => {
        const markTypes = [
            EditorMenuTypes.Bold,
            EditorMenuTypes.Italic,
            EditorMenuTypes.Strikethrough,
            EditorMenuTypes.Code,
        ];

        it.each(markTypes)('%s wraps a range selection in the mark', (type) => {
            const start = doc(p('hello'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 6)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(type)
            );
            expect(next.doc).toEqualDoc(doc(p(b[type]('hello'))));
        });

        it.each(markTypes)(
            '%s removes the mark from a fully marked range',
            (type) => {
                const start = doc(p(b[type]('hello')));
                const state = createEditorTestState(
                    harness,
                    start,
                    textSelection(start, 1, 6)
                );
                const { state: next } = runCommand(
                    state,
                    harness.factory.getCommand(type)
                );
                expect(next.doc).toEqualDoc(doc(p('hello')));
            }
        );

        it.each(markTypes)(
            '%s at an empty cursor toggles a stored mark',
            (type) => {
                const start = doc(p('hello'));
                const state = createEditorTestState(
                    harness,
                    start,
                    textSelection(start, 3)
                );
                const { state: next } = runCommand(
                    state,
                    harness.factory.getCommand(type)
                );
                expect(
                    harness.schema.marks[type].isInSet(next.storedMarks ?? [])
                ).toBeTruthy();
            }
        );

        it('removes the mark from the whole range when part of it carries the mark', () => {
            const start = doc(p(strong('he'), 'llo'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 6)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Bold)
            );
            expect(next.doc).toEqualDoc(doc(p('hello')));
        });

        it.each(markTypes)(
            '%s declines inside a code_block without dispatching',
            (type) => {
                const start = doc(codeBlock('hello'));
                const state = createEditorTestState(
                    harness,
                    start,
                    textSelection(start, 2, 4)
                );
                const { state: next, handled } = runCommand(
                    state,
                    harness.factory.getCommand(type)
                );
                expect(handled).toBe(false);
                expect(next.doc).toEqualDoc(start);
            }
        );
    });

    describe('mark active()', () => {
        it('is false on a plain text range', () => {
            const start = doc(p('hello'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 6)
            );
            const command = harness.factory.getCommand(
                EditorMenuTypes.Bold
            ) as CommandWithActive;
            expect(command.active(state)).toBeFalsy();
        });

        it('is true when the mark exists anywhere in the range', () => {
            const start = doc(p('a', strong('b'), 'c'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 4)
            );
            const command = harness.factory.getCommand(
                EditorMenuTypes.Bold
            ) as CommandWithActive;
            expect(command.active(state)).toBeTruthy();
        });

        it('reflects stored marks at an empty cursor', () => {
            const start = doc(p('hello'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 3)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Bold)
            );
            const command = harness.factory.getCommand(
                EditorMenuTypes.Bold
            ) as CommandWithActive;
            expect(next.selection.$from.marks()).toHaveLength(0);
            expect(command.active(next)).toBeTruthy();
        });

        it('reports a link active regardless of its href', () => {
            const start = doc(
                p(b.link({ href: 'https://anything.example/' }, 'text'))
            );
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 3)
            );
            const command = harness.factory.getCommand(
                EditorMenuTypes.Link
            ) as CommandWithActive;
            expect(command.active(state)).toBeTruthy();
        });
    });

    describe('allowed()', () => {
        it('is undefined on every command', () => {
            for (const type of editorMenuTypesArray) {
                const command = harness.factory.getCommand(
                    type
                ) as CommandWithActive;
                expect(command.allowed).toBeUndefined();
            }
        });
    });

    describe('heading commands', () => {
        it.each([
            [EditorMenuTypes.HeaderLevel1, 1],
            [EditorMenuTypes.HeaderLevel2, 2],
            [EditorMenuTypes.HeaderLevel3, 3],
        ])('%s turns a paragraph into a level-%i heading', (type, level) => {
            const start = doc(p('title'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(type)
            );
            expect(next.doc).toEqualDoc(
                doc(heading({ level: level }, 'title'))
            );
        });

        it('turns a heading back into a paragraph at the same level', () => {
            const start = doc(heading({ level: 2 }, 'title'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.HeaderLevel2)
            );
            expect(next.doc).toEqualDoc(doc(p('title')));
        });

        it('turns an H1 into a paragraph when a different level is applied', () => {
            const start = doc(heading({ level: 1 }, 'title'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.HeaderLevel2)
            );
            expect(next.doc).toEqualDoc(doc(p('title')));
        });

        it('declines a selection spanning two blocks', () => {
            const start = doc(p('aa'), p('bb'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2, 6)
            );
            const { state: next, handled } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.HeaderLevel1)
            );
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });

        it('active() matches only the exact heading level', () => {
            const start = doc(heading({ level: 1 }, 'title'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );
            const h1 = harness.factory.getCommand(
                EditorMenuTypes.HeaderLevel1
            ) as CommandWithActive;
            const h2 = harness.factory.getCommand(
                EditorMenuTypes.HeaderLevel2
            ) as CommandWithActive;
            expect(h1.active(state)).toBeTruthy();
            expect(h2.active(state)).toBeFalsy();
        });
    });

    describe('blockquote command', () => {
        it('wraps a paragraph', () => {
            const start = doc(p('quote me'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Blockquote)
            );
            expect(next.doc).toEqualDoc(doc(blockquote(p('quote me'))));
        });

        it('lifts a paragraph out of a blockquote, round-tripping', () => {
            const start = doc(blockquote(p('quote me')));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 3)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Blockquote)
            );
            expect(next.doc).toEqualDoc(doc(p('quote me')));
        });

        it('declines inside a list item nested in a blockquote', () => {
            const start = doc(blockquote(bulletList(listItem(p('x')))));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 4)
            );
            const { state: next, handled } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Blockquote)
            );
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });

        it('declines a selection spanning two blocks', () => {
            const start = doc(p('aa'), p('bb'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2, 6)
            );
            const { state: next, handled } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Blockquote)
            );
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });

        it('active() is true anywhere under a blockquote ancestor', () => {
            const start = doc(blockquote(bulletList(listItem(p('x')))));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 4)
            );
            const command = harness.factory.getCommand(
                EditorMenuTypes.Blockquote
            ) as CommandWithActive;
            expect(command.active(state)).toBeTruthy();
        });
    });

    describe('list commands', () => {
        it('wraps a paragraph in a bullet list', () => {
            const start = doc(p('item'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.BulletList)
            );
            expect(next.doc).toEqualDoc(doc(bulletList(listItem(p('item')))));
        });

        it('lifts a paragraph out of its bullet list, round-tripping', () => {
            const start = doc(bulletList(listItem(p('item'))));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 3)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.BulletList)
            );
            expect(next.doc).toEqualDoc(doc(p('item')));
        });

        it('lifts out of a bullet list instead of converting when OrderedList is applied', () => {
            const start = doc(bulletList(listItem(p('item'))));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 3)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.OrderedList)
            );
            expect(next.doc).toEqualDoc(doc(p('item')));
        });

        it('wraps a two-paragraph selection into a single list item', () => {
            const start = doc(p('aa'), p('bb'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2, 6)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.BulletList)
            );
            expect(next.doc).toEqualDoc(
                doc(bulletList(listItem(p('aa'), p('bb'))))
            );
        });

        it('active() reports both list types inside a nested list', () => {
            const start = doc(
                orderedList(listItem(p('a'), bulletList(listItem(p('inner')))))
            );
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 8)
            );
            const ordered = harness.factory.getCommand(
                EditorMenuTypes.OrderedList
            ) as CommandWithActive;
            const bullet = harness.factory.getCommand(
                EditorMenuTypes.BulletList
            ) as CommandWithActive;
            expect(ordered.active(state)).toBeTruthy();
            expect(bullet.active(state)).toBeTruthy();
        });
    });

    describe('code block command', () => {
        it('converts a paragraph and back, round-tripping', () => {
            const start = doc(p('code'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );
            const first = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.CodeBlock)
            );
            expect(first.state.doc).toEqualDoc(doc(codeBlock('code')));

            const second = runCommand(
                first.state,
                harness.factory.getCommand(EditorMenuTypes.CodeBlock)
            );
            expect(second.state.doc).toEqualDoc(doc(p('code')));
        });

        it('strips marks when converting a marked paragraph', () => {
            const start = doc(p(strong('code')));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.CodeBlock)
            );
            expect(next.doc).toEqualDoc(doc(codeBlock('code')));
        });

        it('declines a selection spanning two blocks', () => {
            const start = doc(p('aa'), p('bb'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 2, 6)
            );
            const { state: next, handled } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.CodeBlock)
            );
            expect(handled).toBe(false);
            expect(next.doc).toEqualDoc(start);
        });
    });

    describe('link command', () => {
        const externalHref = 'https://other.example/page';

        it('inserts the link text at an empty cursor', () => {
            const start = doc(p('ab'));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1)
            );
            const { state: next, handled } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Link, {
                    href: externalHref,
                    text: 'click',
                })
            );
            expect(handled).toBe(true);
            expect(next.doc.textContent).toBe('clickab');
            const mark = getLinkMark(next.doc.firstChild.firstChild);
            expect(mark.attrs.href).toBe(externalHref);
        });

        it('falls back to the href as text when no text is given', () => {
            const start = doc(p());
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Link, {
                    href: externalHref,
                    text: '',
                })
            );
            expect(next.doc.textContent).toBe(externalHref);
        });

        it('sets the title to the href and external security attrs', () => {
            const start = doc(p());
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Link, {
                    href: externalHref,
                    text: 'x',
                })
            );
            const mark = getLinkMark(next.doc.firstChild.firstChild);
            expect(mark.attrs.title).toBe(externalHref);
            expect(mark.attrs.target).toBe('_blank');
            expect(mark.attrs.rel).toBe('noopener noreferrer');
            expect(mark.attrs.referrerpolicy).toBe('noreferrer');
        });

        it('gives a same-host link no target and no security attrs', () => {
            const internalHref = `http://${window.location.hostname}/page`;
            const start = doc(p());
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Link, {
                    href: internalHref,
                    text: 'x',
                })
            );
            const mark = getLinkMark(next.doc.firstChild.firstChild);
            expect(mark.attrs.target).toBeNull();
            expect(mark.attrs.rel).toBeNull();
            expect(mark.attrs.referrerpolicy).toBeNull();
        });

        it('replaces a range selection and drops its prior marks', () => {
            const start = doc(p(strong('hello')));
            const state = createEditorTestState(
                harness,
                start,
                textSelection(start, 1, 6)
            );
            const { state: next } = runCommand(
                state,
                harness.factory.getCommand(EditorMenuTypes.Link, {
                    href: externalHref,
                    text: '',
                })
            );
            const textNode = next.doc.firstChild.firstChild;
            expect(textNode.text).toBe('hello');
            expect(textNode.marks).toHaveLength(1);
            expect(textNode.marks[0].type.name).toBe('link');
        });

        it('creates a command without a link argument', () => {
            expect(() =>
                harness.factory.getCommand(EditorMenuTypes.Link)
            ).not.toThrow();
        });
    });
});
