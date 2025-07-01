import { FileInfo } from '../global/shared-types/file.types';
import { getIconBackgroundColorForFile } from '../components/file/icon-background-colors';
import { getIconFillColorForFile } from '../components/file/icon-fill-colors';
import { getIconForFile } from '../components/file/icons';
import {
    getIconBackgroundColor,
    getIconColor,
    getIconName,
} from '../components/icon/get-icon-props';

/**
 *
 * @param file
 */
export function getFileIcon(file: FileInfo) {
    const name = getIconName(file.icon);

    if (name) {
        return name;
    }

    const extension = getExtension(file);
    if (!extension) {
        return;
    }

    return getIconForFile(extension);
}

/**
 *
 * @param file
 */
export function getFileColor(file: FileInfo) {
    const color = getIconColor(file.icon, file.iconColor);

    if (color) {
        return color;
    }

    const extension = getExtension(file);
    if (!extension) {
        return;
    }

    return getIconFillColorForFile(extension);
}

/**
 *
 * @param file
 */
export function getFileBackgroundColor(file: FileInfo) {
    const backgroundColor = getIconBackgroundColor(
        file.icon,

        file.iconBackgroundColor
    );

    if (backgroundColor) {
        return backgroundColor;
    }

    const extension = getExtension(file);
    if (!extension) {
        return;
    }

    return getIconBackgroundColorForFile(extension);
}

/**
 *
 * @param file
 */
export function getFileExtensionTitle(file: FileInfo) {
    const name = getIconName(file.icon);

    if (name) {
        return name;
    }

    return getExtension(file);
}

/**
 *
 * @param file
 */
export function getExtension(file: FileInfo) {
    if (!file) {
        return;
    }

    return file.filename.split('.').pop();
}
