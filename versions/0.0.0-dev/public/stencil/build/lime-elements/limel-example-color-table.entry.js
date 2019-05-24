const h = window.LimeElements.h;

class ColorTableExample {
    constructor() {
        this.colors = [
            'lime-deep-red',
            'lime-red',
            'lime-orange',
            'lime-yellow',
            'lime-green',
            'lime-turquoise',
            'lime-blue',
            'lime-dark-blue',
            'lime-magenta',
            'lime-light-grey',
            'lime-dark-grey',
        ];
    }
    render() {
        return h("div", { class: "grid" }, this.colors.map(this.renderColorTile));
    }
    renderColorTile(color) {
        return (h("div", { class: "tile", style: {
                backgroundColor: `var(--${color})`,
            } },
            h("pre", null,
                "--",
                color)));
    }
    static get is() { return "limel-example-color-table"; }
    static get encapsulation() { return "shadow"; }
    static get style() { return ".grid {\n  display: grid;\n  grid-template-columns: 15.625rem 15.625rem 15.625rem;\n  grid-template-rows: 9.375rem 9.375rem 9.375rem 9.375rem;\n  grid-gap: 0.625rem;\n}\n\n.tile {\n  color: white;\n  text-align: center;\n  line-height: 9.375rem;\n  border-radius: 0.1875rem;\n}\n.tile pre {\n  margin: 0;\n  padding: 0;\n}"; }
}

export { ColorTableExample as LimelExampleColorTable };
