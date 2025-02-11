import { TextSelection } from 'prosemirror-state';

export const adjustSelectionToFullBlocks = (state) => {
    const { $from, $to } = state.selection;
    const from = $from.pos === $from.start() ? $from.pos : $from.end();
    const to = $to.pos === $to.end() ? $to.pos : $to.start();

    return { from: from, to: to };
};

export const createBlockSelection = (state, from, to) => {
    return new TextSelection(state.doc.resolve(from), state.doc.resolve(to));
};
