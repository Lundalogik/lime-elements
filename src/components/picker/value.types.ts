/**
 * The type of the value that the picker can handle
 * @public
 */
export type PickerValue =
    | number
    | string
    | { id: string | number; [key: string]: any };
