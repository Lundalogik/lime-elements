import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import { ActionBarItem } from '../../action-bar/action-bar.types';
import { ListSeparator } from '../../list/list-item.types';
import { createRandomString } from '../../../util/random-string';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../../util/make-enter-clickable';
import { getIconColor, getIconName } from '../../icon/get-icon-props';

/**
 * @private
 */
@Component({
    tag: 'limel-action-bar-item',
    shadow: false,
    styleUrl: 'action-bar-item.scss',
})
export class ActionBarButton {
    /**
     * Item that is placed in the action bar.
     */
    @Prop()
    public item!: ActionBarItem | ListSeparator;

    /**
     * Fired when a action bar item has been clicked.
     * @public
     */
    @Event()
    public select: EventEmitter<ActionBarItem | ListSeparator>;

    /**
     * When the item is displayed in the available width,
     * this will be `false`.
     */
    @Prop({ reflect: true })
    public isVisible: boolean = true;

    /**
     * When the item is selected, this will be `true`.
     */
    @Prop({ reflect: true })
    public selected: boolean = false;

    @Element()
    private readonly host: HTMLLimelActionBarItemElement;

    /**
     * Used to attach the right tooltip to the right button
     */
    private readonly tooltipId: string;

    constructor() {
        this.tooltipId = createRandomString();
    }

    public componentWillLoad() {
        makeEnterClickable(this.host);
    }

    public componentDidLoad() {
        this.triggerIconColorWarning();
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
    }

    public render() {
        if (!this.isItem(this.item) && this.item.separator) {
            return <hr />;
        }

        return (
            <button
                id={this.tooltipId}
                type="button"
                onClick={this.handleClick}
                disabled={this.isDisabled()}
                class={{
                    'is-selected': this.isItem(this.item) && this.item.selected,
                }}
            >
                {this.renderIcon()}
                {this.renderLabel()}
                {this.renderTooltip()}
            </button>
        );
    }

    private readonly handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.select.emit(this.item);
    };

    private isItem(item: ActionBarItem | ListSeparator): item is ActionBarItem {
        return !('separator' in item);
    }

    private isDisabled() {
        if (this.isItem(this.item) && this.item.disabled) {
            return true;
        }

        if (!this.isVisible) {
            return true;
        }
    }

    private renderIcon() {
        if (this.isItem(this.item) && !this.item.icon) {
            return;
        }

        if ('icon' in this.item) {
            const name = getIconName(this.item.icon);
            const color = getIconColor(this.item.icon, this.item.iconColor);

            return (
                <limel-icon
                    name={name}
                    style={{
                        '--action-bar-item-icon-color': `${color}`,
                    }}
                />
            );
        }
    }

    private renderLabel() {
        if (!this.isItem(this.item) || this.item.iconOnly) {
            return;
        }

        return <span class="text">{this.item.text}</span>;
    }

    private renderTooltip() {
        if (!this.isItem(this.item)) {
            return;
        }

        if (this.item.text) {
            return (
                <limel-tooltip
                    elementId={this.tooltipId}
                    label={this.item.text}
                    helperLabel={this.item.commandText}
                />
            );
        }

        if (this.item.commandText) {
            return (
                <limel-tooltip
                    elementId={this.tooltipId}
                    label={this.item.commandText}
                />
            );
        }
    }

    private triggerIconColorWarning() {
        if (this.isItem(this.item) && this.item.iconColor) {
            /* eslint-disable-next-line no-console */
            console.warn(
                "The `iconColor` prop is deprecated now! Use the new `Icon` interface and instead of `iconColor: 'color-name'` write `icon {name: 'icon-name', color: 'color-name'}`.",
            );
        }
    }
}
