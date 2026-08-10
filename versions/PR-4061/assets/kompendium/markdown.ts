import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { saveFrontmatter } from './markdown-frontmatter';
import {
    admonitions,
    normalizeLegacyAdmonitions,
} from './markdown-admonitions';
import { kompendiumCode } from './markdown-code';
import { typeLinks } from './markdown-typelinks';
import {
    inlineLinks,
    LinkResolver,
    normalizeInlineLinkUrls,
} from './markdown-inline-links';

export interface File {
    data: {
        frontmatter?: Record<string, any>;
        path?: string;
    };

    toString(): string;
}

export async function markdownToHtml(
    text: string,
    types: string[] = [],
    components: string[] = [],
): Promise<File> {
    const normalized = normalizeInlineLinkUrls(
        normalizeLegacyAdmonitions(text),
    );
    const resolve = createLinkResolver(types, components);

    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkFrontmatter)
        .use(saveFrontmatter)
        .use(remarkDirective)
        .use(admonitions)
        .use(inlineLinks, { resolve: resolve })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(typeLinks, { types: types })
        .use(kompendiumCode)
        .use(rehypeStringify)
        .process(normalized);

    return {
        data: file.data as File['data'],
        toString: () => file.toString(),
    };
}

function createLinkResolver(
    types: string[],
    components: string[],
): LinkResolver {
    const typeSet = new Set(types);
    const componentSet = new Set(components);

    return (target: string) => {
        if (typeSet.has(target)) {
            return `#/type/${target}`;
        }

        if (componentSet.has(target)) {
            return `#/component/${target}/`;
        }

        return null;
    };
}
