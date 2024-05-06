import { Schema } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import { schema } from 'prosemirror-schema-basic';

import { MenuCommandFactory } from './menu-commands';
import { EditorMenuTypes } from './types';

describe('MenuCommandFactory', () => {
    let mySchema: Schema;
    let factory: MenuCommandFactory;

    beforeEach(() => {
        mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
            marks: schema.spec.marks,
        });
        factory = new MenuCommandFactory(mySchema);
    });

    it('getCommand returns a command function for each EditorMenuTypes', () => {
        Object.values(EditorMenuTypes).forEach((type) => {
            const command = factory.getCommand(type);
            expect(typeof command).toBe('function');
        });
    });

    it('getCommand throws an error when an unsupported EditorMenuTypes is passed', () => {
        expect(() =>
            factory.getCommand('unsupportedType' as any),
        ).toThrowError();
    });

    it('buildKeymap returns a keymap object', () => {
        const keymap = factory.buildKeymap();
        expect(typeof keymap).toBe('object');
        expect(Object.keys(keymap)).toEqual([
            'Mod-B',
            'Mod-I',
            'Mod-Shift-1',
            'Mod-Shift-2',
            'Mod-Shift-3',
        ]);
    });
});
