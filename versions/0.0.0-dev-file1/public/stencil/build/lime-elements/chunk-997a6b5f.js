const h = window.LimeElements.h;

const createRandomString = () => {
    const USE_HEX = 36;
    const SKIP_LEADING_ZERODOT = 2;
    return (Math.random()
        .toString(USE_HEX)
        .substring(SKIP_LEADING_ZERODOT) +
        Math.random()
            .toString(USE_HEX)
            .substring(SKIP_LEADING_ZERODOT));
};

export { createRandomString as a };
