<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import emitter from 'element-ui/src/mixins/emitter';

    export default {
        name: "IceSelect",
        mixins: [emitter],
        model: {
            prop: 'value',
            event: 'changevalue'
        },
        props: {
            onlyShow: Boolean,//只是用来翻译数据，不可编辑
            value: [String, Array, Number],
            mapTypeCode: String,
            dataUrl: String,
            isQuery: Boolean,//是否是作为查询条件，如果是，则禁用的数据将放开
            textProp: {
                type: String,
                default: 'text'
            },
            codeProp: {
                type: String,
                default: 'code'
            },
            valueModel: {//表示选择后返回值，多选模式下返回值：[1,2,3]  "1,2,3"
                type: String,
                default: 'array',
                validator: function (value) {
                    return ['string', 'array'].indexOf(value) !== -1
                }
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            options: {
                type: Array,
                default: () => {
                    return []
                }
            },
            text: {
                type: String
            },
            disabledList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            parentProp: String,
            parentValue: [String, Number],//父选中值*/
            disabled:Boolean,
            //带分组的下拉选项，分组字段名称
            childrenProp: {
                type: String,
                default: 'children'
            }
        },
        data() {
            return {
                selectValue: "",
                dataList: [],
                selectList: []
            }
        },
        watch: {
            value: {
                handler(newValue, oldValue) {
                    if (this.multiple) {
                        if (!newValue) {
                            this.selectValue = [];
                            return
                        }
                        if (this.valueModel == 'string') {
                            this.selectValue = newValue.split(",");
                        } else if (this.valueModel == 'array') {
                            this.selectValue = newValue;
                        }
                    } else {
                        if (typeof newValue != Number.name.toLocaleLowerCase() && !newValue) {
                            this.selectValue = "";
                            return
                        }
                        this.selectValue = newValue //+ "";
                    }
                    this.getLabels();


                }, immediate: true
            },
            mapTypeCode() {
                this.addUndoTypeCodes(this.mapTypeCode)
            },
            dataList() {

                /* if (this.valueModel == 'string' && this.$attrs.multiple) {
                     this.selectValue = this.value.split(",");
                 } else if (this.valueModel == 'array' && this.$attrs.multiple) {
                     this.selectValue = this.value;
                 } else {
                     this.selectValue = this.value;
                 }*/
                this.selectList = this.dataList.map(item => {
                    return {
                        value: item[this.codeProp],
                        label: item[this.textProp],
                        ...(item[this.childrenProp] && item[this.childrenProp] instanceof Array) ? {
                            children: item[this.childrenProp].map(item2 => {
                                return {
                                    value: item2[this.codeProp],
                                    label: item2[this.textProp],
                                }
                            })
                        } : {}
                    }
                })
                /*this.$nextTick(() => {

                })*/
            },

            options() {
                if (this.parentProp && this.options) {
                    this.dataList = this.options.filter(item => item[this.parentProp] == this.parentValue);
                } else {
                    this.dataList = this.options;
                }

            },
            selectList() {
                if (this.valueModel == 'string' && this.multiple) {
                    this.selectValue = this.value ? this.value.split(",") : [];
                } else if (this.valueModel == 'array' && this.multiple) {
                    this.selectValue = this.value ? this.value : [];
                } else {
                    this.selectValue = this.value !== undefined ? this.value : "";
                }
            },
            parentValue() {
                this.initSelect();
                this.$emit('update:text', '');
                this.$emit('changevalue', '')
            },
            dataUrl() {
                this.initSelect();
                this.$emit('update:text', '');
                this.$emit('changevalue', '')
            }
        },
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap', 'getDataMapList']),
            ...mapActions('cacheStore', ['addCache']),
            ...mapGetters('cacheStore', ['getCacheByKey']),
            changeValue(value, text) {
                if (this.multiple) {
                    this.getLabels();
                    if (this.valueModel == 'string') {
                        this.$emit('changevalue', this.selectValue.join(","))
                    } else {
                        this.$emit('changevalue', this.selectValue)
                    }
                } else {
                    this.getLabels();
                    this.$emit('changevalue', this.selectValue)
                }
                this.$nextTick(() => {
                    this.dispatch('ElFormItem', 'el.form.blur', ...arguments);
                });
                return false

            },
            getLabels() {
                this.$nextTick(_ => {
                    let labels = '';
                    if (this.multiple) {
                        labels = this.filterSelectList
                            .filter(item => this.selectValue.find(ch => ch == item.value))
                            .map(item => item.label);
                        if (this.valueModel == 'string') {
                            this.$emit('update:text', labels.join(","));
                        } else {
                            this.$emit('update:text', labels);
                        }
                    } else {
                        labels = this.filterSelectList
                            .filter(item => {
                                return item.value == this.selectValue
                            }).map(item => {
                                return item.label;
                            });
                        this.$emit('update:text', labels.join(","));
                    }
                })
            },


            async initSelect() {
                if (this.dataUrl) {
                    //console.log(this.dataUrl)
                    let params = {}
                    if (this.parentProp) {
                        if (this.parentValue == undefined || this.parentValue == null || this.parentValue == '') {
                            return
                        }
                        params[this.parentProp] = this.parentValue
                    }

                    const callback = await this.addCache(this.getCacheKey())
                    if (callback) {
                        this.$axios.get(this.dataUrl, {params: params})
                            .then(result => {
                                this.dataList = result.data;
                                this.$nextTick(_ => {
                                    /* this.selectList = this.dataList.map(item => {
                                         return {value: item[this.codeProp], label: item[this.textProp]}
                                     })*/
                                    callback(this.selectList)
                                })
                            })
                    }


                } else if (this.options) {
                    if (this.parentProp && this.options) {
                        this.dataList = this.options.filter(item => item[this.parentProp] == this.parentValue);
                    } else {
                        this.dataList = this.options;
                    }
                }
            },
            getCacheKey() {
                let params = {}
                if (this.parentProp) {
                    params[this.parentProp] = this.parentValue
                }
                return `${this.dataUrl}:${JSON.stringify(params)}`
            }
        },
        computed: {
            multiple() {
                return this.$attrs.multiple;
            },
            /*filterSelectList() {
                let disableList = this.selectList.find(item => item.value == '$$disabled');
                if (!disableList) {
                    disableList = []
                } else {
                    disableList = disableList.label;
                }

                return this.selectList.filter(item => this.disabledList.indexOf(item.value) == -1)
                    .filter(item => item.value != '$$disabled')
                    .filter(item => {
                        if (this.$attrs['disabled'] == '' || this.$attrs['disabled'] == true) {
                            return true
                        }

                        if (disableList.find(d => d == item.value)) {
                            return false
                        }
                        return true;
                    })
                    .map(item => {
                        return item
                    })
            },*/
            filterSelectList() {
                if (this.mapTypeCode) {
                    return this.getDataMapList()(this.mapTypeCode).map(item=>{
                        item.disabled = this.isQuery?false:item.disabled;
                        return item;
                    }) || []
                } else if (this.dataUrl) {
                    return this.getCacheByKey()(this.getCacheKey()) || []
                } else {
                    return this.selectList || [];
                }

            },
            //值是否有效，如果在选项中不存在则不显示
            valueIsValid() {
                if (this.filterSelectList.find(item => item.value == this.selectValue)) {
                    return true
                }
                return (this.filterSelectList.flatMap(item => item.children || [])).find(item => item.value == this.selectValue)
            }
        },

        created() {
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }

        },
        mounted() {
            if (!this.parentProp) {
                this.initSelect();
            }

        },
        render(h) {
            if (this.onlyShow) {
                const option = this.filterSelectList.find(item => item.value == this.selectValue)
                return <span>{option ? option.label : ''}</span>
            } else {

                return <el-select ref="select"
                                  {...{
                                      model: {
                                          value: this.multiple ? this.selectValue : (this.valueIsValid ? this.selectValue : ''),
                                          callback: value => this.selectValue = value
                                      },
                                      on: {
                                          ...this.$listeners,
                                          change: this.changeValue
                                      },
                                      props: {
                                          ...this.$attrs,
                                          placeholder: this.placeholder
                                      }
                                  }
                                  } disabled={this.disabled}>
                    {
                        this.filterSelectList.filter(item2 => (!item2.children || !(item2.children instanceof Array))).map(item2 => {
                            return <el-option
                                label={item2.label}
                                value={item2.value}
                                disabled={item2.disabled}>
                            </el-option>
                        })
                    }
                    {
                        this.filterSelectList.filter(item2 => (item2.children && item2.children instanceof Array)).map(item2 => {
                            return <el-option-group
                                label={item2.label}>
                                {
                                    item2.children.map(item3 => {
                                        return <el-option
                                            label={item3.label}
                                            value={item3.value}
                                            disabled={item3.disabled}>
                                        </el-option>
                                    })
                                }
                            </el-option-group>
                        })
                    }
                </el-select>
            }
        }
    }

</script>


<style scoped>

</style>
