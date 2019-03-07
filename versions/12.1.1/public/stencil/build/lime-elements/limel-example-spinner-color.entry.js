const h = window.LimeElements.h;

class SpinnerColorExample {
    render() {
        return [
            h("limel-spinner", { style: { color: 'orange' } }),
            h("div", { style: { color: 'blue' } },
                h("limel-spinner", null)),
        ];
    }
    static get is() { return "limel-example-spinner-color"; }
    static get encapsulation() { return "shadow"; }
}

export { SpinnerColorExample as LimelExampleSpinnerColor };
