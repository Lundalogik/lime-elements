import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { Plugin, Transformer } from 'unified';

/**
 * Creates a unified.js plugin that transforms image elements for lazy loading
 *
 * @param lazyLoadImages - Whether to enable lazy loading for images
 * @returns A unified.js plugin function
 */
export function createLazyLoadImagesPlugin(lazyLoadImages = false): Plugin {
    return (): Transformer => {
        if (!lazyLoadImages) {
            return (tree: Node) => tree;
        }

        return (tree: Node) => {
            visit(tree, 'element', (node: any) => {
                if (node.tagName === 'img') {
                    node.properties = node.properties || {};
                    node.properties.loading = 'lazy';

                    if (node.properties.src) {
                        node.properties['data-src'] = node.properties.src;
                        node.properties.src = undefined;
                    }
                }
            });

            return tree;
        };
    };
}
