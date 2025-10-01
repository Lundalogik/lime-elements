import { Component, h, State } from '@stencil/core';
import {
    Link,
    ListItem,
    WhatsNewChip,
    LimelRadioButtonGroupCustomEvent,
} from '@limetech/lime-elements';
/**
 * This component is only used in our documentations
 * to provide a container for settings of examples.
 *
 * For example, it visually groups and organizes checkboxes
 * used to show different states of components,
 * such as Disabled, Required, Readonly, etc…
 *
 * @private
 */
@Component({
    tag: 'limel-example-whats-new',
    shadow: true,
    styleUrl: 'example-whats-new.scss',
})
export class ExampleWhatsNew {
    @State()
    private readonly: boolean = true;

    link_chip1: Link = {
        href: 'https://lundalogik.github.io/lime-elements/versions/latest/#/component/limel-icon-button/',
        title: 'Go to Component Page',
    };
    link_chip2: Link = {
        href: 'https://lundalogik.github.io/lime-elements/versions/latest/#/component/limel-radio-button-group/',
        title: 'Go to Component Page',
    };
    link_chip3: Link = {
        href: 'https://lundalogik.github.io/lime-elements/versions/latest/#/component/limel-slider/',
        title: 'Go to Component Page',
    };
    link_chip4: Link = {
        href: 'https://lundalogik.github.io/lime-elements/versions/latest/#/component/limel-chip/',
        title: 'Go to Component Page',
    };
    link_chip5: Link = {
        href: 'https://lundalogik.github.io/lime-elements/versions/latest/#/component/limel-collapsible-section/',
        title: 'Go to Component Page',
    };
    link_chip6: Link = {
        href: 'https://lundalogik.github.io/lime-elements/versions/latest/#/component/limel-text-editor/',
        title: 'Go to Component Page',
    };
    link_chip7: Link = {
        href: 'https://lundalogik.github.io/lime-elements/versions/latest/#/component/limel-card/',
        title: 'Go to Component Page',
    };

    @State()
    private selectedItem: ListItem<string>;

    private items: Array<ListItem<string>> = [
        {
            text: 'Sunny',
            value: 'weather_sunny',
            icon: { name: 'sun', color: 'rgb(var(--color-orange-default))' },
        },
        {
            text: 'Partly Cloudy',
            value: 'weather_partly_cloudy',
            selected: true,
            icon: {
                name: 'partly_cloudy_day',
                color: 'rgb(var(--color-gray-default))',
            },
        },
        {
            text: 'Rainy',
            value: 'weather_rainy',
            icon: { name: 'rain', color: 'rgb(var(--color-blue-default))' },
        },
    ];

    private listItems: Array<ListItem<number>> = [
        {
            text: 'Lucy Chyzhova',
            secondaryText: 'UX Designer',
            value: 1,

            image: {
                src: 'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png',
                alt: 'A picture of Lucy Chyzhova, UX designer at Lime Technologies',
            },
        },
        {
            text: 'Kiarokh Moattar',
            secondaryText: 'Product Designer',
            value: 2,

            image: {
                src: 'https://lundalogik.github.io/lime-elements/2e86c284-d190-4c41-8da2-4de50103a0cd.png',
                alt: 'A picture of Kiarokh Moattar, Product Designer at Lime Technologies',
            },
        },
        {
            text: 'Adrian Schmidt',
            secondaryText: 'Engineer',
            value: 3,
            icon: 'viking_helmet',
            image: {
                src: 'https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png',
                alt: 'A picture of Adrian Schmidt, Head of Smooth Operations at Lime Technologies',
            },
        },
    ];
    public componentWillLoad() {
        this.selectedItem = this.items.find((item) => item.selected);
    }
    @State()
    private isFavorite = false;
    @State()
    private value = 25;

    private minValue = 0;
    private maxValue = 100;

