import { FunctionalComponent, h } from '@stencil/core';
import { Image } from '../global/shared-types/image.types';

interface ImageTemplateProps {
    image: Image;

    /**
     * Inline styles to set on the rendered `<img>`, e.g. to drive
     * `object-fit` through a custom property.
     */
    style?: { [key: string]: string | undefined };

    /**
     * Handler invoked when the image fails to load (the `<img>`
     * `error` event), letting the host react to a broken or blocked
     * source.
     */
    onError?: (event: Event) => void;
}

/**
 * Renders an `Image` as a plain `<img>` element. Centralises the
 * attribute forwarding so consumer components do not have to
 * reimplement it. Optional `style` and `onError` are
 * forwarded to the element for consumers that also need to control
 * its presentation or react to load failures. Intended for internal
 * use by lime-elements components that accept an `Image`-shaped prop.
 *
 * @param props
 * @param props.image - the image to render
 * @param props.style - inline styles for the `<img>`
 * @param props.onError - handler for the `<img>` `error` event
 * @internal
 */
export const ImageTemplate: FunctionalComponent<ImageTemplateProps> = ({
    image,
    style,
    onError,
}) => {
    return (
        <img
            src={image.src}
            alt={image.alt}
            loading={image.loading ?? 'lazy'}
            referrerPolicy={image.referrerpolicy}
            style={style}
            onError={onError}
        />
    );
};
