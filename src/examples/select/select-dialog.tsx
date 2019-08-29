import { Component, h, State } from '@stencil/core';
import { Option } from '../../interface';

@Component({
    shadow: true,
    tag: 'limel-example-select-dialog',
    styleUrl: 'select-dialog.scss',
})
export class SelectDialogExample {
    @State()
    public heroValue: Option;

    @State()
    public villainValue: Option;

    @State()
    public open = false;

    private heroOptions: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organa', value: 'leia' },
    ];

    private villainOptions: Option[] = [
        { text: 'BB-9E', value: 'bb-9e' },
        { text: 'Unkar Plutt', value: 'unkar' },
        { text: 'Zam Wessell', value: 'zam' },
        { text: 'Greedo', value: 'greedo' },
        { text: 'Evazan and Baba', value: 'evazan_baba' },
        { text: 'Bossk', value: 'bossk' },
        { text: 'Count Dooku', value: 'dooku' },
        { text: 'Captain Phasma', value: 'phasma' },
        { text: 'Commander Cody', value: 'cody' },
        { text: 'DJ', value: 'dj' },
        { text: 'Supreme Leader Snoke', value: 'snoke' },
        { text: 'Jango Fett', value: 'jango' },
        { text: 'General Grievous', value: 'grievous' },
        { text: 'General Hux', value: 'hux' },
        { text: 'Orson Krennic', value: 'orson' },
        { text: 'Sebulba', value: 'sebulba' },
        { text: 'Boba Fett', value: 'boba' },
        { text: 'Watto', value: 'watto' },
        { text: 'Jar Jar Binks', value: 'jarjar' },
        { text: 'The Sarlacc', value: 'sarlacc' },
        { text: 'Darth Maul', value: 'maul' },
        { text: 'Jabba the Hutt', value: 'jabba' },
        { text: 'Anakin Skywalker', value: 'anakin' },
        { text: 'Grand Moff Tarkin', value: 'tarkin' },
        { text: 'Kylo Ren', value: 'ren' },
        { text: 'Emperor Palpatine', value: 'palpatine' },
        { text: 'Darth Vader', value: 'vader' },
    ];

    constructor() {
        this.handleHeroChange = this.handleHeroChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleVillainChange = this.handleVillainChange.bind(this);
    }

    public render() {
        return [
            <limel-button
                label="Select characters"
                primary={true}
                onClick={this.handleButtonClick}
            />,
            <limel-dialog onClose={this.handleClose} open={this.open}>
                <limel-select
                    label="Favorite hero"
                    value={this.heroValue}
                    options={this.heroOptions}
                    onChange={this.handleHeroChange}
                />
                <limel-select
                    label="Loathed villain"
                    value={this.villainValue}
                    options={this.villainOptions}
                    onChange={this.handleVillainChange}
                />
                <limel-icon name="star_wars" />

                <limel-flex-container justify="end" slot="button">
                    <limel-button
                        primary={true}
                        label="Close"
                        onClick={this.handleClose}
                    />
                </limel-flex-container>
            </limel-dialog>,
            <p>Favorite hero: {this.heroValue && this.heroValue.text}</p>,
            <p>
                Loathed villain: {this.villainValue && this.villainValue.text}
            </p>,
        ];
    }

    private handleHeroChange(event: CustomEvent<Option>) {
        this.heroValue = event.detail;
    }

    private handleVillainChange(event: CustomEvent<Option>) {
        this.villainValue = event.detail;
    }

    private handleButtonClick() {
        this.open = true;
    }

    private handleClose() {
        this.open = false;
    }
}
