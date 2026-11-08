import type { Node } from 'unist';
export type LinkResolver = (target: string) => string | null;
export declare function normalizeInlineLinkUrls(text: string): string;
export declare function inlineLinks(options?: {
    resolve?: LinkResolver;
}): (tree: Node) => void;
