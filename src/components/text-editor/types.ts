import { NodeSpec } from 'prosemirror-model';

/**
 * @private
 * set to private to avoid usage while under development
 */
export type TextEditorPlugin = {
    node: NodeConfig[];
};

export interface NodeConfig {
    tagName: string;
    attrs: string[];
}

export type NodeSpecFactory = (config: NodeConfig) => NodeSpec;
