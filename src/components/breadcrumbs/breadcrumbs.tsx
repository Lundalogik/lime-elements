import {
    Component,
    Element,
    h,
    Event,
    EventEmitter,
    Prop,
} from '@stencil/core';
import { BreadcrumbsItem } from './breadcrumbs.types';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import { createRandomString } from '../../util/random-string';
import { getIconColor, getIconName } from '../icon/get-icon-props';

/**
 * A Breadcrumb consists of a list of distinct "places" that a user has gone through,
 * before ending up where they are right now, in a website or an application.
 *
 * These "places" can be for example _pages_ of a website, which are hierarchically
 * laid out before the current page that the user is looking at.
 * They could also be _steps_ which the user has gone through, which perhaps have no
 * hierarchical relation with each other, but has eventually led the user "here".
 *
 * :::note
 * - Where the user currently is, is always the last step of the breadcrumb.
 * - A breadcrumbs never shows where users can go after this place.
 * It only illustrates where user has been before ending up here.
 * If the path that a user can take is not changing and if next steps are clear,
 * you can use the [Progress flow component](#/component/limel-progress-flow) instead.
 * :::
 *
 * Breadcrumbs are often placed horizontally before the main content of the current screen.
 *
 * @exampleComponent limel-example-breadcrumbs-links
 * @exampleComponent limel-example-breadcrumbs-buttons
 * @exampleComponent limel-example-breadcrumbs-icons
 * @exampleComponent limel-example-breadcrumbs-divider
 * @exampleComponent limel-example-breadcrumbs-icon-color
 * @exampleComponent limel-example-breadcrumbs-styling
 */

@Component({
    tag: 'limel-breadcrumbs',
    shadow: true,
    styleUrl: 'breadcrumbs.scss',
})
export class Breadcrumbs {
    /**
     * List of items in the breadcrumbs,
     * each representing a step or a page.
     */
    @Prop()
    public items: BreadcrumbsItem[];

    /**
     * The visual divider that separates items.
     * It must be a single character such as `-` or `,`.
     */
    @Prop()
    public divider: string = '›';

    /**
     * Fired when clicking on buttons (not links!)
     * inside the breadcrumbs.
     */
    @Event()
    public select: EventEmitter<BreadcrumbsItem>;

    @Element()
    private host: HTMLLimelBreadcrumbsElement;

    public render() {
        return (
            <ol
                role="navigation"
                aria-label="Breadcrumb"
                style={{ '--limel-breadcrumbs-divider': `'${this.divider}'` }}
            >
                {this.renderSteps()}
                {this.renderLastStep()}
            </ol>
        );
    }

    public componentWillLoad() {
        makeEnterClickable(this.host);
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
    }

    private renderSteps = () => {
        const allStepsWithoutLast = this.items.slice(0, -1);

        if (this.areItemsLinks(this.items)) {
            return allStepsWithoutLast.map(this.renderAsLink);
        }

        return allStepsWithoutLast.map(this.renderAsButton);
    };

    private renderAsButton = (item: BreadcrumbsItem) => {
        const tooltipId = createRandomString();

        return [
            <button
                role="listitem"
                id={tooltipId}
                class="step"
                onClick={this.handleClick(item)}
            >
                {this.renderIcon(item)}
                {this.renderLabel(item)}
            </button>,
            this.renderTooltip(item, tooltipId),
        ];
    };

    private renderAsLink = (item: BreadcrumbsItem) => {
        const tooltipId = createRandomString();

        return [
            <a
                role="listitem"
                id={tooltipId}
                class="step"
                href={item.link.href}
                title={item.link.title}
            >
                {this.renderIcon(item)}
                {this.renderLabel(item)}
            </a>,
            this.renderTooltip(item, tooltipId),
        ];
    };

    private renderLastStep = () => {
        const lastItem = this.items.slice(-1);

        return (
            <li
                class="last step"
                tabindex="-1"
                aria-current={this.areItemsLinks(this.items) ? 'page' : 'step'}
            >
                {this.renderIcon(lastItem[0])}
                <span class="text">{lastItem[0].text}</span>
            </li>
        );
    };

    private renderIcon = (item: BreadcrumbsItem) => {
        const name = getIconName(item.icon);
        const color = getIconColor(item.icon);

        if (!name) {
            return;
        }

        return (
            <limel-icon
                style={{
                    color: `${color}`,
                }}
                name={name}
            />
        );
    };

    private renderLabel = (item: BreadcrumbsItem) => {
        if (item.type === 'icon-only') {
            return;
        }

        return <span class="text">{item.text}</span>;
    };

    private renderTooltip = (item: BreadcrumbsItem, tooltipId: string) => {
        if (item.type === 'icon-only') {
            return <limel-tooltip elementId={tooltipId} label={item.text} />;
        }
    };

    private areItemsLinks = (items: BreadcrumbsItem[]) => {
        return items.some((item) => 'link' in item);
    };

    private handleClick = (item: BreadcrumbsItem) => (event: MouseEvent) => {
        event.stopPropagation();
        this.select.emit(item);
    };
}
