import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { Plugin, Transformer } from 'unified';
import { getLinkAttributes } from '../text-editor/prosemirror-adapter/plugins/link/utils';

/**
 * Creates a unified.js plugin that transforms link elements
 * to add target, rel, and referrerpolicy attributes.
 *
 * @returns A unified.js plugin function
 */
export function createLinksPlugin(): Plugin {
    return (): Transformer => {
        return (tree: Node) => {
            visit(tree, 'element', (node: any) => {
                if (node.tagName === 'a') {
                    const href = node.properties?.href;
                    const title = node.properties?.title;

                    if (!href) {
                        return;
                    }

                    const attributes = getLinkAttributes(href, title);

                    node.properties.target = attributes.target;
                    node.properties.rel = attributes.rel;
                    node.properties.referrerpolicy = attributes.referrerpolicy;
                }
            });

            return tree;
        };
    };
}
