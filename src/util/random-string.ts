export const createRandomString = () => {
    if (
        !('crypto' in window) ||
        typeof window.crypto?.randomUUID !== 'function'
    ) {
        return legacyCreateRandomString();
    }

    return 'a_' + crypto.randomUUID(); // ids must start with letters
};

function legacyCreateRandomString() {
    const USE_HEX = 36;
    const SKIP_LEADING_ZERODOT = 2;
    const ASCII_A = 97;
    const NUMBER_OF_LETTERS = 26;

    return (
        String.fromCharCode(
            ASCII_A + Math.floor(Math.random() * NUMBER_OF_LETTERS)
        ) +
        Math.random().toString(USE_HEX).substring(SKIP_LEADING_ZERODOT) +
        Math.random().toString(USE_HEX).substring(SKIP_LEADING_ZERODOT)
    );
}
