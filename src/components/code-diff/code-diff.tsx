import { Component, Element, h, Prop, State, Watch, Host } from '@stencil/core';

import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';
import {
    DiffHunk,
    DiffLine,
    DiffResult,
    DiffSegment,
    SplitDiffLine,
} from './types';
import { ActionBarItem } from '../action-bar/action-bar.types';
import { buildSplitLines, computeDiff, normalizeForDiff } from './diff-engine';
import { tokenize, SyntaxToken } from './syntax-highlighter';
import { buildSearchRegex, navigateMatchIndex } from './search-utils';
import {
    extractRemovedContent,
    extractRemovedContentFromSplit,
} from './content-utils';

/**
 * Displays a visual diff between two text values, modeled on
 * GitHub's code difference view.
 *
 * Supports unified and split (side-by-side) views with line numbers,
 * color-coded additions and removals, word-level inline highlighting,
 * and collapsible unchanged context sections.
 *
 * @beta
 * @exampleComponent limel-example-code-diff-basic
 * @exampleComponent limel-example-code-diff-headings
 * @exampleComponent limel-example-code-diff-json
 * @exampleComponent limel-example-code-diff-split
 * @exampleComponent limel-example-code-diff-line-wrap
 * @exampleComponent limel-example-code-diff-expand
 */
@Component({
    tag: 'limel-code-diff',
    shadow: true,
    styleUrl: 'code-diff.scss',
})
export class CodeDiff {
    /**
     * The "before" value to compare.
     * Can be a string or an object (which will be serialized to JSON).
     */
    @Prop()
    public oldValue: string | object = '';

    /**
     * The "after" value to compare.
     * Can be a string or an object (which will be serialized to JSON).
     */
    @Prop()
    public newValue: string | object = '';

    /**
     * Heading for the original (before) version, displayed in the diff header.
     * Defaults to `"Original"`, localized via `translationLanguage`.
     */
    @Prop({ reflect: true })
    public oldHeading?: string;

    /**
     * Heading for the modified (after) version, displayed in the diff header.
     * Defaults to `"Modified"`, localized via `translationLanguage`.
     */
    @Prop({ reflect: true })
    public newHeading?: string;

    /**
     * The layout of the diff view.
     * - `unified` — single column with interleaved additions and removals
     * - `split` — side-by-side comparison with old on left, new on right
     */
    @Prop({ reflect: true })
    public layout: 'unified' | 'split' = 'unified';

    /**
     * Number of unchanged context lines to display around each change.
     */
    @Prop({ reflect: true })
    public contextLines: number = 3;

    /**
     * When `true`, long lines are wrapped instead of causing
     * horizontal scrolling. Useful when comparing prose or
     * config files with long values.
     */
    @Prop({ reflect: true })
    public lineWrapping = true;

    /**
     * Language for syntax highlighting.
     * Currently supports `"json"`. When set, code tokens are
     * colorized (strings, numbers, keys, etc.) alongside the
     * diff highlighting.
     */
    @Prop({ reflect: true })
    public language?: string;

    /**
     * When `true`, JSON values are parsed, keys are sorted,
     * and indentation is normalized before diffing.
     * This eliminates noise from formatting or key-order differences.
     */
    @Prop({ reflect: true })
    public reformatJson = false;

    /**
     * Defines the language for translations.
     * Will translate all visible labels and announcements.
     */
    @Prop({ reflect: true })
    public translationLanguage: Languages = 'en';

    @Element()
    private readonly host: HTMLLimelCodeDiffElement;

    @State()
    private diffResult: DiffResult = {
        hunks: [],
        additions: 0,
        deletions: 0,
        allLines: [],
    };

    @State()
    private liveAnnouncement: string = '';

    @State()
    private copyState: 'idle' | 'copied' = 'idle';

    @State()
    private searchVisible: boolean = false;

    @State()
    private searchTerm: string = '';

    @State()
    private currentMatchIndex: number = 0;

    private focusedRowIndex: number = -1;
    private normalizedOldText: string = '';

    /**
     * Render-time counter that increments for each search match
     * found while rendering removed lines. Used to determine which
     * match is the "current" one for navigation highlighting.
     */
    private searchMatchCounter: number = 0;

