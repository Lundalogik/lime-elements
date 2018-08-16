export interface ListItem {
    text: string;
    secondaryText?: string;
    icon?: string;
    [data: string]: any;
}

export interface ListSeparator {
    separator: true;
}
