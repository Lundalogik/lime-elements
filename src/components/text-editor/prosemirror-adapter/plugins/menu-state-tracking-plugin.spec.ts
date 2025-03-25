import {
    createMenuStateTrackingPlugin,
    getMenuItemStates,
} from './menu-state-tracking-plugin';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { EditorMenuTypes } from '../menu/types';
import { MenuCommandFactory } from '../menu/menu-commands';

// Mock EditorMenuTypes enum for testing
const mockMenuTypes: EditorMenuTypes[] = [
    'bold' as EditorMenuTypes,
    'italic' as EditorMenuTypes,
    'link' as EditorMenuTypes,
];

describe('menu-state-tracking-plugin', () => {
    let menuCommandFactory: MenuCommandFactory;
    let updateCallback: jest.Mock;
    let view: Partial<EditorView>;
    let state: Partial<EditorState>;
    let dispatch: jest.Mock;

    beforeEach(() => {
        menuCommandFactory = {
            getCommand: jest.fn(),
        } as any;

        updateCallback = jest.fn();
        dispatch = jest.fn();

        state = {
            tr: {
                setMeta: jest.fn().mockReturnThis(),
            } as any,
        };

        view = {
            state: state as EditorState,
            dispatch: dispatch,
        };
    });

    describe('getMenuItemStates', () => {
        it('should return active and allowed states for menu items', () => {
            const mockCommands = {
                bold: {
                    active: jest.fn().mockReturnValue(true),
                    allowed: jest.fn().mockReturnValue(true),
                },
                italic: {
                    active: jest.fn().mockReturnValue(false),
                    allowed: jest.fn().mockReturnValue(true),
                },
                link: {
                    active: jest.fn().mockReturnValue(false),
                    allowed: jest.fn().mockReturnValue(false),
                },
            };

            menuCommandFactory.getCommand = jest.fn(
                (type) => mockCommands[type],
            );

            const result = getMenuItemStates(
                mockMenuTypes,
                menuCommandFactory,
                view as EditorView,
            );

            expect(result).toEqual({
                active: {
                    bold: true,
                    italic: false,
                    link: false,
                },
                allowed: {
                    bold: true,
                    italic: true,
                    link: false,
                },
            });

            expect(menuCommandFactory.getCommand).toHaveBeenCalledTimes(3);
            expect(mockCommands.bold.active).toHaveBeenCalledWith(state);
            expect(mockCommands.bold.allowed).toHaveBeenCalledWith(state);
        });

        it('should handle missing active or allowed methods', () => {
            const commands = {
                bold: {
                    active: jest.fn().mockReturnValue(true),
                    // No allowed method
                },
                italic: {
                    // No active method
                    allowed: jest.fn().mockReturnValue(true),
                },
                link: {},
            };

            menuCommandFactory.getCommand = jest.fn((type) => commands[type]);

            const result = getMenuItemStates(
                mockMenuTypes,
                menuCommandFactory,
                view as EditorView,
            );

            expect(result).toEqual({
                active: {
                    bold: true,
                    italic: false,
                    link: false,
                },
                allowed: {
                    bold: true, // Default to true when missing
                    italic: true,
                    link: true, // Default to true when missing
                },
            });
        });
    });

    describe('createMenuStateTrackingPlugin', () => {
        it('should create a plugin with the correct key', () => {
            const plugin: Plugin = createMenuStateTrackingPlugin(
                mockMenuTypes,
                menuCommandFactory,
                updateCallback,
            );

            expect(plugin).toBeInstanceOf(Plugin);
            expect(plugin.key).toBe('actionBarPlugin$');
        });

        it('should update plugin state when meta is set', () => {
            const plugin = createMenuStateTrackingPlugin(
                mockMenuTypes,
                menuCommandFactory,
                updateCallback,
            );

            const mockTransaction = {
                getMeta: jest.fn().mockReturnValue({
                    active: { bold: true },
                    allowed: { bold: true },
                }),
            } as unknown as Transaction;

            const newState = plugin.spec.state.apply(mockTransaction, {
                active: {},
                allowed: {},
            });

            expect(newState).toEqual({
                active: { bold: true },
                allowed: { bold: true },
            });
        });

        it('should not update plugin state when no meta is set', () => {
            const plugin = createMenuStateTrackingPlugin(
                mockMenuTypes,
                menuCommandFactory,
                updateCallback,
            );

            const mockTransaction = {
                getMeta: jest.fn().mockReturnValue(null),
            } as unknown as Transaction;

            const oldState = {
                active: { bold: true },
                allowed: { bold: true },
            };
            const newState = plugin.spec.state.apply(mockTransaction, oldState);

            expect(newState).toBe(oldState);
        });
    });
});
