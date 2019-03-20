import { Component, State } from '@stencil/core';
import {
    FlexContainerAlign,
    FlexContainerDirection,
    FlexContainerJustify,
} from '../../components/flex-container/flex-container';
import { Option } from '../../components/select/option';

@Component({
    tag: 'limel-example-flex-container',
    shadow: true,
    styleUrl: 'flex-container.scss',
})
export class FlexContainerExample {
    private directionOptions: Array<Option<FlexContainerDirection>> = [
        {
            text: 'Horizontal',
            value: 'horizontal',
        },
        {
            text: 'Vertical',
            value: 'vertical',
        },
    ];

    private alignOptions: Array<Option<FlexContainerAlign>> = [
        {
            value: 'start',
            text: 'Start',
        },
        {
            value: 'center',
            text: 'Center',
        },
        {
            value: 'end',
            text: 'End',
        },
        {
            value: 'stretch',
            text: 'Stretch',
        },
    ];

    private justifyOptions: Array<Option<FlexContainerJustify>> = [
        {
            value: 'start',
            text: 'Start',
        },
        {
            value: 'center',
            text: 'Center',
        },
        {
            value: 'end',
            text: 'End',
        },
        {
            value: 'space-around',
            text: 'Space around',
        },
        {
            value: 'space-between',
            text: 'Space between',
        },
        {
            value: 'space-evenly',
            text: 'Space evenly',
        },
    ];

    @State()
    private direction: Option<FlexContainerDirection>;

    @State()
    private align: Option<FlexContainerAlign>;

    @State()
    private justify: Option<FlexContainerJustify>;

    @State()
    private reverse = false;

    public componentWillLoad() {
        this.direction = this.directionOptions[0];
        this.align = this.alignOptions[0];
        this.justify = this.justifyOptions[0];
    }

    public render() {
        return [
            <limel-flex-container justify="space-between">
                <limel-select
                    label="Direction"
                    options={this.directionOptions}
                    value={this.direction}
                    onChange={(
                        event: CustomEvent<Option<FlexContainerDirection>>
                    ) => {
                        this.direction = event.detail;
                    }}
                />
                <limel-select
                    label="Align"
                    options={this.alignOptions}
                    value={this.align}
                    onChange={(
                        event: CustomEvent<Option<FlexContainerAlign>>
                    ) => {
                        this.align = event.detail;
                    }}
                />
                <limel-select
                    label="Justify"
                    options={this.justifyOptions}
                    value={this.justify}
                    onChange={(
                        event: CustomEvent<Option<FlexContainerJustify>>
                    ) => {
                        this.justify = event.detail;
                    }}
                />
                <limel-checkbox
                    label="Reverse"
                    checked={this.reverse}
                    onChange={(event: CustomEvent<boolean>) => {
                        this.reverse = event.detail;
                    }}
                />
            </limel-flex-container>,
            <limel-flex-container
                class="container"
                direction={this.direction.value}
                align={this.align.value}
                justify={this.justify.value}
                reverse={this.reverse}
            >
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
            </limel-flex-container>,
        ];
    }
}
