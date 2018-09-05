export interface ListItem {
    text: string;
    secondaryText?: string;
    disabled?: boolean;
    [data: string]: any;
}

export interface ListSeparator {
    separator: true;
}
