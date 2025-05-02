import { EditorImage, EditorLink, EditorMetadata } from '../text-editor.types';
import { Node } from 'prosemirror-model';

/**
 * Extracts metadata from a ProseMirror document node
 *
 * This function traverses the entire document tree and collects information about
 * special elements like images and links.
 *
 * @param doc - The ProseMirror document node to extract metadata from
 * @returns A metadata object containing arrays of images and links found in the document
 */
export function getMetadataFromDoc(doc: Node): EditorMetadata {
    const metadata: EditorMetadata = { images: [], links: [] };

    doc.descendants((node) => {
        if (isImageNode(node)) {
            metadata.images.push(extractImageMetadata(node));
        } else if (isTextNodeWithMarks(node)) {
            extractLinkMetadata(node).forEach((link) =>
                metadata.links.push(link),
            );
        }

        return true;
    });

    return metadata;
}

function isImageNode(node: Node): boolean {
    return node.type.name === 'image' && !!node.attrs;
}

function extractImageMetadata(node: Node): EditorImage {
    return {
        src: node.attrs.src,
        state: node.attrs.state,
        fileInfoId: node.attrs.fileInfoId,
    };
}

function isTextNodeWithMarks(node: Node): boolean {
    return node.isText && node.marks?.length > 0;
}

function extractLinkMetadata(node: Node): EditorLink[] {
    return node.marks
        .filter((mark) => mark.type.name === 'link' && mark.attrs)
        .map((mark) => ({
            href: mark.attrs.href,
            text: node.text,
        }));
}

/**
 * Determines if metadata has changed between two states
 * Handles duplicates correctly but is order-insensitive
 *
 * @param oldMetadata - The previous metadata state to compare against
 * @param newMetadata - The current metadata state
 * @returns True if there are any differences between the metadata objects, false otherwise
 */
export function hasMetadataChanged(
    oldMetadata: EditorMetadata,
    newMetadata: EditorMetadata,
): boolean {
    return (
        hasDifferentLengths(oldMetadata, newMetadata) ||
        hasDifferentLinks(oldMetadata.links, newMetadata.links) ||
        hasDifferentImages(oldMetadata.images, newMetadata.images)
    );
}

function hasDifferentLengths(
    oldMetadata: EditorMetadata,
    newMetadata: EditorMetadata,
): boolean {
    return (
        oldMetadata.images.length !== newMetadata.images.length ||
        oldMetadata.links.length !== newMetadata.links.length
    );
}

function hasDifferentLinks(
    oldLinks: EditorLink[],
    newLinks: EditorLink[],
): boolean {
    const oldLinkCounts = getLinkFrequencyMap(oldLinks);
    const newLinkCounts = getLinkFrequencyMap(newLinks);

    return !areFrequencyMapsEqual(oldLinkCounts, newLinkCounts);
}

function hasDifferentImages(
    oldImages: EditorImage[],
    newImages: EditorImage[],
): boolean {
    const oldImageCounts = getImageFrequencyMap(oldImages);
    const newImageCounts = getImageFrequencyMap(newImages);

    return !areFrequencyMapsEqual(oldImageCounts, newImageCounts);
}

/**
 * Creates a frequency map for images based on their key properties
 */
function getImageFrequencyMap(images: EditorImage[]): Map<string, number> {
    const countMap = new Map<string, number>();

    images.forEach((image) => {
        const key = `${image.fileInfoId}|${image.state}|${image.src}`;

        countMap.set(key, (countMap.get(key) || 0) + 1);
    });

    return countMap;
}

/**
 * Creates a frequency map for links based on their key properties
 */
function getLinkFrequencyMap(links: EditorLink[]): Map<string, number> {
    const countMap = new Map<string, number>();

    links.forEach((link) => {
        const key = `${link.href}|${link.text}`;

        countMap.set(key, (countMap.get(key) || 0) + 1);
    });

    return countMap;
}

/**
 * Compares two frequency maps for equality
 */
function areFrequencyMapsEqual(
    map1: Map<string, number>,
    map2: Map<string, number>,
): boolean {
    if (map1.size !== map2.size) {
        return false;
    }

    for (const [key, count] of map1.entries()) {
        if (map2.get(key) !== count) {
            return false;
        }
    }

    return true;
}
