const h = window.LimeElements.h;

class LinearProgressExampleIndeterminate {
    render() {
        return h("limel-linear-progress", { indeterminate: true });
    }
    static get is() { return "limel-example-linear-progress-indeterminate"; }
    static get encapsulation() { return "shadow"; }
}

export { LinearProgressExampleIndeterminate as LimelExampleLinearProgressIndeterminate };
