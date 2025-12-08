import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Select multiple values
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-multiple',
})
export class SelectMultipleExample {
    @State()
    public value: Option[] = [];

    @State()
    public disabled = false;

    @State()
    public readonly = false;

    @State()
    public required = false;

    private options: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Obi-Wan Kenobi', value: 'Obi-Wan' },
        { text: 'Yoda', value: 'Yoda' },
        { text: 'Rey', value: 'Rey' },
        { text: 'Leia Organa', value: 'leia4' },
        { text: 'Ahsoka Tano', value: 'ahsoka' },
        { text: 'Finn', value: 'finn' },
        { text: 'Poe Dameron', value: 'poe' },
        { text: 'Chewbacca', value: 'chewbacca' },
        { text: 'Mace Windu', value: 'mace' },
        { text: 'Jyn Erso', value: 'jyn' },
        { text: 'Qui-Gon Jinn', value: 'qui-gon' },
        { text: 'Lando Calrissian', value: 'lando' },
        { text: 'Ezra Bridger', value: 'ezra' },
        { text: 'Padmé Amidala', value: 'padme' },
        { text: 'C-3PO', value: 'c-3po' },
        { text: 'R2-D2', value: 'r2-d2' },
        { text: 'Aayla Secura', value: 'aayla' },
        { text: 'Kit Fisto', value: 'kit' },
        { text: 'Captain Rex', value: 'rex' },
        { text: 'Sabine Wren', value: 'sabine' },
        { text: 'Hera Syndulla', value: 'hera' },
        { text: 'Kanan Jarrus', value: 'kanan' },
        { text: 'Bodhi Rook', value: 'bodhi' },
    ];

    public render() {
        return [
            <limel-select
                label="Favorite heroes"
                value={this.value}
                options={this.options}
                disabled={this.disabled}
                readonly={this.readonly}
                required={this.required}
                onChange={this.handleChange}
                multiple={true}
            />,
            <limel-example-controls>
                <limel-switch
                    value={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-switch
                    value={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
                <limel-switch
                    value={this.required}
                    label="Required"
                    onChange={this.setRequired}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: LimelSelectCustomEvent<Option[]>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };
}
