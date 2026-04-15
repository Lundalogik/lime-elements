import {
    Chip,
    LimelChipSetCustomEvent,
    Option,
    JSX,
    LimelSelectCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import { ENTER } from '../../../util/keycodes';

type ChipSetType = Exclude<JSX.LimelChipSet['type'], undefined>;

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
 *
 * :::note
 * Marking individual chips as `invalid` does **not** automatically set
 * the invalid state of the chip-set as a whole. The consumer is
 * responsible for deciding whether the field itself should be
 * considered invalid, and for setting the chip-set-level `invalid` prop
 * accordingly. This gives the consumer full control over the
 * validity of the field.
 * :::
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

    @State()
    private selectedInputType?: Option<ChipSetType>;

    private inputTypeOptions?: Array<Option<ChipSetType>>;

    constructor() {
        this.value = [
            this.createChip('alice@example.com'),
            this.createChip('invalid-email@address'),
            this.createChip('bob@example.com'),
        ];
    }

    public componentWillLoad() {
        this.inputTypeOptions = [
            { text: 'Input', value: 'input' },
            { text: 'Choice', value: 'choice' },
            { text: 'Filter', value: 'filter' },
        ];
        this.selectedInputType = this.inputTypeOptions[0];
    }

    public render() {
        return (
            <Host>
                <limel-chip-set
                    type={this.selectedInputType?.value}
                    label="Recipients"
                    helperText="Type an email address and press Enter. Invalid entries are flagged on the chip."
                    searchLabel="Type an email address"
                    value={this.value}
                    onChange={this.handleChange}
                    onInput={this.handleInput}
                    onKeyUp={this.onKeyUp}
                />
                <limel-example-controls
                    style={{ '--example-controls-max-columns-width': '9rem' }}
                >
                    <limel-select
                        label="Chip set type"
                        value={this.selectedInputType}
                        options={this.inputTypeOptions}
                        onChange={this.handleInputTypeChange}
                    />
                </limel-example-controls>
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleInputTypeChange = (
        event: LimelSelectCustomEvent<Option<ChipSetType>>
    ) => {
        this.selectedInputType = event.detail;
        this.value = this.value.map((chip) => {
            chip.selected = false;
            return chip;
        });
    };

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

    private handleChange = (event: LimelChipSetCustomEvent<Chip | Chip[]>) => {
        if (Array.isArray(event.detail)) {
            this.value = event.detail;
        } else {
            const interactedChip = event.detail as Chip;

            if (this.selectedInputType?.value === 'filter') {
                this.value = this.value.map((chip) => {
                    if (chip.id === interactedChip.id) {
                        return interactedChip;
                    }

                    return chip;
                });
            } else if (this.selectedInputType?.value === 'choice') {
                this.value = this.value.map((chip) => {
                    if (chip.id === interactedChip.id) {
                        return interactedChip;
                    }

                    return { ...chip, selected: false };
                });
            }
        }
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
