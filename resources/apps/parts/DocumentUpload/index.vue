<template>
    <div class="v-uploader">
        <div class="v-uploader__button" :id="uuid"></div>
        <slot></slot>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import shortid from 'shortid';
import qq from 'fine-uploader/lib/core';

export default {
    name: 'v-document-upload',

    props: {
        acceptFiles: {
            type: String,
            default: 'image/png, image/jpeg, application/pdf, application/zip'
        },

        allowedExtensions: {
            type: Array,
            default:() => (['png', 'jpg', 'jpeg', 'pdf', 'zip']) 
        },

        callback: {
            type: Function,
            default:() => {}
        },

        documentName: {
            type: String,
            default: null
        }
    },

    computed: {
        ...mapState(['auth', 'upload'])
    },

    data:() => ({
        uuid: shortid.generate(),
    }),

    mounted() {
        this.initFineUploader();
    },

    methods: {
        initFineUploader: function() {
            let _this = this;
            let requestUrl = this.documentName ? '/api/document?documentName=' + this.documentName : '/api/document';
            let combineUrl = this.documentName ? '/api/document?documentName=' + this.documentName + '&completed=true' : '/api/document?completed=true';

            let options = {
                button: document.getElementById(_this.uuid),

                request: {
                    customHeaders: {
                        Authorization: _this.auth.token
                    },
                    endpoint: requestUrl,
                    filenameParam: 'fileName',
                    inputName: 'fileUpload',
                    uuidName: 'uuid',
                    totalFileSizeName: 'totalFileSize'
                },

                chunking: {
                    enabled: true,
                    mandatory: true,
                    // partSize: 50000,
                    paramNames: {
                        chunkSize: 'chunkSize',
                        partByteOffset: 'partByteOffset',
                        partIndex: 'partIndex',
                        totalParts: 'totalParts'
                    },
                    success: {
                        endpoint: combineUrl
                    }
                },

                validation: {
                    acceptFiles: _this.acceptFiles,
                    allowedExtensions: _this.allowedExtensions
                },

                callbacks: {
                    onUpload: function () {
                        _this.$store.commit('upload', { progress: true });
                    },

                    onUploadChunk: function (id, name, data) {
                        let value = (parseInt(data.partIndex) + 1) / parseInt(data.totalParts) * 100;
                        
                        _this.$store.commit('upload', { value: value });
                        
                        if (value >= 100) {
                            _this.$store.commit('upload', { combined: true });
                        }
                    },

                    onComplete: function (id, name, response) {
                        if (!response.success) {
                            _this.$store.dispatch('errors', response.error);
                        } else {
                            if (typeof _this.callback === 'function') {
                                _this.callback(response.record)
                            }

                            _this.$store.commit('upload', {
                                combined: false,
                                progress: false,
                                value: 0
                            });
                        }
                    },

                    onError: function (id, name, errorReason, xhrOrXdr) {
                        if (xhrOrXdr && xhrOrXdr.status == 401) {
                            _this.$store.dispatch('signout');
                        } else {
                            _this.$store.dispatch('errors', errorReason);
                        }

                        _this.$store.commit('upload', {
                            combined: false,
                            progress: false,
                            value: 0
                        });
                    },
                }
            };

            return new qq.FineUploaderBasic(options);
        },
    }
};
</script>
