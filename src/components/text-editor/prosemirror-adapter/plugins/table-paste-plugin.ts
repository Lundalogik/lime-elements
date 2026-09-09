import { Plugin, PluginKey, Selection, Transaction } from 'prosemirror-state';
import { Fragment, ResolvedPos, Schema, Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
    cellAround,
    CellSelection,
    isInTable,
    TableMap,
    tableNodeTypes,
} from 'prosemirror-tables';

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

// prosemirror-tables pastes a cell grid over the existing cells. Unless the
// user selected cells explicitly, pasted cells become rows of the table (or
// a new table) instead.
const handleTablePaste = (view: EditorView, slice: Slice): boolean => {
    const { state } = view;
    if (state.selection instanceof CellSelection || !isInTable(state)) {
        return false;
    }

    const rows = pastedRows(slice, state.schema);
    if (!rows && !containsTableAmongBlocks(slice)) {
        return false;
    }

    const tr = state.tr.deleteSelection();
    const $cell = cellAround(tr.selection.$head);
    if (rows) {
        insertRows(tr, $cell, rows);
    } else {
        insertBlocks(tr, $cell, slice.content);
    }

    view.dispatch(tr.scrollIntoView());

    return true;
};

const insertRows = (
    tr: Transaction,
    $cell: ResolvedPos | null,
    rows: Fragment
): void => {
    const table = tableNodeTypes(tr.doc.type.schema).table.create(null, rows);
    if ($cell && rowsFitBelow($cell, TableMap.get(table).width)) {
        insertAt(tr, $cell.after(), rows);

        return;
    }

    insertBlocks(tr, $cell, Fragment.from(table));
};

const insertBlocks = (
    tr: Transaction,
    $cell: ResolvedPos | null,
    blocks: Fragment
): void => {
    if ($cell) {
        insertAt(tr, $cell.after(-1), blocks);

        return;
    }

    tr.replaceSelection(new Slice(blocks, 0, 0));
};

const insertAt = (tr: Transaction, pos: number, content: Fragment): void => {
    const step = tr.steps.length;
    tr.insert(pos, content);
    const end = tr.mapping.slice(step).mapResult(pos, 1).pos;
    tr.setSelection(Selection.near(tr.doc.resolve(end), -1));
};

// A new row would split any cell spanning the boundary below the caret's row.
const rowsFitBelow = ($cell: ResolvedPos, width: number): boolean => {
    const map = TableMap.get($cell.node(-1));
    if (width !== map.width) {
        return false;
    }

    const boundary = map.findCell($cell.pos - $cell.start(-1)).top + 1;
    if (boundary >= map.height) {
        return true;
    }

    for (let col = 0; col < map.width; col++) {
        const above = map.map[(boundary - 1) * map.width + col];
        const below = map.map[boundary * map.width + col];
        if (above === below) {
            return false;
        }
    }

    return true;
};

// Reads the slice the way prosemirror-tables does: strip the wrappers a copy
// from inside a table leaves around the content, then accept rows or cells.
const pastedRows = (slice: Slice, schema: Schema): Fragment | null => {
    let { content, openStart, openEnd } = slice;
    while (
        content.childCount === 1 &&
        ((openStart > 0 && openEnd > 0) ||
            content.firstChild!.type.spec.tableRole === 'table')
    ) {
        openStart--;
        openEnd--;
        content = content.firstChild!.content;
    }

    const role = content.firstChild?.type.spec.tableRole;
    if (role === 'row') {
        return content;
    }

    if (role === 'cell' || role === 'header_cell') {
        return Fragment.from(tableNodeTypes(schema).row.create(null, content));
    }

    return null;
};

const containsTableAmongBlocks = (slice: Slice): boolean => {
    if (slice.content.childCount < 2) {
        return false;
    }

    return slice.content.content.some(
        (block) => block.type.spec.tableRole === 'table'
    );
};
