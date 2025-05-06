import { EditorView, NodeView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { ImageState } from '../../../text-editor.types';
import translate from '../../../../../global/translations';
import { Languages } from '../../../../date-picker/date.types';

const MIN_WIDTH = 10;

export const createImageViewPlugin = (language: Languages) => {
    return new Plugin({
        props: {
            nodeViews: {
                image: (node, view, getPos) => {
                    return new ImageView(node, view, getPos, language);
                },
            },
        },
    });
};

class ImageView implements NodeView {
    node: Node;
    view: EditorView;
    getPos: () => number;
    dom: HTMLDivElement;
    img: HTMLImageElement;
    language: Languages;

    public constructor(
        node: Node,
        view: EditorView,
        getPos: () => number,
        language: Languages,
    ) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.language = language;

        this.dom = document.createElement('div');
        this.dom.className = `image-wrapper state-${node.attrs.state}`;

        this.img = document.createElement('img');
        this.img.src = node.attrs.src;
        this.img.alt = node.attrs.alt;
        this.img.style.maxWidth = node.attrs.maxWidth;
        this.img.style.width = node.attrs.width;

        this.dom.appendChild(this.img);

        this.transitionBetweenStates();
    }

    private createResizeHandle = (position: 'bottom-right' | 'top-left') => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${position}`;
        handle.setAttribute('role', 'slider');
        handle.setAttribute(
            'aria-label',
            translate.get('editor-image-view.resize-handle', this.language),
        );
        handle.setAttribute('tabindex', '0');
        handle.setAttribute('aria-valuemin', MIN_WIDTH.toString());
        handle.setAttribute('aria-valuenow', this.img.offsetWidth.toString());
        handle.setAttribute('aria-valuetext', `${this.img.offsetWidth} pixels`);
        handle.setAttribute('aria-grabbed', 'false');

        handle.addEventListener('pointerdown', (e: PointerEvent) => {
            handle.setAttribute('aria-grabbed', 'true');
            this.onResizeStart(e, position);
        });

        return handle;
    };

    private onResizeStart = (
        event: PointerEvent,
        position: 'bottom-right' | 'top-left',
    ) => {
        event.preventDefault();
        const handle = event.target as HTMLElement;

        const startX = event.clientX;
        const startWidth = this.img.offsetWidth;

        const onPointerMove = (e: PointerEvent) => {
            const delta = e.clientX - startX;
            const widthDelta = position === 'top-left' ? -delta : delta;
            const newWidth = Math.max(MIN_WIDTH, startWidth + widthDelta);

            this.img.style.width = `${newWidth}px`;

            const handles = this.dom.querySelectorAll('.resize-handle');
            handles.forEach((resizeHandle) => {
                resizeHandle.setAttribute('aria-valuenow', newWidth.toString());
                resizeHandle.setAttribute(
                    'aria-valuetext',
                    `${newWidth} pixels`,
                );
            });
        };

        const onPointerUp = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            handle.setAttribute('aria-grabbed', 'false');

            this.view.dispatch(
                this.view.state.tr.setNodeMarkup(this.getPos(), undefined, {
                    ...this.node.attrs,
                    width: this.img.style.width,
                    height: this.node.attrs.height,
                }),
            );
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    private createLoadingState = () => {
        this.dom.setAttribute('aria-live', 'polite');
        this.dom.setAttribute('aria-busy', 'true');
        this.dom.setAttribute(
            'aria-label',
            translate.get('editor-image-view.loading', this.language, {
                filename: this.node.attrs.alt || 'file',
            }),
        );

        const spinnerElement = document.createElement('limel-linear-progress');
        spinnerElement.setAttribute('indeterminate', 'true');
        this.dom.appendChild(spinnerElement);
    };

    private createSuccessState = () => {
        this.dom.setAttribute('aria-live', 'polite');
        this.dom.setAttribute('aria-busy', 'false');
        this.dom.setAttribute(
            'aria-label',
            translate.get('editor-image-view.success', this.language, {
                filename: this.node.attrs.alt || 'file',
            }),
        );

        const bottomRightHandle = this.createResizeHandle('bottom-right');
        const topLeftHandle = this.createResizeHandle('top-left');

        this.dom.appendChild(bottomRightHandle);
        this.dom.appendChild(topLeftHandle);
    };

    private createFailedState = () => {
        this.dom.setAttribute('aria-live', 'assertive');
        this.dom.setAttribute('aria-busy', 'false');
        this.dom.setAttribute(
            'aria-label',
            translate.get('editor-image-view.failed', this.language, {
                filename: this.node.attrs.alt || 'file',
            }),
        );
    };

    private cleanUpPreviousState = () => {
        Array.from(this.dom.childNodes).forEach((child) => {
            if (!(child instanceof HTMLImageElement)) {
                child.remove();
            }
        });
    };

    private transitionBetweenStates = () => {
        this.cleanUpPreviousState();
        this.dom.className = `image-wrapper state-${this.node.attrs.state}`;

        if (this.node.attrs.state === ImageState.LOADING) {
            this.createLoadingState();
        } else if (this.node.attrs.state === ImageState.SUCCESS) {
            this.createSuccessState();
        } else if (this.node.attrs.state === ImageState.FAILED) {
            this.createFailedState();
        }
    };

    private transitioningBetweenSuccessStates = (newNode: Node): boolean => {
        return (
            this.node.attrs.state === ImageState.SUCCESS &&
            newNode.attrs.state === ImageState.SUCCESS
        );
    };

    // Ensure that the existing NodeView is reused rather than recreated.
    // Recreating the NodeView will cause flickering between states.
    public update(node: Node): boolean {
        if (!this.transitioningBetweenSuccessStates(node)) {
            this.img.src = node.attrs.src;
            this.img.alt = node.attrs.alt;
            this.img.style.maxWidth = node.attrs.maxWidth;
            this.img.style.width = node.attrs.width;
        }

        this.node = node;
        this.transitionBetweenStates();

        return true;
    }
}
