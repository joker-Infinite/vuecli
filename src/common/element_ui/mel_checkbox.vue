<template>
    <div style="width: 100%;height: 100%">
        <el-checkbox v-if="allSelect" :indeterminate="isIndeterminate" v-model="checkAll"
                     @change="handleCheckAllChange">全选
        </el-checkbox>
        <div v-if="allSelect" style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedData" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(value,index) in options" :label="value" :key="index">{{value}}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
    export default {
        name: "mel_checkbox",
        props: {
            allSelect: {
                type: Boolean,
                default: true
            },
            options: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                checkAll: false,
                isIndeterminate: false,
                checkedData: []
            };
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedData = val ? this.options : [];
                this.$emit('change', this.checkedData, this.options);
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(val) {
                let checked = val.length;
                this.checkAll = checked === this.options.length;
                this.isIndeterminate = checked > 0 && checked < this.options.length;
                this.$emit('change', val, this.options);
            }
        }
    }
</script>

<style scoped>

</style>