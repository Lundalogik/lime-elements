import { EditorState } from 'prosemirror-state';
import { Schema, DOMParser } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { keymap } from 'prosemirror-keymap';
import { exampleSetup } from 'prosemirror-example-setup';
import { EditorView } from 'prosemirror-view';
import { MenuCommandFactory } from './menu-commands';
import { EditorMenuTypes } from './types';
import { strikethrough } from './menu-schema-extender';

describe('MenuCommandFactory', () => {
    let mySchema: Schema;
    let factory: MenuCommandFactory;
    let state: EditorState;
    let view: EditorView;
    let buildKeymap: Function;

    beforeEach(() => {
        mySchema = new Schema({
            nodes: addListNodes(
                basicSchema.spec.nodes,
                'paragraph block*',
                'block'
            ),
            marks: basicSchema.spec.marks.append({
                strikethrough: strikethrough,
            }),
        });

        factory = new MenuCommandFactory(mySchema);

        buildKeymap = () => {
            return {
                'Mod-B': factory.getCommand(EditorMenuTypes.Bold),
                'Mod-I': factory.getCommand(EditorMenuTypes.Italic),
                'Mod-Shift-1': factory.getCommand(EditorMenuTypes.HeaderLevel1),
                'Mod-Shift-2': factory.getCommand(EditorMenuTypes.HeaderLevel2),
                'Mod-Shift-3': factory.getCommand(EditorMenuTypes.HeaderLevel3),
            };
        };

        const doc = DOMParser.fromSchema(mySchema).parse(
            document.createElement('div')
        );

        state = EditorState.create({
            doc: doc,
            plugins: [
                ...exampleSetup({ schema: mySchema, menuBar: false }),
                keymap(buildKeymap()),
            ],
        });

        document.body.innerHTML = '<div id="editor"></div>';
        const editorDiv = document.querySelector('#editor');

        view = new EditorView(editorDiv!, {
            state: state,
            dispatchTransaction: (tr) => {
                state = state.apply(tr);
                view.updateState(state);
            },
        });
    });

    it('getCommand returns a command function for each EditorMenuTypes', () => {
        for (const type of Object.values(EditorMenuTypes)) {
            const command = factory.getCommand(type);
            expect(typeof command).toBe('function');
        }
    });

    it('buildKeymap returns a keymap object', () => {
        const myKeymap = buildKeymap();
        expect(typeof myKeymap).toBe('object');
        expect(Object.keys(myKeymap)).toEqual([
            'Mod-B',
            'Mod-I',
            'Mod-Shift-1',
            'Mod-Shift-2',
            'Mod-Shift-3',
        ]);
    });

    it('getCommand throws error for unsupported mark', () => {
        expect(() => {
            factory.getCommand('unsupported_mark' as EditorMenuTypes);
        }).toThrow('The Mark "unsupported_mark" is not supported');
    });
});
