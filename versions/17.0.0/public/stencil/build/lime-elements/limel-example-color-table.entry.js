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
    static get style() { return ".grid {\n  display: grid;\n  grid-template-columns: 25rem 25rem 25rem;\n  grid-template-rows: 15rem 15rem 15rem 15rem;\n  grid-gap: 1rem; }\n\n.tile {\n  color: white;\n  text-align: center;\n  line-height: 15rem;\n  border-radius: .3rem; }\n  .tile pre {\n    margin: 0;\n    padding: 0; }"; }
}

export { ColorTableExample as LimelExampleColorTable };
