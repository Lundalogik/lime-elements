/* eslint-disable no-console */
import { createHash } from 'crypto-browserify';
import DOMPurify from 'dompurify';
import fetch from 'node-fetch';

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
];

const MB_SIZE = 5;
const KB_SIZE = 1024;
const MAX_FILE_SIZE = MB_SIZE * KB_SIZE * KB_SIZE;
const TIMEOUT = 10000;

interface SanitizeResult {
    isValid: boolean;
    base64Data?: string;
    mimeType?: string;
    error?: string;
}

export async function sanitizeBase64Image(
    base64String: string,
): Promise<SanitizeResult> {
    try {
        if (!isValidBase64(base64String)) {
            return { isValid: false, error: 'Invalid base64 format' };
        }

        const { mimeType, data } = extractBase64Data(base64String);

        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return {
                isValid: false,
                error: `Unsupported file type: ${mimeType}`,
            };
        }

        const sizeInBytes = calculateBase64Size(data);
        if (sizeInBytes > MAX_FILE_SIZE) {
            return {
                isValid: false,
                error: `File exceeds maximum allowed size (${MB_SIZE}MB)`,
            };
        }

        if (mimeType === 'image/svg+xml') {
            return sanitizeSvg(data);
        }

        return {
            isValid: true,
            base64Data: `data:${mimeType};base64,${data}`,
            mimeType: mimeType,
        };
    } catch (error) {
        console.error('Error sanitizing base64 image:', error);

        return { isValid: false, error: 'Failed to process image' };
    }
}

export async function urlToSanitizedBase64(
    imageUrl: string,
): Promise<SanitizeResult> {
    try {
        const url = new URL(imageUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
            return { isValid: false, error: 'Invalid URL protocol' };
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            TIMEOUT, // 10 second timeout
        );

        const response = await fetch(imageUrl, {
            signal: controller.signal,
            headers: { 'User-Agent': 'YourAppName/1.0' },
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            return {
                isValid: false,
                error: `Failed to fetch image: ${response.status}`,
            };
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !ALLOWED_MIME_TYPES.includes(contentType)) {
            return {
                isValid: false,
                error: `Unsupported file type: ${contentType}`,
            };
        }

        const blob = await response.blob();
        const base64Data = await blobToBase64(blob);

        if (contentType === 'image/svg+xml') {
            const base64Content = base64Data.split(',')[1];

            return sanitizeSvg(base64Content);
        }

        return {
            isValid: true,
            base64Data: base64Data,
            mimeType: contentType,
        };
    } catch (error) {
        console.error('Error converting URL to base64:', error);

        return { isValid: false, error: 'Failed to process image URL' };
    }
}

export async function fileToSanitizedBase64(
    file: File,
): Promise<SanitizeResult> {
    try {
        if (!file.type || !ALLOWED_MIME_TYPES.includes(file.type)) {
            return {
                isValid: false,
                error: `Unsupported file type: ${file.type}`,
            };
        }

        if (file.size > MAX_FILE_SIZE) {
            return {
                isValid: false,
                error: `File exceeds maximum allowed size (${MB_SIZE}MB)`,
            };
        }

        const base64Data = await readFileAsBase64(file);

        if (file.type === 'image/svg+xml') {
            const base64Content = base64Data.split(',')[1];

            return sanitizeSvg(base64Content);
        }

        return {
            isValid: true,
            base64Data: base64Data,
            mimeType: file.type,
        };
    } catch (error) {
        console.error('Error converting file to base64:', error);

        return { isValid: false, error: 'Failed to process image file' };
    }
}

function sanitizeSvg(base64Data: string): SanitizeResult {
    try {
        const svgString = atob(base64Data);

        const sanitizedSvg = DOMPurify.sanitize(svgString, {
            USE_PROFILES: { svg: true, svgFilters: true },
            FORBID_TAGS: ['script', 'style'],
            FORBID_ATTR: [
                'onerror',
                'onload',
                'onclick',
                'onmouseover',
                'onmouseout',
                'onmousemove',
                'onmousedown',
                'onmouseup',
                'onkeydown',
                'onkeypress',
                'onkeyup',
            ],
        });

        const sanitizedBase64 = btoa(sanitizedSvg);

        return {
            isValid: true,
            base64Data: `data:image/svg+xml;base64,${sanitizedBase64}`,
            mimeType: 'image/svg+xml',
        };
    } catch (error) {
        console.error('Error sanitizing SVG:', error);

        return { isValid: false, error: 'Failed to sanitize SVG' };
    }
}

function extractBase64Data(base64String: string): {
    mimeType: string;
    data: string;
} {
    if (base64String.startsWith('data:')) {
        const regex = /^data:([^;]+);base64,(.+)$/;
        const matches = regex.exec(base64String);
        if (!matches) {
            throw new Error('Invalid data URL format');
        }

        return { mimeType: matches[1], data: matches[2] };
    }

    return { mimeType: 'image/png', data: base64String };
}

function isValidBase64(str: string): boolean {
    const regex = /^[A-Za-z0-9+/=]+$/;
    if (str.startsWith('data:')) {
        const data = str.split(',')[1];

        return !!data && regex.test(data);
    }

    return regex.test(str);
}

export function calculateBase64Size(base64String: string): number {
    let paddingCount = 0;
    for (let i = base64String.length - 1; i >= 0; i--) {
        if (base64String[i] === '=') {
            paddingCount++;
        } else {
            break;
        }
    }

    const BASE64_RATIO = 0.75;

    return Math.floor((base64String.length - paddingCount) * BASE64_RATIO);
}

export function generateImageHash(base64Data: string): string {
    return createHash('sha256').update(base64Data).digest('hex');
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert blob to base64'));
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file as base64'));
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}
