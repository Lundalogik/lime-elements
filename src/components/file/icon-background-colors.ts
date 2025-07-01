const DEFAULT_ICON_BACKGROUND_COLOR = 'rgba(var(--color-gray-lighter), 0.4)';
const CALENDAR_ICON_BACKGROUND_COLOR = 'rgba(var(--color-cyan-lighter), 0.4)';
const EMAIL_ICON_BACKGROUND_COLOR = 'rgba(var(--color-gray-lighter), 0.4)';
const HTML_ICON_BACKGROUND_COLOR = 'rgba(var(--color-blue-lighter), 0.4)';
const TEXT_ICON_BACKGROUND_COLOR = 'rgba(var(--color-yellow-lighter), 0.4)';
const EXCEL_ICON_BACKGROUND_COLOR = 'rgba(var(--color-green-lighter), 0.4)';
const POWERPOINT_ICON_BACKGROUND_COLOR =
    'rgba(var(--color-coral-lighter), 0.4)';
const WORD_ICON_BACKGROUND_COLOR = 'rgba(var(--color-sky-lighter), 0.4)';
const IMAGE_ICON_BACKGROUND_COLOR = 'rgba(var(--color-lime-lighter), 0.4)';
const VECTOR_GRAPHIC_ICON_BACKGROUND_COLOR =
    'rgba(var(--color-magenta-lighter), 0.4)';
const PRESENTATION_BACKGROUND_COLOR = 'rgba(var(--color-blue-lighter), 0.4)';
const DOCUMENT_ICON_BACKGROUND_COLOR = 'rgba(var(--color-orange-lighter), 0.4)';
const SPREADSHEET_ICON_BACKGROUND_COLOR =
    'rgba(var(--color-green-lighter), 0.4)';
const AUDIO_ICON_BACKGROUND_COLOR = 'rgba(var(--color-indigo-lighter), 0.4)';
const VIDEO_ICON_BACKGROUND_COLOR = 'rgba(var(--color-red-lighter), 0.4)';
const COMPRESSED_ICON_BACKGROUND_COLOR =
    'rgba(var(--color-orange-lighter), 0.4)';
const MESSAGE_ICON_BACKGROUND_COLOR = 'rgba(var(--color-yellow-lighter), 0.4)';
const PDF_ICON_BACKGROUND_COLOR = 'rgba(var(--color-red-lighter), 0.4)';
const DATA_ICON_BACKGROUND_COLOR = 'rgba(var(--color-glaucous-lighter), 0.4)';

