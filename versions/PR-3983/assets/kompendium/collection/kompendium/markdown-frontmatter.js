import { visit } from "unist-util-visit";
import YAML from "yaml";
export function saveFrontmatter() {
    return transformer;
}
function transformer(tree, file) {
    visit(tree, 'yaml', storeData(file));
}
const storeData = (file) => (item) => {
    file.data.frontmatter = item.value ? YAML.parse(item.value) : undefined;
};
//# sourceMappingURL=markdown-frontmatter.js.map
