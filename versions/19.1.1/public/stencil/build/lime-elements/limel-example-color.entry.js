const h = window.LimeElements.h;

class ColorExample {
    render() {
        return [
            h("limel-button", { label: "I'm blue!" }),
            h("br", null),
            h("br", null),
            h("limel-button", { primary: true, label: "Do not press!", style: {
                    '--lime-primary-color': 'var(--lime-red)',
                } }),
            h("br", null),
            h("br", null),
            h("div", { class: "box" }),
        ];
    }
    static get is() { return "limel-example-color"; }
    static get encapsulation() { return "shadow"; }
    static get style() { return "limel-button {\n  --lime-primary-color: var(--lime-blue); }\n\n.box {\n  background-color: var(--lime-green);\n  width: 3.125rem;\n  height: 3.125rem; }"; }
}

export { ColorExample as LimelExampleColor };
