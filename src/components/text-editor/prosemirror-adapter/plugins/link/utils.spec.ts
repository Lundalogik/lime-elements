import { getLinkAttributes } from './utils';

const originalLocation = window.location;

beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
            hostname: 'internal.com',
            protocol: 'https:',
            origin: 'https://internal.com',
        },
    });
});

afterEach(() => {
    // Restore original window.location
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: originalLocation,
    });
});

test.each([
    {
        description: 'relative URL as internal link',
        url: '/path/to/page',
        title: 'Title',
        expected: {
            isExternal: false,
            href: '/path/to/page',
            title: 'Title',
        },
    },
    {
        description: 'fragment URL as internal link',
        url: '#section-1',
        title: 'Title',
        expected: {
            isExternal: false,
            href: '#section-1',
            title: 'Title',
        },
    },
    {
        description: 'protocol-relative URL to same domain as internal link',
        url: '//internal.com/path',
        title: 'Title',
        expected: {
            isExternal: false,
            href: '//internal.com/path',
            title: 'Title',
        },
    },
    {
        description: 'absolute URL to same domain as internal link',
        url: 'https://internal.com/page',
        title: 'Title',
        expected: {
            isExternal: false,
            href: 'https://internal.com/page',
            title: 'Title',
        },
    },
    {
        description: 'relative URL with query parameters as internal link',
        url: '/search?q=test&page=1',
        title: 'Title',
        expected: {
            isExternal: false,
            href: '/search?q=test&page=1',
            title: 'Title',
        },
    },
    {
        description: 'malformed URL as internal link',
        url: 'not-a-valid-url',
        title: 'Title',
        expected: {
            isExternal: false,
            href: 'not-a-valid-url',
            title: 'Title',
        },
    },
    {
        description:
            'protocol-relative URL to different domain as external link',
        url: '//external.com/path',
        title: 'Title',
        expected: {
            isExternal: true,
            href: '//external.com/path',
            title: 'Title',
        },
    },
    {
        description: 'absolute URL to different domain as external link',
        url: 'https://external.com/page',
        title: 'Title',
        expected: {
            isExternal: true,
            href: 'https://external.com/page',
            title: 'Title',
        },
    },
    {
        description: 'external link with null title preserves null title',
        url: 'https://external.com/page',
        title: null,
        expected: {
            isExternal: true,
            href: 'https://external.com/page',
            title: null,
        },
    },
])('getLinkAttributes handles $description', ({ url, title, expected }) => {
    const attributes = getLinkAttributes(url, title);

    expect(attributes.href).toBe(expected.href);
    expect(attributes.title).toBe(expected.title);

    if (expected.isExternal) {
        expect(attributes.target).toBe('_blank');
        expect(attributes.rel).toBe('noopener noreferrer');
        expect(attributes.referrerpolicy).toBe('noreferrer');
    } else {
        expect(attributes.target).toBeNull();
        expect(attributes.rel).toBeNull();
        expect(attributes.referrerpolicy).toBeNull();
    }
});
