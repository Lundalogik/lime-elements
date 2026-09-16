import { SourceElement } from './collect-elements';
import { representElement } from './represent-element';

const WHITELIST = [
    { tagName: 'test-described', attributes: ['name', 'link'] },
    { tagName: 'test-plain', attributes: ['label'] },
    { tagName: 'test-failing', attributes: [] },
];

let connectedWhileAsked: boolean | undefined;
let hydratedLink: unknown;

class TestDescribed extends HTMLElement {
    public link?: unknown;

    public toMarkdown(): Promise<string> {
        connectedWhileAsked = this.isConnected;
        hydratedLink = this.link;

        return Promise.resolve(`[${this.getAttribute('name')}](x)`);
    }
}

class TestFailing extends HTMLElement {
    public toMarkdown(): Promise<string> {
        return Promise.reject(new Error('load failed'));
    }
}

class TestForbidden extends HTMLElement {
    public toMarkdown(): Promise<string> {
        throw new Error('must never be asked');
    }
}

function recorded(tagName: string, html: string, closed = true): SourceElement {
    return { tagName, start: 0, end: html.length, closed, html };
}

describe('representElement', () => {
    let host: HTMLDivElement;

    beforeAll(() => {
        customElements.define('test-described', TestDescribed);
        customElements.define('test-failing', TestFailing);
        customElements.define('test-forbidden', TestForbidden);
    });

    beforeEach(() => {
        host = document.createElement('div');
        document.body.append(host);
        connectedWhileAsked = undefined;
        hydratedLink = undefined;
    });

    afterEach(() => {
        host.remove();
    });

    it('asks a copy of the element, made from its markup', async () => {
        const result = await representElement(
            recorded(
                'test-described',
                '<test-described name="Pelle"></test-described>'
            ),
            host,
            WHITELIST
        );

        expect(result).toBe('[Pelle](x)');
    });

    it('attaches the copy under the host while it is asked, and removes it after', async () => {
        await representElement(
            recorded(
                'test-described',
                '<test-described name="Pelle"></test-described>'
            ),
            host,
            WHITELIST
        );

        expect(connectedWhileAsked).toBe(true);
        expect(host.childElementCount).toBe(0);
    });

    it('hydrates JSON attributes into properties, as the render does', async () => {
        await representElement(
            recorded(
                'test-described',
                '<test-described name="Pelle" link=\'{"href":"https://crm/1"}\'></test-described>'
            ),
            host,
            WHITELIST
        );

        expect(hydratedLink).toEqual({ href: 'https://crm/1' });
    });

    it('creates nothing for an element outside the whitelist', async () => {
        const result = await representElement(
            recorded('test-forbidden', '<test-forbidden></test-forbidden>'),
            host,
            WHITELIST
        );

        expect(result).toBe('');
        expect(host.childElementCount).toBe(0);
    });

    it('uses the content of a closed element that cannot describe itself', async () => {
        const result = await representElement(
            recorded('test-plain', '<test-plain label="x">Label</test-plain>'),
            host,
            WHITELIST
        );

        expect(result).toBe('Label');
    });

    it('contributes nothing for an unclosed element that cannot describe itself', async () => {
        const result = await representElement(
            recorded(
                'test-plain',
                '<test-plain label="x"></test-plain>',
                false
            ),
            host,
            WHITELIST
        );

        expect(result).toBe('');
    });

    it('removes the copy even when it fails to describe itself', async () => {
        await expect(
            representElement(
                recorded('test-failing', '<test-failing></test-failing>'),
                host,
                WHITELIST
            )
        ).rejects.toThrow('load failed');
        expect(host.childElementCount).toBe(0);
    });
});
