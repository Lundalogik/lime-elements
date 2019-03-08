const h = window.LimeElements.h;

class SelectTestWrapper {
    constructor() {
        this.onChangeCalledTimes = 0;
    }
    render() {
        return (h("limel-select", { label: "Favourite Doctor", value: this.value, onChange: event => {
                this.onChange(event);
            } }));
    }
    onChange(event) {
        this.onChangeCalledTimes += 1;
        this.onChangeLastEventDetails = event.detail;
        this.value = event.detail;
    }
    static get is() { return "select-test-wrapper"; }
    static get properties() { return {
        "onChangeCalledTimes": {
            "type": Number,
            "attr": "on-change-called-times",
            "mutable": true
        },
        "onChangeLastEventDetails": {
            "type": String,
            "attr": "on-change-last-event-details",
            "mutable": true
        },
        "value": {
            "type": "Any",
            "attr": "value",
            "mutable": true
        }
    }; }
}

export { SelectTestWrapper };
