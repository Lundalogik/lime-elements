const h = window.LimeElements.h;

class SelectTestWrapper {
    constructor() {
        this.onChangeCalledTimes = 0;
        this.onChange = this.onChange.bind(this);
    }
    render() {
        const props = {};
        if (this.native) {
            props.native = true;
        }
        return (h("limel-select", Object.assign({}, props, { label: "Favourite Doctor", value: this.value, onChange: this.onChange })));
    }
    onChange(event) {
        this.onChangeCalledTimes += 1;
        this.onChangeLastEventDetails = event.detail;
        this.value = event.detail;
    }
    static get is() { return "select-test-wrapper"; }
    static get properties() { return {
        "native": {
            "type": Boolean,
            "attr": "native"
        },
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
