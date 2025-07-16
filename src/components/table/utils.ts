import { isEqual } from 'lodash-es';
import { RowData } from './table.types';

export const areRowsEqual = (newData: RowData[], oldData: RowData[]) => {
    // Ensures table updates when a user modifies row content and triggers a refresh,
    // catching edits even if IDs and order remain the same.
    if (newData.length !== oldData.length) {
        return false;
    }

    return newData.every((newItem, index) => isEqual(newItem, oldData[index]));
};
