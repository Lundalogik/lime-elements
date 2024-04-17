const DEFAULT_ICON_FILL_COLOR = 'rgb(var(--color-gray-dark))';
const CALENDAR_ICON_FILL_COLOR = 'rgb(var(--color-cyan-dark))';
const EMAIL_ICON_FILL_COLOR = 'rgb(var(--color-gray-dark))';
const HTML_ICON_FILL_COLOR = 'rgb(var(--color-blue-dark))';
const TEXT_ICON_FILL_COLOR = 'rgb(var(--color-yellow-darker))';
const EXCEL_ICON_FILL_COLOR = 'rgb(var(--color-green-dark))';
const POWERPOINT_ICON_FILL_COLOR = 'rgb(var(--color-coral-dark))';
const WORD_ICON_FILL_COLOR = 'rgb(var(--color-sky-dark))';
const IMAGE_ICON_FILL_COLOR = 'rgb(var(--color-lime-dark))';
const VECTOR_GRAPHIC_FILL_COLOR = 'rgb(var(--color-magenta-dark))';
const PRESENTATION_ICON_FILL_COLOR = 'rgb(var(--color-blue-dark))';
const DOCUMENT_ICON_FILL_COLOR = 'rgb(var(--color-orange-dark))';
const SPREADSHEET_ICON_FILL_COLOR = 'rgb(var(--color-green-dark))';
const AUDIO_ICON_FILL_COLOR = 'rgb(var(--color-indigo-dark))';
const VIDEO_ICON_FILL_COLOR = 'rgb(var(--color-red-dark))';
const COMPRESSED_ICON_FILL_COLOR = 'rgb(var(--color-brown-default))';
const MESSAGE_ICON_FILL_COLOR = 'rgb(var(--color-yellow-dark))';
const PDF_ICON_FILL_COLOR = 'rgb(var(--color-red-dark))';
const DATA_ICON_FILL_COLOR = 'rgb(var(--color-glaucous-dark))';

const filetypeFillColorTable: Record<string, string> = {
    // Message
    msg: MESSAGE_ICON_FILL_COLOR,

    // Calendar
    ics: CALENDAR_ICON_FILL_COLOR,
    ical: CALENDAR_ICON_FILL_COLOR,
    icalendar: CALENDAR_ICON_FILL_COLOR,
    ifb: CALENDAR_ICON_FILL_COLOR,

    // Email
    email: EMAIL_ICON_FILL_COLOR,
    eml: EMAIL_ICON_FILL_COLOR,
    oft: EMAIL_ICON_FILL_COLOR,
    ost: EMAIL_ICON_FILL_COLOR,
    emlx: EMAIL_ICON_FILL_COLOR,

    // Web
    html: HTML_ICON_FILL_COLOR,
    xml: HTML_ICON_FILL_COLOR,

    // Editable text
    txt: TEXT_ICON_FILL_COLOR,
    rtf: TEXT_ICON_FILL_COLOR,

    // Editable document
    dot: WORD_ICON_FILL_COLOR,
    doc: WORD_ICON_FILL_COLOR,
    docx: WORD_ICON_FILL_COLOR,
    dotx: WORD_ICON_FILL_COLOR,
    docm: WORD_ICON_FILL_COLOR,
    dotm: WORD_ICON_FILL_COLOR,
    odt: DOCUMENT_ICON_FILL_COLOR,
    pages: DOCUMENT_ICON_FILL_COLOR,

    // Portable document
    pdf: PDF_ICON_FILL_COLOR,

    // Presentation
    ppt: POWERPOINT_ICON_FILL_COLOR,
    pot: POWERPOINT_ICON_FILL_COLOR,
    pps: POWERPOINT_ICON_FILL_COLOR,
    pptx: POWERPOINT_ICON_FILL_COLOR,
    pptm: POWERPOINT_ICON_FILL_COLOR,
    potx: POWERPOINT_ICON_FILL_COLOR,
    potm: POWERPOINT_ICON_FILL_COLOR,
    ppam: POWERPOINT_ICON_FILL_COLOR,
    ppsx: POWERPOINT_ICON_FILL_COLOR,
    ppsm: POWERPOINT_ICON_FILL_COLOR,
    sldx: POWERPOINT_ICON_FILL_COLOR,
    sldm: POWERPOINT_ICON_FILL_COLOR,
    odp: PRESENTATION_ICON_FILL_COLOR,
    key: PRESENTATION_ICON_FILL_COLOR,

    // Spreadsheet
    xls: EXCEL_ICON_FILL_COLOR,
    xlsx: EXCEL_ICON_FILL_COLOR,
    csv: DEFAULT_ICON_FILL_COLOR,
    numbers: SPREADSHEET_ICON_FILL_COLOR,

    // Image
    bmp: IMAGE_ICON_FILL_COLOR,
    jpg: IMAGE_ICON_FILL_COLOR,
    jpeg: IMAGE_ICON_FILL_COLOR,
    heic: IMAGE_ICON_FILL_COLOR,
    png: IMAGE_ICON_FILL_COLOR,
    gif: IMAGE_ICON_FILL_COLOR,

    // Editable image
    psd: PRESENTATION_ICON_FILL_COLOR,
    ai: DOCUMENT_ICON_FILL_COLOR,

    // Vector graphic
    svg: VECTOR_GRAPHIC_FILL_COLOR,
    svgz: VECTOR_GRAPHIC_FILL_COLOR,
    ep: VECTOR_GRAPHIC_FILL_COLOR,
    eps: VECTOR_GRAPHIC_FILL_COLOR,
    sketch: VECTOR_GRAPHIC_FILL_COLOR,

    // Audio
    mp3: AUDIO_ICON_FILL_COLOR,
    wav: AUDIO_ICON_FILL_COLOR,
    wma: AUDIO_ICON_FILL_COLOR,
    ogg: AUDIO_ICON_FILL_COLOR,

    // Video
    flv: VIDEO_ICON_FILL_COLOR,
    h264: VIDEO_ICON_FILL_COLOR,
    mov: VIDEO_ICON_FILL_COLOR,
    mp4: VIDEO_ICON_FILL_COLOR,
    mwv: VIDEO_ICON_FILL_COLOR,

    // Compressed
    zip: COMPRESSED_ICON_FILL_COLOR,
    '7z': COMPRESSED_ICON_FILL_COLOR,
    rar: COMPRESSED_ICON_FILL_COLOR,

    // Data
    json: DATA_ICON_FILL_COLOR,
    yaml: DATA_ICON_FILL_COLOR,
    sql: DATA_ICON_FILL_COLOR,
    db: DATA_ICON_FILL_COLOR,
    dbf: DATA_ICON_FILL_COLOR,
};

/**
 * Takes a file extension as argument and returns the fill color to use.
 * While some file types have a fairly universally accepted icon color, like
 * blue for Word documents, others are more arbitrary. This function provides
 * a convention that we use at Lime. If you are using this code in your own
 * project, you may or may not find this helper useful.
 *
 * @param extension - The file extension (without the dot).
 * @returns The color to use for the icon.
 * @public
 */
export function getIconFillColorForFile(extension: string): string {
    return (
        filetypeFillColorTable[extension.toLowerCase()] ||
        DEFAULT_ICON_FILL_COLOR
    );
}
