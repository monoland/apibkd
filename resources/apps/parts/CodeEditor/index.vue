<template>
    <div class="v-editor">
        <div
            class="v-editor__line-numbers"
            aria-hidden="true"
            v-if="lineNumbers"
        >
            <div
            class="v-editor__line-number token comment"
            v-for="line in lineNumbersCount"
            :key="line"
            >{{ line }}</div>
        </div>

        <pre
            class="v-editor__code"
            :class="{ ['language-' + language]: true }"
            ref="pre"
            v-html="content"
            :contenteditable="!readonly"
            @keydown="handleKeyDown"
            @keyup="handleKeyUp"
            @click="handleClick"
            spellCheck="false"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            data-gramm="false"
        ></pre>
    </div>
</template>

<script>
import prism from "./utils/prism";
import escapeHtml from "escape-html";
import normalizeHtml from "./utils/normalizeHtml.js";
import htmlToPlain from "./utils/htmlToPlain.js";
import selectionRange from "./utils/selection-range.js";
import { getIndent, getDeindentLevel } from "./utils/getIndent";

export default {
    name: 'v-code-editor',

    model: {
        prop: "code",
        event: "change"
    },

    props: {
        emitEvents: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            default: "js"
        },
        lineNumbers: {
            type: Boolean,
            default: false
        },
        autoStyleLineNumbers: {
            type: Boolean,
            default: true
        },
        readonly: {
            type: Boolean,
            default: false
        },
        code: {
            type: String,
            default: ""
        }
    },

    computed: {
        content: function() {
            return prism(this.codeData, this.language);
        },

        lineNumbersCount: function() {
            let totalLines = this.codeData.split(/\r\n|\n/).length;
            
            if (this.codeData.endsWith("\n")) {
                totalLines--;
            }

            return totalLines;
        }
    },

    data:() => ({
        undoStack: [],
        selection: undefined,
        lineNumbersHeight: "20px",
        undoOffset: 0,
        undoTimestamp: 0,
        lastPos: 0,
        codeData: "",
        composing: false
    }),

    mounted() {
        this.recordChange(this.getPlain());
        this.undoTimestamp = 0;
        this.styleLineNumbers();

        const onPaste = e => {
            e.preventDefault();
            const currentCursorPos = selectionRange(this.$refs.pre);

            var text = (e.originalEvent || e).clipboardData.getData("Text");
            document.execCommand("insertHTML", false, escapeHtml(text));

            const newCursorPos = currentCursorPos.end + text.length;
            this.selection = { start: newCursorPos, end: newCursorPos };

            const plain = this.getPlain();
            this.recordChange(plain, this.selection);
            this.updateContent(plain);
            this.setLineNumbersHeight();
        };
        
        const $pre = this.$refs.pre;

        $pre.addEventListener("paste", onPaste);
        
        this.$once("hook:beforeDestroy", () => {
            $pre.removeEventListener("paste", onPaste);
        });

        $pre.addEventListener("compositionstart", () => {
            this.composing = true;
        });
        
        $pre.addEventListener("compositionend", () => {
            this.composing = false;
        });
    },

    updated() {
        if (this.selection) {
            selectionRange(this.$refs.pre, this.selection);
        }
    },
    
    methods: {
        setLineNumbersHeight: function() {
            this.lineNumbersHeight = getComputedStyle(this.$refs.pre).height;
        },

        styleLineNumbers: function() {
            if (!this.lineNumbers || !this.autoStyleLineNumbers) return;

            const $editor = this.$refs.pre;
            const $lineNumbers = this.$el.querySelector(".v-editor__line-numbers");
            const editorStyles = window.getComputedStyle($editor);

            this.$nextTick(() => {
                const btlr = "border-top-left-radius";
                const bblr = "border-bottom-left-radius";
                $lineNumbers.style[btlr] = editorStyles[btlr];
                $lineNumbers.style[bblr] = editorStyles[bblr];
                $editor.style[btlr] = 0;
                $editor.style[bblr] = 0;

                const stylesList = [
                    "background-color",
                    "margin-top",
                    "padding-top",
                    "font-family",
                    "font-size",
                    "line-height"
                ];

                stylesList.forEach(style => {
                    $lineNumbers.style[style] = editorStyles[style];
                });
                
                $lineNumbers.style["margin-bottom"] = "-" + editorStyles["padding-top"];
            });
        },

        handleClick: function(evt) {
            if (this.emitEvents) {
                this.$emit("editorClick", evt);
            }

            this.undoTimestamp = 0;
            this.selection = selectionRange(this.$refs.pre);
        },

        getPlain: function() {
            if (this._innerHTML === this.$refs.pre.innerHTML) {
                return this._plain;
            }

            const plain = htmlToPlain(normalizeHtml(this.$refs.pre.innerHTML));
            this._innerHTML = this.$refs.pre.innerHTML;
            this._plain = plain;

            return this._plain;
        },

        recordChange: function(plain, selection) {
            if (plain === this.undoStack[this.undoStack.length - 1]) return;
            
            if (this.undoOffset > 0) {
                this.undoStack = this.undoStack.slice(0, -this.undoOffset);
                this.undoOffset = 0;
            }

            const timestamp = Date.now();
            const record = { plain, selection };

            if (timestamp - this.undoTimestamp < 3000) {
                this.undoStack[this.undoStack.length - 1] = record;
            } else {
                this.undoStack.push(record);

                if (this.undoStack.length > 50) {
                    this.undoStack.shift();
                }
            }

            this.undoTimestamp = timestamp;
        },

        updateContent: function(plain) {
            this.$emit("change", plain);
        },

        restoreStackState: function(offset) {
            const { plain, selection } = this.undoStack[
                this.undoStack.length - 1 - offset
            ];

            this.selection = selection;
            this.undoOffset = offset;
            this.updateContent(plain);
        },

        undo: function() {
            const offset = this.undoOffset + 1;
            
            if (offset >= this.undoStack.length) {
                return;
            }

            this.restoreStackState(offset);
        },
        
        redo: function() {
            const offset = this.undoOffset - 1;
            
            if (offset < 0) {
                return;
            }

            this.restoreStackState(offset);
        },

        handleKeyDown: function(evt) {
            if (this.emitEvents) {
                this.$emit("keydown", evt);
            }

            if (evt.keyCode === 9 && !this.ignoreTabKey) {
                document.execCommand("insertHTML", false, "  ");
                evt.preventDefault();
            } else if (evt.keyCode === 8) {
                const { start: cursorPos, end: cursorEndPos } = selectionRange(this.$refs.pre);
            
                if (cursorPos !== cursorEndPos) return;

                const deindent = getDeindentLevel(this.$refs.pre.innerText, cursorPos);
            
                if (deindent <= 0) return;

                for (let i = 0; i < deindent; i++) {
                    document.execCommand("delete", false);
                }

                evt.preventDefault();
            } else if (evt.keyCode === 13) {
                const { start: cursorPos } = selectionRange(this.$refs.pre);
                const indentation = getIndent(this.$refs.pre.innerText, cursorPos);

                document.execCommand("insertHTML", false, "\n " + indentation);
                document.execCommand("delete", false);

                evt.preventDefault();
            } else if (evt.keyCode === 90 && evt.metaKey !== evt.ctrlKey && !evt.altKey) {
                if (evt.shiftKey) {
                    this.redo();
                } else {
                    this.undo();
                }

                evt.preventDefault();
            }
        },

        handleKeyUp: function(evt) {
            const keyupCode = evt.which;
            
            if (this.composing) {
                if (keyupCode === 13) {
                    this.composing = false;
                } else {
                    return;
                }
            }

            if (this.emitEvents) {
                this.$emit("keyup", evt);
            }

            if (evt.keyCode === 91 || evt.keyCode === 93 || evt.ctrlKey || evt.metaKey) {
                return;
            }

            if (evt.keyCode === 13) {
                this.undoTimestamp = 0;
            }

            this.selection = selectionRange(this.$refs.pre);

            if (evt.keyCode !== 37 && evt.keyCode !== 38 && evt.keyCode !== 39 && evt.keyCode !== 40) {
                const plain = this.getPlain();

                this.recordChange(plain, this.selection);
                this.updateContent(plain);
            } else {
                this.undoTimestamp = 0;
            }
        }
    },

    watch: {
        code: {
            immediate: true,

            handler: function(newVal) {
                if (!newVal) {
                    this.codeData = "";
                } else {
                    this.codeData = newVal;
                }
            }
        },
        content: {
            immediate: true,

            handler: function() {
                if (this.lineNumbers) {
                    this.$nextTick(() => {
                        this.setLineNumbersHeight();
                    });
                }
            }
        },
        
        lineNumbers: function() {
            this.$nextTick(() => {
                this.styleLineNumbers();
                this.setLineNumbersHeight();
            });
        }
    },
};
</script>