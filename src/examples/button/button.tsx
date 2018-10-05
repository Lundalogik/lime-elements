import { Component, Element } from '@stencil/core';

@Component({
    tag: 'limel-example-button',
    shadow: true,
})
export class ButtonExample {
    @Element()
    private hostElement: HTMLElement;

    private buttonWithClickHandler;

    public componentDidLoad() {
        this.buttonWithClickHandler = this.hostElement.shadowRoot.querySelector(
            '#buttonWithClickHandler'
        );
    }

    public render() {
        return [
            <section>
                <h3>Default</h3>
                <p>
                    <limel-button label="Primary" primary={true} />
                </p>
                <p>
                    <limel-button label="Secondary" />
                </p>
            </section>,
            <section>
                <h3>Disabled</h3>
                <p>
                    <limel-button
                        label="Primary"
                        primary={true}
                        disabled={true}
                    />
                </p>
                <p>
                    <limel-button label="Secondary" disabled={true} />
                </p>
            </section>,
            <section>
                <h3>Loading</h3>
                <p>
                    <limel-button
                        label="Primary"
                        primary={true}
                        loading={true}
                    />
                </p>
                <p>
                    <limel-button label="Secondary" loading={true} />
                </p>
            </section>,
            <section>
                <h3>Disabled &amp; loading</h3>
                <p>
                    <limel-button
                        label="Primary"
                        primary={true}
                        disabled={true}
                        loading={true}
                    />
                </p>
                <p>
                    <limel-button
                        label="Secondary"
                        disabled={true}
                        loading={true}
                    />
                </p>
            </section>,
            <section>
                <h3>With click handler</h3>
                <p>
                    The click handler in this example sets the attributes{' '}
                    <code>loading</code> and <code>disabled</code> to{' '}
                    <code>true</code>. After 1 second, the <code>loading</code>{' '}
                    attribute is set to <code>false</code> again. After another
                    4 seconds, the button is once again enabled.
                </p>
                <p>
                    When the <code>loading</code> attribute changes from{' '}
                    <code>true</code> to <code>false</code>, the button
                    automatically displays a checkmark icon for 2 seconds. Note
                    that our click handler isn't actually involved in this.
                </p>
                <p>
                    <limel-button
                        id="buttonWithClickHandler"
                        label="Click me!"
                        primary={true}
                        onClick={() => {
                            this.onClick();
                        }}
                    />
                </p>
            </section>,
        ];
    }

    private onClick() {
        const button = this.buttonWithClickHandler;
        button.setAttribute('disabled', 'true');
        button.setAttribute('loading', 'true');

        const TIME_LOADING = 1000;
        const TIME_DISABLED = 4000;
        setTimeout(() => {
            button.setAttribute('loading', 'false');
            setTimeout(() => {
                button.setAttribute('disabled', 'false');
            }, TIME_DISABLED);
        }, TIME_LOADING);
    }
}
