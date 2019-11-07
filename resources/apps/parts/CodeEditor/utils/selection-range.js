import iterator from "dom-iterator";

function position(el, pos) {
    let selection = window.getSelection();

    if (1 == arguments.length) {
        if (!selection.rangeCount) return;

        let indexes = {};
        let range = selection.getRangeAt(0);
        let clone = range.cloneRange();
        clone.selectNodeContents(el);
        clone.setEnd(range.endContainer, range.endOffset);
        indexes.end = clone.toString().length;
        clone.setStart(range.startContainer, range.startOffset);
        indexes.start = indexes.end - clone.toString().length;
        indexes.atStart = clone.startOffset === 0;
        indexes.commonAncestorContainer = clone.commonAncestorContainer;
        indexes.endContainer = clone.endContainer;
        indexes.startContainer = clone.startContainer;

        return indexes;
    }

    let setSelection = pos.end && pos.end !== pos.start;
    let length = 0;

    let range = document.createRange();
    let it = iterator(el).select(Node.TEXT_NODE).revisit(false);

    let next;
    let startindex;
    let start = pos.start > el.textContent.length ? el.textContent.length : pos.start;
    let end = pos.end > el.textContent.length ? el.textContent.length : pos.end;
    let atStart = pos.atStart;

    while ((next = it.next())) {
        let olen = length;
        length += next.textContent.length;

        let atLength = atStart ? length > start : length >= start;
        if (!startindex && atLength) {
            startindex = true;
            range.setStart(next, start - olen);
            if (!setSelection) {
                range.collapse(true);
                makeSelection(el, range);
                break;
            }
        }

        if (setSelection && length >= end) {
            range.setEnd(next, end - olen);
            makeSelection(el, range);
            break;
        }
    }
}

function makeSelection(el, range) {
    let selection = window.getSelection();
    el.focus();
    selection.removeAllRanges();
    selection.addRange(range);
}

export default position;
