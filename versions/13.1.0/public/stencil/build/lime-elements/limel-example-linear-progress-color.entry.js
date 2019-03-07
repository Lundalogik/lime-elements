const h = window.LimeElements.h;

class LinearProgressExampleColor {
    constructor() {
        this.color = { text: 'lime-blue', value: 'lime-blue' };
        this.value = 0.85;
        this.colors = [
            { text: 'lime-red', value: 'lime-red' },
            { text: 'lime-orange', value: 'lime-orange' },
            { text: 'lime-yellow', value: 'lime-yellow' },
            { text: 'lime-green', value: 'lime-green' },
            { text: 'lime-blue', value: 'lime-blue' },
            { text: 'lime-magenta', value: 'lime-magenta' },
        ];
    }
    render() {
        return [
            h("limel-select", { label: "Color", options: this.colors, value: this.color, onChange: event => {
                    this.color = event.detail;
                } }),
            h("br", null),
            h("limel-linear-progress", { value: this.value, style: {
                    '--lime-primary-color': `var(--${this.color.value})`,
                    '--background-color': 'whitesmoke',
                } }),
        ];
    }
    static get is() { return "limel-example-linear-progress-color"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "state": true
        }
    }; }
}

export { LinearProgressExampleColor as LimelExampleLinearProgressColor };
