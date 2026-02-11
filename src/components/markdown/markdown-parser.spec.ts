import { markdownToHTML, sanitizeHTML } from './markdown-parser';

describe('markdownToHTML', () => {
    describe('basic markdown', () => {
        it('should convert simple markdown to HTML', async () => {
            const result = await markdownToHTML('# Hello World');
            expect(result).toEqualHtml('<h1>Hello World</h1>');
        });

        it('should convert bold text', async () => {
            const result = await markdownToHTML('This is **bold** text');
            expect(result).toEqualHtml(
                '<p>This is <strong>bold</strong> text</p>'
            );
        });

        it('should convert italic text', async () => {
            const result = await markdownToHTML('This is *italic* text');
            expect(result).toEqualHtml('<p>This is <em>italic</em> text</p>');
        });

        it('should convert links', async () => {
            const result = await markdownToHTML(
                '[Example](https://example.com)'
            );
            expect(result).toEqualHtml(`
                <p>
                    <a href="https://example.com"
                       target="_blank"
                       rel="noopener noreferrer"
                       referrerpolicy="noreferrer">
                        Example
                    </a>
                </p>
            `);
        });
    });

    describe('paragraphs', () => {
        it('should wrap text in paragraph tags', async () => {
            const result = await markdownToHTML('Simple paragraph');
            expect(result).toEqualHtml('<p>Simple paragraph</p>');
        });

        it('should create multiple paragraphs from double line breaks', async () => {
            const result = await markdownToHTML(
                'First paragraph.\n\nSecond paragraph.'
            );
            expect(result).toEqualHtml(`
                <p>First paragraph.</p>
                <p>Second paragraph.</p>
            `);
        });
    });

    describe('headings', () => {
        it('should render all heading levels', async () => {
            const result = await markdownToHTML(
                '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6'
            );
            expect(result).toEqualHtml(`
                <h1>H1</h1>
                <h2>H2</h2>
                <h3>H3</h3>
                <h4>H4</h4>
                <h5>H5</h5>
                <h6>H6</h6>
            `);
        });
    });

    describe('lists', () => {
        it('should render unordered lists', async () => {
            const result = await markdownToHTML('- Item 1\n- Item 2\n- Item 3');
            expect(result).toEqualHtml(`
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            `);
        });

        it('should render ordered lists', async () => {
            const result = await markdownToHTML(
                '1. First\n2. Second\n3. Third'
            );
            expect(result).toEqualHtml(`
                <ol>
                    <li>First</li>
                    <li>Second</li>
                    <li>Third</li>
                </ol>
            `);
        });

        it('should render nested lists', async () => {
            const result = await markdownToHTML(
                '- Parent\n  - Child\n    - Grandchild'
            );
            expect(result).toEqualHtml(`
                <ul>
                    <li>Parent
                        <ul>
                            <li>Child
                                <ul>
                                    <li>Grandchild</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            `);
        });
    });

    describe('blockquotes', () => {
        it('should render blockquotes', async () => {
            const result = await markdownToHTML('> This is a quote');
            expect(result).toEqualHtml(`
                <blockquote>
                    <p>This is a quote</p>
                </blockquote>
            `);
        });

        it('should render nested blockquotes', async () => {
            const result = await markdownToHTML('> Level 1\n>> Level 2');
            expect(result).toEqualHtml(`
                <blockquote>
                    <p>Level 1</p>
                    <blockquote>
                        <p>Level 2</p>
                    </blockquote>
                </blockquote>
            `);
        });
    });

    describe('code', () => {
        it('should render inline code', async () => {
            const result = await markdownToHTML('Use `const` for constants');
            expect(result).toEqualHtml(
                '<p>Use <code>const</code> for constants</p>'
            );
        });

        it('should render code blocks', async () => {
            const result = await markdownToHTML('```\nconst x = 1;\n```');
            expect(result).toEqualHtml(`
                <pre><code>const x = 1;
</code></pre>
            `);
        });

        it('should render code blocks with language', async () => {
            const result = await markdownToHTML(
                '```javascript\nconst x = 1;\n```'
            );
            expect(result).toEqualHtml(`
                <pre><code class="language-javascript">const x = 1;
</code></pre>
            `);
        });
    });

    describe('images', () => {
        it('should render images', async () => {
            const result = await markdownToHTML('![Alt text](image.png)');
            expect(result).toEqualHtml(
                '<p><img src="image.png" alt="Alt text"></p>'
            );
        });

        it('should render images with titles', async () => {
            const result = await markdownToHTML(
                '![Alt](image.png "Image title")'
            );
            expect(result).toEqualHtml(
                '<p><img src="image.png" alt="Alt" title="Image title"></p>'
            );
        });
    });

    describe('horizontal rules', () => {
        it('should render horizontal rules', async () => {
            const result = await markdownToHTML('Before\n\n---\n\nAfter');
            expect(result).toEqualHtml(`
                <p>Before</p>
                <hr>
                <p>After</p>
            `);
        });
    });

    describe('GFM features (GitHub Flavored Markdown)', () => {
        it('should render tables', async () => {
            const result = await markdownToHTML(
                '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
            );
            expect(result).toEqualHtml(`
                <table>
                    <thead>
                        <tr>
                            <th>Header 1</th>
                            <th>Header 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Cell 1</td>
                            <td>Cell 2</td>
                        </tr>
                    </tbody>
                </table>
            `);
        });

        it('should render strikethrough', async () => {
            const result = await markdownToHTML('~~deleted~~');
            expect(result).toEqualHtml('<p><del>deleted</del></p>');
        });

        it('should render task lists', async () => {
            const result = await markdownToHTML(
                '- [ ] Unchecked\n- [x] Checked'
            );
            expect(result).toEqualHtml(`
                <ul class="contains-task-list">
                    <li class="task-list-item">
                        <input type="checkbox" disabled> Unchecked
                    </li>
                    <li class="task-list-item">
                        <input type="checkbox" checked disabled> Checked
                    </li>
                </ul>
            `);
        });

        it('should render autolinks', async () => {
            const result = await markdownToHTML(
                'Visit https://example.com for more'
            );
            expect(result).toEqualHtml(`
                <p>
                    Visit
                    <a href="https://example.com"
                       target="_blank"
                       rel="noopener noreferrer"
                       referrerpolicy="noreferrer">
                        https://example.com
                    </a>
                    for more
                </p>
            `);
        });
    });

    describe('link attributes', () => {
        it('should not add security attributes to relative links', async () => {
            const result = await markdownToHTML('[About](/about)');
            // Relative links should not get target="_blank" or security attributes
            expect(result).toEqualHtml(`
                <p>
                    <a href="/about">About</a>
                </p>
            `);
        });
    });

    describe('forceHardLineBreaks option', () => {
        it('should convert soft line breaks to hard breaks when enabled', async () => {
            const result = await markdownToHTML('Line 1\nLine 2', {
                forceHardLineBreaks: true,
            });
            expect(result).toEqualHtml(`
                <p>Line 1<br>
                Line 2</p>
            `);
        });

        it('should not convert soft line breaks when disabled', async () => {
            const result = await markdownToHTML('Line 1\nLine 2', {
                forceHardLineBreaks: false,
            });
            expect(result).toEqualHtml('<p>Line 1\nLine 2</p>');
        });

        it('should not double-break lines that already have trailing spaces', async () => {
            // Two trailing spaces before \n is already a hard break in markdown
            const result = await markdownToHTML('Line 1  \nLine 2', {
                forceHardLineBreaks: true,
            });
            expect(result).toEqualHtml(`
                <p>Line 1<br>
                Line 2</p>
            `);
        });
    });

    describe('removeEmptyParagraphs option', () => {
        it('should remove empty paragraphs when enabled', async () => {
            const result = await markdownToHTML('<p></p><p>Content</p>', {
                removeEmptyParagraphs: true,
            });
            expect(result).toEqualHtml('<p>Content</p>');
        });

        it('should keep empty paragraphs when disabled', async () => {
            const result = await markdownToHTML('<p></p><p>Content</p>', {
                removeEmptyParagraphs: false,
            });
            expect(result).toEqualHtml('<p></p><p>Content</p>');
        });

        it('should remove paragraphs with only whitespace', async () => {
            const result = await markdownToHTML('<p>   </p><p>Content</p>', {
                removeEmptyParagraphs: true,
            });
            expect(result).toEqualHtml('<p>Content</p>');
        });

        it('should preserve paragraphs with meaningful content', async () => {
            const result = await markdownToHTML('<p><img src="test.png"></p>', {
                removeEmptyParagraphs: true,
            });
            expect(result).toEqualHtml('<p><img src="test.png"></p>');
        });
    });

    describe('lazyLoadImages option', () => {
        it('should add lazy loading attributes when enabled', async () => {
            const result = await markdownToHTML('![Alt](image.png)', {
                lazyLoadImages: true,
            });
            expect(result).toEqualHtml(
                '<p><img alt="Alt" loading="lazy" data-src="image.png"></p>'
            );
        });

        it('should not add lazy loading attributes when disabled', async () => {
            const result = await markdownToHTML('![Alt](image.png)', {
                lazyLoadImages: false,
            });
            expect(result).toEqualHtml(
                '<p><img src="image.png" alt="Alt"></p>'
            );
        });
    });

    describe('whitelist option (custom components)', () => {
        it('should allow whitelisted custom elements', async () => {
            // Note: Inline content gets wrapped in <p> tags by markdown parser
            const result = await markdownToHTML(
                '<my-component attr="value">Content</my-component>',
                {
                    whitelist: [
                        { tagName: 'my-component', attributes: ['attr'] },
                    ],
                }
            );
            expect(result).toEqualHtml(
                '<p><my-component attr="value">Content</my-component></p>'
            );
        });

        it('should strip non-whitelisted custom elements', async () => {
            const result = await markdownToHTML(
                '<unknown-element>Content</unknown-element>'
            );
            expect(result).toEqualHtml('<p>Content</p>');
        });

        it('should strip non-whitelisted attributes from custom elements', async () => {
            const result = await markdownToHTML(
                '<my-component allowed="ok" forbidden="no">Content</my-component>',
                {
                    whitelist: [
                        { tagName: 'my-component', attributes: ['allowed'] },
                    ],
                }
            );
            expect(result).toEqualHtml(
                '<p><my-component allowed="ok">Content</my-component></p>'
            );
        });
    });

    describe('raw HTML passthrough', () => {
        it('should allow safe HTML elements', async () => {
            const result = await markdownToHTML('<div>Content</div>');
            expect(result).toEqualHtml('<div>Content</div>');
        });

        it('should allow span elements', async () => {
            const result = await markdownToHTML(
                'Text with <span>inline</span> element'
            );
            expect(result).toEqualHtml(
                '<p>Text with <span>inline</span> element</p>'
            );
        });
    });

    describe('edge cases', () => {
        it('should handle empty input', async () => {
            const result = await markdownToHTML('');
            expect(result).toBe('');
        });

        it('should handle whitespace-only input', async () => {
            const result = await markdownToHTML('   \n\n   ');
            expect(result).toBe('');
        });

        it('should handle unicode characters', async () => {
            const result = await markdownToHTML(
                '# Emoji: 🎉\n\nÖsterreich, 日本語, العربية'
            );
            expect(result).toEqualHtml(`
                <h1>Emoji: 🎉</h1>
                <p>Österreich, 日本語, العربية</p>
            `);
        });

        it('should handle escaped markdown characters', async () => {
            const result = await markdownToHTML(
                String.raw`\*not bold\* and \[not a link\]`
            );
            expect(result).toEqualHtml('<p>*not bold* and [not a link]</p>');
        });

        it('should handle deeply nested structures', async () => {
            const result = await markdownToHTML(
                '> - Item in quote\n>   - Nested item'
            );
            expect(result).toEqualHtml(`
                <blockquote>
                    <ul>
                        <li>Item in quote
                            <ul>
                                <li>Nested item</li>
                            </ul>
                        </li>
                    </ul>
                </blockquote>
            `);
        });
    });

    describe('mixed content', () => {
        it('should handle markdown and HTML mixed', async () => {
            // Note: Markdown inside HTML blocks is NOT processed as markdown
            // This is standard markdown behavior
            // Also note: class attribute is stripped by sanitizer (not whitelisted)
            const result = await markdownToHTML(
                '# Heading\n\n<div class="custom">**Bold in div**</div>'
            );
            expect(result).toEqualHtml(`
                <h1>Heading</h1>
                <div>**Bold in div**</div>
            `);
        });
    });
});