    /**
     * Total search matches found during the last render pass.
     */
    private totalSearchMatches: number = 0;

    /**
     * Whether the current render is inside a removed line,
     * so search highlighting knows when to activate.
     */
    private isRenderingRemovedLine: boolean = false;

    /**
     * Cached search regex for the current render pass.
     * Built once in render() and reused across all renderSearchableText calls.
     */
    private activeSearchRegex: RegExp | null = null;

    private searchInputEl: HTMLLimelInputFieldElement;
    private prevSearchVisible: boolean = false;

    public componentWillLoad() {
        this.recomputeDiff();
    }

    public componentDidRender() {
        if (this.searchVisible && !this.prevSearchVisible) {
            this.searchInputEl?.focus();
        }

        this.prevSearchVisible = this.searchVisible;

        if (this.searchTerm && this.totalSearchMatches > 0) {
            const current = this.host.shadowRoot?.querySelector(
                '.search-match--current'
            );
            current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }

    public render() {
        this.searchMatchCounter = 0;
        this.activeSearchRegex = buildSearchRegex(this.searchTerm);

        const diffContent = this.renderDiff();

        // Capture total matches after rendering completes
        this.totalSearchMatches = this.searchMatchCounter;

        const lineNumberWidth = this.computeLineNumberWidth();

        return (
            <Host style={{ '--limel-line-number-min-width': lineNumberWidth }}>
                {this.renderHeader()}
                {this.renderScreenReaderSummary()}
                {this.searchVisible && this.renderSearchBar()}
                <div
                    class="diff-body"
                    role="table"
                    aria-label={this.getTranslation('code-diff.table-label')}
                    tabindex="0"
                    onKeyDown={(event) => this.handleKeyDown(event)}
                >
                    {diffContent}
                </div>
                <div
                    class="screen-reader-only"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {this.liveAnnouncement}
                </div>
            </Host>
        );
    }

    @Watch('oldValue')
    @Watch('newValue')
    @Watch('contextLines')
    @Watch('reformatJson')
    @Watch('layout')
    protected watchInputs() {
        this.recomputeDiff();
    }

    private recomputeDiff() {
        const oldText = normalizeForDiff(this.oldValue, this.reformatJson);
        const newText = normalizeForDiff(this.newValue, this.reformatJson);
        this.normalizedOldText = oldText;
        this.diffResult = computeDiff(oldText, newText, this.contextLines);
        this.focusedRowIndex = -1;
    }

    private formatSrSummary(): string | null {
        const { additions, deletions } = this.diffResult;
        if (additions === 0 && deletions === 0) {
            return null;
        }

        const parts: string[] = [];
        if (additions > 0) {
            const key =
                additions === 1
                    ? 'code-diff.diff-addition'
                    : 'code-diff.diff-additions';
            parts.push(this.getTranslation(key, { count: additions }));
        }

        if (deletions > 0) {
            const key =
                deletions === 1
                    ? 'code-diff.diff-deletion'
                    : 'code-diff.diff-deletions';
            parts.push(this.getTranslation(key, { count: deletions }));
        }

        return this.getTranslation('code-diff.diff-summary', {
            parts: parts.join(', '),
        });
    }

    private renderScreenReaderSummary() {
        const summary = this.formatSrSummary();

        return (
            <div class="screen-reader-only" role="status" aria-live="polite">
                {summary ??
                    this.getTranslation('code-diff.no-differences-found')}
            </div>
        );
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            return;
        }

        event.preventDefault();

        const rows = this.getDiffRows();
        if (rows.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            this.focusedRowIndex = Math.min(
                this.focusedRowIndex + 1,
                rows.length - 1
            );
        } else {
            this.focusedRowIndex = Math.max(this.focusedRowIndex - 1, 0);
        }

        this.updateRowFocus(rows);
    }

    private getDiffRows(): HTMLElement[] {
        const body = this.host.shadowRoot?.querySelector('.diff-body');
        if (!body) {
            return [];
        }

        return [
            ...body.querySelectorAll<HTMLElement>(
                '.diff-line:not(.diff-line--collapsed)'
            ),
        ];
    }

