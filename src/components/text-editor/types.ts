import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';

/**
 * set to private to avoid usage while under development
 * @private
 */
export type TextEditorPlugin = {
    node: CustomElementDefinition[];
};

/**
 * @beta
 */
export type EditorUiType = 'standard' | 'minimal' | 'no-toolbar';
