import { Node, Schema } from 'prosemirror-model';
import { getMetadataFromDoc, hasMetadataChanged } from './metadata-utils';
import { EditorMetadata } from '../text-editor.types';

function createTestSchema() {
    return new Schema({
        nodes: {
            doc: { content: 'block+' },
            paragraph: { group: 'block', content: 'inline*' },
            text: { group: 'inline' },
            image: {
                group: 'inline',
                inline: true,
                attrs: {
                    src: { default: '' },
                    alt: { default: '' },
                    fileInfoId: { default: '' },
                    state: { default: '' },
                },
            },
        },
        marks: {
            link: {
                attrs: {
                    href: { default: '' },
                    title: { default: '' },
                },
            },
        },
    });
}

function createTestDoc(schema: Schema, content: any): Node {
    return schema.nodeFromJSON(content);
}

test('getMetadataFromDoc should extract images correctly', () => {
    const schema = createTestSchema();
    const doc = createTestDoc(schema, {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'image',
                        attrs: {
                            src: 'image1.jpg',
                            fileInfoId: 'id1',
                            state: 'success',
                        },
                    },
                    {
                        type: 'image',
                        attrs: {
                            src: 'image2.jpg',
                            fileInfoId: 'id2',
                            state: 'success',
                        },
                    },
                ],
            },
        ],
    });

    const metadata = getMetadataFromDoc(doc);

    expect(metadata.images.length).toBe(2);
    expect(metadata.images[0].src).toBe('image1.jpg');
    expect(metadata.images[0].fileInfoId).toBe('id1');
    expect(metadata.images[1].src).toBe('image2.jpg');
    expect(metadata.images[1].fileInfoId).toBe('id2');
    expect(metadata.links.length).toBe(0);
});

test('getMetadataFromDoc should extract links correctly', () => {
    const schema = createTestSchema();
    const doc = createTestDoc(schema, {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'Link 1',
                        marks: [
                            {
                                type: 'link',
                                attrs: {
                                    href: 'https://example.com',
                                },
                            },
                        ],
                    },
                    { type: 'text', text: ' and ' },
                    {
                        type: 'text',
                        text: 'Link 2',
                        marks: [
                            {
                                type: 'link',
                                attrs: {
                                    href: 'https://test.com',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    });

    const metadata = getMetadataFromDoc(doc);

    expect(metadata.links.length).toBe(2);
    expect(metadata.links[0].href).toBe('https://example.com');
    expect(metadata.links[0].text).toBe('Link 1');
    expect(metadata.links[1].href).toBe('https://test.com');
    expect(metadata.links[1].text).toBe('Link 2');
    expect(metadata.images.length).toBe(0);
});

test('getMetadataFromDoc should handle complex documents with both images and links', () => {
    const schema = createTestSchema();
    const doc = createTestDoc(schema, {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'Text with ',
                    },
                    {
                        type: 'text',
                        text: 'link',
                        marks: [
                            {
                                type: 'link',
                                attrs: {
                                    href: 'https://example.com',
                                },
                            },
                        ],
                    },
                    {
                        type: 'image',
                        attrs: {
                            src: 'image.jpg',
                            fileInfoId: 'id123',
                            state: 'success',
                        },
                    },
                ],
            },
        ],
    });

    const metadata = getMetadataFromDoc(doc);

    expect(metadata.images.length).toBe(1);
    expect(metadata.links.length).toBe(1);
    expect(metadata.images[0].src).toBe('image.jpg');
    expect(metadata.links[0].href).toBe('https://example.com');
});

test('hasMetadataChanged should return true when image counts differ', () => {
    const oldMetadata: EditorMetadata = {
        images: [
            { src: 'img1.jpg', fileInfoId: 'id1', state: 'success' },
            { src: 'img2.jpg', fileInfoId: 'id2', state: 'success' },
        ],
        links: [],
    };

    const newMetadata: EditorMetadata = {
        images: [{ src: 'img1.jpg', fileInfoId: 'id1', state: 'success' }],
        links: [],
    };

    expect(hasMetadataChanged(oldMetadata, newMetadata)).toBe(true);
});

