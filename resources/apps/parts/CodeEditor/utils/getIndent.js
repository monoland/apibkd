const getLine = (plain, cursorPos) => {
    const startSlice = plain.slice(0, cursorPos);
    const lastNewline = startSlice.lastIndexOf("\n") + 1;
    const lineSlice = startSlice.slice(lastNewline);
    return lineSlice;
};

const indentRe = /^\s+/;

export const getIndent = (plain, cursorPos) => {
    const line = getLine(plain, cursorPos);
    const matches = line.match(indentRe);
    
    if (matches === null) return "";

    return matches[0] || "";
};

const deindentSpacesRe = /^(\t| {2})* {2}$/;

export const getDeindentLevel = (plain, cursorPos) => {
    const line = getLine(plain, cursorPos);

    if (!deindentSpacesRe.test(line)) return 0;

    return 2;
};
