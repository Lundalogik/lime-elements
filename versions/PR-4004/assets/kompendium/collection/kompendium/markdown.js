import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { saveFrontmatter } from "./markdown-frontmatter";
import { admonitions, normalizeLegacyAdmonitions, } from "./markdown-admonitions";
import { kompendiumCode } from "./markdown-code";
import { typeLinks } from "./markdown-typelinks";
export async function markdownToHtml(text, types = []) {
    const normalized = normalizeLegacyAdmonitions(text);
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkFrontmatter)
        .use(saveFrontmatter)
        .use(remarkDirective)
        .use(admonitions)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(typeLinks, { types: types })
        .use(kompendiumCode)
        .use(rehypeStringify)
        .process(normalized);
    return {
        data: file.data,
        toString: () => file.toString(),
    };
}
//# sourceMappingURL=markdown.js.map