    private updateRowFocus(rows: HTMLElement[]) {
        for (const row of rows) {
            row.removeAttribute('tabindex');
            row.classList.remove('diff-line--focused');
        }

        const target = rows[this.focusedRowIndex];
        if (target) {
            target.setAttribute('tabindex', '-1');
            target.classList.add('diff-line--focused');
            target.focus();
            this.announceLine(target);
        }
    }

    private announceLine(row: HTMLElement) {
        let lineType = this.getTranslation('code-diff.line-context');
        if (row.classList.contains('diff-line--added')) {
            lineType = this.getTranslation('code-diff.line-added');
        } else if (row.classList.contains('diff-line--removed')) {
            lineType = this.getTranslation('code-diff.line-removed');
        }

        const content =
            row.querySelector('.line-content, .split-content')?.textContent ??
            '';
        const trimmed =
            content.length > 80 ? content.slice(0, 80) + '…' : content;

        this.liveAnnouncement = `${lineType}: ${trimmed}`;
    }

    private renderHeader() {
        const oldHeading =
            this.oldHeading ?? this.getTranslation('code-diff.old-heading');
        const newHeading =
            this.newHeading ?? this.getTranslation('code-diff.new-heading');

        const { additions, deletions } = this.diffResult;
        const hasDiff = additions > 0 || deletions > 0;

        return (
            <div class="diff-header">
                <div class="diff-header__labels">
                    <span class="diff-header__old">{oldHeading}</span>
                    <span class="diff-header__new">{newHeading}</span>
                </div>
                <div class="diff-header__actions">
                    <div class="diff-header__stats">
                        {additions > 0 && (
                            <span class="stat stat--added">+{additions}</span>
                        )}
                        {deletions > 0 && (
                            <span class="stat stat--removed">-{deletions}</span>
                        )}
                    </div>
                    {hasDiff && this.renderCopyButton()}
                    {deletions > 0 && this.renderSearchToggle()}
                </div>
            </div>
        );
    }

    private renderCopyButton() {
        const label =
            this.copyState === 'copied'
                ? this.getTranslation('code-diff.copied')
                : this.getTranslation('code-diff.copy-old-version');

        const icon = this.copyState === 'copied' ? 'checkmark' : 'copy';

        return (
            <limel-icon-button
                label={label}
                icon={icon}
                onClick={() => this.copyToClipboard(this.normalizedOldText)}
            />
        );
    }

    private async copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            this.copyState = 'copied';
            this.liveAnnouncement = this.getTranslation(
                'code-diff.copied-to-clipboard'
            );

