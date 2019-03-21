const h = window.LimeElements.h;

class FlexContainerExample {
    constructor() {
        this.directionOptions = [
            {
                text: 'Horizontal',
                value: 'horizontal',
            },
            {
                text: 'Vertical',
                value: 'vertical',
            },
        ];
        this.alignOptions = [
            {
                value: 'start',
                text: 'Start',
            },
            {
                value: 'center',
                text: 'Center',
            },
            {
                value: 'end',
                text: 'End',
            },
            {
                value: 'stretch',
                text: 'Stretch',
            },
        ];
        this.justifyOptions = [
            {
                value: 'start',
                text: 'Start',
            },
            {
                value: 'center',
                text: 'Center',
            },
            {
                value: 'end',
                text: 'End',
            },
            {
                value: 'space-around',
                text: 'Space around',
            },
            {
                value: 'space-between',
                text: 'Space between',
            },
            {
                value: 'space-evenly',
                text: 'Space evenly',
            },
        ];
        this.reverse = false;
    }
    componentWillLoad() {
        this.direction = this.directionOptions[0];
        this.align = this.alignOptions[0];
        this.justify = this.justifyOptions[0];
    }
    render() {
        return [
            h("limel-flex-container", { justify: "space-between" },
                h("limel-select", { label: "Direction", options: this.directionOptions, value: this.direction, onChange: (event) => {
                        this.direction = event.detail;
                    } }),
                h("limel-select", { label: "Align", options: this.alignOptions, value: this.align, onChange: (event) => {
                        this.align = event.detail;
                    } }),
                h("limel-select", { label: "Justify", options: this.justifyOptions, value: this.justify, onChange: (event) => {
                        this.justify = event.detail;
                    } }),
                h("limel-checkbox", { label: "Reverse", checked: this.reverse, onChange: (event) => {
                        this.reverse = event.detail;
                    } })),
            h("limel-flex-container", { class: "container", direction: this.direction.value, align: this.align.value, justify: this.justify.value, reverse: this.reverse },
                h("div", null, "1"),
                h("div", null, "2"),
                h("div", null, "3"),
                h("div", null, "4"),
                h("div", null, "5")),
        ];
    }
    static get is() { return "limel-example-flex-container"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "align": {
            "state": true
        },
        "direction": {
            "state": true
        },
        "justify": {
            "state": true
        },
        "reverse": {
            "state": true
        }
    }; }
    static get style() { return "limel-flex-container {\n  margin-bottom: 2rem; }\n  limel-flex-container.container {\n    height: 60rem;\n    border: 0.1rem solid var(--lime-dark-grey);\n    border-radius: 0.3rem; }\n  limel-flex-container div {\n    display: block;\n    padding: 2.5rem 5rem;\n    text-align: center;\n    color: white;\n    font-size: 2rem;\n    line-height: 0; }\n    limel-flex-container div:nth-child(1) {\n      background-color: var(--lime-red);\n      padding: 1.25rem 5rem; }\n    limel-flex-container div:nth-child(2) {\n      background-color: var(--lime-orange);\n      padding: 5rem; }\n    limel-flex-container div:nth-child(3) {\n      background-color: var(--lime-green); }\n    limel-flex-container div:nth-child(4) {\n      background-color: var(--lime-blue);\n      padding: 2.5rem 10rem; }\n    limel-flex-container div:nth-child(5) {\n      background-color: var(--lime-magenta);\n      padding: 2.5rem; }"; }
}

export { FlexContainerExample as LimelExampleFlexContainer };
