export class Fullscreen {
    private enter: () => void;
    private exit: () => void;

    constructor(element: any) {
        this.enter =
            element.requestFullscreen ||
            element.msRequestFullscreen ||
            element.mozRequestFullScreen ||
            element.webkitRequestFullscreen;
        this.enter = this.enter.bind(element);
        const doc: any = window.document;
        this.exit =
            doc.exitFullscreen ||
            doc.msExitFullscreen ||
            doc.mozCancelFullScreen ||
            doc.webkitExitFullscreen;
    }

    public requestFullscreen = () => {
        if (this.enter) {
            this.enter();
        }
    };

    public exitFullscreen = () => {
        if (this.exit) {
            this.exit.bind(window.document)();
        }
    };

    public toggle = () => {
        const doc: any = window.document;
        const isFullscreen =
            doc.fullscreenElement ||
            doc.mozFullScreenElement ||
            doc.webkitFullscreenElement ||
            doc.msFullscreenElement;

        if (isFullscreen) {
            this.exitFullscreen();
        } else {
            this.requestFullscreen();
        }
    };

    public isSupported(): boolean {
        return !!this.requestFullscreen;
    }
}