const filetypeBackgroundColorTable: Record<string, string> = {
    // Message
    msg: MESSAGE_ICON_BACKGROUND_COLOR,

    // Calendar
    ics: CALENDAR_ICON_BACKGROUND_COLOR,
    ical: CALENDAR_ICON_BACKGROUND_COLOR,
    icalendar: CALENDAR_ICON_BACKGROUND_COLOR,

    // Email
    ifb: CALENDAR_ICON_BACKGROUND_COLOR,
    email: EMAIL_ICON_BACKGROUND_COLOR,
    eml: EMAIL_ICON_BACKGROUND_COLOR,
    oft: EMAIL_ICON_BACKGROUND_COLOR,
    ost: EMAIL_ICON_BACKGROUND_COLOR,
    emlx: EMAIL_ICON_BACKGROUND_COLOR,

    // Web
    html: HTML_ICON_BACKGROUND_COLOR,
    xml: HTML_ICON_BACKGROUND_COLOR,

    // Editable text
    txt: TEXT_ICON_BACKGROUND_COLOR,
    rtf: TEXT_ICON_BACKGROUND_COLOR,

    // Editable document
    dot: WORD_ICON_BACKGROUND_COLOR,
    doc: WORD_ICON_BACKGROUND_COLOR,
    docx: WORD_ICON_BACKGROUND_COLOR,
    dotx: WORD_ICON_BACKGROUND_COLOR,
    docm: WORD_ICON_BACKGROUND_COLOR,
    dotm: WORD_ICON_BACKGROUND_COLOR,
    odt: DOCUMENT_ICON_BACKGROUND_COLOR,
    pages: DOCUMENT_ICON_BACKGROUND_COLOR,

    // Portable document
    pdf: PDF_ICON_BACKGROUND_COLOR,

    // Presentation
    ppt: POWERPOINT_ICON_BACKGROUND_COLOR,
    pot: POWERPOINT_ICON_BACKGROUND_COLOR,
    pps: POWERPOINT_ICON_BACKGROUND_COLOR,
    pptx: POWERPOINT_ICON_BACKGROUND_COLOR,
    pptm: POWERPOINT_ICON_BACKGROUND_COLOR,
    potx: POWERPOINT_ICON_BACKGROUND_COLOR,
    potm: POWERPOINT_ICON_BACKGROUND_COLOR,
    ppam: POWERPOINT_ICON_BACKGROUND_COLOR,
    ppsx: POWERPOINT_ICON_BACKGROUND_COLOR,
    ppsm: POWERPOINT_ICON_BACKGROUND_COLOR,
    sldx: POWERPOINT_ICON_BACKGROUND_COLOR,
    sldm: POWERPOINT_ICON_BACKGROUND_COLOR,
    odp: PRESENTATION_BACKGROUND_COLOR,
    key: PRESENTATION_BACKGROUND_COLOR,

    // Spreadsheet
    xls: EXCEL_ICON_BACKGROUND_COLOR,
    xlsx: EXCEL_ICON_BACKGROUND_COLOR,
    csv: DEFAULT_ICON_BACKGROUND_COLOR,
    numbers: SPREADSHEET_ICON_BACKGROUND_COLOR,

    // Image
    bmp: IMAGE_ICON_BACKGROUND_COLOR,
    jpg: IMAGE_ICON_BACKGROUND_COLOR,
    jpeg: IMAGE_ICON_BACKGROUND_COLOR,
    heic: IMAGE_ICON_BACKGROUND_COLOR,
    png: IMAGE_ICON_BACKGROUND_COLOR,
    gif: IMAGE_ICON_BACKGROUND_COLOR,

    // Editable image
    psd: PRESENTATION_BACKGROUND_COLOR,
    ai: DOCUMENT_ICON_BACKGROUND_COLOR,

    // Vector graphic
    svg: VECTOR_GRAPHIC_ICON_BACKGROUND_COLOR,
    svgz: VECTOR_GRAPHIC_ICON_BACKGROUND_COLOR,
    ep: VECTOR_GRAPHIC_ICON_BACKGROUND_COLOR,
    eps: VECTOR_GRAPHIC_ICON_BACKGROUND_COLOR,
    sketch: VECTOR_GRAPHIC_ICON_BACKGROUND_COLOR,

    // Audio
    mp3: AUDIO_ICON_BACKGROUND_COLOR,
    wav: AUDIO_ICON_BACKGROUND_COLOR,
    wma: AUDIO_ICON_BACKGROUND_COLOR,
    ogg: AUDIO_ICON_BACKGROUND_COLOR,

    // Video
    flv: VIDEO_ICON_BACKGROUND_COLOR,
    h264: VIDEO_ICON_BACKGROUND_COLOR,
    mov: VIDEO_ICON_BACKGROUND_COLOR,
    mp4: VIDEO_ICON_BACKGROUND_COLOR,
    mwv: VIDEO_ICON_BACKGROUND_COLOR,

    // Compressed:
    zip: COMPRESSED_ICON_BACKGROUND_COLOR,
    '7z': COMPRESSED_ICON_BACKGROUND_COLOR,
    rar: COMPRESSED_ICON_BACKGROUND_COLOR,

    // Data
    json: DATA_ICON_BACKGROUND_COLOR,
    yaml: DATA_ICON_BACKGROUND_COLOR,
    sql: DATA_ICON_BACKGROUND_COLOR,
    db: DATA_ICON_BACKGROUND_COLOR,
    dbf: DATA_ICON_BACKGROUND_COLOR,
};

/**
 *
 * @param extension
 */
export function getIconBackgroundColorForFile(extension: string): string {
    return (
        filetypeBackgroundColorTable[extension.toLowerCase()] ||
        DEFAULT_ICON_BACKGROUND_COLOR
    );
}
