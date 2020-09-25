<template>
    <div>
        <el-row v-if="checkAllBtn">
            <el-col :span="24" :style="{'height':!!checkAllHeight?checkAllHeight:''}">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
            </el-col>
        </el-row>
        <el-checkbox-group v-model="checkArr" @change="checkedChange"
                           v-bind="$attrs"
                           v-on="$listeners">
            <el-row>
                <el-col v-for="(item,index) in filtedCheckList"
                        :span="columns>4?((24/columns)%2===0?(24/columns):6):(24/columns)"
                        :key="item.value" :style="{'height':!!checkHeight?checkHeight:''}">
                    <el-checkbox :label="item.value"
                                 :disabled="item.disabled">{{item.label}}
                    </el-checkbox>
                </el-col>
            </el-row>
        </el-checkbox-group>
    </div>

</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "IceDatamapCheckGroup",
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap', 'getDataMapList']),

            /**
             * 全选按钮的change事件
             * @param val
             */
            handleCheckAllChange(val) {
                let arr = [];
                //选中状态则为全部
                this.checkArr = val ? this.filtedCheckList.map((item) => {
                    return item.value
                }) : [];
                arr = val ? this.filtedCheckList.map((item) => {
                    return item.label
                }) : [];
                this.isIndeterminate = false;
                this.$emit('checkedChange', this.checkArr);
                this.$emit('update:text', arr);
            },

            /**
             * checkbox列的change事件
             * @param value
             */
            checkedChange(value) {
                if (this.checkAllBtn) {//当全选按钮显示时执行
                    let checkedCount = value.length;
                    this.checkAll = checkedCount === this.filtedCheckList.length;
                    this.isIndeterminate = checkedCount > 0 && checkedCount < this.filtedCheckList.length;
                }
                let arr = [];
                for (let i = 0; i < value.length; i++) {
                    let label = this.labelVal(this.filtedCheckList, value[i]);
                    if (!!label) {
                        arr.push(label);
                    }
                }
                this.$emit('checkedChange', value);
                this.$emit('update:text', arr);
            },

            /**
             * 获取对应的label
             * @param arr
             * @param val
             * @returns {*}
             */
            labelVal(arr, val) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].value == val) {
                        return arr[i].label;
                    }
                }
                return '';
            }
        },
        props: {
            //数据字典code值
            mapTypeCode: String,

            //一行几个换行
            columns: {
                //当超过4时需要设置为偶数且被24整除，不然会被默认为4
                //(index%columns===0?24-(Math.ceil(24/columns))*(columns-1):Math.ceil(24/columns))
                type: Number,
                default: 4
            },

            //是否显示全选按钮
            checkAllBtn: Boolean,

            //checkBox的上下间距，单位px，如30px
            checkHeight: {
                type: String,
                default: ''
            },

            //全选的上下间距，单位px，如30px，checkAllBtn为true时有效
            checkAllHeight: {
                type: String,
                default: ''
            },

            value: Array,

            filterVal: [Array, String],//过滤的值
        },
        model: {
            prop: 'value',
            event: 'checkedChange'
        },
        data() {
            return {
                checkAll: false,//是否全选
                isIndeterminate: false,//checkAll为true，isIndeterminate为false则为勾选状态，为true则为半勾选
                checkArr: [],//选择的值
            }
        },
        computed: {
            checkList() {//获取数据
                return this.getDataMapList()(this.mapTypeCode)//.filter(item => !item.disabled);
            },
            filtedCheckList() {
                let value = [];
                if (!this.filterVal || this.filterVal.length == 0) {
                    return this.checkList
                }
                if (!this.filterVal instanceof Array) {
                    value = [this.filterVal]
                } else {
                    value = this.filterVal;
                }
                return this.checkList.filter(item => value.indexOf(item.value) == -1)
            }
        },
        created() {
            this.addUndoTypeCodes(this.mapTypeCode)
        },
        watch: {
            mapTypeCode() {
                this.addUndoTypeCodes(this.mapTypeCode)
            },
            value(newValue) {
                if (!newValue) {
                    this.checkArr = [];
                } else {
                    this.checkArr = newValue;
                }
            },
        },
        mounted() {
            this.checkArr = this.value;
            this.checkedChange(this.checkArr);
        }
    }
</script>

<style scoped>

</style>
