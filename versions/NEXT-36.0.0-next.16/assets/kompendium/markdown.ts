import unified from 'unified';
import markdown from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import parseFrontmatter from 'remark-parse-yaml';
import admonitions from 'remark-admonitions';
import remark2rehype from 'remark-rehype';
import raw from 'rehype-raw';
import html from 'rehype-stringify';
import { saveFrontmatter } from './markdown-frontmatter';
import { kompendiumCode } from './markdown-code';
import { typeLinks } from './markdown-typelinks';

export interface File {
    data: {
        frontmatter?: Record<string, any>;
        path?: string;
    };

    toString(): string;
}

export async function markdownToHtml(text: string, types = []): Promise<File> {
    return new Promise((resolve) => {
        unified()
            .use(markdown)
            .use(frontmatter)
            .use(parseFrontmatter)
            .use(saveFrontmatter)
            .use(admonitions, { icons: 'none' })
            .use(remark2rehype, { allowDangerousHtml: true })
            .use(raw)
            .use(typeLinks, { types: types })
            .use(kompendiumCode)
            .use(html)
            .process(text, (_, file) => {
                resolve(file);
            });
    });
}
