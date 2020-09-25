<template>
    <!--  <div class="ice-dragable-flex">-->
    <div class="ice-dragable-flex" :style="{flexDirection:direction}">
        <div class="side" :style="{width:preSideWidth,height:preSideHeight}">
            <div class="ice-full-relative" v-show="!preHidden">
            <slot name="pre"></slot>
            </div>
        </div>
        <div class="main-wrapper">
            <template v-if="preSize>0">
            <div class="drag-line" :style="preLineStyle" @mousedown="dragLine($event,'pre')"
                     v-if="preSide>0&&dragable">
                    <div class="bar" :style="{...lineBarStyle,cursor:preLineStyle.cursor}">
                        <div :class="direction == 'row'?'el-icon-d-caret rotate':'el-icon-d-caret'"></div>
                    </div>
                </div>
                <div class="drag-line" v-if="preSide>0&&!dragable&&foldable" :style="preLineStyle">
                    <div class="bar" :style="lineBarStyle" @click="fold('pre')">
                        <div :class="direction == 'row'?`icon ${preSide==2?'right':'left'}`:`icon top`"></div>
                    </div>
                </div>
            </template>

            <template v-if="postSize>0">
            <div class="drag-line" :style="postLineStyle" @mousedown="dragLine($event,'post')"
                     v-if="postSide>0&&dragable">
                    <div class="bar" :style="{...lineBarStyle,cursor:postLineStyle.cursor}">
                        <div :class="direction == 'row'?'el-icon-d-caret rotate':'el-icon-d-caret'"></div>
                    </div>
                </div>
                <div class="drag-line" v-if="postSide>0&&!dragable&&foldable" :style="postLineStyle">
                    <div class="bar" :style="lineBarStyle" @click="fold('post')">
                        <div :class="direction == 'row'?`icon ${postSide==2?'left':'right'}`:'icon bottom'"></div>
                    </div>
                </div>
            </template>

            <div class="ice-full-absolute" :style="direction == 'row'?'left:6px;right:6px;':'top:6px;bottom:6px;'">
                <slot></slot>
            </div>
        </div>
        <div class="side" :style="{width:postSideWidth,height:postSideHeight}">
            <div class="ice-full-relative" v-show="!postHidden">
            <slot name="post"></slot>
        </div>
    </div>
    </div>
    <!-- </div>-->

</template>

