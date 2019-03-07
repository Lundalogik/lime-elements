const h = window.LimeElements.h;

class SelectExample {
    constructor() {
        this.preselectedValue = { text: 'Leia Organo', value: 'leia' };
        this.disabled = false;
        this.optionGroup = 0;
        this.basicOptions = [
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ];
        this.initallyEmptyOptions = [
            { text: '', value: '' },
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ];
        this.initallyEmptyRequiredOptions = [
            { text: '', value: '', disabled: true },
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ];
        this.preselectedOptions = [
            { text: '', value: '' },
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ];
        this.toggleOptions = [
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
    }
    render() {
        return [
            h("section", null,
                h("h3", null, "Basic Usage"),
                h("limel-select", { options: this.basicOptions, value: this.basicValue, label: "Favorite hero", onChange: event => {
                        this.basicValue = event.detail;
                    } }),
                h("p", null,
                    "Value: ",
                    JSON.stringify(this.basicValue))),
            h("section", null,
                h("h3", null, "Initially Empty"),
                h("limel-select", { options: this.initallyEmptyOptions, value: this.initallyEmptyValue, label: "Favorite hero", onChange: event => {
                        this.initallyEmptyValue = event.detail;
                    } }),
                h("p", null,
                    "Value: ",
                    JSON.stringify(this.initallyEmptyValue))),
            h("section", null,
                h("h3", null, "Initially Empty but the Empty Option Cannot be Selected"),
                h("limel-select", { options: this.initallyEmptyRequiredOptions, value: this.initallyEmptyRequiredValue, label: "Favorite hero", onChange: event => {
                        this.initallyEmptyRequiredValue = event.detail;
                    } }),
                h("p", null,
                    "Value: ",
                    JSON.stringify(this.initallyEmptyRequiredValue))),
            h("section", null,
                h("h3", null, "Specific value pre-selected"),
                h("limel-select", { options: this.preselectedOptions, value: this.preselectedValue, label: "Favorite hero", onChange: event => {
                        this.preselectedValue = event.detail;
                    } }),
                h("p", null,
                    "Value: ",
                    JSON.stringify(this.preselectedValue))),
            h("section", null,
                h("h3", null, "Changing Available Options"),
                h("limel-button-group", null,
                    h("limel-button", { primary: true, onClick: () => {
                            this.disabled = !this.disabled;
                        }, label: this.disabled ? 'Enable' : 'Disable' }),
                    h("limel-button", { primary: true, onClick: () => {
                            this.optionGroup =
                                (this.optionGroup + 1) %
                                    this.toggleOptions.length;
                        }, label: "Toggle options" })),
                h("limel-select", { options: this.toggleOptions[this.optionGroup], value: this.toggleValue, disabled: this.disabled, label: "Favorite hero", onChange: event => {
                        this.toggleValue = event.detail;
                    } }),
                h("p", null,
                    "Value: ",
                    JSON.stringify(this.toggleValue)),
                h("p", null,
                    "Currently showing option group: ",
                    this.optionGroup + 1,
                    " /",
                    ' ',
                    this.toggleOptions.length)),
            h("hr", null),
            h("p", null,
                "When importing Option, see",
                ' ',
                h("a", { href: "/lime-elements/usage#import-statements" }, "Usage")),
        ];
    }
    static get is() { return "limel-example-select"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "basicValue": {
            "state": true
        },
        "disabled": {
            "state": true
        },
        "initallyEmptyRequiredValue": {
            "state": true
        },
        "initallyEmptyValue": {
            "state": true
        },
        "optionGroup": {
            "state": true
        },
        "preselectedValue": {
            "state": true
        },
        "toggleValue": {
            "state": true
        }
    }; }
}

export { SelectExample as LimelExampleSelect };
