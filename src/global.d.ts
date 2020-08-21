// The ResizeObserver API is available in all major browsers. However,
// TypeScript has yet to implement any type declarations for it. A basic
// incomplete version of the API is declared here just to get the compiler
// not to throw errors.
//
// https://github.com/microsoft/TypeScript/issues/37861

interface IResizeObserver {
    new (callback: ResizeObserverCallback): IResizeObserver;
    disconnect: () => void;
    observe: (element: Element, options?: object) => void;
    unobserve: (element: Element) => void;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void;

interface ResizeObserverEntry {
    target: Element;
    contentRect: DOMRectReadOnly;
}

declare const ResizeObserver: IResizeObserver;
