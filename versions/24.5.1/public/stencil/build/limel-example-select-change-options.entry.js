import { r as registerInstance, h } from './core-804afdbc.js';

const SelectExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.disabled = false;
        this.currentOptionGroup = 0;
        this.optionGroups = [
            [
                { text: 'Luke Skywalker', value: 'luke' },
                { text: 'Han Solo', value: 'han' },
                { text: 'Leia Organo', value: 'leia' },
            ],
            [
                { text: '', value: '' },
                { text: 'Homer Simpson', value: 'homer' },
                { text: 'Moe Szyslak', value: 'moe' },
                { text: 'Ned Flanders', value: 'ned' },
            ],
            [
                { text: '', value: '', disabled: true },
                { text: 'Bart Simpson', value: 'bart' },
                { text: 'Ned Flanders', value: 'ned' },
            ],
            [
                { text: 'David Tennant', value: '10' },
                { text: 'Matt Smith', value: '11' },
                { text: 'Peter Capaldi', value: '12' },
                { text: 'Jodie Witthaker', value: '13' },
            ],
            [],
        ];
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.changeOptionsGroup = this.changeOptionsGroup.bind(this);
    }
    render() {
        return (h("section", null, h("limel-select", { label: "Favorite hero", value: this.value, options: this.optionGroups[this.currentOptionGroup], disabled: this.disabled, onChange: this.onChange }), h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-button", { label: this.disabled ? 'Enable' : 'Disable', onClick: this.toggleEnabled }), h("limel-button", { label: "Change Options", onClick: this.changeOptionsGroup }))), h("p", null, "Value: ", JSON.stringify(this.value)), h("p", null, "Currently showing option group:", ' ', this.currentOptionGroup + 1, " / ", this.optionGroups.length)));
    }
    onChange(event) {
        this.value = event.detail;
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    changeOptionsGroup() {
        this.currentOptionGroup =
            (this.currentOptionGroup + 1) % this.optionGroups.length;
    }
    static get style() { return "p {\n  font-size: small;\n}"; }
};

export { SelectExample as limel_example_select_change_options };
