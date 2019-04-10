const h = window.LimeElements.h;

class SpinnerExample {
    render() {
        return [
            h("limel-spinner", null),
            h("limel-spinner", { size: "mini" }),
            h("limel-spinner", { size: "x-small" }),
            h("limel-spinner", { size: "small" }),
            h("limel-spinner", { size: "medium" }),
            h("limel-spinner", { size: "large" }),
        ];
    }
    static get is() { return "limel-example-spinner"; }
    static get encapsulation() { return "shadow"; }
}

export { SpinnerExample as LimelExampleSpinner };
