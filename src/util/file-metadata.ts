import { FileInfo } from '../global/shared-types/file.types';
import { getIconBackgroundColorForFile } from '../components/file/icon-background-colors';
import { getIconFillColorForFile } from '../components/file/icon-fill-colors';
import { getIconForFile } from '../components/file/icons';
import {
    getIconBackgroundColor,
    getIconColor,
    getIconName,
} from '../components/icon/get-icon-props';

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

export function getFileColor(file: FileInfo) {
    // eslint-disable-next-line sonarjs/deprecation
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

export function getFileBackgroundColor(file: FileInfo) {
    const backgroundColor = getIconBackgroundColor(
        file.icon,
        // eslint-disable-next-line sonarjs/deprecation
        file.iconBackgroundColor,
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

export function getFileExtensionTitle(file: FileInfo) {
    const name = getIconName(file.icon);

    if (name) {
        return name;
    }

    return getExtension(file);
}

export function getExtension(file: FileInfo) {
    if (!file) {
        return;
    }

    return file.filename.split('.').pop();
}
