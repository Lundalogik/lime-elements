import {
    Plugin,
    PluginKey,
    Selection,
    TextSelection,
} from 'prosemirror-state';
import { Slice } from 'prosemirror-model';
import { isInTable } from 'prosemirror-tables';

export const tablePastePluginKey = new PluginKey('tablePastePlugin');

// Narrow gate: only intercept when the pasted slice's top-level is a
// complete <table>. Bare <tr>/<td> slices would not fit at block level
// (where the post-table insertion happens), so we let the default
// prosemirror-tables flow handle them.
const sliceStartsWithTable = (slice: Slice): boolean => {
    return slice.content.firstChild?.type.spec.tableRole === 'table';
};

export const createTablePastePlugin = (): Plugin => {
    return new Plugin({
        key: tablePastePluginKey,
        props: {
            handlePaste: (view, _event, slice) => {
                try {
                    const { state } = view;

                    if (!(state.selection instanceof TextSelection)) {
                        return false;
                    }

                    if (!isInTable(state)) {
                        return false;
                    }

                    if (!sliceStartsWithTable(slice)) {
                        return false;
                    }

                    const { $from } = state.selection;
                    let tableDepth = -1;
                    for (let depth = $from.depth; depth > 0; depth--) {
                        if (
                            $from.node(depth).type.spec.tableRole === 'table'
                        ) {
                            tableDepth = depth;
                            break;
                        }
                    }

                    if (tableDepth < 0) {
                        return false;
                    }

                    // Force a closed slice so ProseMirror does not strip the
                    // table/row/cell wrappers when inserting at block level.
                    // parseSlice returns max-open slices (openStart/openEnd > 0),
                    // which would otherwise cause merging into surrounding context.
                    const closedSlice = new Slice(slice.content, 0, 0);
                    const posAfterTable = $from.after(tableDepth);
                    const tr = state.tr.replace(
                        posAfterTable,
                        posAfterTable,
                        closedSlice
                    );
                    const $endPos = tr.doc.resolve(
                        posAfterTable + closedSlice.size
                    );
                    tr.setSelection(
                        Selection.near($endPos, -1)
                    ).scrollIntoView();

                    view.dispatch(tr);

                    return true;
                } catch (error) {
                    console.error(
                        'table-paste-plugin: failed to intercept paste, falling through to default',
                        error
                    );

                    return false;
                }
            },
        },
    });
};
