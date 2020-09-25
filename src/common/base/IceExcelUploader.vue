<template>
    <div style="display: flex;padding-bottom: 10px">
        <el-upload
                :action="$apicontext+'/'+module+'/excel/upload?template='+service"
                ref="upload"
                :show-file-list="false"
                :auto-upload="true"
                accept="application/vnd.ms-excel"
                :on-success="success"
                :before-upload="beforeAvatarUpload">
            <el-button size="mini" type="success">Excel上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls文件
                <el-button size="mini" class="el-button el-button--text el-button--small" @click="downloadTemplate">
                    点击下载模板
                </el-button>
            </div>
        </el-upload>


        <el-dialog
                ref="dialog"
                :v-show="beginShow"
                custom-class="custom-dialog"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
                :title="title"
                center
                :fullscreen="true"
                :visible.sync="dialogVisible"
                :append-to-body="true"
                style="height:100%;display:none"
                width="1200px">
            <div ref="dialogref">
                <div class="import-info">
                    <span class="error" v-if="errorNum > 0">导入的数据中有<span>{{errorNum}}</span>条异常,请检查(有异常时不允许提交请修正excel后再试)</span>
                </div>
                <el-table
                        :data="tableData"
                        :height="tabelHeight"
                        :row-class-name="tableRowClassName">
                    <el-table-column
                            :fit="true"
                            :label="value.titleName"
                            v-for="(value,key) in titles"
                            :min-width="computWidth(value.titleCode,value.width)"
                            :key="value.titleCode">
                        <template slot-scope="scope">
                            <div v-if="value.titleType == 'TEXT'" :title="scope.row[value.titleCode]">{{
                                scope.row[value.titleCode] }}
                            </div>
                            <div v-if="value.titleType == 'DATE'" :title="scope.row[value.titleCode]">{{
                                scope.row[value.titleCode] }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="button-area">
                    <el-button type="danger" @click="close">关闭</el-button>
                    <el-button type="success" @click="submit" :disabled="errorNum > 0||tableData.length <= 0">提交
                    </el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {Loading} from 'element-ui';

    export default {
        name: 'IceExcelUploader',
        props: {
            service: {type: String, required: true},
            callBack: {type: Function, required: false, defaults: null},
            module: {type: String, required: true},
            isSuccess: Function,
        },
        data() {
            return {
                beginShow: false,//开始显示
                dialogVisible: true,
                titles: [],
                tableData: [],
                tabelHeight: window.innerHeight - 150,
                title: 'excel导入预览',
                errorNum: 0,
                loadingInstance: null,
                templateId: ''
            };
        },
        methods: {
            beforeAvatarUpload(file) {
                this.errorNum = 0;
                this.tableData = [];
                const isExcel = file.type === "application/vnd.ms-excel";
                if (!isExcel) {
                    this.$message.error("上传不是xls文件");
                } else {
                    this.dialogVisible = true;

                    this.loadingInstance = Loading.service({
                        target: this.$refs['dialogref'],
                        fullscreen: false
                    });
                }

                return isExcel;
            },
            handlePreview(file) {
            },
            tableRowClassName({row, rowIndex}) {

                if (row['$errInfo']) {
                    return 'warning-row';
                }
                if (row['提示信息']) {
                    return 'info-row';
                }
                return '';
            },
            success: function (response, file, fileList) {
                this.loadingInstance.close();
                if (response.code != 1) {
                    this.$message.error(response.msg);
                    this.dialogVisible = false;
                    return;
                }
                var list = response.data.list;
                for (var i = 0; i < list.length; i++) {
                    if (list[i]['$errInfo']) {
                        this.errorNum += 1;
                    } else {
                        break;
                    }
                }
                this.tableData = list;
                this.titles = response.data.titles;
            },
            computWidth: function (title, width) {
                if (title == 'excle行号') {
                    return 90;
                } else if (title == '错误信息') {
                    return 200;
                } else if (title == '提示信息') {
                    return 200;
                } else {
                    return width > 0 ? width : 100;
                }
            },
            close() {
                this.dialogVisible = false;
            },
            submit: function () {
                this.loadingInstance = Loading.service({
                    target: this.$refs['dialogref'],
                    fullscreen: false
                });
                if (this.callBack) {
                    this.callBack(this.tableData);
                }
                var _this = this;
                this.$axios.post("/" + this.module + "/excel/data/submit", {
                    "template": this.service,
                    "data": JSON.stringify(this.tableData)
                }).then(function (response) {
                    _this.$message.success("上传成功");
                    _this.loadingInstance.close();
                    _this.dialogVisible = false;
                    if (typeof _this.isSuccess == "function") {
                        _this.isSuccess();
                    }
                    _this.$emit('uploadSuccess', 'success');
                }).catch(function (response) {
                    _this.$message.error("导入失败");
                    _this.loadingInstance.close();
                });
            },
            downloadTemplate: function () {
                window.open(this.$apicontext + "/" + this.module + "/excel/download?template=" + this.service);
            }
        },
        mounted: function () {
            this.dialogVisible = false;
            this.beginShow = true;
            /*    var _this = this;
                this.$axios.get("/excel/template/" + this.service)
                        .then(function (response) {
                            _this.templateId = response.data;
                        })
                        .catch(function (response) {

                        })*/
        }
    }
</script>
<style lang="less" scoped>
    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 24px;
    }

    .import-info {
        text-align: center;
    }

    .import-info .error {
        color: red;
    }

    .button-area {
        padding-top: 30px;
        display: flex;
        justify-content: center;
    }
</style>
<style>
    .warning-row {
        color: #ff0e74;
    }
</style>

