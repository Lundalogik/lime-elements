import { Component, h, State } from '@stencil/core';

/**
 * Example of the highlight color menu component
 */
@Component({
    tag: 'limel-example-highlight-color-menu',
    shadow: true,
})
export class HighlightColorMenuExample {
    @State()
    private color: string = 'rgb(var(--color-yellow-light))';

    @State()
    private isOpen: boolean = false;

    public render() {
        return [
            <div>
                <limel-button
                    label="Open Highlight Color Menu"
                    onClick={this.openMenu}
                />
                <p>Selected color: {this.color}</p>
                <p>
                    <strong>Instructions:</strong> Click the colored square
                    button to open the color palette with 100 visual color
                    swatches!
                </p>
            </div>,
            <limel-text-editor-highlight-color-menu
                color={this.color}
                isOpen={this.isOpen}
                onColorChange={this.handleColorChange}
                onCancel={this.handleCancel}
                onSave={this.handleSave}
            />,
        ];
    }

    private openMenu = () => {
        this.isOpen = true;
    };

    private handleColorChange = (event: CustomEvent<string>) => {
        this.color = event.detail;
    };

    private handleCancel = () => {
        this.isOpen = false;
    };

    private handleSave = () => {
        this.isOpen = false;
        console.log('Selected highlight color:', this.color);
    };
}
