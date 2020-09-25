<script>
    import {Table} from 'element-ui'
    import Schema from 'async-validator'
    import emitter from 'element-ui/src/mixins/emitter';
    export default {
        name: "IceEditableTable",
        extends: Table,
        mixins: [emitter],
        props: {
            rules: Object,
            required: Boolean
        },
        data() {
            return {
                rowValidStatus: []
            }
        },
        methods: {
            validate(rowid, validateResult = () => {
            }, fieldName) {
                let result = true;

                if (rowid !== undefined) {
                    let rowdata = this.data[rowid];
                    let rules = {};
                    if (fieldName) {
                        rules[fieldName] = this.rules[fieldName];
                        if (!rules[fieldName]) {
                            return
                        }
                    } else {
                        rules = this.rules
                        if (!rules) {
                            return
                        }
                    }
                    let thiz = this;

                    //清空数据校验
                    if (thiz.rowValidStatus[rowid]) {
                        if (fieldName) {
                            thiz.$set(thiz.rowValidStatus[rowid], fieldName, {});
                        } else {
                            thiz.$set(thiz.rowValidStatus, rowid, {});
                        }
                    } else {
                        thiz.$set(thiz.rowValidStatus, rowid, {});
                    }


                    //校验数据是否重复
                    for (let field in rules) {
                        let otherRows = this.data.filter((item, index) => index != rowid);
                        let fieldRule = rules[field];
                        let repeatable = true;
                        let msg = "输入内容不能重复";
                        if (fieldRule) {
                            if (fieldRule instanceof Array) {
                                fieldRule.forEach(rule => {
                                    if (rule.repeatable == false) {
                                        repeatable = false;
                                        msg = rule.message;
                                    }
                                })
                            } else {
                                if (fieldRule.repeatable == false) {
                                    repeatable = false
                                    msg = fieldRule.message;
                                }
                            }
                            if (repeatable === false) {
                                if (
                                    otherRows.findIndex((value, index, arr) => {
                                        return rowdata[field] == value[field] && rowdata[field] && value[field]
                                    }) != -1) {
                                    result = false
                                    thiz.$set(thiz.rowValidStatus[rowid], field, {});
                                    thiz.$set(thiz.rowValidStatus[rowid][field], 'result', false);
                                    thiz.$set(thiz.rowValidStatus[rowid][field], 'msg', msg);
                                }
                            }
                        }

                    }


                    //使用async校验数据

                    let validator = new Schema(rules);
                    validator.validate(rowdata, (errors, fields) => {


                        if (errors) {
                            errors.forEach(item => {
                                let field = item.field
                                thiz.$set(thiz.rowValidStatus[rowid], field, {});
                                thiz.$set(thiz.rowValidStatus[rowid][field], 'result', false);
                                thiz.$set(thiz.rowValidStatus[rowid][field], 'msg', item.message);
                            })
                            result = false
                        }

                        validateResult(result)
                    });


                }
                //console.log(rowdata)
            },
            validateField(rowid, field, validateResult = () => {
            }) {
                this.validate(rowid, validateResult, field);
            },
            validateAll(validateResult = () => {
            }) {
                return new Promise((resolve, reject) => {
                    let rowdata = this.data;

                    if (this.required && rowdata.length <= 0) {
                        resolve(false)
                        validateResult(false)
                        this.invalidGO()
                    }

                    let validateStatus = [];
                    rowdata.forEach((item, index) => {
                        this.validate(index, status => {
                            validateStatus.push(status);
                        })
                    });
                    if (validateStatus.findIndex((value, index, arr) => {
                        return !value
                    }) != -1) {
                        resolve(false)
                        validateResult(false)
                        this.invalidGO()
                    } else {
                        resolve(true)
                        validateResult(true)
                    }
                })

            },
            clearValidate() {
                let rowdata = this.data;
                rowdata.forEach((item, index) => {
                    this.$set(this.rowValidStatus, index, {});
                })

            },
            clearValidateRow(rowid) {
                this.$set(this.rowValidStatus, rowid, {});
            },
            deleteValidateRow(rowid) {
                this.rowValidStatus.splice(rowid, 1)
                this.rowValidStatus = this.rowValidStatus;

            },
            invalidGO(){
                this.dispatch('IceFormGroup', 'validateGO', "")
            }
        },
        watch: {
            data: {
                handler(value) {
                    this.$nextTick(_ => {
                        this.doLayout();
                    })
                },
                immediate: true
            }
        },
        mounted() {
        }

    }

</script>
