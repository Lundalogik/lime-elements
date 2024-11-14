import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';

/**
 * @private
 * set to private to avoid usage while under development
 */
export type TextEditorPlugin = {
    node: CustomElementDefinition[];
};

/**
 * @beta
 */
export type EditorUiType = 'standard' | 'minimal';