            setTimeout(() => {
                this.copyState = 'idle';
            }, 2000);
        } catch {
            // Clipboard API may fail in insecure contexts
        }
    }

    private renderSearchToggle() {
        return (
            <limel-icon-button
                class={{ 'search-toggle--active': this.searchVisible }}
                label={this.getTranslation('code-diff.search')}
                icon="search"
                onClick={() => this.toggleSearch()}
            />
        );
    }

    private renderSearchBar() {
        const matchInfo =
            this.totalSearchMatches === 0
                ? this.getTranslation('code-diff.no-matches')
                : this.getTranslation('code-diff.match-count', {
                      current: this.currentMatchIndex + 1,
                      total: this.totalSearchMatches,
                  });

        return (
            <div class="search-bar">
                <limel-input-field
                    class="search-bar__input"
                    type="search"
                    placeholder={this.getTranslation('code-diff.search') + '…'}
                    value={this.searchTerm}
                    onChange={(e) => this.onSearchInput(e)}
                    onKeyDown={(e) => this.onSearchKeyDown(e)}
                    ref={(el) => (this.searchInputEl = el)}
                />
                <span class="search-bar__count">{matchInfo}</span>
                <limel-action-bar
                    actions={this.getSearchActions()}
                    onItemSelected={(e) => this.onSearchAction(e)}
                />
            </div>
        );
    }

    private toggleSearch() {
        this.searchVisible = !this.searchVisible;
        if (!this.searchVisible) {
            this.searchTerm = '';
            this.currentMatchIndex = 0;
        }
    }

    private onSearchInput(event: CustomEvent<string>) {
        this.searchTerm = event.detail;
        this.currentMatchIndex = 0;
    }

    private onSearchKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (event.shiftKey) {
                this.navigateSearch(-1);
            } else {
                this.navigateSearch(1);
            }
        } else if (event.key === 'Escape') {
            this.toggleSearch();
        }
    }

    private computeLineNumberWidth(): string {
        const maxLineNumber = this.diffResult.allLines.length;
        const digits = String(maxLineNumber).length;

        return `calc(${digits}ch + 2 * var(--limel-code-diff-line-number-padding))`;
    }

    private getSearchActions(): ActionBarItem[] {
        const noMatches = this.totalSearchMatches === 0;

        return [
            {
                text: this.getTranslation('code-diff.previous-match'),
                icon: '-lime-caret-top',
                iconOnly: true,
                disabled: noMatches,
                value: 'prev',
            },
            {
                text: this.getTranslation('code-diff.next-match'),
                icon: '-lime-caret-bottom',
                iconOnly: true,
                disabled: noMatches,
                value: 'next',
            },
            {
                text: this.getTranslation('code-diff.close-search'),
                icon: 'cancel',
                iconOnly: true,
                value: 'close',
            },
        ];
    }

    private onSearchAction(event: CustomEvent<ActionBarItem>) {
        const { value } = event.detail;
        if (value === 'prev') {
            this.navigateSearch(-1);
        } else if (value === 'next') {
            this.navigateSearch(1);
        } else if (value === 'close') {
            this.toggleSearch();
        }
    }

    private navigateSearch(direction: number) {
        this.currentMatchIndex = navigateMatchIndex(
            this.currentMatchIndex,
            direction,
            this.totalSearchMatches
        );
    }

    private renderDiff() {
        const { hunks, collapsedAfter } = this.diffResult;

        if (hunks.length === 0) {
            return (
                <div class="diff-empty">
                    {this.getTranslation('code-diff.no-differences')}
                </div>
            );
        }

        const lineRenderer =
            this.layout === 'split'
                ? (hunk: DiffHunk) => this.renderSplitHunkRows(hunk)
                : (hunk: DiffHunk) => this.renderHunkLines(hunk);

        return this.renderHunks(hunks, collapsedAfter, lineRenderer);
    }

    private renderHunks(
        hunks: DiffHunk[],
        collapsedAfter: number | undefined,
        lineRenderer: (hunk: DiffHunk) => any[]
    ) {
        const elements: any[] = [];

        for (const [i, hunk] of hunks.entries()) {
            if (hunk.collapsedBefore) {
                elements.push(this.renderCollapsedRow(hunk.collapsedBefore, i));
            }

            elements.push(...lineRenderer(hunk));
        }

        if (collapsedAfter) {
            elements.push(this.renderCollapsedAfterRow(collapsedAfter));
        }

        return elements;
    }

    private renderHunkLines(hunk: DiffHunk) {
        const elements: any[] = [];
        let i = 0;

        while (i < hunk.lines.length) {
            const line = hunk.lines[i];

            if (line.type === 'context') {
                elements.push(this.renderLine(line));
                i++;
                continue;
            }

            // Collect consecutive changed lines as a change block
            const blockLines: DiffLine[] = [];
            while (i < hunk.lines.length && hunk.lines[i].type !== 'context') {
                blockLines.push(hunk.lines[i]);
                i++;
            }

            elements.push(this.renderChangeBlock(blockLines));
        }

        return elements;
    }

    private renderChangeBlock(lines: DiffLine[]) {
        const removedContent = extractRemovedContent(lines);

        return (
            <div class="change-group">
                {lines.map((line) => this.renderLine(line))}
                {removedContent && this.renderBlockCopyButton(removedContent)}
            </div>
        );
    }

    private renderLine(line: DiffLine) {
        const lineClass = {
            'diff-line': true,
            [`diff-line--${line.type}`]: true,
        };

        const indicatorMap: Record<DiffLine['type'], string> = {
            added: '+',
            removed: '-',
            context: ' ',
        };
        const indicator = indicatorMap[line.type];

        return (
            <div class={lineClass} role="row">
                <span
                    class="line-number line-number--old"
                    role="cell"
                    aria-label={
                        line.oldLineNumber
                            ? this.getTranslation('code-diff.old-line', {
                                  number: line.oldLineNumber,
                              })
                            : undefined
                    }
                >
                    {line.oldLineNumber ?? ''}
                </span>
                <span
                    class="line-number line-number--new"
                    role="cell"
                    aria-label={
                        line.newLineNumber
                            ? this.getTranslation('code-diff.new-line', {
                                  number: line.newLineNumber,
                              })
                            : undefined
                    }
                >
                    {line.newLineNumber ?? ''}
                </span>
                <span class="line-indicator" role="cell">
                    {indicator}
                </span>
                <span class="line-content" role="cell">
                    {this.renderContent(line)}
                </span>
            </div>
        );
    }

    private renderSplitHunkRows(hunk: DiffHunk) {
        const splitRows = buildSplitLines(hunk.lines);
        const elements: any[] = [];
        let i = 0;

        while (i < splitRows.length) {
            const row = splitRows[i];
            const isContext =
                row.left?.type === 'context' && row.right?.type === 'context';

            if (isContext) {
                elements.push(this.renderSplitRow(row));
                i++;
                continue;
            }

            // Collect consecutive changed rows
            const blockRows: SplitDiffLine[] = [];
            while (i < splitRows.length) {
                const r = splitRows[i];
                const rIsContext =
                    r.left?.type === 'context' && r.right?.type === 'context';
                if (rIsContext) {
                    break;
                }

                blockRows.push(r);
                i++;
            }

            elements.push(this.renderSplitChangeBlock(blockRows));
        }

        return elements;
    }

    private renderSplitChangeBlock(rows: SplitDiffLine[]) {
        const removedContent = extractRemovedContentFromSplit(rows);

        return (
            <div class="change-group">
                {rows.map((row) => this.renderSplitRow(row))}
                {removedContent && this.renderBlockCopyButton(removedContent)}
            </div>
        );
    }

    private renderSplitRow(row: SplitDiffLine) {
        const leftType = row.left?.type ?? 'empty';
        const rightType = row.right?.type ?? 'empty';
        const oldLineLabel = row.left?.oldLineNumber
            ? this.getTranslation('code-diff.old-line', {
                  number: row.left.oldLineNumber,
              })
            : undefined;
        const newLineLabel = row.right?.newLineNumber
            ? this.getTranslation('code-diff.new-line', {
                  number: row.right.newLineNumber,
              })
            : undefined;

        return (
            <div class="diff-line diff-line--split" role="row">
                <span
                    class="line-number line-number--old"
                    role="cell"
                    aria-label={oldLineLabel}
                >
                    {row.left?.oldLineNumber ?? ''}
                </span>
                <span
                    class={`split-content split-content--left split-content--${leftType}`}
                    role="cell"
                >
                    {row.left ? this.renderContent(row.left) : ''}
                </span>
                <span
                    class="line-number line-number--new"
                    role="cell"
                    aria-label={newLineLabel}
                >
                    {row.right?.newLineNumber ?? ''}
                </span>
                <span
                    class={`split-content split-content--right split-content--${rightType}`}
                    role="cell"
                >
                    {row.right ? this.renderContent(row.right) : ''}
                </span>
            </div>
        );
    }

    private renderBlockCopyButton(removedContent: string) {
        return (
            <limel-icon-button
                class="change-group__copy"
                elevated={true}
                label={this.getTranslation('code-diff.copy-change')}
                icon="copy"
                onClick={() => this.copyToClipboard(removedContent)}
            />
        );
    }

    private renderContent(line: DiffLine) {
        this.isRenderingRemovedLine =
            line.type === 'removed' && this.searchTerm.length > 0;

        if (!line.segments || line.segments.length === 0) {
            return this.renderSyntaxTokens(line.content);
        }

        return line.segments.map((segment) =>
            this.renderSegment(segment, line.type)
        );
    }

    private renderSegment(segment: DiffSegment, lineType: DiffLine['type']) {
        const content = this.renderSyntaxTokens(segment.value);

        if (segment.type === 'equal') {
            return content;
        }

        const segmentClass =
            lineType === 'removed' ? 'segment--removed' : 'segment--added';

        return <mark class={segmentClass}>{content}</mark>;
    }

    private renderSyntaxTokens(text: string) {
        const tokens = tokenize(text, this.language);

        if (tokens.length === 1 && tokens[0].type === 'plain') {
            return this.renderSearchableText(text);
        }

        return tokens.map((token) => this.renderSyntaxToken(token));
    }

    private renderSyntaxToken(token: SyntaxToken) {
        const text = this.renderSearchableText(token.value);

        if (token.type === 'plain') {
            return text;
        }

        return <span class={`syntax--${token.type}`}>{text}</span>;
    }

    private renderSearchableText(text: string): any {
        if (!this.isRenderingRemovedLine || !this.activeSearchRegex) {
            return text;
        }

        const parts = text.split(this.activeSearchRegex);

        if (parts.length === 1) {
            return text;
        }

        return parts.map((part, i) => {
            // Odd indices are the captured matches from split
            if (i % 2 === 0) {
                return part;
            }

            const matchIndex = this.searchMatchCounter++;
            const isCurrent = matchIndex === this.currentMatchIndex;
            const cls = {
                'search-match': true,
                'search-match--current': isCurrent,
            };

            return <mark key={`match-${matchIndex}`} class={cls}>{part}</mark>;
        });
    }

    private renderCollapsedRow(count: number, hunkIndex: number) {
        return (
            <div class="diff-line diff-line--collapsed" role="row">
                <button
                    class="expand-button"
                    type="button"
                    onClick={() => this.expandHunk(hunkIndex)}
                    aria-label={this.getTranslation(
                        'code-diff.show-hidden-lines',
                        {
                            count,
                        }
                    )}
                >
                    {this.getTranslation('code-diff.hidden-lines', { count })}
                </button>
            </div>
        );
    }

    private renderCollapsedAfterRow(count: number) {
        return (
            <div class="diff-line diff-line--collapsed" role="row">
                <button
                    class="expand-button"
                    type="button"
                    onClick={() => this.expandAfter()}
                    aria-label={this.getTranslation(
                        'code-diff.show-hidden-lines',
                        {
                            count,
                        }
                    )}
                >
                    {this.getTranslation('code-diff.hidden-lines', { count })}
                </button>
            </div>
        );
    }

    private expandHunk(hunkIndex: number) {
        const hunks = [...this.diffResult.hunks];
        const hunk = hunks[hunkIndex];
        const prevHunkEnd =
            hunkIndex > 0
                ? hunks[hunkIndex - 1].startIndex +
                  hunks[hunkIndex - 1].lines.length
                : 0;

        const hiddenLines = this.diffResult.allLines.slice(
            prevHunkEnd,
            hunk.startIndex
        );

        hunks[hunkIndex] = {
            ...hunk,
            lines: [...hiddenLines, ...hunk.lines],
            collapsedBefore: undefined,
            startIndex: prevHunkEnd,
        };

        this.diffResult = { ...this.diffResult, hunks };
        this.liveAnnouncement = this.getTranslation('code-diff.expanded-lines');
    }

    private expandAfter() {
        const hunks = [...this.diffResult.hunks];
        const lastIndex = hunks.length - 1;
        const lastHunk = hunks[lastIndex];
        const lastHunkEnd = lastHunk.startIndex + lastHunk.lines.length;
        const hiddenLines = this.diffResult.allLines.slice(lastHunkEnd);

        hunks[lastIndex] = {
            ...lastHunk,
            lines: [...lastHunk.lines, ...hiddenLines],
        };

        this.diffResult = {
            ...this.diffResult,
            hunks,
            collapsedAfter: undefined,
        };
        this.liveAnnouncement = this.getTranslation(
            'code-diff.expanded-lines-end'
        );
    }

    private getTranslation(key: string, params?: object): string {
        return translate.get(key, this.translationLanguage, params);
    }
}
