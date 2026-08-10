import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
    textSelection,
    typeText,
} from './editor-test-harness';
import { TriggerEventDetail } from '../text-editor.types';
import { ContentTypeConverter } from '../utils/content-type-converter';

const identityConverter: ContentTypeConverter = {
    parseAsHTML: async (text) => text,
    serialize: () => '',
};

interface CollectedEvent {
    type: string;
    detail: TriggerEventDetail;
    composed: boolean;
}

function collectTriggerEvents(target: EventTarget): CollectedEvent[] {
    const events: CollectedEvent[] = [];
    for (const type of ['triggerStart', 'triggerChange', 'triggerStop']) {
        target.addEventListener(type, (event: Event) => {
            events.push({
                type: type,
                detail: (event as CustomEvent<TriggerEventDetail>).detail,
                composed: event.composed,
            });
        });
    }

    return events;
}

let cleanup: (() => void) | undefined;

function setUp(startDoc?, selection?) {
    const harness = createEditorTestHarness({
        triggerCharacters: ['@', '#'],
        contentConverter: identityConverter,
        customElements: [{ tagName: 'test-chip', attributes: ['label'] }],
    });
    const b = harness.builders as Record<string, any>;
    const start = startDoc?.(b);
    const mounted = mountView(
        createEditorTestState(harness, start, start && selection?.(start))
    );
    cleanup = mounted.cleanup;
    const events = collectTriggerEvents(mounted.view.dom);

    return { view: mounted.view, events: events, b: b };
}

function ofType(events: CollectedEvent[], type: string): CollectedEvent[] {
    return events.filter((event) => event.type === type);
}

afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.restoreAllMocks();
});

describe('trigger start conditions', () => {
    it('starts at the beginning of the document', () => {
        const { view, events } = setUp();
        typeText(view, '@');

        expect(events[0].type).toBe('triggerStart');
        expect(events[0].detail.trigger).toBe('@');
        expect(events[0].detail.value).toBe('@');
        for (const event of events.slice(1)) {
            expect(event.type).toBe('triggerChange');
            expect(event.detail.value).toBe('');
        }
        expect(typeof events[0].detail.textEditor.insert).toBe('function');
        expect(typeof events[0].detail.textEditor.insertHtml).toBe('function');
        expect(typeof events[0].detail.textEditor.stopTrigger).toBe('function');
    });

    it('starts after a space', () => {
        const { view, events } = setUp();
        typeText(view, 'x @');

        expect(ofType(events, 'triggerStart')).toHaveLength(1);
    });

    it('does not start mid-word', () => {
        const { view, events } = setUp();
        typeText(view, 'x@');

        expect(events).toEqual([]);
    });

    it('does not start after punctuation', () => {
        const { view, events } = setUp();
        typeText(view, '.@');

        expect(events).toEqual([]);
    });

    it('starts at the beginning of a later paragraph', () => {
        const { view, events } = setUp(
            (b) => b.doc(b.p('a'), b.p()),
            (start) => textSelection(start, 4)
        );
        typeText(view, '@');

        expect(ofType(events, 'triggerStart')).toHaveLength(1);
    });

    it('ignores unconfigured characters', () => {
        const { view, events } = setUp();
        typeText(view, '$');

        expect(events).toEqual([]);
    });

    it('starts while replacing a selection', () => {
        const { view, events } = setUp(
            (b) => b.doc(b.p('ab')),
            (start) => textSelection(start, 1, 3)
        );
        typeText(view, '@');

        expect(ofType(events, 'triggerStart')).toHaveLength(1);
    });

    it('does not start from a programmatic insertion', () => {
        const { view, events } = setUp();
        view.dispatch(view.state.tr.insertText('@'));

        expect(ofType(events, 'triggerStart')).toEqual([]);
    });
});

describe('trigger value accumulation', () => {
    it('accumulates text after the trigger character, spaces included', () => {
        const { view, events } = setUp();
        typeText(view, '@jo hn');

        const values = ofType(events, 'triggerChange')
            .map((event) => event.detail.value)
            .filter((value, index, all) => value !== all[index - 1]);
        expect(values).toEqual(['', 'j', 'jo', 'jo ', 'jo h', 'jo hn']);
    });

    it('fires on a selection-only transaction with no deduplication', () => {
        const { view, events } = setUp();
        typeText(view, '@a');
        const before = ofType(events, 'triggerChange').length;

        view.dispatch(
            view.state.tr.setSelection(textSelection(view.state.doc, 2) as any)
        );

        expect(ofType(events, 'triggerChange').length).toBeGreaterThan(before);
    });

    it('reports an empty value, not a stop, when the cursor moves before the trigger', () => {
        const { view, events } = setUp();
        typeText(view, 'x @a');

        view.dispatch(
            view.state.tr.setSelection(textSelection(view.state.doc, 1) as any)
        );

        expect(events.at(-1).type).toBe('triggerChange');
        expect(events.at(-1).detail.value).toBe('');
        expect(ofType(events, 'triggerStop')).toEqual([]);
    });
});

