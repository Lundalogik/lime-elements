import { FileInfo } from '../global/shared-types/file.types';
import {
    getFileBackgroundColor,
    getFileColor,
    getFileExtensionTitle,
    getFileIcon,
} from './file-metadata';

/**
 *
 * @param file
 */
export function createFileInfo(file: File): FileInfo {
    const limeFile: FileInfo = {
        id: crypto.randomUUID(),
        filename: file.name,
        contentType: file.type,
        size: file.size,
        fileContent: file,
    };
    limeFile.icon = {
        name: getFileIcon(limeFile),
        title: getFileExtensionTitle(limeFile),
        color: getFileColor(limeFile),
        backgroundColor: getFileBackgroundColor(limeFile),
    };

    return limeFile;
}

/**
 *
 * @param file
 * @param accept
 */
export function isTypeAccepted(file: FileInfo, accept?: string): boolean {
    if (accept === undefined || accept === '*') {
        return true;
    }

    const acceptList = accept.split(',').map((raw) => raw.trim());

    return acceptList.some((acceptedType: string) => {
        if (acceptedType === file.contentType) {
            return true;
        }

        if (acceptedType.endsWith('/*')) {
            const baseType = acceptedType.split('/')[0];

            return file.contentType.startsWith(`${baseType}/`);
        }

        if (acceptedType.startsWith('.')) {
            const fileType = acceptedType.split('.')[1];

            return file.contentType.endsWith(`/${fileType}`);
        }
    });
}