<script>
    export default {
        name: "IceDragableFlex",
        props: {
            direction: {
                type: String,
                default: 'column',
                validator: function (value) {
                    return ['column', 'row'].indexOf(value) !== -1
                }
            },
            preSize: {
                type: Number,
                default: 200,
            },
            postSize: {
                type: Number,
                default: 200,
            },
            dragable: {
                type: Boolean,
                default: false
                }
            ,
            foldable: {
                type: Boolean,
                default: false
            }

        },
        data() {
            return {
                lineSize: 6,
                preSide: 200,
                postSide: 200,
                preHidden: false,
                postHidden: false,
                preSideHistory: 0,
                postSideHistory: 0
            }
        },
        methods: {
            dragLine(e, type) {
                let startX = e.clientX;
                let startY = e.clientY;

                let thiz = this;
                let preSide = thiz.preSide;
                let postSide = thiz.postSide;


                let canmove = true;
                document.onmousemove = function (e) {
                    e.preventDefault();
                    if (!canmove) {
                        return
                    }

                    //得到鼠标拖动的宽高距离：取绝对值
                    let distX = e.clientX - startX;
                    let distY = e.clientY - startY;
                    if (type == 'pre') {
                        if (thiz.direction == 'row') {
                            const size = (preSide + distX) < 50 ? 50 : (preSide + distX)
                            thiz.$emit("update:preSize", size)
                            thiz.preSide = size
                        } else {
                            const size = (preSide + distY) < 50 ? 50 : (preSide + distY)
                            thiz.$emit("update:preSize", size)
                            thiz.preSide = size
                        }
                    } else {
                        if (thiz.direction == 'row') {
                            const size = (postSide - distX) < 50 ? 50 : (postSide - distX)
                            thiz.$emit("update:postSize", size)
                            thiz.postSide = size
                        } else {
                            const size = (postSide - distY) < 50 ? 50 : (postSide - distY)
                            thiz.$emit("update:postSize", size)
                            thiz.postSide = size
                        }
                    }


                }

                document.onmouseup = function (e) {
                    canmove = false;
                    e.preventDefault();
                    document.onmousemove = null;
                }
            },
            fold(type) {
                if (type == 'pre') {
                    if (this.preSide == 2) {
                        this.preHidden = false
                        this.preSide = this.preSideHistory
                        this.$emit("update:preSize", this.preSideHistory)
                    } else {
                        this.preSideHistory = this.preSide;
                        this.preSide = 2;
                        this.preHidden = true
                        this.$emit("update:preSize", 2)
                    }
                } else {
                    if (this.postSide == 2) {
                        this.postHidden = false
                        this.postSide = this.postSideHistory
                        this.$emit("update:postSize", this.postSideHistory)
                    } else {
                        this.postSideHistory = this.postSide;
                        this.postSide = 2
                        this.postHidden = true
                        this.$emit("update:postSize", 2)
                    }
                }
            }
        },
        computed: {
            preSideHeight() {
                if (this.direction == 'row') {
                    return '100%'
                } else {
                    return this.preSide + 'px';
                }

            },
            preSideWidth() {
                if (this.direction == 'column') {
                    return '100%'
                } else {
                    return this.preSide + 'px';
                }
            },
            postSideHeight() {
                if (this.direction == 'row') {
                    return '100%'
                } else {
                    return this.postSide + 'px';
                }

            },
            postSideWidth() {
                if (this.direction == 'column') {
                    return '100%'
                } else {
                    return this.postSide + 'px';
                }
            },
            preLineStyle() {
                if (this.direction == 'row') {
                    return {
                        top: '0',
                        left: '-3px',
                        width: this.lineSize + 'px',
                        bottom: '0',
                        cursor: this.dragable ? 'e-resize' : 'auto',
                        flexDirection: 'row'
                    }
                } else {
                    return {
                        top: '-3px',
                        left: '0',
                        height: this.lineSize + 'px',
                        right: '0',
                        cursor: this.dragable ? 'n-resize' : 'auto',
                        flexDirection: 'column'
                    }
                }
            },
            lineBarStyle() {
                if (this.direction == 'row') {
                    return {
                        height: '100px',
                        width: '100%'
                    }
                } else {
                    return {
                        height: '100%',
                        width: '100px'
                    }
                }
            },
            postLineStyle() {
                if (this.direction == 'row') {
                    return {
                        top: '0',
                        right: '-3px',
                        width: this.lineSize + 'px',
                        bottom: '0',
                        cursor: this.dragable ? 'e-resize' : 'auto'
                    }
                } else {
                    return {
                        bottom: '-3px',
                        right: '0',
                        height: this.lineSize + 'px',
                        left: '0',
                        cursor: this.dragable ? 'n-resize' : 'auto'
                    }
                }
            },

        },
        watch: {},
        created() {
            this.preSide = this.preSize
            this.postSide = this.postSize
        },
        components: {}
    }

</script>


<style lang="less" scoped>
    .ice-dragable-flex {
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
        box-sizing: border-box;
        /* border: 2px solid #c6c7cb;*/
        padding: 1px;

        .side {
            flex-grow: 0;
            /*transition: all 0.6s;*/
        }

        .main-wrapper {
            flex-grow: 1;
            position: relative;
            /*background: #e2dadb;*/

            .drag-line {
                position: absolute;
                background: #f5f6fb;
                z-index: 100;
                display: flex;
                align-items: center;
                justify-content: center;

                .bar {

                    background: #c5c5c5;
                    cursor: pointer;
                    color: #000;
                    border-radius: 2px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .icon {
                        width: 0;
                        height: 0;
                    }

                    .el-icon-d-caret.rotate {
                        transform: rotate(90deg);
                    }

                    .icon.right {
                        border-top: 4px solid #c5c5c5;
                        border-bottom: 4px solid #c5c5c5;
                        border-left: 4px solid #000;
                    }

                    .icon.left {
                        border-top: 4px solid #c5c5c5;
                        border-bottom: 4px solid #c5c5c5;
                        border-right: 4px solid #000;
                    }

                    .icon.top {
                        border-left: 4px solid #c5c5c5;
                        border-right: 4px solid #c5c5c5;
                        border-bottom: 4px solid #000;
                    }

                    .icon.bottom {
                        border-left: 4px solid #c5c5c5;
                        border-top: 4px solid #000;
                        border-right: 4px solid #c5c5c5;
                    }

                }
            }

            /*.drag-line.pre {
                top: 0;
                left: 0;
            }
            .drag-line.post {
                top: 0;
                right: 0;
            }*/
        }
    }
</style>
