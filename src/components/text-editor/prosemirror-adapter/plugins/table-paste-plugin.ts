import { Plugin, PluginKey, Selection, TextSelection } from 'prosemirror-state';
import { Fragment, Node, ResolvedPos, Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { isInTable, selectionCell, TableMap } from 'prosemirror-tables';

export const createTablePastePlugin = (): Plugin => {
    return new Plugin({
        key: new PluginKey('tablePastePlugin'),
        props: {
            handlePaste: (view, _event, slice) => {
                return handleTablePaste(view, slice);
            },
        },
    });
};

const handleTablePaste = (view: EditorView, slice: Slice): boolean => {
    const { state } = view;

    if (!(state.selection instanceof TextSelection)) {
        return false;
    }

    const pastedRows = sliceAsRows(slice);
    if (!sliceContainsTable(slice) && !pastedRows) {
        return false;
    }

    if (!isInTable(state)) {
        return false;
    }

    if (!selectionStaysInsideOneTable(state)) {
        return pasteInPlace(view, slice.content, pastedRows);
    }

    if (pastedRows) {
        return pasteRows(view, pastedRows);
    }

    return pasteAfterEnclosingTable(view, slice.content);
};

const pasteAfterEnclosingTable = (
    view: EditorView,
    content: Fragment
): boolean => {
    const { state } = view;
    const posInOldDoc = selectionCell(state).after(-1);
    const tr = state.tr.deleteSelection();

    const posAfterTable = tr.mapping.map(posInOldDoc);
    tr.insert(posAfterTable, content);
    const $endPos = tr.doc.resolve(posAfterTable + content.size);
    tr.setSelection(Selection.near($endPos, -1)).scrollIntoView();

    view.dispatch(tr);

    return true;
};

const pasteRows = (view: EditorView, rows: Fragment): boolean => {
    const { state } = view;
    const $cell = selectionCell(state);
    const enclosingTable = $cell.node(-1);

    // Splicing rows into a table with spanning cells can break its grid.
    const spliceIsSafe =
        rowWidth(rows.firstChild!) === TableMap.get(enclosingTable).width &&
        !containsSpanningCells(enclosingTable) &&
        !containsSpanningCells(rows);

    if (!spliceIsSafe) {
        return pasteAfterEnclosingTable(
            view,
            Fragment.from(enclosingTable.type.create(null, rows))
        );
    }

    const posAfterCaretRow = $cell.after();
    const tr = state.tr.deleteSelection();
    const insertPos = tr.mapping.map(posAfterCaretRow);
    tr.insert(insertPos, rows);
    const $endPos = tr.doc.resolve(insertPos + rows.size);
    tr.setSelection(Selection.near($endPos, -1)).scrollIntoView();

    view.dispatch(tr);

    return true;
};

const pasteInPlace = (
    view: EditorView,
    content: Fragment,
    rows: Fragment | null
): boolean => {
    if (rows) {
        const tableType = selectionCell(view.state).node(-1).type;
        content = Fragment.from(tableType.create(null, rows));
    }

    // A closed slice keeps the pasted table a block instead of letting
    // its cell content merge into the surrounding text.
    const tr = view.state.tr
        .replaceSelection(new Slice(content, 0, 0))
        .scrollIntoView();
    view.dispatch(tr);

    return true;
};

const sliceContainsTable = (slice: Slice): boolean => {
    for (let i = 0; i < slice.content.childCount; i++) {
        if (slice.content.child(i).type.spec.tableRole === 'table') {
            return true;
        }
    }

    return false;
};

// Copying a cell selection puts bare rows on the clipboard.
const sliceAsRows = (slice: Slice): Fragment | null => {
    if (slice.content.childCount === 0) {
        return null;
    }
    for (let i = 0; i < slice.content.childCount; i++) {
        if (slice.content.child(i).type.spec.tableRole !== 'row') {
            return null;
        }
    }

    return slice.content;
};

const selectionStaysInsideOneTable = (state: {
    selection: { $from: ResolvedPos; $to: ResolvedPos };
}): boolean => {
    const fromTable = enclosingTablePos(state.selection.$from);
    const toTable = enclosingTablePos(state.selection.$to);

    return fromTable !== null && fromTable === toTable;
};

const enclosingTablePos = ($pos: ResolvedPos): number | null => {
    for (let depth = $pos.depth; depth > 0; depth--) {
        if ($pos.node(depth).type.spec.tableRole === 'table') {
            return $pos.before(depth);
        }
    }

    return null;
};

const rowWidth = (rowNode: Node): number => {
    let width = 0;
    for (let i = 0; i < rowNode.childCount; i++) {
        width += rowNode.child(i).attrs.colspan ?? 1;
    }

    return width;
};

const containsSpanningCells = (content: Node | Fragment): boolean => {
    for (let i = 0; i < content.childCount; i++) {
        const child = content.child(i);
        if ((child.attrs.rowspan ?? 1) > 1 || (child.attrs.colspan ?? 1) > 1) {
            return true;
        }
        if (containsSpanningCells(child)) {
            return true;
        }
    }

    return false;
};