describe('sanitizeHTML', () => {
    describe('script and dangerous elements', () => {
        it('should remove script tags', async () => {
            const result = await sanitizeHTML(
                '<p>Hello</p><script>alert("xss")</script>'
            );
            expect(result).toEqualHtml('<p>Hello</p>');
        });

        it('should preserve safe HTML', async () => {
            const result = await sanitizeHTML(
                '<p>This is <strong>safe</strong> HTML</p>'
            );
            expect(result).toEqualHtml(
                '<p>This is <strong>safe</strong> HTML</p>'
            );
        });
    });

    describe('event handler attributes', () => {
        it('should strip onerror attribute', async () => {
            const result = await sanitizeHTML(
                '<img src="image.jpg" onerror="alert(\'xss\')">'
            );
            expect(result).toEqualHtml('<img src="image.jpg">');
        });

        it('should strip onclick attribute', async () => {
            const result = await sanitizeHTML(
                '<a href="https://example.com" onclick="alert(\'xss\')">Link</a>'
            );
            expect(result).toEqualHtml(
                '<a href="https://example.com">Link</a>'
            );
        });

        it('should strip onmouseover attribute', async () => {
            const result = await sanitizeHTML(
                '<div onmouseover="alert(1)">Hover me</div>'
            );
            expect(result).toEqualHtml('<div>Hover me</div>');
        });

        it('should strip onfocus attribute', async () => {
            // Note: rehype-sanitize only allows input[type="checkbox"][disabled]
            // (for GFM task lists), so other input types are converted
            const result = await sanitizeHTML(
                '<input onfocus="alert(1)" type="text">'
            );
            expect(result).not.toContain('onfocus');
            expect(result).toEqualHtml('<input disabled type="checkbox">');
        });
    });

    describe('dangerous elements', () => {
        it('should remove iframe elements', async () => {
            const result = await sanitizeHTML(
                '<p>Content</p><iframe src="https://evil.com"></iframe>'
            );
            expect(result).toEqualHtml('<p>Content</p>');
        });

        it('should remove object elements', async () => {
            const result = await sanitizeHTML(
                '<object data="evil.swf"></object>'
            );
            expect(result).toEqualHtml('');
        });

        it('should remove embed elements', async () => {
            const result = await sanitizeHTML('<embed src="evil.swf">');
            expect(result).toEqualHtml('');
        });

        it('should remove form elements', async () => {
            // Form is removed, input is converted to allowed format (checkbox)
            const result = await sanitizeHTML(
                '<form action="https://evil.com"><input></form>'
            );
            expect(result).toEqualHtml('<input disabled type="checkbox">');
        });
    });

    describe('javascript URLs', () => {
        it('should strip javascript: URLs from href', async () => {
            const result = await sanitizeHTML(
                '<a href="javascript:alert(1)">Click</a>'
            );
            // eslint-disable-next-line sonarjs/code-eval -- Testing sanitizer strips malicious URLs
            expect(result).not.toContain('javascript:');
            expect(result).toEqualHtml('<a>Click</a>');
        });

        it('should strip javascript: URLs from src', async () => {
            const result = await sanitizeHTML(
                '<img src="javascript:alert(1)">'
            );
            // eslint-disable-next-line sonarjs/code-eval -- Testing sanitizer strips malicious URLs
            expect(result).not.toContain('javascript:');
            expect(result).toEqualHtml('<img>');
        });
    });

    describe('data URLs', () => {
        it('should strip data URLs for security', async () => {
            // Data URLs are stripped by the sanitizer to prevent
            // potential XSS via data: protocol
            const result = await sanitizeHTML(
                '<img src="data:image/png;base64,abc123">'
            );
            expect(result).toEqualHtml('<img>');
        });
    });

    describe('style attribute sanitization', () => {
        it('should allow safe CSS properties', async () => {
            const result = await sanitizeHTML(
                '<p style="color: red; font-weight: bold;">Text</p>'
            );
            expect(result).toEqualHtml(
                '<p style="color: red; font-weight: bold">Text</p>'
            );
        });

        it('should strip dangerous CSS properties', async () => {
            const result = await sanitizeHTML(
                '<p style="color: red; position: absolute; z-index: 9999;">Text</p>'
            );
            expect(result).toEqualHtml('<p style="color: red">Text</p>');
        });

        it('should normalize background to background-color', async () => {
            const result = await sanitizeHTML(
                '<p style="background: blue;">Text</p>'
            );
            expect(result).toEqualHtml(
                '<p style="background-color: blue">Text</p>'
            );
        });
    });

    describe('whitelist support', () => {
        it('should allow whitelisted custom elements', async () => {
            const result = await sanitizeHTML(
                '<my-element attr="value">Content</my-element>',
                [{ tagName: 'my-element', attributes: ['attr'] }]
            );
            expect(result).toEqualHtml(
                '<my-element attr="value">Content</my-element>'
            );
        });
    });

    describe('edge cases', () => {
        it('should handle empty input', async () => {
            const result = await sanitizeHTML('');
            expect(result).toBe('');
        });

        it('should handle malformed HTML', async () => {
            const result = await sanitizeHTML(
                '<p>Unclosed paragraph<div>Mixed</p></div>'
            );
            // Should not throw and should produce valid HTML
            expect(result).toContain('Unclosed paragraph');
            expect(result).toContain('Mixed');

            // Verify tags are balanced (parser may reorder or add tags to fix nesting)
            const countOccurrences = (str: string, substr: string) =>
                (str.match(new RegExp(substr, 'g')) || []).length;
            expect(countOccurrences(result, '<p>')).toBe(
                countOccurrences(result, '</p>')
            );
            expect(countOccurrences(result, '<div>')).toBe(
                countOccurrences(result, '</div>')
            );
        });

        it('should handle deeply nested elements', async () => {
            const result = await sanitizeHTML(
                '<div><div><div><div><p>Deep</p></div></div></div></div>'
            );
            expect(result).toEqualHtml(
                '<div><div><div><div><p>Deep</p></div></div></div></div>'
            );
        });
    });
});
