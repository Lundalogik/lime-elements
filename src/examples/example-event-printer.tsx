import { Component, h, Method, State } from '@stencil/core';
import dayjs from 'dayjs';
/**
 * The `limel-example-event-printer` component is a utility component used in
 * Lime Elements documentation for debugging and displaying events
 * that occur in component examples.
 *
 * ## Purpose
 * This component acts as an event logger that:
 * - Captures and displays events in a readable format
 * - Shows event details in an expandable view
 * - Timestamps each event occurrence
 * - Pretty-prints event data
 *
 * ## Usage
 * ```tsx
 * <limel-example-event-printer ref={(el) => this.eventPrinter = el} />
 * // Later in your code:
 * this.eventPrinter.writeEvent(event);
 * ```
 *
 * ## State Management
 * Uses `@State()` decorator to maintain an array of caught events
 * Each event entry contains:
 * - `timestamp`: String representation of when the event occurred
 * - `event`: The actual Event object
 *
 * ## Display Format
 * Events are displayed in a collapsible `<details>` element with:
 * - Summary showing timestamp, event type, and basic details
 * - Expandable section showing the full event data
 * - Code formatting for better readability
 *
 * @private
 */
@Component({
    tag: 'limel-example-event-printer',
    styleUrl: 'example-event-printer.scss',
})
export class ExampleEventPrinter {
    @State()
    private caughtEvents: Array<{ timestamp: string; event: Event }> = [];

    protected eventCatcher!: HTMLElement;

    constructor() {
        this.formatEvent = this.formatEvent.bind(this);
        this.pushEvent = this.pushEvent.bind(this);
    }

    @Method()
    public async writeEvent(event: Event) {
        console.log(event);
        this.pushEvent(event);
    }

    public render() {
        return [
            <header>Caught events:</header>,
            this.caughtEvents.map(this.formatEvent),
        ];
    }

    private formatEvent({ timestamp, event }) {
        return (
            <details>
                <summary>
                    {`${timestamp} ${event
                        .toString()
                        .replace(/\[object (.*)\]/, '$1')}: `}
                    type=<code>{event.type}</code> detail=
                    <code>{`${event.detail}`}</code>
                </summary>
                <pre>
                    <code>{serializeEvent(event)}</code>
                </pre>
            </details>
        );
    }

    private pushEvent(event: Event) {
        this.caughtEvents = [
            { timestamp: dayjs().format('HH:mm:ss.SSS'), event: event },
            ...this.caughtEvents,
        ];
    }
}

function serializeEvent(e: any) {
    if (!e) {
        return;
    }

    const obj = {
        eventName: e.toString(),
        altKey: e.altKey,
        bubbles: e.bubbles,
        button: e.button,
        buttons: e.buttons,
        cancelBubble: e.cancelBubble,
        cancelable: e.cancelable,
        clientX: e.clientX,
        clientY: e.clientY,
        composed: e.composed,
        ctrlKey: e.ctrlKey,
        currentTarget: e.currentTarget ? e.currentTarget.outerHTML : null,
        defaultPrevented: e.defaultPrevented,
        detail: e.detail,
        eventPhase: e.eventPhase,
        fromElement: e.fromElement ? e.fromElement.outerHTML : null,
        isTrusted: e.isTrusted,
        layerX: e.layerX,
        layerY: e.layerY,
        metaKey: e.metaKey,
        movementX: e.movementX,
        movementY: e.movementY,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        pageX: e.pageX,
        pageY: e.pageY,
        path: e.path?.length ? e.path.map((n) => n.localName) : null,
        relatedTarget: e.relatedTarget ? e.relatedTarget.outerHTML : null,
        returnValue: e.returnValue,
        screenX: e.screenX,
        screenY: e.screenY,
        shiftKey: e.shiftKey,
        sourceCapabilities: null,
        target: e.target ? e.target.outerHTML : null,
        timeStamp: e.timeStamp,
        toElement: e.toElement ? e.toElement.outerHTML : null,
        type: e.type,
        view: e.view ? e.view.toString() : null,
        which: e.which,
        x: e.x,
        y: e.y,
    };
    if (e.sourceCapabilities) {
        obj.sourceCapabilities = e.sourceCapabilities.toString();
    }

    return JSON.stringify(obj, null, 2);
}
