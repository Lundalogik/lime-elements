import { adaptColorContrast } from './adapt-color-contrast';

function makeP(
    host: HTMLElement,
    attrs: { style?: string } = {},
    text = 'x'
): HTMLParagraphElement {
    const p = document.createElement('p');
    if (attrs.style) {
        p.setAttribute('style', attrs.style);
    }
    p.textContent = text;
    host.append(p);

    return p;
}

describe('adaptColorContrast', () => {
    let host: HTMLDivElement;

    beforeEach(() => {
        host = document.createElement('div');
        host.style.backgroundColor = 'rgb(255, 255, 255)';
        document.body.append(host);
    });

    afterEach(() => {
        host.remove();
    });

    it('does nothing when there are no inline color styles', () => {
        const plain = makeP(host, {}, 'plain');
        const bold = makeP(host, { style: 'font-weight: bold' }, 'bold');
        const beforePlain = plain.outerHTML;
        const beforeBold = bold.outerHTML;
        adaptColorContrast(host);
        expect(plain.outerHTML).toBe(beforePlain);
        expect(bold.outerHTML).toBe(beforeBold);
    });

    it('leaves elements with `color: inherit` alone', () => {
        const p = makeP(host, { style: 'color: inherit' });
        adaptColorContrast(host);
        expect(p.style.color).toBe('inherit');
    });

    it('strips low-contrast color from inline style', () => {
        const p = makeP(host, { style: 'color: rgb(250, 250, 250)' });
        adaptColorContrast(host);
        expect(p.style.color).toBe('');
    });

    it('removes the style attribute entirely when color was its only declaration', () => {
        const p = makeP(host, { style: 'color: rgb(250, 250, 250)' });
        adaptColorContrast(host);
        expect(p.hasAttribute('style')).toBe(false);
    });

    it('preserves other inline declarations when stripping color', () => {
        const p = makeP(host, {
            style: 'color: rgb(250, 250, 250); font-weight: bold; padding: 4px',
        });
        adaptColorContrast(host);
        expect(p.style.color).toBe('');
        expect(p.style.fontWeight).toBe('bold');
        expect(p.style.padding).toBe('4px');
    });

    it('leaves brand colors that pass the contrast threshold alone', () => {
        const p = makeP(host, { style: 'color: rgb(31, 73, 125)' });
        adaptColorContrast(host);
        expect(p.style.color).toBe('rgb(31, 73, 125)');
    });

    it('preserves a saturated red against a dark surface', () => {
        host.style.backgroundColor = 'rgb(20, 20, 20)';
        const p = makeP(host, { style: 'color: rgb(200, 38, 19)' });
        adaptColorContrast(host);
        expect(p.style.color).toBe('rgb(200, 38, 19)');
    });

    it('strips fully transparent colors so the surface color inherits', () => {
        const p = makeP(host, { style: 'color: transparent' });
        adaptColorContrast(host);
        expect(p.style.color).toBe('');
    });

    it('strips black text on a dark surface and not on a light one', () => {
        const p = makeP(host, { style: 'color: rgb(0, 0, 0)' });
        adaptColorContrast(host);
        expect(p.style.color).toBe('rgb(0, 0, 0)');

        host.style.backgroundColor = 'rgb(20, 20, 20)';
        adaptColorContrast(host);
        expect(p.style.color).toBe('');
    });

    it('walks across an ancestor with no background to find the surface', () => {
        const inner = document.createElement('div');
        host.append(inner);
        const p = makeP(inner, { style: 'color: rgb(250, 250, 250)' });
        adaptColorContrast(host);
        expect(p.style.color).toBe('');
    });

    it('does not strip when an ancestor has a background-image', () => {
        const inner = document.createElement('div');
        inner.style.backgroundImage = 'linear-gradient(to right, red, blue)';
        host.append(inner);
        const p = makeP(inner, { style: 'color: rgb(250, 250, 250)' });
        adaptColorContrast(host);
        expect(p.style.color).toBe('rgb(250, 250, 250)');
    });
});