    public render() {
        const icon = {
            name: '-lime-logo-elements',
            color: 'rgb(var(--color-green-default))',
        };

        return (
            <div class="thumbnails-grid">
                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="Icon Button Styling"
                    description="Using the Icon interface, you can easily customize the appearance of icons within the button, tweaking its color, backgroundColor, or adding an accessible title to it."
                    chips={
                        [
                            { text: 'Icon Button', link: this.link_chip1 },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-icon-button
                        slot="demo"
                        elevated={true}
                        label={this.getLabel()}
                        icon={this.getIcon()}
                        onClick={this.toggleFavorite}
                    />
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="Radio Button Group"
                    description="The Radio Button component lets users choose a single option from multiple choices, supporting icons and badge styling."
                    chips={
                        [
                            {
                                text: 'Radio Button Group',
                                link: this.link_chip2,
                            },
                            {
                                text: 'New Component',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-radio-button-group
                        slot="demo"
                        items={this.items}
                        selectedItem={this.selectedItem}
                        badgeIcons={true}
                        onChange={this.handleRadioButtonChange}
                    />
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="Slider Indications"
                    description="Indicate that the current value of the slider is required or invalid."
                    chips={
                        [
                            { text: 'Slider', link: this.link_chip3 },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-slider
                        slot="demo"
                        label="Basic slider"
                        unit=" %"
                        value={this.value}
                        valuemax={this.maxValue}
                        valuemin={this.minValue}
                        onChange={this.handleSliderChange}
                        required={true}
                        invalid={true}
                    />
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="Chip Size"
                    description="When the size property is set to small, the chip will render with a smaller height and gap."
                    chips={
                        [
                            { text: 'Chip', link: this.link_chip4 },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-chip slot="demo" text="Small Chip" size="small" />
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="Header Icon"
                    description="Icon to display in the header of the section."
                    chips={
                        [
                            {
                                text: 'Collapsible Section',
                                link: this.link_chip5,
                            },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-collapsible-section
                        slot="demo"
                        header="Header"
                        icon="ok"
                    >
                        <p>Body</p>
                    </limel-collapsible-section>
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="Readonly Border"
                    description="In readonly state, the border color of the chip can be customized, using --chip-readonly-border-color."
                    chips={
                        [
                            {
                                text: 'Chip',
                                link: this.link_chip4,
                            },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-chip
                        slot="demo"
                        text="Delivered"
                        icon={icon}
                        readonly={true}
                    />
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="Loading State"
                    description="Setting the loading to true puts the component in the loading state, and renders an indeterminate progress indicator inside the chip."
                    chips={
                        [
                            {
                                text: 'Chip',
                                link: this.link_chip4,
                            },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-chip
                        slot="demo"
                        text="Loading"
                        icon={icon}
                        loading={true}
                    />
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="With custom component in the header"
                    description="By using the slot=header attribute on a custom UI elements, you can place it in the header area of the collapsible section alongside the default header text and header actions. This can enable richer header content, like status indicators, badges, or icons."
                    chips={
                        [
                            {
                                text: 'Collapsible Section',
                                link: this.link_chip5,
                            },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-collapsible-section
                        slot="demo"
                        header="This section has custom content in the header"
                    >
                        <limel-circular-progress
                            // style={style}
                            slot="header"
                            value={65}
                            size="x-small"
                        />
                        <p>This element becomes the body.</p>
                    </limel-collapsible-section>
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="3D Tilt Effect"
                    description="Added interactive 3D tilt effect on hover"
                    chips={
                        [
                            {
                                text: 'Card',
                                link: this.link_chip7,
                            },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-card
                        slot="demo"
                        icon={icon}
                        heading="Lime Elements"
                        subheading="World's best component library"
                        value="Enterprise class design system, written in typescript, empowering developers & designers to build _modern_ and _flexible_ web applications."
                    />
                </limel-whats-new-card>

                <limel-whats-new-card
                    class="thumbnail-card-link"
                    heading="List with Pictures"
                    description="Add pictures to the list items"
                    chips={
                        [
                            {
                                text: 'Card',
                                link: this.link_chip7,
                            },
                            {
                                text: 'New Property',
                                readonly: this.readonly,
                            },
                        ] as WhatsNewChip[]
                    }
                >
                    <limel-list slot="demo" items={this.listItems} />
                </limel-whats-new-card>
            </div>
        );
    }
    private handleRadioButtonChange = (
        event: LimelRadioButtonGroupCustomEvent<ListItem<string>>
    ) => {
        const item = event.detail;
        this.selectedItem = item.selected === false ? undefined : item;
    };
    private getLabel() {
        return this.isFavorite ? 'Remove Favorite' : 'Add Favorite';
    }

    private getIcon() {
        const defaultIcon = 'heart_outlined';
        const toggledIcon = {
            name: 'heart_filled',
            color: 'rgb(var(--color-red-default))',
        };
        return this.isFavorite ? toggledIcon : defaultIcon;
    }

    private toggleFavorite = () => {
        this.isFavorite = !this.isFavorite;
    };
    private handleSliderChange = (event: CustomEvent<number>) => {
        this.value = event.detail;
    };
}
