import type { Node } from 'unist';
interface VFile {
    data: Record<string, unknown>;
}
export declare function saveFrontmatter(): (tree: Node, file: VFile) => void;
export {};
