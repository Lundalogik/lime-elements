import { markdownToHTML, sanitizeHTML } from './markdown-parser';

describe('markdownToHTML', () => {
    it('should convert simple markdown to HTML', async () => {
        const markdown = '# Hello World';
        const result = await markdownToHTML(markdown);
        expect(result).toContain('<h1>Hello World</h1>');
    });

    it('should convert bold text', async () => {
        const markdown = 'This is **bold** text';
        const result = await markdownToHTML(markdown);
        expect(result).toContain('<strong>bold</strong>');
    });

    it('should convert italic text', async () => {
        const markdown = 'This is *italic* text';
        const result = await markdownToHTML(markdown);
        expect(result).toContain('<em>italic</em>');
    });

    it('should convert links', async () => {
        const markdown = '[Example](https://example.com)';
        const result = await markdownToHTML(markdown);
        expect(result).toContain('href="https://example.com"');
        expect(result).toContain('>Example</a>');
    });
});

describe('sanitizeHTML', () => {
    it('should remove script tags', async () => {
        const html = '<p>Hello</p><script>alert("xss")</script>';
        const result = await sanitizeHTML(html);
        expect(result).not.toContain('<script>');
        expect(result).toContain('<p>Hello</p>');
    });

    it('should preserve safe HTML', async () => {
        const html = '<p>This is <strong>safe</strong> HTML</p>';
        const result = await sanitizeHTML(html);
        expect(result).toContain('<p>This is <strong>safe</strong> HTML</p>');
    });

    it('should strip event-handler attributes', async () => {
        const html =
            '<img src="image.jpg" onerror="alert(\'xss\')">' +
            '<a href="https://example.com" onclick="alert(\'xss\')">Link</a>';
        const result = await sanitizeHTML(html);

        // Safe tags and attributes should be preserved
        expect(result).toContain('<img');
        expect(result).toContain('src="image.jpg"');
        expect(result).toContain('<a');
        expect(result).toContain('href="https://example.com"');
        expect(result).toContain('>Link</a>');

        // Event-handler attributes should be stripped
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('onclick');
        expect(result).not.toContain("alert('xss')");
    });
});
