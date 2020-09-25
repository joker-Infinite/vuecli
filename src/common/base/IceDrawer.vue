<template>
    <div style="position: absolute;transition: all 0.4s ease-out;width: 0px" v-show="value">
        <div class="ice-drawer-mask">
        </div>
        <div class="ice-drawer-wrap" @click="maskClick">
            <div class="ice-drawer" :style="{right:value?'0px':'-'+width+'px'}" @click.stop="stop">
                <div class="ice-drawer-content">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "IceDrawer",
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: Boolean,
            width: {
                type: Number,
                default: 300
            }
        },
        data() {
            return {
                contentWidth: 0
            }
        },
        methods: {
            maskClick() {
                console.log("maskClick")
                this.$emit('change', false)
            },
            stop() {

            }
        },
        watch: {
            value() {
                if (this.value) {
                    this.contentWidth = this.width
                } else {
                    this.contentWidth = 0;
                }
            }
        }
    }
</script>

<style scoped>

    .ice-drawer-mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(55, 55, 55, .6);
        height: 100%;
        z-index: 2001;
    }

    .ice-drawer-wrap {
        position: fixed;
        overflow: auto;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2001;
        -webkit-overflow-scrolling: touch;
        outline: 0;
    }

    .ice-drawer {
        right: 0;
        width: 400px;
        height: 100%;
        position: fixed;
        top: 0;
        transition: all 0.4s ease-out;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
    }

    .ice-drawer-content {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: #fff;
        border: 0;
        background-clip: padding-box;
        padding: 20px 10px;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
    }
</style>