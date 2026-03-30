import visit from 'unist-util-visit';

export function saveFrontmatter(): (tree, file) => any {
    return transformer;
}

function transformer(tree, file) {
    return visit(tree, 'yaml', storeData(file));
}

const storeData = (file) => (item) => {
    file.data.frontmatter = item.data.parsedValue;
};
