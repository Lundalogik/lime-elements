import type { Node } from 'unist';
import { visit } from 'unist-util-visit';
import YAML from 'yaml';

interface VFile {
    data: Record<string, unknown>;
}

export function saveFrontmatter(): (tree: Node, file: VFile) => void {
    return transformer;
}

function transformer(tree: Node, file: VFile) {
    visit(tree, 'yaml', storeData(file));
}

const storeData = (file: VFile) => (item: Node & { value?: string }) => {
    file.data.frontmatter = item.value ? YAML.parse(item.value) : undefined;
};
