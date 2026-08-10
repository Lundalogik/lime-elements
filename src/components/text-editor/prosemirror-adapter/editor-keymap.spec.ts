import {
    createEditorTestHarness,
    createEditorTestState,
    runCommand,
    textSelection,
} from './editor-test-harness';
import './editor-doc-matcher';
import { EditorMenuTypes } from './menu/types';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;

describe('editor keymap', () => {
    it('the factory keymap has exactly the eight documented bindings', () => {
        const keymap = harness.factory.buildKeymap();
        expect(Object.keys(keymap).sort()).toEqual(
            [
                'Mod-B',
                'Mod-I',
                'Mod-Shift-1',
                'Mod-Shift-2',
                'Mod-Shift-3',
                'Mod-Shift-C',
                'Mod-Shift-X',
                'Mod-`',
            ].sort()
        );
    });

    describe('binding-command equivalence', () => {
        const bindings: Array<[string, EditorMenuTypes]> = [
            ['Mod-B', EditorMenuTypes.Bold],
            ['Mod-I', EditorMenuTypes.Italic],
            ['Mod-Shift-1', EditorMenuTypes.HeaderLevel1],
            ['Mod-Shift-2', EditorMenuTypes.HeaderLevel2],
            ['Mod-Shift-3', EditorMenuTypes.HeaderLevel3],
            ['Mod-Shift-X', EditorMenuTypes.Strikethrough],
            ['Mod-`', EditorMenuTypes.Code],
            ['Mod-Shift-C', EditorMenuTypes.CodeBlock],
        ];

        it.each(bindings)(
            '%s produces the same document as the %s menu command',
            (binding, type) => {
                const start = doc(p('hello'));
                const keyState = createEditorTestState(
                    harness,
                    start,
                    textSelection(start, 1, 6)
                );
                const menuState = createEditorTestState(
                    harness,
                    start,
                    textSelection(start, 1, 6)
                );

                const viaKey = runCommand(
                    keyState,
                    harness.factory.buildKeymap()[binding]
                ).state;
                const viaMenu = runCommand(
                    menuState,
                    harness.factory.getCommand(type)
                ).state;

                expect(viaKey.doc).toEqualDoc(viaMenu.doc);
                expect(viaKey.doc.eq(start)).toBe(false);
            }
        );
    });
});
