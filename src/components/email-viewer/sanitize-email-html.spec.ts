import { sanitizeEmailHTML } from './sanitize-email-html';

describe('sanitizeEmailHTML', () => {
    describe('XSS prevention', () => {
        it('removes script tags', async () => {
            const result = await sanitizeEmailHTML(
                '<div>Hello</div><script>alert("xss")</script>'
            );
            expect(result).not.toContain('<script');
            expect(result).not.toContain('alert');
            expect(result).toContain('Hello');
        });

        it('removes event handler attributes', async () => {
            const result = await sanitizeEmailHTML(
                '<div onmouseover="alert(1)">text</div>'
            );
            expect(result).not.toContain('onmouseover');
            expect(result).toContain('text');
        });

        it('removes onclick attributes', async () => {
            const result = await sanitizeEmailHTML(
                '<a onclick="steal()" href="#">click</a>'
            );
            expect(result).not.toContain('onclick');
        });

        it('removes javascript: URLs from href', async () => {
            const result = await sanitizeEmailHTML(
                `<a href="javascript:alert(1)">click</a>`
            );
            // eslint-disable-next-line sonarjs/code-eval -- Testing sanitizer strips malicious URLs
            expect(result).not.toContain(`javascript:`);
        });
    });

    describe('dangerous CSS removal', () => {
        it('removes expression() from inline styles', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="width: expression(document.body.clientWidth)">text</div>'
            );
            expect(result).not.toContain('expression');
        });

        it('removes behavior: from inline styles', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="behavior: url(malicious.htc)">text</div>'
            );
            expect(result).not.toContain('behavior');
        });

        it('removes -moz-binding from inline styles', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="-moz-binding: url(evil.xml)">text</div>'
            );
            expect(result).not.toContain('-moz-binding');
        });

        it('removes javascript: from CSS values', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="background: javascript:alert(1)">text</div>'
            );
            expect(result).not.toContain('javascript');
        });

        it('removes @import from style tags', async () => {
            const result = await sanitizeEmailHTML(
                '<style>@import url("https://evil.com/steal.css");</style>'
            );
            expect(result).not.toContain('@import');
        });

        it('removes @import with bare URL syntax', async () => {
            const result = await sanitizeEmailHTML(
                '<style>@import "https://evil.com/steal.css";</style>'
            );
            expect(result).not.toContain('@import');
        });

        it('removes unsafe url() in CSS but keeps safe ones', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="background: url(https://evil.com/track.gif)">text</div>'
            );
            // rehype-stringify HTML-encodes quotes in attribute values
            expect(result).toContain('url(&#x22;&#x22;)');
        });

        it('preserves data: URLs in CSS', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="background: url(data:image/png;base64,abc)">text</div>'
            );
            expect(result).toContain('data:image/png;base64,abc');
        });

        it('preserves cid: URLs in CSS', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="background: url(cid:image001)">text</div>'
            );
            expect(result).toContain('cid:image001');
        });

        it('preserves fragment URLs in CSS', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="background: url(#gradient1)">text</div>'
            );
            expect(result).toContain('#gradient1');
        });
    });

    describe('image handling', () => {
        it('preserves data: images with allowed MIME types', async () => {
            const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
            const result = await sanitizeEmailHTML(`<img src="${dataUrl}">`);
            expect(result).toContain(dataUrl);
        });

        it('allows image/jpeg data URLs', async () => {
            const dataUrl = 'data:image/jpeg;base64,/9j/4AAQ=';
            const result = await sanitizeEmailHTML(`<img src="${dataUrl}">`);
            expect(result).toContain(dataUrl);
        });

        it('allows image/gif data URLs', async () => {
            const dataUrl = 'data:image/gif;base64,R0lGODlh';
            const result = await sanitizeEmailHTML(`<img src="${dataUrl}">`);
            expect(result).toContain(dataUrl);
        });

        it('allows image/webp data URLs', async () => {
            const dataUrl = 'data:image/webp;base64,UklGR';
            const result = await sanitizeEmailHTML(`<img src="${dataUrl}">`);
            expect(result).toContain(dataUrl);
        });

        it('strips data: images with disallowed MIME types', async () => {
            const result = await sanitizeEmailHTML(
                '<img src="data:text/html;base64,PHNjcmlwdD4=">'
            );
            expect(result).not.toContain('data:text/html');
        });

        it('moves remote https images to data-remote-src', async () => {
            const result = await sanitizeEmailHTML(
                '<img src="https://example.com/image.png">'
            );
            expect(result).toContain(
                'data-remote-src="https://example.com/image.png"'
            );
            // The src attribute should be removed (only data-remote-src remains)
            expect(result).not.toMatch(/\ssrc="/);
        });

        it('moves remote http:// images to data-remote-src', async () => {
            const result = await sanitizeEmailHTML(
                '<img src="http://example.com/track.gif">'
            );
            expect(result).toContain(
                'data-remote-src="http://example.com/track.gif"'
            );
            expect(result).not.toMatch(/\ssrc="/);
        });

        it('strips non-http/https/data image sources', async () => {
            const result = await sanitizeEmailHTML(
                '<img src="ftp://example.com/image.png">'
            );
            expect(result).not.toContain('ftp://');
        });
    });

    describe('style preservation', () => {
        it('preserves inline styles on elements', async () => {
            const result = await sanitizeEmailHTML(
                '<div style="color: red; font-size: 14px;">styled</div>'
            );
            expect(result).toContain('color: red');
            expect(result).toContain('font-size: 14px');
        });

        it('preserves style tags', async () => {
            const result = await sanitizeEmailHTML(
                '<style>.header { color: blue; }</style><div class="header">Hi</div>'
            );
            expect(result).toContain('<style>');
            expect(result).toContain('.header');
            expect(result).toContain('color: blue');
        });
    });

    describe('email-specific tags', () => {
        it('preserves <center> tags', async () => {
            const result = await sanitizeEmailHTML(
                '<center>centered content</center>'
            );
            expect(result).toContain('<center>');
        });

        it('preserves <font> tags with color, size, and face', async () => {
            const result = await sanitizeEmailHTML(
                '<font color="red" size="3" face="Arial">text</font>'
            );
            expect(result).toContain('<font');
            expect(result).toContain('color="red"');
            expect(result).toContain('size="3"');
            expect(result).toContain('face="Arial"');
        });

        it('preserves table cellpadding and cellspacing', async () => {
            const result = await sanitizeEmailHTML(
                '<table cellpadding="5" cellspacing="0" border="1"><tr><td>cell</td></tr></table>'
            );
            expect(result).toContain('cellpadding="5"');
            expect(result).toContain('cellspacing="0"');
            expect(result).toContain('border="1"');
        });

        it('preserves colgroup and col elements', async () => {
            const result = await sanitizeEmailHTML(
                '<table><colgroup><col width="100"><col width="200"></colgroup><tr><td>a</td><td>b</td></tr></table>'
            );
            expect(result).toContain('<colgroup>');
            expect(result).toContain('<col');
        });
    });

    describe('attributes', () => {
        it('preserves class attributes', async () => {
            const result = await sanitizeEmailHTML(
                '<div class="email-body main">content</div>'
            );
            expect(result).toContain('class="email-body main"');
        });

        it('preserves id attributes without clobber prefix', async () => {
            const result = await sanitizeEmailHTML(
                '<div id="section1">content</div>'
            );
            expect(result).toContain('id="section1"');
            expect(result).not.toContain('user-content-');
        });
    });

    describe('document structure', () => {
        it('preserves html/head/body structure', async () => {
            const result = await sanitizeEmailHTML(
                '<html><head><title>Email</title></head><body><p>Hello</p></body></html>'
            );
            expect(result).toContain('<html>');
            expect(result).toContain('<head>');
            expect(result).toContain('<body>');
            expect(result).toContain('Hello');
        });

        it('preserves meta tags', async () => {
            const result = await sanitizeEmailHTML(
                '<html><head><meta charset="utf-8"></head><body>Hi</body></html>'
            );
            expect(result).toContain('<meta');
            expect(result).toContain('charset="utf-8"');
        });
    });

    describe('dangerous meta tags', () => {
        it('strips meta http-equiv="refresh" (open redirect)', async () => {
            const result = await sanitizeEmailHTML(
                '<html><head><meta http-equiv="refresh" content="0;url=http://evil.com"></head><body>Hi</body></html>'
            );
            // http-equiv is not in the allowed meta attributes, so it's stripped.
            // The content attribute may survive, but without http-equiv it cannot
            // trigger a redirect.
            expect(result).not.toContain('http-equiv');
        });
    });
});
