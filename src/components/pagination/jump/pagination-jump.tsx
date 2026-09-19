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
import { Languages } from '../../date-picker/date.types';
import translate from '../../../global/translations';
import { ENTER } from '../../../util/keycodes';
import { pageFromInput } from '../pagination.util';

const FIRST_PAGE = 1;
const FALLBACK_LANGUAGE = 'en';

/**
 * A field for going straight to a page, which `limel-pagination` puts inside
 * the popover its `···` opens.
 *
 * It draws nothing until it is opened, so a pagination that is merely on
 * screen pays for an empty element rather than a form. It lives in a
 * component of its own because the popover carries its content into a shadow
 * root elsewhere on the page, where a parent's stylesheet cannot reach it —
 * a component brings its own.
 *
 * @private
 * @exampleComponent limel-example-pagination-jump-basic
 */
@Component({
    tag: 'limel-pagination-jump',
    shadow: true,
    styleUrl: 'pagination-jump.scss',
})
export class PaginationJump {
    /**
     * Whether the field is being shown.
     */
    @Prop({ reflect: true })
    public open: boolean = false;

    /**
     * The page to start from, which is the one the user is on.
     */
    @Prop()
    public page: number = FIRST_PAGE;

    /**
     * How many pages there are, which is as far as a jump can go.
     */
    @Prop()
    public pageCount: number = FIRST_PAGE;

    /**
     * Set while a page is being fetched, so that another cannot be asked for.
     */
    @Prop()
    public loading: boolean = false;

    /**
     * The language used for the labels and for the way numbers are written.
     */
    @Prop()
    public language: Languages = 'en';

    /**
     * Asks for the page that was typed, already brought within the set.
     */
    @Event()
    public jump: EventEmitter<number>;

    /** What the field shows: the page it opened with, then what is typed. */
    @State()
    private value: string = '';

    private field?: HTMLLimelInputFieldElement;

    private shouldFocusField = false;

    private numberFormat?: Intl.NumberFormat;

    public componentWillLoad() {
        this.handleOpenChange();
    }

    @Watch('language')
    protected handleLanguageChange() {
        this.numberFormat = undefined;
    }

    /**
     * Opening starts the field again rather than leaving what was last typed,
     * so it always offers the page the user is on now.
     */
    @Watch('open')
    protected handleOpenChange() {
        if (!this.open) {
            return;
        }

        this.value = String(this.page);
        this.shouldFocusField = true;
    }

    public componentDidRender() {
        if (!this.shouldFocusField) {
            return;
        }

        this.shouldFocusField = false;
        this.focusField();
    }

    public render() {
        if (!this.open) {
            return;
        }

        return (
            <Host onKeyDown={this.handleKeyDown}>
                <limel-input-field
                    type="number"
                    label={this.translate('pagination.page-number')}
                    placeholder={this.pageRange}
                    value={this.value}
                    onChange={this.handleChange}
                    min={FIRST_PAGE}
                    max={this.pageCount}
                    step={1}
                    ref={this.setField}
                />
                <limel-button
                    primary={true}
                    label={this.translate('pagination.go')}
                    disabled={this.loading}
                    onClick={this.commit}
                />
            </Host>
        );
    }

    /**
     * Only to keep what is on screen honest. `limel-input-field` draws an
     * unfocused number through its `value` prop, so a field left pinned to
     * the page it opened with would show that again the moment the keyboard
     * moved to the button, while the button submitted something else.
     *
     * @param event - the field reporting what it now holds
     */
    private readonly handleChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.value = String(event.detail ?? '');
    };

    private readonly handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== ENTER) {
            return;
        }

        event.preventDefault();
        this.commit();
    };

    private readonly commit = () => {
        const page = this.target;

        if (page === null || this.loading) {
            return;
        }

        this.jump.emit(page);
    };

    /**
     * The page that is in the field now, or `null` when it holds none.
     *
     * Read from the field itself rather than from its `change` event, which
     * arrives on a debounce: a page typed and submitted inside that window
     * would otherwise be submitted as whatever preceded it.
     */
    private get target(): number | null {
        const typed = this.nativeField?.value ?? this.value;

        return pageFromInput(typed, this.pageCount);
    }

    /** `1–492`, so that being moved to 492 is a stated bound, not a surprise. */
    private get pageRange(): string {
        return this.translate('pagination.page-range', {
            first: this.formatNumber(FIRST_PAGE),
            last: this.formatNumber(this.pageCount),
        });
    }

    private readonly setField = (element: HTMLLimelInputFieldElement) => {
        this.field = element;
    };

    /** `limel-input-field` wraps a native field but does not expose it. */
    private get nativeField(): HTMLInputElement | undefined {
        return this.field?.shadowRoot?.querySelector('input');
    }

    /**
     * The field delegates focus to the input it wraps, so focusing the host
     * is enough. Selecting as well, so the page the user is on is both the
     * starting value and out of the way of the first keystroke.
     */
    private focusField() {
        const host = this.field;

        host?.componentOnReady().then(() => {
            // A frame later, so the popover has been put where it belongs
            // before the field takes the keyboard.
            requestAnimationFrame(() => {
                host.focus();
                host.shadowRoot?.querySelector('input')?.select();
            });
        });
    }

    /**
     * The parent warns about a language it cannot use, so this one only has
     * to keep drawing.
     *
     * @param value - the number to write out
     * @returns the number in the current language
     */
    private formatNumber(value: number): string {
        this.numberFormat ??= this.createNumberFormat();

        return this.numberFormat.format(value);
    }

    /**
     * The pagination hands down the language it settled on, so this only has
     * to survive being handed one directly, as the example page does.
     *
     * @returns a formatter, in that language where it can be used
     */
    private createNumberFormat(): Intl.NumberFormat {
        try {
            return new Intl.NumberFormat(this.language);
        } catch {
            return new Intl.NumberFormat(FALLBACK_LANGUAGE);
        }
    }

    private readonly translate = (key: string, params?: object): string => {
        return translate.get(key, this.language, params);
    };
}
