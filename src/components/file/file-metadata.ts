import { FileInfo } from '../../interface';
import { getIconForFile } from './icons';
import { getIconFillColorForFile } from './icon-fill-colors';
import { getIconBackgroundColorForFile } from './icon-background-colors';

export function getFileIcon(file: FileInfo) {
    if (file?.icon) {
        return file.icon;
    }

    const extension = getExtension(file);
    if (!extension) {
        return;
    }

    return getIconForFile(extension);
}

export function getFileColor(file: FileInfo) {
    if (file?.iconColor) {
        return file.iconColor;
    }

    const extension = getExtension(file);
    if (!extension) {
        return;
    }

    return getIconFillColorForFile(extension);
}

export function getFileBackgroundColor(file: FileInfo) {
    if (file?.iconBackgroundColor) {
        return file.iconBackgroundColor;
    }

    const extension = getExtension(file);
    if (!extension) {
        return;
    }

    return getIconBackgroundColorForFile(extension);
}

export function getFileExtensionTitle(file: FileInfo) {
    if (file?.icon) {
        return file.icon;
    }

    return getExtension(file);
}

export function getExtension(file: FileInfo) {
    if (!file) {
        return;
    }

    return file.filename.split('.').pop();
}