describe('trigger stop paths', () => {
    it('stops when the trigger character is deleted', () => {
        const { view, events } = setUp();
        typeText(view, '@a');

        view.dispatch(view.state.tr.delete(1, 2));

        const stops = ofType(events, 'triggerStop');
        expect(stops).toHaveLength(1);
        expect(stops[0].detail.value).toBe('');
    });

    it('stops via stopTrigger and allows a fresh start afterwards', () => {
        const { view, events } = setUp();
        typeText(view, '@');

        events.at(-1).detail.textEditor.stopTrigger();
        expect(ofType(events, 'triggerStop')).toHaveLength(1);

        typeText(view, ' @');
        expect(ofType(events, 'triggerStart')).toHaveLength(2);
    });

    it('stops when typing at exactly the trigger position', () => {
        const { view, events } = setUp();
        typeText(view, 'x @a');

        view.dispatch(
            view.state.tr.setSelection(textSelection(view.state.doc, 3) as any)
        );
        typeText(view, 'z');

        expect(ofType(events, 'triggerStop')).toHaveLength(1);
    });

    it('starts a second trigger with no stop for the first', () => {
        const { view, events } = setUp();
        typeText(view, '@a #');

        expect(ofType(events, 'triggerStart')).toHaveLength(2);
        expect(ofType(events, 'triggerStop')).toEqual([]);
    });
});

describe('trigger inserters', () => {
    it('insert replaces the trigger text and appends a trailing space', () => {
        const { view, events } = setUp();
        typeText(view, '@x');

        events.at(-1).detail.textEditor.insert('done');

        expect(view.state.doc.textContent).toBe('done ');
        expect(ofType(events, 'triggerStop')).toHaveLength(1);
    });

    it('insert honors the remapped trigger position', () => {
        const { view, events } = setUp(
            (b) => b.doc(b.p('x ')),
            (start) => textSelection(start, 3)
        );
        typeText(view, '@y');

        view.dispatch(view.state.tr.insertText('AB', 1));
        events.at(-1).detail.textEditor.insert('done');

        expect(view.state.doc.textContent).toBe('ABx done ');
    });

    it('insertHtml pipes through the converter without a trailing space', async () => {
        const { view, events } = setUp();
        typeText(view, '@x');

        await events.at(-1).detail.textEditor.insertHtml('<strong>Y</strong>');

        expect(view.state.doc.textContent).toBe('Y');
        let textNode;
        view.state.doc.descendants((node) => {
            if (node.isText) {
                textNode = node;
            }
        });
        expect(textNode.marks[0].type.name).toBe('strong');
        expect(ofType(events, 'triggerStop')).toHaveLength(1);
    });

    it('insert places a registered custom element node', () => {
        const { view, events } = setUp();
        typeText(view, '@x');

        events.at(-1).detail.textEditor.insert({
            node: { tagName: 'test-chip', attributes: { label: 'a' } },
        });

        let chip;
        view.state.doc.descendants((node) => {
            if (node.type.name === 'test-chip') {
                chip = node;
            }
        });
        expect(chip.attrs.label).toBe('a');
    });

    it('insert logs and leaves the document unchanged for an unknown tag', () => {
        const { view, events } = setUp();
        typeText(view, '@x');
        const before = view.state.doc;
        const errors = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        events.at(-1).detail.textEditor.insert({
            node: { tagName: 'not-registered', attributes: {} },
        });

        expect(errors).toHaveBeenCalled();
        expect(view.state.doc.eq(before)).toBe(true);
    });
});

describe('trigger event mechanics', () => {
    it('dispatches composed, bubbling events observable above the editor', () => {
        const { view } = setUp();
        const outer = collectTriggerEvents(view.dom.parentElement);

        typeText(view, '@');

        expect(outer.length).toBeGreaterThan(0);
        expect(outer.every((event) => event.composed)).toBe(true);
    });

    it('creates a fresh inserter for every event', () => {
        const { view, events } = setUp();
        typeText(view, '@a');

        expect(events[0].detail.textEditor).not.toBe(
            events[1].detail.textEditor
        );
    });
});
