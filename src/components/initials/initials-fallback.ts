import { Image } from '../../global/shared-types/image.types';
import { hasImageFailed } from '../../util/failed-images';
import { getInitials } from './get-initials';
import { InitialsName } from './initials.types';

/**
 * Returns whether `initials` give any letters to show.
 *
 * @param initials - the name to read the initials from
 * @internal
 */
export function hasInitials(initials?: InitialsName): boolean {
    return !!initials && !!getInitials(initials.name, initials.nameType);
}

/**
 * Returns whether `initials` are shown instead of `image`, because the image
 * has failed to load before.
 *
 * @param image - the picture to show
 * @param initials - the name to read the initials from
 * @internal
 */
export function initialsReplaceImage(
    image: Image,
    initials?: InitialsName
): boolean {
    return hasImageFailed(image.src) && hasInitials(initials);
}
