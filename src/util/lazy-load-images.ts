/**
 * Global utilities for implementing image lazy loading across components.
 *
 * Strategy:
 * 1. During render, components output <img data-src="..." loading="lazy"> (no real src).
 * 2. After the DOM has been rendered, call observeLazyImages(root) with the component's
 *    host or shadow root to start observing any images having a data-src attribute.
 * 3. When an observed image enters the viewport, its data-src is copied to src and the
 *    data attribute removed, letting the browser load it at that moment.
 *
 * This augments native loading="lazy" with an IntersectionObserver based mechanism
 * to prevent the browser from preloading many off-screen images aggressively.
 */

import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Plugin, Transformer } from 'unified';

/** Attribute used internally to avoid observing the same image multiple times */
const OBSERVED_ATTR = 'data-lazy-observed';

/**
 * Observe images inside the provided root (Host element or shadow root) and lazily
 * set their src when they become visible.
 *
 * Only images matching the selector `img[data-src]:not([data-lazy-observed])` are
 * considered. After an image is scheduled for observation it gets the
 * `data-lazy-observed` attribute so subsequent calls are cheap.
 *
 * @param root - The host element or shadow root to search within.
 */
export function observeLazyImages(root: HTMLElement | ShadowRoot) {
    if (!root) {
        return;
    }

    const images = root.querySelectorAll<HTMLImageElement>(
        'img[data-src]:not([' + OBSERVED_ATTR + '])'
    );
    if (images.length === 0) {
        return;
    }

    // Fallback for browsers without IntersectionObserver
    if ((window as any).IntersectionObserver === undefined) {
        for (const img of images) {
            const dataSrc = img.dataset.src;
            if (dataSrc) {
                img.src = dataSrc;
                delete img.dataset.src;
            }
        }
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                const dataSrc = img.dataset.src;
                if (dataSrc) {
                    img.src = dataSrc;
                    delete img.dataset.src;
                }
                observer.unobserve(img);
            }
        }
    });

    for (const img of images) {
        img.setAttribute(OBSERVED_ATTR, '');
        observer.observe(img);
    }
}

/**
 * Unified.js plugin used by markdown parsing to convert <img src="..."> tags
 * into lazy-loadable markup by moving src -> data-src and adding loading="lazy".
 *
 * Exported here so it can be reused in any future parsing contexts.
 *
 * @param lazyLoadImages - Whether to enable the transformation.
 */
export function createLazyLoadImagesPlugin(lazyLoadImages = false): Plugin {
    return (): Transformer => {
        if (!lazyLoadImages) {
            return (tree: Node) => tree;
        }

        return (tree: Node) => {
            visit(tree, 'element', (node: any) => {
                if (node.tagName === 'img') {
                    node.properties = node.properties || {};
                    node.properties.loading = 'lazy';

                    if (node.properties.src) {
                        // Keep the original src so native lazy loading still works.
                        // Duplicate into data-src so IntersectionObserver can still
                        // manage advanced strategies without breaking initial load.
                        node.properties['data-src'] = node.properties.src;
                    }
                }
            });

            return tree;
        };
    };
}

/**
 * Convenience helper to prepare an <img> element for lazy loading.
 * Moves the provided src to data-src and sets loading="lazy".
 *
 * @param img - The image element to modify.
 * @param src - The image URL.
 */
export function prepareLazyImage(img: HTMLImageElement, src: string) {
    if (!img) {
        return;
    }
    img.loading = 'lazy';
    img.dataset.src = src;
    img.removeAttribute('src');
}
