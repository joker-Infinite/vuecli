<template>
    <el-date-picker v-bind="$attrs"
                    v-model="dateValue"
                    v-on="$listeners"
                    @focus="focus"
                    @input="reComputeTime"
                    :picker-options="{
                        disabledDate:(time)=> {
                            return timeFilter?!timeFilter(time):(maxFun(time)||minFun(time))
                        },
                    }"
                    ref="datePicker">

    </el-date-picker>
</template>
<script>
    import moment from 'moment'
    import {parseDate, formatDate} from 'element-ui/lib/utils/date-util'

    export default {
        name: "IceDatePicker",
        props: {
            max: [String, Date],//最大日期，使用规则：days:1  表示比今天大一天   days:-1  表示比今天小一天  months:1  表示比今天大一个月
            min: [String, Date],
            timeFilter: Function,//优先级最高，格式：time=>{return true}  返回Boolean
            value: [Date, String],
            scope: Object,
            isGuZhang: Boolean
        },
        data() {
            return {
                dateValue: '',
                maxFun: () => {
                    return false;
                },
                minFun: () => {
                    return false;
                },
                initValue: null,//可以置为的最大时间
                minDate: null,
                maxDate: null,
                preDateStr: ''
            }
        },
        created() {
            this.initValue = this.value
        },
        methods: {
            maxRecompute() {

                if (this.max) {

                    if (typeof this.max == 'string' &&
                        (this.max.startsWith("days") ||
                            this.max.startsWith("weeks") ||
                            this.max.startsWith("months") ||
                            this.max.startsWith("years") ||
                            this.max.startsWith("scope"))
                    ) {

                    } else {
                        if (!(this.max instanceof Date)) {
                            this.maxDate = parseDate(this.max, this.$attrs["valueFormat"] || this.$attrs["value-format"])
                        } else {
                            this.maxDate = this.max
                        }

                        this.maxFun = time => {
                            /*time = new Date(time).setHours(0);
                            time = new Date(time).setMinutes(0);
                            time = new Date(time).setSeconds(0);
                            time = new Date(time).setMilliseconds(0);*/

                            let time2 = this.maxDate.getTime();

                            time2 = new Date(time2).setHours(23);
                            time2 = new Date(time2).setMinutes(59);
                            time2 = new Date(time2).setSeconds(59);
                            time2 = new Date(time2).setMilliseconds(0);

                            return time > time2;
                        }

                        return;
                    }


                    let params = this.max.split(":");
                    if (params.length == 0) {
                        return
                    }

                    if (params[0] == 'scope') {
                        this.maxFun = time => {
                            if (!this.scope[params[1]]) {
                                return false
                            }
                            return time > this.scope[params[1]]
                        }
                        return;
                    }

                    let type = 'days';
                    let offset = 0;
                    if (params.length == 1) {
                        offset = parseInt(params[0]);
                    } else if (params.length == 2) {
                        type = params[0];
                        offset = parseInt(params[1]);
                    }
                    let date = moment().add(offset, type)

                    this.maxFun = time => {
                        /*time = new Date(time).setHours(0);
                        time = new Date(time).setMinutes(0);
                        time = new Date(time).setSeconds(0);
                        time = new Date(time).setMilliseconds(0);*/

                        let time2 = date.toDate().getTime();

                        time2 = new Date(time2).setHours(23);
                        time2 = new Date(time2).setMinutes(59);
                        time2 = new Date(time2).setSeconds(59);
                        time2 = new Date(time2).setMilliseconds(0);

                        return time > time2;
                    }

                }
            },
            minRecompute() {

                if (this.min) {


                    if (typeof this.min == 'string' &&
                        (this.min.startsWith("days") ||
                            this.min.startsWith("weeks") ||
                            this.min.startsWith("months") ||
                            this.min.startsWith("years") ||
                            this.min.startsWith("scope"))
                    ) {

                    } else {
                        if (!(this.min instanceof Date)) {
                            this.minDate = parseDate(this.min, this.$attrs["valueFormat"] || this.$attrs["value-format"])
                        } else {
                            this.minDate = this.min
                        }

                        this.minFun = time => {
                            /*time = new Date(time).setHours(0);
                            time = new Date(time).setMinutes(0);
                            time = new Date(time).setSeconds(0);
                            time = new Date(time).setMilliseconds(0);*/

                            let time2 = this.minDate.getTime();

                            time2 = new Date(time2).setHours(0);
                            time2 = new Date(time2).setMinutes(0);
                            time2 = new Date(time2).setSeconds(0);
                            time2 = new Date(time2).setMilliseconds(0);

                            return time < time2;
                        }


                        return;
                    }


                    let params = this.min.split(":");
                    if (params.length == 0) {
                        return
                    }

                    if (params[0] == 'scope') {
                        this.minFun = time => {
                            if (!this.scope[params[1]]) {
                                return false
                            }
                            return time < this.scope[params[1]]
                        }
                        return;
                    }

                    let type = 'days';
                    let offset = 0;
                    if (params.length == 1) {
                        offset = parseInt(params[0]);
                    } else if (params.length == 2) {
                        type = params[0];
                        offset = parseInt(params[1]);
                    }
                    let date = moment().add(offset, type)
                    this.minFun = time => {
                        /*time = new Date(time).setHours(0);
                        time = new Date(time).setMinutes(0);
                        time = new Date(time).setSeconds(0);
                        time = new Date(time).setMilliseconds(0);*/

                        let time2 = date.toDate().getTime();

                        time2 = new Date(time2).setHours(0);
                        time2 = new Date(time2).setMinutes(0);
                        time2 = new Date(time2).setSeconds(0);
                        time2 = new Date(time2).setMilliseconds(0);

                        return time < time2;
                    }
                }
            },
            async focus() {

                // console.log('focus')
                //只有故障入口调用该组件才执行下面的逻辑
                if (!this.isGuZhang) {
                    return
                }
                //延时100ms，给dom留出充足的时间渲染
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, 100)
                })
                let cikeButtons = document.querySelectorAll(".el-picker-panel__footer .el-button--text")
                cikeButtons.forEach(ele => {
                    ele.style.color = "#ccc"
                })

            },

            reComputeTime() {
                if (this.$attrs.type !== 'datetime') {
                    return
                }
                this.$nextTick(_ => {
                    const timepicker = this.$refs.datePicker.picker.$refs.timepicker

                    //判断是否在同一天
                    if (!this.dateValue) {
                        return
                    }

                    let now = null

                    if (this.dateValue instanceof Date) {
                        now = this.dateValue
                    } else {
                        now = parseDate(this.dateValue, this.$attrs["valueFormat"] || this.$attrs["value-format"])
                    }

                    let nowStr = formatDate(now)

                    if (this.preDateStr == nowStr) {
                        return;
                    }


                    let minDateStr = this.minDate ? formatDate(this.minDate) : '';
                    let maxDateStr = this.maxDate ? formatDate(this.maxDate) : '';

                    let min = new Date(2020, 1, 1, 0, 0, 0)
                    let max = new Date(2020, 1, 1, 23, 59, 59)


                    if (minDateStr == nowStr) {
                        min = new Date(2020, 1, 1, this.minDate.getHours(), this.minDate.getMinutes(), this.minDate.getSeconds())
                    }


                    if (maxDateStr == nowStr) {
                        max = new Date(2020, 1, 1, this.maxDate.getHours(), this.maxDate.getMinutes(), this.maxDate.getSeconds())
                    }

                    timepicker.selectableRange = [[min, max]]

                })
            }

        },
        computed: {},
        watch: {
            dateValue() {
                this.$emit("change", this.dateValue);
            },
            value: {
                handler() {
                    this.dateValue = this.value;
                },
                immediate: true
            },
            min() {
                this.minRecompute();
            },
            max() {
                this.maxRecompute();
            }
        },
        mounted() {
            this.minRecompute();
            this.maxRecompute();
        },
        components: {}
    }

</script>


<style scoped>

</style>
