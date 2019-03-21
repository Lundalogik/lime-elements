export interface Option<T extends string = string> {
    text: string;
    value: T;
    disabled?: boolean;
}
