/**
 * Split an example's docs into a title (the first non-empty line) and the
 * remaining body. Kept in a separate module from the kompendium-playground
 * component so it can be unit-tested directly -- Stencil only allows a
 * component module to export the component class itself.
 * @param {string} docs the example's docs text
 * @returns {{title: string; body: string}} the title and remaining body
 */
export declare function splitDocs(docs: string): {
    title: string;
    body: string;
};
