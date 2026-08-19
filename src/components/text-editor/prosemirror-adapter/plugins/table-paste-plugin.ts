import { Plugin, PluginKey, Selection, TextSelection } from 'prosemirror-state';
import { Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { isInTable, selectionCell } from 'prosemirror-tables';

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

    if (!sliceContainsTable(slice)) {
        return false;
    }

    if (!isInTable(state)) {
        return false;
    }

    // Paste replaces the selection: drop any selected range
    // (prosemirror-tables normalizes cross-cell ranges into
    // CellSelection, so a TextSelection is confined to one
    // cell) before inserting the pasted table.
    const posInOldDoc = selectionCell(state).after(-1);
    const tr = state.tr.deleteSelection();

    // Insert the fragment closed (tr.insert) rather than the open-ended
    // pasted slice, so the table/row/cell wrappers survive at block level.
    const posAfterTable = tr.mapping.map(posInOldDoc);
    tr.insert(posAfterTable, slice.content);
    const $endPos = tr.doc.resolve(posAfterTable + slice.content.size);
    tr.setSelection(Selection.near($endPos, -1)).scrollIntoView();

    view.dispatch(tr);

    return true;
};

// Narrow gate: only intercept when the pasted slice contains a
// complete <table> at the top level. Bare <tr>/<td> slices would not
// fit at block level (where the post-table insertion happens), so we
// let the default prosemirror-tables flow handle them.
const sliceContainsTable = (slice: Slice): boolean => {
    for (let i = 0; i < slice.content.childCount; i++) {
        if (slice.content.child(i).type.spec.tableRole === 'table') {
            return true;
        }
    }

    return false;
};
