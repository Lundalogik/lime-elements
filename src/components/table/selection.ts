/**
 * Contains changes made to a selection
 */
export interface SelectionChangeSet {
    /**
     * Tells whether the items were selected or deselected
     */
    selected: boolean;
    /**
     * Gets the affected items
     */
    items: any[];
    /**
     * Gets the indexes of the affected items
     */
    indexes: number[];
}

/**
 * Contains a set of selected data objects with methods for adding and removing
 * items to the selection by referring to them by their index/position.
 * Maintains a memory of the last toggled item which can be used to select or
 * deselect a range of items between the last toggled item and a given item.
 */
export class Selection {
    private selectedItems: Set<any>;
    private lastToggledIndex: number;

    /**
     * Creates an instance of the Selection class.
     * The provided function `getDataByIndex` is used to provide data for the
     * selected items when selection is toggled by using the item index,
     * which can be the row position in a table.
     *
     * @param getDataByIndex - A function that returns the data at the given index
     */
    constructor(private getDataByIndex: (index: number) => any) {
        this.clear();
    }

    /**
     * @returns The size of the selection
     */
    get size(): number {
        return this.selectedItems.size;
    }

    /**
     * @returns The selected items
     */
    get items(): any[] {
        return Array.from(this.selectedItems);
    }

    /**
     * @param items - The selected items
     */
    set items(items: any[]) {
        this.selectedItems = new Set(items);
        this.lastToggledIndex = -1;
    }

    /**
     * Checks whether the given item exist in the selection
     *
     * @param data - The data to look up
     * @returns `true` if the given data exist in the selection, otherwise `false`
     */
    public has(data: any) {
        return this.selectedItems.has(data);
    }

    /**
     * Toggles the item at the given index in the selection
     *
     * @param index - The index of the item to toggle
     * @returns The changes made to the selection
     */
    public toggleSelection(index: number): SelectionChangeSet {
        return this.toggleRange(index, index);
    }

    /**
     * Toggles the items from the last toggled index to the given index in the selection.
     * The toggled items will be toggled as the item at the given index no matter
     * their current state in the selection.
     * Initially, when no last toggled index exist, this function behaves like
     * `toggleSelection`.
     *
     * @param index - The index of the item to toggle
     * @returns The changes made to the selection
     */
    public toggleSelectionFromLastIndex(index: number): SelectionChangeSet {
        if (this.lastToggledIndex < 0) {
            return this.toggleSelection(index);
        }

        return this.toggleRange(this.lastToggledIndex, index);
    }

    /**
     * Clears the current selection and resets last toggled index
     */
    public clear() {
        this.selectedItems = new Set();
        this.lastToggledIndex = -1;
    }

    private toggleRange = (
        fromIndex: number,
        toIndex: number,
    ): SelectionChangeSet => {
        const select = !this.selectedItems.has(this.getDataByIndex(toIndex));

        const lowerBound = Math.min(fromIndex, toIndex);
        const upperBound = Math.max(fromIndex, toIndex);
        const updatedIndexes = [];
        const updatedItems = [];
        for (let index = lowerBound; index <= upperBound; index++) {
            const data = this.getDataByIndex(index);

            if (!data) {
                continue;
            }

            const isSelected = this.selectedItems.has(data);

            if (isSelected === select) {
                continue;
            }

            if (select) {
                this.selectedItems.add(data);
            } else {
                this.selectedItems.delete(data);
            }

            updatedIndexes.push(index);
            updatedItems.push(data);
        }

        this.lastToggledIndex = toIndex;

        return {
            selected: select,
            items: updatedItems,
            indexes: updatedIndexes,
        };
    };
}
