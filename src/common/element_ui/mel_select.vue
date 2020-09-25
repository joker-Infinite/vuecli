<template>
    <el-select class="select" :value="value" @change="selectValue">
        <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        name: "mel_select",
        props: {
            options: {
                type: Array,
                default: []
            },
            value: String
        },
        data() {
            return {}
        },
        methods: {
            selectValue(v) {
                let index = 0;
                this.options.forEach((itm, inx) => {
                    if (itm.value === v) {
                        index = inx;
                    }
                });
                this.$emit('change', v, this.options, index);
            }
        },
        comments: {}
    }
</script>

<style scoped lang="less">
    .select {
        width: 150px;
        border-radius: 10px !important;
        box-shadow: 0 0 10px #38d inset !important;
    }

    .el-input__inner {
        border-radius: 10px !important;
        box-shadow: 0 0 10px #38d inset !important;
    }
</style>