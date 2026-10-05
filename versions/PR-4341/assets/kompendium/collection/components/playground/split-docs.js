import { firstLine } from "../component/anchors";
/**
 * Split an example's docs into a title (the first non-empty line) and the
 * remaining body. Kept in a separate module from the kompendium-playground
 * component so it can be unit-tested directly -- Stencil only allows a
 * component module to export the component class itself.
 * @param {string} docs the example's docs text
 * @returns {{title: string; body: string}} the title and remaining body
 */
export function splitDocs(docs) {
    const lines = (docs || '').split('\n');
    const titleIndex = lines.findIndex((line) => line.trim().length > 0);
    if (titleIndex === -1) {
        return { title: '', body: '' };
    }
    return {
        title: firstLine(docs),
        body: lines
            .slice(titleIndex + 1)
            .join('\n')
            .trim(),
    };
}
