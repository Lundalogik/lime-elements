const DEFAULT_ICON = 'file';
const CALENDAR_ICON = 'tear_off_calendar';
const EMAIL_ICON = 'email';
const HTML_ICON = 'internet';
const TEXT_ICON = 'text_box';
const EXCEL_ICON = 'ms_excel_copyrighted';
const WORD_ICON = 'ms_word_copyrighted';
const POWERPOINT_ICON = 'ms_powerpoint_copyrighted';
const IMAGE_ICON = 'picture';
const PHOTO_ICON = 'camera';
const VECTOR_GRAPHIC_ICON = 'vector';
const PRESENTATION_ICON = 'presentation_filled';
const DOCUMENT_ICON = 'overview_pages_2';
const SPREADSHEET_ICON = 'data_sheet';
const AUDIO_ICON = 'audio_wave';
const VIDEO_ICON = 'video_file';
const COMPRESSED_ICON = 'condom_package';
const MESSAGE_ICON = 'ms_outlook_copyrighted';
const DATA_ICON = 'database';

const filetypeIconTable: Record<string, string> = {
    // Message
    msg: MESSAGE_ICON,

    // Calendar
    ics: CALENDAR_ICON,
    ical: CALENDAR_ICON,
    icalendar: CALENDAR_ICON,
    ifb: CALENDAR_ICON,

    // Email
    email: EMAIL_ICON,
    eml: EMAIL_ICON,
    oft: EMAIL_ICON,
    ost: EMAIL_ICON,
    emlx: EMAIL_ICON,

    // Web
    html: HTML_ICON,
    xml: HTML_ICON,

    // Editable text
    txt: TEXT_ICON,
    rtf: TEXT_ICON,

    // Editable document
    dot: WORD_ICON,
    doc: WORD_ICON,
    docx: WORD_ICON,
    dotx: WORD_ICON,
    docm: WORD_ICON,
    dotm: WORD_ICON,
    odt: DOCUMENT_ICON,
    pages: DOCUMENT_ICON,

    // Portable document
    pdf: 'PDF_2',

    // Presentation
    ppt: POWERPOINT_ICON,
    pot: POWERPOINT_ICON,
    pps: POWERPOINT_ICON,
    pptx: POWERPOINT_ICON,
    pptm: POWERPOINT_ICON,
    potx: POWERPOINT_ICON,
    potm: POWERPOINT_ICON,
    ppam: POWERPOINT_ICON,
    ppsx: POWERPOINT_ICON,
    ppsm: POWERPOINT_ICON,
    sldx: POWERPOINT_ICON,
    sldm: POWERPOINT_ICON,
    odp: PRESENTATION_ICON,
    key: PRESENTATION_ICON,

    // Spreadsheet
    xls: EXCEL_ICON,
    xlsx: EXCEL_ICON,
    csv: SPREADSHEET_ICON,
    numbers: SPREADSHEET_ICON,

    // Image
    jpg: PHOTO_ICON,
    jpeg: PHOTO_ICON,
    heic: PHOTO_ICON,
    bmp: IMAGE_ICON,
    png: IMAGE_ICON,
    gif: IMAGE_ICON,

    // Editable image
    psd: 'adobe_photoshop_copyrighted',
    ai: 'adobe_illustrator_copyrighted',

    // Vector graphic
    svg: VECTOR_GRAPHIC_ICON,
    svgz: VECTOR_GRAPHIC_ICON,
    ep: VECTOR_GRAPHIC_ICON,
    eps: VECTOR_GRAPHIC_ICON,
    sketch: VECTOR_GRAPHIC_ICON,

    // Audio
    mp3: AUDIO_ICON,
    wav: AUDIO_ICON,
    wma: AUDIO_ICON,
    ogg: AUDIO_ICON,

    // Video
    avi: VIDEO_ICON,
    flv: VIDEO_ICON,
    h264: VIDEO_ICON,
    mov: VIDEO_ICON,
    mp4: VIDEO_ICON,
    mwv: VIDEO_ICON,

    // Compressed
    zip: COMPRESSED_ICON,
    '7z': COMPRESSED_ICON,
    rar: COMPRESSED_ICON,

    // Data
    json: 'json',
    yaml: DATA_ICON,
    sql: DATA_ICON,
    db: DATA_ICON,
    dbf: DATA_ICON,
};

/**
 *
 * @param extension
 */
export function getIconForFile(extension: string): string {
    return filetypeIconTable[extension.toLowerCase()] || DEFAULT_ICON;
}
