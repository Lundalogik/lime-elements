import { Button } from 'src/components';
import { Command } from 'prosemirror-state';

export type TextEditorMenuItems = TextEditorMenuButton[];

export type TextEditorMenuButton = Button & {
    disabled?: boolean;
    command: Command;
    dropdown?: Array<Button & { disabled?: boolean; command: Command }>;
};
