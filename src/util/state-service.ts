export function getState(key: string) {
    return JSON.parse(localStorage.getItem(key));
}

export function setState(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}
