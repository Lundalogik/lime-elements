import {
    Component,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';
import { createRandomString } from '../../util/random-string';
import { getPrimarySubtag } from '../../util/language';
import { GoToPageEvent, GoToPageReason } from './pagination.types';
import { getPageSlots, PageSlot } from './pagination.util';

const FIRST_PAGE = 1;
const DEFAULT_PAGE_SIZE = 100;

/** Where `global/translations` lands when it cannot use a language. */
const FALLBACK_LANGUAGE = 'en';

/** The props this component validates, and so may complain about. */
type PaginationProp = 'page' | 'pageSize' | 'totalItems' | 'language';

/**
 * What one render draws, settled once before it runs.
 *
 * Everything here has already been through validation, so nothing downstream
 * has to ask again — and nothing downstream can warn twice about the same
 * value, or write to the console from inside a label.
 */
interface View {
    page: number;
    pageCount: number | null;
    pageSize: number;
    totalItems: number | null;
}

/**
 * Pagination reports where the user is in a set of results, and allows them
 * to move somewhere else in it.
 * For a user, knowing where they are matters as much as being able to move.
 * A page number and a total tells users how much there is in the list that they are
 * looking at, and how far into it they have got; and hovering a page shows
 * exactly which items it holds.
 *
 * @exampleComponent limel-example-pagination-basic
 * @exampleComponent limel-example-pagination-single-page
 * @exampleComponent limel-example-pagination-page-size
 * @exampleComponent limel-example-pagination-page
 * @exampleComponent limel-example-pagination-total-items
 * @exampleComponent limel-example-pagination-loading
 * @exampleComponent limel-example-pagination-language
 *
 * @beta
 */
@Component({
    tag: 'limel-pagination',
    shadow: true,
    styleUrl: 'pagination.scss',
})
export class Pagination {
    /**
     * Which page to show. The first page is `1`, not `0`.
     * Set it to the page from `goToPage` to move the control.
     */
    @Prop()
    public page: number = FIRST_PAGE;

    /**
     * Number of items that fit on one page.
     * Together with `totalItems`, used by the component to calculate the total number of pages.
     */
    @Prop({ reflect: true })
    public pageSize: number = DEFAULT_PAGE_SIZE;

    /**
     * How many items there are in total, across every page.
     * `null` means the count has not arrived yet.
     * Together with `pageSize`, used by the component to calculate the total number of pages.
     */
    @Prop({ reflect: true })
    public totalItems: number | null = null;

    /**
     * Set this to `true` while you are fetching a page.
     */
    @Prop({ reflect: true })
    public loading: boolean = false;

    /**
     * The language used for the labels and the tooltips, and for the way
     * numbers are written.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Asks for a page to be loaded, and says which items it holds.
     *
     * The component does not move itself. Clicking a page emits this and
     * nothing else; set `page` to the number it carries and the control
     * follows. Not setting it is how you decline — useful when the load fails,
     * or when there is unsaved work to confirm first.
     *
     * The one exception is a page that does not exist, which it cannot show
     * whatever you say. There it shows the nearest page that does and emits so
     * you can catch up.
     */
    @Event({ cancelable: false })
    public goToPage: EventEmitter<GoToPageEvent>;

    /**
     * The count from the last time we had one, so the control can hold its
     * shape while a new one is on its way. The count rather than the page count
     * it implies, because `pageSize` may change while we are waiting.
     */
    private lastKnownTotalItems: number | null = null;

    @State()
    private liveMessage: string = '';

    /** Ids are per slot, not per page: a page moves between slots, a slot does not. */
    private readonly idPrefix = createRandomString();

    /** The value each prop was last complained about with. */
    private readonly warnedAbout = new Map<PaginationProp, unknown>();

    private numberFormat?: Intl.NumberFormat;

    /** Settled once per render, and the only thing `render` reads. */
    private view: View = {
        page: FIRST_PAGE,
        pageCount: null,
        pageSize: DEFAULT_PAGE_SIZE,
        totalItems: null,
    };

    /** The page the previous render showed. */
    private shownPage?: number;

    /** Which items the page held last render, announced or not. */
    private lastRange?: string | null;

    /** The `page` we last reported a correction for, so we report it once. */
    private reportedAsk?: number;

    /** A correction the consumer has not been told about. */
    private pendingCorrection?: number;

    /**
     * Settling here rather than in a `@Watch` keeps the result the same
     * however the consumer assigns the props. A watcher runs the moment one
     * property is set, so `totalItems` and `page` assigned in the same tick
     * would settle twice, the first time against a page count about to change.
     */
    public componentWillRender() {
        // The only place the three validators run. Everything after this reads
        // the answers rather than asking again.
        const totalItems = this.knownTotalItems;
        const pageSize = this.usablePageSize;
        const usable = this.wholePage(this.page);

        if (totalItems !== null) {
            this.lastKnownTotalItems = totalItems;
        }

        const pageCount = this.countPages(
            totalItems ?? this.lastKnownTotalItems,
            pageSize
        );
        const page = this.capToLastPage(usable, pageCount);

        this.view = {
            page: page,
            pageCount: pageCount,
            pageSize: pageSize,
            totalItems: totalItems,
        };

        this.readOut(page);
        this.reconcile(page, usable);

        this.shownPage = page;
    }

    /**
     * @param total - the count to divide, or `null` if none is known
     * @param pageSize - how many items fit on one page
     * @returns how many pages that makes, or `null` when nothing is known
     */
    private countPages(total: number | null, pageSize: number): number | null {
        if (total === null) {
            return null;
        }

        return Math.max(FIRST_PAGE, Math.ceil(total / pageSize));
    }

    public componentDidRender() {
        const page = this.pendingCorrection;

        if (page === undefined) {
            return;
        }

        this.pendingCorrection = undefined;
        this.emitGoToPage(page, 'clamped');
    }

    /**
     * Read out the page whenever what it holds changes — not only when its
     * number does. A page size that doubles leaves the user on page 3 of a
     * different set, and someone who cannot see the screen is owed that.
     *
     * Compared as numbers rather than as the sentence they make. The same
     * items in another language, or a count going away while the next one
     * loads, both rewrite the sentence without anything having moved.
     *
     * @param page - the page about to be rendered
     */
    private readOut(page: number) {
        const range = this.rangeIdentity(page);
        const previous = this.lastRange;

        this.lastRange = range;

        if (this.shownPage === undefined) {
            return;
        }

        const hasMoved = page !== this.shownPage;
        const holdsSomethingElse =
            range !== null && previous !== null && range !== previous;

        if (hasMoved || holdsSomethingElse) {
            this.liveMessage =
                this.rangeLabel(page) || this.pageLabel(page, true);
        }
    }

    /**
     * The items themselves, not the numbers that imply them: a total that
     * ticks from 248 to 249 leaves every page but the last one holding exactly
     * what it held.
     *
     * @param page - the page about to be rendered
     * @returns which items the page holds, or `null` while that is unknown
     */
    private rangeIdentity(page: number): string | null {
        const items = this.itemsOn(page);

        return items === null ? null : `${items.from}:${items.to}`;
    }

    /**
     * @param page - the page to measure, 1-based
     * @returns how many items come before it
     */
    private offsetOf(page: number): number {
        return (page - FIRST_PAGE) * this.view.pageSize;
    }

    /**
     * The one place that works out which items a page holds. The last page is
     * usually short, so the upper bound is capped at what exists.
     *
     * @param page - the page to measure, 1-based
     * @returns the first and last item on it, or `null` with no count
     */
    private itemsOn(page: number): { from: number; to: number } | null {
        const { totalItems, pageSize } = this.view;

        if (totalItems === null) {
            return null;
        }

        const from = this.offsetOf(page) + 1;

        return { from: from, to: Math.min(from + pageSize - 1, totalItems) };
    }

    /**
     * Tell the consumer when we are not showing what they asked for.
     *
     * A page we had to *correct* is always news: the value was unusable
     * whatever the count says. A page we had to *clamp* is only news when we
     * have a count of our own to justify it — while one is in flight we hold
     * the shape we last knew, and a shape is not evidence that the consumer's
     * page is wrong. Asserting it against a stale count destroys a page that
     * was about to turn out valid, and nothing later can undo that.
     *
     * @param page - the page about to be rendered
     * @param usable - the page they asked for, once validated
     */
    private reconcile(page: number, usable: number) {
        const asked = this.page;
        const isCorrected = !Object.is(usable, asked);
        const isClamped = page !== usable;
        const shouldTell =
            isCorrected || (isClamped && this.view.totalItems !== null);

        // Forget only when we are genuinely showing what was asked for. Going
        // quiet because we cannot vouch for a bound is not the same thing: a
        // clamp we already reported would be reported again the moment the
        // count came back.
        if (!isCorrected && !isClamped) {
            this.reportedAsk = undefined;
        }

        if (!shouldTell) {
            return;
        }

        // Said once per page-and-ask. `Object.is`, so a `NaN` page counts as
        // reported rather than being re-sent on every render for the life of
        // the component.
        if (page === this.shownPage && Object.is(asked, this.reportedAsk)) {
            return;
        }

        this.reportedAsk = asked;
        this.pendingCorrection = page;
    }

    @Watch('language')
    protected handleLanguageChange() {
        this.numberFormat = undefined;
    }

    public render() {
        const { page, pageCount } = this.view;
        const slots = this.slotsFor(page, pageCount);

        return (
            <Host>
                <nav
                    aria-label={this.translate('pagination.label')}
                    aria-busy={this.loading ? 'true' : null}
                >
                    {this.renderArrow('previous')}
                    {slots.map((slot, index) => this.renderSlot(slot, index))}
                    {this.renderArrow('next')}
                </nav>
                <span class="live-region" aria-live="polite">
                    {this.liveMessage}
                </span>
            </Host>
        );
    }

    /**
     * Without a count we know where the user is but not how far the set goes,
     * so we show that one page rather than nothing. A strip of arrows with no
     * number on it says less than it looks like it does.
     *
     * @param page - the page being shown
     * @param pageCount - how many pages there are, or `null` if not yet known
     * @returns the positions to render
     */
    private slotsFor(page: number, pageCount: number | null): PageSlot[] {
        if (pageCount === null) {
            return [{ kind: 'page', page: page }];
        }

        return getPageSlots(page, pageCount);
    }

    /**
     * A gap marker, or a page button.
     *
     * @param slot - the position to render
     * @param index - where the position sits in the window
     * @returns the rendered slot
     */
    private readonly renderSlot = (slot: PageSlot, index: number) => {
        if (slot.kind === 'gap') {
            return (
                <span key={`gap-${index}`} class="gap" aria-hidden="true">
                    ···
                </span>
            );
        }

        const isCurrent = slot.page === this.currentPage;

        return (
            <button
                key={`page-${index}`}
                id={this.slotId(index)}
                class="page"
                aria-current={isCurrent ? 'page' : null}
                aria-disabled={this.loading ? 'true' : null}
                aria-label={this.pageLabel(slot.page, isCurrent)}
                data-page={slot.page}
                onClick={this.selectPage}
            >
                {this.formatNumber(slot.page)}
                {this.renderSpinner(isCurrent)}
                {this.renderTooltip(slot.page, index)}
            </button>
        );
    };

    /**
     * A spinner around the page the user is heading for, while it loads.
     *
     * @param isCurrent - whether this is the page being loaded
     * @returns the rendered spinner
     */
    private renderSpinner(isCurrent: boolean) {
        if (!isCurrent || !this.loading) {
            return;
        }

        return <limel-spinner />;
    }

    /**
     * Names the page a button leads to, and what that page holds.
     *
     * Nested inside the button so the two are created and torn down as one:
     * `limel-tooltip` resolves its owner element once and never looks again.
     *
     * @param page - the page the tooltip describes
     * @param index - where the page sits in the window
     * @returns the rendered tooltip
     */
    private renderTooltip(page: number, index: number) {
        return (
            <limel-tooltip
                elementId={this.slotId(index)}
                label={this.translate('pagination.page', {
                    page: this.formatNumber(page),
                })}
                helperLabel={this.rangeLabel(page)}
            />
        );
    }

    /**
     * @param direction - which arrow to render
     * @returns the rendered arrow
     */
    private renderArrow(direction: 'previous' | 'next') {
        const isDisabled = this.isArrowDisabled(direction);

        return (
            <button
                id={this.arrowId(direction)}
                class={`arrow ${direction}`}
                aria-label={this.translate(`pagination.${direction}-page`)}
                aria-disabled={isDisabled ? 'true' : null}
                data-direction={direction}
                onClick={this.step}
            >
                <span aria-hidden="true" />
                {this.renderArrowTooltip(direction)}
            </button>
        );
    }

    /**
     * Says what the arrow does, which its glyph only implies, and where it
     * lands. At either end of the set there is nowhere to land.
     *
     * @param direction - which arrow to describe
     * @returns the rendered tooltip
     */
    private renderArrowTooltip(direction: 'previous' | 'next') {
        if (this.isArrowDisabled(direction)) {
            return;
        }

        const target =
            direction === 'next' ? this.currentPage + 1 : this.currentPage - 1;

        return (
            <limel-tooltip
                elementId={this.arrowId(direction)}
                label={this.translate(`pagination.go-to-${direction}-page`)}
                helperLabel={this.translate('pagination.page', {
                    page: this.formatNumber(target),
                })}
            />
        );
    }

    private isArrowDisabled(direction: 'previous' | 'next'): boolean {
        if (this.loading) {
            return true;
        }

        const { page, pageCount } = this.view;

        if (direction === 'previous') {
            return page <= FIRST_PAGE;
        }

        return pageCount === null || page >= pageCount;
    }

    // Bound once: a handler built per render is a new identity each time, so
    // every button would have its listener swapped on every page change.
    private readonly step = (event: MouseEvent) => {
        const direction = (event.currentTarget as HTMLElement).dataset
            .direction as 'previous' | 'next';

        if (this.isArrowDisabled(direction)) {
            return;
        }

        this.goTo(this.currentPage + (direction === 'next' ? 1 : -1));
    };

    private readonly selectPage = (event: MouseEvent) => {
        if (this.loading) {
            return;
        }

        const { page } = (event.currentTarget as HTMLElement).dataset;
        this.goTo(Number(page));
    };

    /**
     * @param page - the page to ask for, 1-based
     */
    private goTo(page: number) {
        if (page === this.currentPage) {
            return;
        }

        this.emitGoToPage(page, 'user');
    }

    /** The page on screen: the one asked for, within the range that exists. */
    private get currentPage(): number {
        return this.view.page;
    }

    private emitGoToPage(page: number, reason: GoToPageReason) {
        this.goToPage.emit({
            page: page,
            reason: reason,
            pageSize: this.view.pageSize,
            offset: this.offsetOf(page),
        });
    }

    /**
     * `totalItems` when it is a count we can do arithmetic with, and `null`
     * — "not known yet" — when it is not. A `NaN` count would make the page
     * count `NaN`, which no comparison catches.
     */
    private get knownTotalItems(): number | null {
        const { totalItems } = this;

        if (totalItems === null || totalItems === undefined) {
            return null;
        }

        if (Number.isSafeInteger(totalItems) && totalItems >= 0) {
            this.warnedAbout.delete('totalItems');

            return totalItems;
        }

        this.warnOnce(
            'totalItems',
            totalItems,
            () =>
                `\`totalItems\` must be a whole number of at least 0, or null, but was ${totalItems}. Ignoring it and keeping the last count it had.`
        );

        return null;
    }

    /** `pageSize`, or the default when we were given something unusable. */
    private get usablePageSize(): number {
        return this.countable(
            'pageSize',
            this.pageSize,
            FIRST_PAGE,
            DEFAULT_PAGE_SIZE
        );
    }

    /**
     * A page number we can count with, whatever the consumer supplied.
     *
     * @param page - the value the consumer gave
     * @returns a whole number of at least 1
     */
    private wholePage(page: number): number {
        return this.countable('page', page, FIRST_PAGE, FIRST_PAGE);
    }

    /**
     * A prop as a whole number we can safely count with, or the fallback.
     *
     * `Number.isSafeInteger` rather than `Number.isFinite`: past 2^53 a page
     * number cannot be incremented, and arithmetic on it stops being exact.
     *
     * @param prop - the prop being read, for the message
     * @param value - what the consumer gave
     * @param least - the smallest value that makes sense
     * @param fallback - what to use when the value does not
     * @returns a whole number of at least `least`
     */
    private countable(
        prop: PaginationProp,
        value: number,
        least: number,
        fallback: number
    ): number {
        if (Number.isSafeInteger(value) && value >= least) {
            this.warnedAbout.delete(prop);

            return value;
        }

        this.warnOnce(
            prop,
            value,
            () =>
                `\`${prop}\` must be a whole number of at least ${least}, but was ${value}. Using ${fallback}.`
        );

        return fallback;
    }

    /**
     * Caps only the top; callers have already raised the page to at least one.
     *
     * @param page - the page to cap
     * @param pageCount
     * @returns the page, or the last one if it is beyond the end
     */
    private capToLastPage(page: number, pageCount: number | null): number {
        return pageCount === null ? page : Math.min(page, pageCount);
    }

    /**
     * Keyed on the prop and the value, so repeated renders stay quiet while a
     * new fault still gets said — including the same fault returning after the
     * prop has been usable in between. The message is built only when it is
     * going to be read: these run several times per render.
     *
     * @param prop - the prop being complained about
     * @param value - what it held
     * @param message - what is wrong and what was done instead
     */
    private warnOnce(
        prop: PaginationProp,
        value: unknown,
        message: () => string
    ) {
        if (
            this.warnedAbout.has(prop) &&
            Object.is(this.warnedAbout.get(prop), value)
        ) {
            return;
        }

        this.warnedAbout.set(prop, value);
        console.warn(`limel-pagination: ${message()}`);
    }

    private pageLabel(page: number, isCurrent: boolean): string {
        const key = isCurrent
            ? 'pagination.current-page'
            : 'pagination.go-to-page';

        return this.translate(key, { page: this.formatNumber(page) });
    }

    /**
     * `21–40 of 248` for a given page. The last page is usually short, so the
     * upper bound is capped at the number of items that actually exist.
     *
     * @param page - the page to describe, 1-based
     * @returns the translated range
     */
    private rangeLabel(page: number): string {
        const { totalItems: total, pageSize } = this.view;

        if (total === null) {
            return '';
        }

        const from = (page - FIRST_PAGE) * pageSize + 1;
        const to = page * pageSize;

        return this.translate('pagination.items-range', {
            from: this.formatNumber(from),
            to: this.formatNumber(Math.min(to, total)),
            total: this.formatNumber(total),
        });
    }

    private slotId(index: number): string {
        return `${this.idPrefix}-slot-${index}`;
    }

    private arrowId(direction: 'previous' | 'next'): string {
        return `${this.idPrefix}-${direction}`;
    }

    /**
     * The formatter is built once and kept until `language` changes: a page and
     * its tooltip need six formatted numbers between them.
     *
     * @param value - the number to write out
     * @returns the number in the current language
     */
    private formatNumber(value: number): string {
        this.numberFormat ??= this.createNumberFormat();

        return this.numberFormat.format(value);
    }

    /**
     * `Intl.NumberFormat` throws on a language it cannot parse, and this is
     * called from `render`, so an unusable one would leave the control drawing
     * nothing at all — the single state a user cannot click their way out of.
     * `src/util/language.ts` states the rule this keeps.
     *
     * A tag it cannot parse throws; a well-formed tag it does not support, like
     * `zz`, does not — it quietly resolves to whatever locale the machine runs
     * in. Both end up formatting numbers in something other than what was
     * asked for, so both are worth saying out loud.
     *
     * @returns a formatter, in the given language where that is possible
     */
    private createNumberFormat(): Intl.NumberFormat {
        const { language } = this;

        try {
            const format = new Intl.NumberFormat(language);
            const resolved = format.resolvedOptions().locale;

            if (getPrimarySubtag(resolved) === getPrimarySubtag(language)) {
                this.warnedAbout.delete('language');

                return format;
            }
        } catch {
            // Fall through to the warning below.
        }

        this.warnOnce(
            'language',
            language,
            () =>
                `\`language\` must be one this browser can write numbers in, but was ${JSON.stringify(language)}. Using ${FALLBACK_LANGUAGE}.`
        );

        // Where the translations land for the same unusable value, rather than
        // the viewer's own locale — English labels beside system digit
        // grouping would read differently on every machine.
        return new Intl.NumberFormat(FALLBACK_LANGUAGE);
    }

    private readonly translate = (key: string, params?: object): string => {
        return translate.get(key, this.language, params);
    };
}
