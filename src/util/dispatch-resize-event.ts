export const dispatchResizeEvent = () => {
    const resizeEvent = new UIEvent('resize', { view: window, detail: 0 });
    window.dispatchEvent(resizeEvent);
};
