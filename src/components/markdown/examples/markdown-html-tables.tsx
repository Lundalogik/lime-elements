import { Component, h, Host } from '@stencil/core';

const cellStyle =
    'overflow:hidden;padding:2px 3px;vertical-align:bottom;' +
    'border:1px solid rgb(204,204,204)';

const markdown = `
<table cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:Arial;width:0px;border-collapse:collapse">
  <colgroup><col width="59"><col width="292"></colgroup>
  <tbody>
    <tr style="height:21px">
      <td style="${cellStyle};font-size:6pt;text-align:right">1</td>
      <td style="${cellStyle};background-color:rgb(207,226,243);font-weight:bold">Acme Ltd</td>
    </tr>
    <tr style="height:21px">
      <td style="${cellStyle};font-size:6pt;text-align:right">2</td>
      <td style="${cellStyle}">Amount due: $1,600</td>
    </tr>
  </tbody>
</table>
`;

/**
 * HTML tables with column definitions
 *
 * Tables pasted from spreadsheets (e.g. Google Sheets) define their
 * column widths in a `colgroup` element, and often set a zero `width`
 * on the `table` element itself. The sanitizer keeps `colgroup` and
 * `col` (including their `width` and `span` attributes) and removes a
 * zero width from the table's inline style, so the author's column
 * widths render faithfully: a narrow numbered column next to a wide
 * content column.
 *
 * The second render adds the `no-table-styles` class, which disables
 * the component's own table styling in favor of the user agent
 * stylesheet — the mode used when rendering email content. Without the
 * component's `min-width: 100%`, the table's size is determined
 * entirely by the sanitized markup, so the `col` widths alone must
 * keep the table readable.
 */
@Component({
    tag: 'limel-example-markdown-html-tables',
    shadow: true,
})
export class MarkdownHtmlTablesExample {
    public render() {
        return (
            <Host>
                <h4>Default</h4>
                <limel-markdown value={markdown} />
                <h4>Without component table styles</h4>
                <limel-markdown class="no-table-styles" value={markdown} />
            </Host>
        );
    }
}
