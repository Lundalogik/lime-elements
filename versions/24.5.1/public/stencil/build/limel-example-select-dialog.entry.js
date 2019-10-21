import { r as registerInstance, h } from './core-804afdbc.js';

const SelectDialogExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.open = false;
        this.heroOptions = [
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organa', value: 'leia' },
        ];
        this.villainOptions = [
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
        this.handleHeroChange = this.handleHeroChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleVillainChange = this.handleVillainChange.bind(this);
    }
    render() {
        return [
            h("limel-button", { label: "Select characters", primary: true, onClick: this.handleButtonClick }),
            h("limel-dialog", { onClose: this.handleClose, open: this.open }, h("limel-select", { label: "Favorite hero", value: this.heroValue, options: this.heroOptions, onChange: this.handleHeroChange }), h("limel-select", { label: "Loathed villain", value: this.villainValue, options: this.villainOptions, onChange: this.handleVillainChange }), h("limel-icon", { name: "star_wars" }), h("limel-flex-container", { justify: "end", slot: "button" }, h("limel-button", { primary: true, label: "Close", onClick: this.handleClose }))),
            h("p", null, "Favorite hero: ", this.heroValue && this.heroValue.text),
            h("p", null, "Loathed villain: ", this.villainValue && this.villainValue.text),
        ];
    }
    handleHeroChange(event) {
        this.heroValue = event.detail;
    }
    handleVillainChange(event) {
        this.villainValue = event.detail;
    }
    handleButtonClick() {
        this.open = true;
    }
    handleClose() {
        this.open = false;
    }
    static get style() { return "limel-dialog {\n  --dialog-height: 200px;\n}\n\nlimel-icon {\n  height: 300px;\n  width: 300px;\n  color: var(--lime-dark-grey);\n}"; }
};

export { SelectDialogExample as limel_example_select_dialog };
