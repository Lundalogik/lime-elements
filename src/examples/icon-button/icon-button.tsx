import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-icon-button',
    shadow: true,
})
export class IconButtonExample {
    @State()
    private isFavorite = false;

    public render() {
        return [
            <section>
                <h3>Basic Usage</h3>
                <p>
                    <limel-icon-button
                        label="Add favourite"
                        icon="heart_outlined"
                    />
                </p>
            </section>,
            <section>
                <h3>Toggle State</h3>
                <p>
                    <limel-icon-button
                        label={
                            this.isFavorite ? 'Remove favorite' : 'Add favorite'
                        }
                        icon={
                            this.isFavorite
                                ? 'heart_filled'
                                : 'heart_outlined'
                        }
                        onClick={() => {
                            this.isFavorite = !this.isFavorite;
                        }}
                    />
                </p>
            </section>,
            <section>
                <h3>Disabled</h3>
                <p>
                    <limel-icon-button
                        label="Add favourite"
                        icon="heart_outlined"
                        disabled={true}
                    />
                </p>
            </section>,
        ];
    }
}
