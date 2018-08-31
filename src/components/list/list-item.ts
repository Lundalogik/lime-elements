export interface ListItem {
    text: string;
    secondaryText?: string;
    [data: string]: any;
}

export interface ListSeparator {
    separator: true;
}
