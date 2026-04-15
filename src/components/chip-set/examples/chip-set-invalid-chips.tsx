import { Chip, LimelChipSetCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { ENTER } from '../../../util/keycodes';

/**
 * Per-chip invalid state
 *
 * Set `invalid: true` on any chip in the `value` array to mark that
 * specific chip as invalid. This is independent of the chip-set-level
 * `invalid` prop, which is intended for signalling that the whole field
 * is invalid. Per-chip `invalid` lets the consumer flag individual
 * entries, for example an address that fails validation in a list of
 * recipients.
 *
 * In this example, each entry is checked with a simple email regex when
 * added. Invalid entries are rendered with `invalid: true` and an error
 * icon.
 */
@Component({
    tag: 'limel-example-chip-set-invalid-chips',
    shadow: true,
})
export class ChipSetInvalidChipsExample {
    @State()
    private value: Chip[];

    @State()
    private textValue = '';

    constructor() {
        this.value = [
            this.createChip('alice@example.com'),
            this.createChip('not-an-email'),
            this.createChip('bob@example.com'),
        ];
    }

    public render() {
        return [
            <limel-chip-set
                type="input"
                label="Recipients"
                helperText="Type an email address and press Enter. Invalid entries are flagged on the chip."
                searchLabel="Type an email address"
                value={this.value}
                onChange={this.handleChange}
                onInput={this.handleInput}
                onKeyUp={this.onKeyUp}
            />,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleInput = (
        event: LimelChipSetCustomEvent<string> | InputEvent
    ) => {
        if (event instanceof CustomEvent) {
            this.textValue = event.detail;
        }
    };

    private onKeyUp = (event: KeyboardEvent) => {
        if (event.key === ENTER && this.textValue.trim()) {
            this.value = [
                ...this.value,
                this.createChip(this.textValue.trim()),
            ];
            this.textValue = '';
        }
    };

    private handleChange = (event: LimelChipSetCustomEvent<Chip[]>) => {
        this.value = event.detail;
    };

    private createChip = (text: string): Chip => {
        const isValid = this.looksLikeEmail(text);

        return {
            id: text,
            text: text,
            removable: true,
            invalid: !isValid,
            ...(!isValid && { icon: 'error' }),
        };
    };

    private looksLikeEmail = (text: string): boolean => {
        const atIndex = text.indexOf('@');
        if (atIndex <= 0 || atIndex === text.length - 1) {
            return false;
        }

        const domain = text.slice(atIndex + 1);

        return domain.includes('.') && !/\s/.test(text);
    };
}
