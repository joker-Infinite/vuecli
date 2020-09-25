<template>
    <div class="label-area" :style="labelAreaStyle">
        <div class="label" :style="labelStyle"><span v-if="required" style="color: red">*</span>{{name}}{{division}}
        </div>
        <div class="label-content " v-bind:class="{'error':errorClass}"
             ref="labelContent">
            <!--      <div class="ice-full-relative">-->
            <slot></slot>
            <!-- </div>-->


            <div v-if="needValid&&errorMsg"
                 style="position: absolute;color: red;font-size: 14px;left: 0;bottom: -18px;">
                {{errorMsg}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'iceLabel',
        props: {
            name: String,
            width: {
                type: Number,
                default: 100
            },
            required: {
                type: Boolean,
                default: false
            },
            position: {
                type: String,
                default: 'left'//left,top
            },
            needValid: {
                type: Boolean,
                default: false
            },
            division: {
                type: String,
                default: ':'
            }
        },
        data() {
            return {
                errorMsg: '',
                errorClass: false
            }
        },
        methods: {
            fireErrorMsg(msg) {
                this.clearError();
                this.errorMsg = msg;
                this.errorClass = true;
            },
            clearError() {
                this.errorMsg = '';
                this.errorClass = false;
            }
        },
        computed: {
            labelAreaStyle() {
                let style = {};
                if (this.position == 'top') {
                    style['flexDirection'] = 'column';
                } else {
                    style['flexDirection'] = 'row';
                }
                if (this.needValid) {
                    style['marginBottom'] = '16px'
                } else {
                    style['marginBottom'] = '5px'
                }
                return style;
            },
            contentWidth() {
                return this.position == 'top' ? '280px' : '200px'
            },
            labelStyle() {
                let style = {};
                if (this.position == 'top') {
                    style['textAlign'] = 'left';
                    style['width'] = '100%';
                    style['marginBottom'] = '6px';
                } else {
                    style['width'] = this.width + 'px';
                }
                return style;
            }
        },
        watch: {},
        mounted() {

        },
        components: {}
    }

</script>

<style lang="css">
    .label-area > .label-content.error .el-input__inner, .label-area > .label-content.error textarea {
        border-color: red;
    }
</style>
<style lang="less" scoped>
    .label-area {
        display: flex;
        align-items: center;
        min-height: 32px;
        padding: 4px 0;
        box-sizing: border-box;
        margin: 5px 0;

        .label {
            font-size: 14px;
            padding-right: 4px;
            text-align: right;
            flex-grow: 0;
            flex-shrink: 0;
            width: 100px;
        }

        .label-content {
            flex-grow: 1;
            /* width: 200px;*/
            position: relative;
            align-self: stretch;
            /* display: flex;*/
            align-items: center;

            /** {
                width: 100%;
            }*/
        }

    }
</style>
