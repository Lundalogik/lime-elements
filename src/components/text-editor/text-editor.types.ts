import { CustomElement } from '../../global/shared-types/custom-element.types';

/**
 * @alpha
 */
export type TriggerCharacter =
    | '@'
    | '#'
    | '$'
    | '!'
    | '?'
    | '&'
    | '*'
    | '%'
    | '+'
    | '-'
    | '='
    | '/'
    | '\\'
    | '^'
    | '~'
    | '`'
    | ':'
    | ';'
    | '|'
    | '.'
    | ','
    | '<'
    | '>'
    | '['
    | ']'
    | '{'
    | '}'
    | '('
    | ')'
    | "'";

/**
 * @alpha
 */
export type TextEditorNode = {
    /**
     * The top node
     */
    node: CustomElement | string;

    /**
     * One more more children under the top node
     */
    children?: Array<TextEditorNode | string>;
};

/**
 * @alpha
 */
export interface TextEditor {
    /**
     * Method to insert either text or a node at the cursor position
     */
    insert: (input: TextEditorNode | string) => void;

    /**
     * Method to insert an HTML string at the cursor position
     */
    insertHtml: (input: string) => Promise<void>;

    stopTrigger: () => void;
}

/**
 * @alpha
 */
export interface TriggerEventDetail {
    /**
     * The trigger that triggered this event
     *
     */
    trigger: TriggerCharacter;

    /**
     * The text editor
     */
    textEditor: TextEditor;

    /**
     * Current value of the trigger
     */
    value: string;
}
