import { FileInfo } from './file.types';
import { getIconForFile } from './icons';
import { getIconFillColorForFile } from './icon-fill-colors';
import { getIconBackgroundColorForFile } from './icon-background-colors';
import {
    getIconBackgroundColor,
    getIconColor,
    getIconName,
} from '../icon/get-icon-props';

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
