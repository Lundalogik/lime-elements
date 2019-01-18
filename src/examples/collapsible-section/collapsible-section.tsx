import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-collapsible-section',
    shadow: true,
})
export class CollapsibleSectionExample {
    @State()
    private secondExampleIsOpen = false;

    @State()
    private percentage = 34;

    public render() {
        return [
            <section>
                <h3>Basic example</h3>
                <limel-collapsible-section header="This text becomes the header">
                    <p>This element becomes the body.</p>
                </limel-collapsible-section>
            </section>,
            <hr />,
            <section>
                <h3>Closing and opening from outside the component</h3>
                <limel-button-group>
                    <limel-button
                        label={'toggle'}
                        primary={true}
                        onClick={this.toggleSecondExample.bind(this)}
                    />
                </limel-button-group>
                <limel-collapsible-section
                    header="Click me or click the button"
                    isOpen={this.secondExampleIsOpen}
                    onOpen={this.secondExampleOnOpen.bind(this)}
                    onClose={this.secondExampleOnClose.bind(this)}
                >
                    <p>
                        Either way, the section will toggle!
                        <limel-slider unit="%" value={this.percentage} />
                    </p>
                </limel-collapsible-section>
            </section>,
        ];
    }

    private toggleSecondExample() {
        this.secondExampleIsOpen = !this.secondExampleIsOpen;
    }

    private secondExampleOnOpen() {
        console.log('Second example opened');
        this.secondExampleIsOpen = true;
    }

    private secondExampleOnClose() {
        console.log('Second example closed');
        this.secondExampleIsOpen = false;
    }
}
