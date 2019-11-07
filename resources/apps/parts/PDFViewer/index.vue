<template>
    <div class="pdf-viewer">
        <div class="pdf-viewer__wrap grey darken-2" id="pdf-wrap" v-scroll:#pdf-wrap="onScroll">
            <div class="pdf-viewer__page" v-for="i in numPages" :key="i" 
                :id="`page${i}`"
                :data-render="0" 
                :style="`width: ${viewport.width}px; height: ${viewport.height}px;`"
            >
                <div class="pdf-viewer__canvas">
                    <canvas :id="`canvas${i}`" :style="`min-width: ${viewport.width}px; min-height: ${viewport.height}px;`"></canvas>
                </div>
            </div>  
        </div>

        <div class="pdf-viewer__info grey darken-3 d-flex flex-column">
            <div class="d-flex align-center px-2" style="flex: 1 1 0;">
                <v-btn icon dark @click="zoomOut">
                    <v-icon small>remove</v-icon>
                </v-btn>
                <v-btn icon dark @click="zoomIn">
                    <v-icon small>add</v-icon>
                </v-btn>

                <v-spacer></v-spacer>
                
                <div class="pdf-info__page white--text">
                    <input type="text" v-model="navPage" v-on:keyup.enter="onPageTo" @keypress="isNumber($event)">
                    <span>/</span>
                    <span class="total">{{ numPages }}</span>
                </div>
                
                <v-spacer></v-spacer>
                
                <v-btn icon dark @click="onPrint">
                    <v-icon small>print</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'pdf-viewer',

    computed: {
        ...mapState(['auth', 'http'])
    },

    props: {
        src: {
            type: String,
            default: null
        }
    },

    data:() => ({
        curPage: 0,
        navPage: 0,
        
        numPages: 0,
        scale: 1,
        viewport: {},
        pdf: null,

        onGoTo: false
    }),

    mounted() {
        if (this.src) this.fetchPDF(this.src); 
    },

    methods: {
        fetchPDF: function(fileUrl) {
            let loadingTask = window.pdfjsLib.getDocument({
                url: fileUrl,
                withCredentials: true,
                httpHeaders: {
                    Authorization: this.auth.token
                }
            });

            loadingTask.promise.then(pdfobj => {
                this.numPages = pdfobj.numPages;
                this.pdf = pdfobj;
                this.curPage = this.numPages >= 1 ? 1 : 0;
                this.navPage = this.curPage;

                let nPage = this.numPages >= 5 ? 5 : this.numPages;

                for (let index = 1; index <= nPage; index++) {
                    this.pdf.getPage(index).then(this.renderPage).then(() => {
                        if (this.curPage < this.numPages && this.curPage < nPage) {
                            this.curPage++;
                        } else {
                            this.curPage = 1;
                        }
                    });
                }
            });
        },

        renderPage: function(page) {
            this.viewport = page.getViewport({
                scale: this.scale
            });
            
            let wraper = document.getElementById(`page${this.curPage}`);
                wraper.setAttribute('data-render', 1);

            let canvas = document.getElementById(`canvas${this.curPage}`);
            let context = canvas.getContext('2d');
                canvas.height = this.viewport.height;
                canvas.width = this.viewport.width;
                context.clearRect(0, 0, canvas.width, canvas.height);
            
            const PRINT_RESOLUTION = { value: 50, kind: 0x02 } || 150;
            const PRINT_UNITS = PRINT_RESOLUTION / 72.0;

            page.render({
                canvasContext: context, 
                transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
                viewport: this.viewport,
                intent: 'print'
            });
        },

        resizeCanvas: function()
        {
            this.onGoTo = true;

            this.pdf.getPage(this.navPage).then(page => {
                this.viewport = page.getViewport({
                    scale: this.scale
                });

                for (let index = 1; index <= this.numPages; index++) {
                    let wraper = document.getElementById(`page${index}`);
                        wraper.setAttribute('data-render', 0);

                    let canvas = document.getElementById(`canvas${index}`);
                        canvas.height = this.viewport.height;
                        canvas.width = this.viewport.width;
                }

                this.curPage = this.navPage;
            }).then(() => {
                this.pdf.getPage(this.curPage).then(this.renderPage).then(() => {
                    this.onGoTo = false;
                });
            });
        },

        isNumber: function(e) {
            let evt = (e) ? e : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },

        zoomIn: function() {
            let max = 2.5;

            this.scale = this.scale < max ? this.scale + 0.25 : max;
        },

        zoomOut: function() {
            let min = 0.5;

            this.scale = this.scale > min ? this.scale - 0.25 : min;
        },

        onScroll: function(e) {
            if (!this.onGoTo) {
                let tmpPage = parseInt(e.target.scrollTop / (this.viewport.height + 12)) + 1;
                let rndPage = tmpPage;

                if (tmpPage < this.navPage) {
                    rndPage = rndPage > 1 ? rndPage - 1 : 1;
                } else if (tmpPage > this.navPage) {
                    rndPage = rndPage < this.numPages ? rndPage + 1 : this.numPages;
                }

                this.navPage = tmpPage;

                this.$nextTick(() => {
                    let wraper = document.getElementById(`page${rndPage}`);

                    if (wraper) {
                        let render = parseInt(wraper.getAttribute('data-render'));

                        if (render === 0) {
                            this.curPage = rndPage;

                            this.pdf.getPage(this.curPage).then(this.renderPage).then(() => {
                                if (this.curPage < this.numPages) {
                                    this.curPage++;
                                } else {
                                    this.curPage = this.numPages;
                                }
                            });
                        }
                    }
                });
            }
        },

        onPageTo: function() {
            this.onGoTo = true;

            if (this.navPage > this.numPages) {
                this.navPage = this.numPages;
            } else if (this.navPage < 1) {
                this.navPage = 1;
            }

            this.$vuetify.goTo(`#page${this.navPage}`, { offset: 120, container: '#pdf-wrap' }).then(() => {
                this.onGoTo = false;
            });
        },

        onPrint: function() {
            let pWindow = window.open('', 'Print', 'height=600,width=800');

            pWindow.document.write('<html><head><title>Print</title>');
            pWindow.document.write('</head><body >');
            
            for (let index = 1; index <= this.numPages; index++) {
                let canvas = document.getElementById(`canvas${index}`);
                let images = canvas.toDataURL("image/url");
                pWindow.document.write(`<img src="${images}" style="width: 100%;"/>`);
            }

            pWindow.document.write('</body></html>');
            pWindow.document.close();
            pWindow.focus();

            setTimeout(() => {
                pWindow.print();    
                pWindow.close();
            }, 750);

            return true;
        }
    },

    watch: {
        scale: function() {
            this.resizeCanvas();
        },

        src: function(newVal) {
            if (newVal) this.fetchPDF(newVal);
        }
    }
};
</script>