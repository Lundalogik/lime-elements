const h = window.LimeElements.h;

const dispatchResizeEvent = () => {
    /*
     * The shorthand (`window.dispatchEvent(new Event('resize'));`)
     * causes compiler errors, so we go the long way around.
     * See https://stackoverflow.com/a/1818513/280972
     * /Ads
     */
    const resizeEvent = window.document.createEvent('UIEvents');
    resizeEvent.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(resizeEvent);
};

export { dispatchResizeEvent as a };
