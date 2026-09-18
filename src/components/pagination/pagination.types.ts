/**
 * Why a page is being asked for.
 *
 * `user` is someone picking a page. `clamped` is the component reporting that
 * it could not show the page it was given — either that page no longer exists,
 * or the value was not one it could use — and is showing the nearest one it
 * can. Worth telling apart, because a correction is not a navigation and
 * usually should not become an entry in the browser's history.
 *
 * @beta
 */
export type GoToPageReason = 'user' | 'clamped';

/**
 * Everything needed to load a page: which one it is, and where it sits in the
 * set.
 *
 * `offset` comes along with it because that is the half most APIs ask for that
 * you would otherwise compute, and the half that is easy to get wrong by one.
 *
 * @beta
 */
export interface GoToPageEvent {
    /**
     * The page being asked for. Set `page` to this to show it. The first page
     * is `1`, not `0`.
     */
    page: number;

    /** Whether the user picked this page, or the component had to move them. */
    reason: GoToPageReason;

    /**
     * How many items fit on one page. Usually `pageSize`, but if that was not
     * a number the component could use, this is what it used instead.
     */
    pageSize: number;

    /**
     * How many items to skip to reach this page, which is
     * `(page - 1) * pageSize`. Along with `pageSize`, this is what most APIs
     * ask for, so you do not have to work the arithmetic out yourself.
     */
    offset: number;
}
