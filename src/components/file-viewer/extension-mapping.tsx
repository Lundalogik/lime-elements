export function detectExtension(fileName, url): any {
    const pathLike = fileName || url;
    if (!pathLike) {
        return 'unknown';
    }

    const extension = pathLike.split('.').pop().toLowerCase();
    const extensionsToTypes = {
        pdf: 'pdf',
        jpg: 'image',
        jpeg: 'image',
        heic: 'image',
        bmp: 'image',
        png: 'image',
        gif: 'image',
        svg: 'image',
        svgz: 'image',
        ep: 'image',
        eps: 'image',
        avi: 'video',
        flv: 'video',
        h264: 'video',
        mov: 'video',
        mp4: 'video',
        mwv: 'video',
        mkv: 'video',
        mp3: 'audio',
        wav: 'audio',
        wma: 'audio',
        ogg: 'audio',
        txt: 'text',
        json: 'text',
        html: 'text',
        xml: 'text',
        // Word
        doc: 'office',
        docx: 'office',
        odt: 'office',
        dot: 'office',
        dotx: 'office',
        docm: 'office', // not supported
        dotm: 'office', // not yet tested
        // Presentation
        pot: 'office', // not tested
        ppt: 'office',
        pptx: 'office',
        odp: 'office',
        potx: 'office', // not supported
        potm: 'office', // not supported
        pps: 'office',
        ppsx: 'office',
        ppsm: 'office', // not supported
        pptm: 'office', // not supported
        ppam: 'office', // not tested
        pages: 'office', // not supported (Apple)
        // Spreadsheet
        xls: 'office',
        xlsx: 'office',
        xlsm: 'office',
        xlsb: 'office',
        ods: 'office',
        csv: 'office', // not supported
        numbers: 'office', // not supported (Apple)
    };

    return extensionsToTypes[extension] || 'unknown';
}
