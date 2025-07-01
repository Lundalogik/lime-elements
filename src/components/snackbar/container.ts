/**
 * Container to keep track of all snackbar elements that gets added to the page.
 * When an element gets added or removed, the container will emit a
 * `changeOffset` event on all elements in the container, letting them know
 * the new offset to where they should position themselves.
 */
export class SnackbarContainer {
    private snackbarElements: HTMLLimelSnackbarElement[] = [];

    /**
     * Add a new element to the container
     *
     * @param snackbar - element to add
     */
    public add(snackbar: HTMLLimelSnackbarElement) {
        const popover = this.getPopover(snackbar);

        // @ts-expect-error Stencil does not seem to recognise the existance of showPopover
        popover?.showPopover();

        this.snackbarElements = [snackbar, ...this.snackbarElements];
        this.emitOffsets();
    }

    /**
     * Remove an element from the container
     *
     * @param snackbar - element to remove
     */
    public remove(snackbar: HTMLLimelSnackbarElement): void {
        const popover = this.getPopover(snackbar);

        // @ts-expect-error Stencil does not seem to recognise the existance of hidePopover
        popover?.hidePopover();

        this.snackbarElements = this.snackbarElements.filter(
            (item) => item !== snackbar
        );
        this.emitOffsets();
    }

    private emitOffsets() {
        let offset = 0;
        for (const snackbar of this.snackbarElements) {
            snackbar.dispatchEvent(
                new CustomEvent('changeOffset', {
                    detail: offset,
                })
            );
            offset += this.getPopover(snackbar).getBoundingClientRect().height;
        }
    }

    private getPopover(snackbar: HTMLLimelSnackbarElement) {
        return snackbar.shadowRoot.querySelector('[popover]');
    }
}
