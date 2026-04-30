import { FunctionalComponent, h } from '@stencil/core';
import { Image } from '../global/shared-types/image.types';

interface ImageTemplateProps {
    image: Image;
}

/**
 * Renders an `Image` as a plain `<img>` element. Centralises the
 * attribute forwarding so consumer components do not have to
 * reimplement it. Intended for internal use by lime-elements
 * components that accept an `Image`-shaped prop.
 *
 * @param props
 * @param props.image - the image to render
 * @internal
 */
export const ImageTemplate: FunctionalComponent<ImageTemplateProps> = ({
    image,
}) => {
    return (
        <img
            src={image.src}
            alt={image.alt}
            loading={image.loading ?? 'lazy'}
            referrerPolicy={image.referrerpolicy}
        />
    );
};
