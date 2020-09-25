<template>
    <div class="form-group" :name="name" :id="name">
        <div :class="expanded?'title is-active':'title'" style="cursor: pointer" v-if="name&&expandable" @click="expanded=!expanded">
            <div class="bar"></div>
            <div class="name">{{name}}</div>
            <div :class="expanded?'el-icon-arrow-down':'el-icon-arrow-right'"
                 style="position: absolute;right: 8px;line-height: 48px"></div>
        </div>
        <div class="title is-active" v-if="name&&!expandable">
            <div class="bar"></div>
            <div class="name">{{name}}</div>
        </div>
        <el-collapse-transition>
            <div :class="expanded?'form-content is-active':'form-content'" v-show="expanded">
                <slot>
                </slot>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>

    import emitter from 'element-ui/src/mixins/emitter';

    export default {
        name: "IceFormGroup",
        componentName: 'IceFormGroup',
        mixins: [emitter],
        props: {
            name: String,
            code: String,
            expandable: {
                type: Boolean,
                default: true
            },
            defaultExpanded: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                expanded: this.defaultExpanded
            }
        },
        methods: {
            setExpanded(expanded = true) {
                this.expanded = expanded;
            }
        },
        watch:{
            defaultExpanded(val){
                this.expanded = val;
            }
        },
        created() {
            //流程初始化完毕事件
            this.$on('ice-flow-form-ready', data => {
                if (data[this.code]) {
                    const rule = data[this.code];
                    if (rule.isHidden == "0") {
                        this.$el.style.display = 'none'
                        this.broadcast('ElFormItem', 'ice-form-group-invalid');
                    }
                    if (rule.isDisabled == "0") {
                        this.broadcast('ElFormItem', 'ice-form-group-invalid');
                    }

                }
            })
            //表单元素校验不通过，需要快速跳转定位
            this.$on('validateGO', data => {
                this.dispatch('IceFlowForm', 'validateGO', this.name)
            })
        },
        mounted() {
            if (this.name) {
                this.dispatch("IceFlowForm", "ice-flow-group-regist", {name: this.name, el: this.$el, $vue: this})
            }

        },
        beforeDestroy() {
            if (this.name) {
                this.dispatch("IceFlowForm", "ice-flow-group-destory", {name: this.name, el: this.$el, $vue: this})
            }
        },
        components: {}
    }
</script>

<style lang="less" scoped>
    .form-group {
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
        box-sizing: border-box;
        padding-bottom: 0px;
        padding-top: 0px;
    }
    .form-group .title.is-active {
        border-bottom: transparent;
    }
    .form-group .title {
        display: flex;
        height: 40px;
        line-height: 40px;
        margin-bottom: 0px;
        background: white;
        position: relative;
        border-bottom: solid 1px rgb(235, 235, 235);
        transition: border-bottom-color 1s;

        .bar {
            margin-top: 12px;
            height: 24px;
            width: 6px;
            background: #0091b0;
        }

        .name {
            font-size: 15px;
            height: 48px;
            margin-left: 8px;
            vertical-align: middle;
            line-height: 48px
        }
    }

    .form-group .form-content {
        position: relative;
        display: flex;
        flex-flow: wrap;
        padding: 5px 0;
    }
    .form-group .form-content.is-active{
        border-bottom: solid 1px rgb(235, 235, 235);
    }
</style>