test('hasMetadataChanged should return true when link counts differ', () => {
    const oldMetadata: EditorMetadata = {
        images: [],
        links: [
            { href: 'https://example.com', text: 'Example' },
            { href: 'https://test.com', text: 'Test' },
        ],
    };

    const newMetadata: EditorMetadata = {
        images: [],
        links: [{ href: 'https://example.com', text: 'Example' }],
    };

    expect(hasMetadataChanged(oldMetadata, newMetadata)).toBe(true);
});

test('hasMetadataChanged should return true when image content differs', () => {
    const oldMetadata: EditorMetadata = {
        images: [{ src: 'img1.jpg', fileInfoId: 'id1', state: 'success' }],
        links: [],
    };

    const newMetadata: EditorMetadata = {
        images: [{ src: 'img2.jpg', fileInfoId: 'id1', state: 'success' }],
        links: [],
    };

    expect(hasMetadataChanged(oldMetadata, newMetadata)).toBe(true);
});

test('hasMetadataChanged should return true when link content differs', () => {
    const oldMetadata: EditorMetadata = {
        images: [],
        links: [{ href: 'https://example.com', text: 'Example' }],
    };

    const newMetadata: EditorMetadata = {
        images: [],
        links: [{ href: 'https://example.com', text: 'Changed Text' }],
    };

    expect(hasMetadataChanged(oldMetadata, newMetadata)).toBe(true);
});

test('hasMetadataChanged should handle duplicate elements correctly', () => {
    const oldMetadata: EditorMetadata = {
        images: [
            { src: 'img1.jpg', fileInfoId: 'id1', state: 'success' },
            { src: 'img1.jpg', fileInfoId: 'id1', state: 'success' },
        ],
        links: [
            { href: 'https://example.com', text: 'Example' },
            { href: 'https://example.com', text: 'Example' },
        ],
    };

    const newMetadata: EditorMetadata = {
        images: [
            { src: 'img1.jpg', fileInfoId: 'id1', state: 'success' },
            { src: 'img1.jpg', fileInfoId: 'id1', state: 'success' },
        ],
        links: [
            { href: 'https://example.com', text: 'Example' },
            { href: 'https://example.com', text: 'Example' },
        ],
    };

    expect(hasMetadataChanged(oldMetadata, newMetadata)).toBe(false);
});

test('hasMetadataChanged should ignore order changes', () => {
    const oldMetadata: EditorMetadata = {
        images: [
            { src: 'img1.jpg', fileInfoId: 'id1', state: 'success' },
            { src: 'img2.jpg', fileInfoId: 'id2', state: 'success' },
        ],
        links: [
            { href: 'https://example.com', text: 'Example' },
            { href: 'https://test.com', text: 'Test' },
        ],
    };

    const newMetadata: EditorMetadata = {
        images: [
            { src: 'img2.jpg', fileInfoId: 'id2', state: 'success' },
            { src: 'img1.jpg', fileInfoId: 'id1', state: 'success' },
        ],
        links: [
            { href: 'https://test.com', text: 'Test' },
            { href: 'https://example.com', text: 'Example' },
        ],
    };

    expect(hasMetadataChanged(oldMetadata, newMetadata)).toBe(false);
});

test('hasMetadataChanged should return false when metadata is identical', () => {
    const oldMetadata: EditorMetadata = {
        images: [{ src: 'img1.jpg', fileInfoId: 'id1', state: 'success' }],
        links: [{ href: 'https://example.com', text: 'Example' }],
    };

    const newMetadata: EditorMetadata = {
        images: [{ src: 'img1.jpg', fileInfoId: 'id1', state: 'success' }],
        links: [{ href: 'https://example.com', text: 'Example' }],
    };

    expect(hasMetadataChanged(oldMetadata, newMetadata)).toBe(false);
});
