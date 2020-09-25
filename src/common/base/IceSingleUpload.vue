<template>
    <div class="ice-upload">
        <div v-if="doSecret" style="width: 100%">
            <!-- <slot :click="()=>visible=true">-->
            <div style="display: flex;align-items: stretch;width: 100%"
                 v-if="styleType=='button'&&!uploaderDisabled&&!$scopedSlots.default">

                <el-button :icon="uploading?'el-icon-loading':'el-icon-upload'" unauth @click="()=>visible=true">
                    {{uploading?'上传中'+percent+'%':'附件上传'}}
                </el-button>

                <div style="line-height: 32px">
                    <div style="display: inline-block">
                        <el-dropdown slot="prefix" placement="bottom" v-if="sectetText&&filename"
                                     @command="updateSecret">
                            <span style="color: #ff6949;cursor: pointer;"> [{{sectetText}}]</span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                        :command="item.value"
                                        :title="!item.disable?`点击修改附件密级为：${item.name}`:''"
                                        :style="'background: rgb(255, '+(255-30*index)+', '+(255-30*index)+');margin:0 5px;'"
                                        v-for=" (item,index) in secrets.filter(item=>!item.disable)" :key="item.value">
                                    {{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div :title="filename" style="display: inline-block">
                        {{getChangedName(security,filename)}}
                    </div>
                </div>

                <el-button @click="evt=>{$downloadFile(value)}" type="text" title="点击下载" v-if="!uploading&&filename">
                    下载
                </el-button>
                <div v-if="!uploading&&filename" style="padding-top: 8px">
                    <span class="el-icon-close closeFiles" style="cursor: pointer" @click="reset"
                          title="点击清空已上传文件"></span>
                </div>
            </div>


            <el-input placeholder="请选择上传的文件" style="line-height: 30px;"
                      :value="getChangedName(security,filename)" clearable
                      @click.native.stop="evt=>{}"
                      readonly="readonly"
                      :title="filename"
                      class="input" v-if="styleType=='input'&&!uploaderDisabled&&!$scopedSlots.default">
                <div slot="prefix" style="color: #ff6949" v-if="sectetText&&filename&&securityLocked">
                    [{{sectetText}}]
                </div>
                <el-dropdown slot="prefix" placement="bottom" v-if="sectetText&&filename&&!securityLocked"
                             @command="updateSecret">
                    <span style="color: #ff6949;cursor: pointer"> [{{sectetText}}]</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                                :command="item.value"
                                class="vxe-table--ignore-clear"
                                :title="!item.disable?`点击修改附件密级为：${item.name}`:''"
                                :style="'background: rgb(255, '+(255-30*index)+', '+(255-30*index)+');margin:0 5px;'"
                                v-for=" (item,index) in secrets" :key="item.value" :disabled="item.disable">
                            {{item.name}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <el-button :icon="uploading?'el-icon-loading':'el-icon-upload'" title="点击上传文件" slot="append"
                           unauth @click="()=>visible=true"></el-button>
                <div slot="suffix" v-if="uploading">{{percent}}%</div>
                <div slot="suffix" v-if="!uploading&&filename">
                    <!--    <span>{{sectetText}}</span>-->
                    <span style="padding-right: 10px">{{getSize(size)}}</span>
                    <span class="el-icon-close" style="cursor: pointer" @click="reset" title="点击清空已上传文件"></span>
                    <span class="el-icon-download" style="padding-left: 5px;cursor: pointer"
                          @click="evt=>{$downloadFile(value)}" title="点击下载"></span>
                </div>
            </el-input>


            <div @click="()=>visible=true">
                <slot :click="(data)=>{this.$emit('upLoadData',data)}"></slot>
            </div>


            <!--<div style="display: block" v-if="uploaderDisabled&&value&&!$scopedSlots.default"
                 @click="evt=>{evt.stopPropagation();evt.preventDefault();}">
                <div>{{getChangedName(security,filename)}}
                    <el-button style="margin-left: 10px" type="text"
                               @click="_=>{$downloadFile(value);$emit('downloadFile')}">下载
                    </el-button>
                </div>
            </div>-->
            <div class="inlineBlock widthCalc" style="width: 100%" v-if="uploaderDisabled&&value&&!$scopedSlots.default">
                <div class="inlineBlock">
                    <i class="el-icon-document"></i>
                </div>
                <div style="display: inline-flex;text-align: left" class="widthCalc">
                                    <span class="textOverFlow" :title="getChangedName(security,filename)">
                                        {{getChangedName(security,filename)}}
                                    </span>
                </div>
                <div class="inlineBlock">
                    <el-button type="text" @click="_=>{$downloadFile(value);$emit('downloadFile')}"
                               priorDisabled="false">
                        下载
                    </el-button>
                </div>
            </div>
            <div style="display: block" v-if="uploaderDisabled&&!value&&!$scopedSlots.default">
                <div>未上传附件</div>
            </div>
            <!--</slot>-->
        </div>
        <div v-if="!doSecret">
            <div class="ice-full-absolute" style="display: flex" v-if="uploaderDisabled&&value&&!$scopedSlots.default"
                 @click="evt=>{evt.stopPropagation();evt.preventDefault();}">
                <div class="fileName">
                    <div class="fileNameShow" :title="filename">
                        {{filename}}
                    </div>
                    <el-button style="margin-left: 10px" type="text"
                               @click="_=>{$downloadFile(value,false);$emit('downloadFile')}">下载({{getSize(size)}})
                    </el-button>
                </div>
            </div>
            <div class="ice-full-absolute" style="display: flex" v-if="uploaderDisabled&&!value&&!$scopedSlots.default">
                <div>未上传附件</div>
            </div>

            <!-- <div @click="reset">-->
            <div style="display: flex;position: relative">
                <!--    <slot>-->
                <div style="display: flex;align-items: stretch;width: 100%"
                     v-if="styleType=='button'&&!uploaderDisabled&&!$scopedSlots.default">
                    <el-upload
                            v-if="!uploaderDisabled"
                            ref="upload"
                            action="/"
                            :multiple="false"
                            :show-file-list="false"
                            :before-upload="defaultBeforeUpload"
                            :on-change="onchange"
                            :on-success="onSuccess?onSuccess:success"
                            :on-error="error"
                            :disabled="uploading"
                            :on-progress="progress?progress:onProgress"
                            :accept="accept"
                            :auto-upload="!doSecret"
                            :on-remove="beforeRemove"
                            :http-request="checkedFile"
                            :before-remove="beforeRemove"
                            slot="append"
                            :limit="1">
                        <el-button :icon="uploading?'el-icon-loading':'el-icon-upload'" unauth @click="reset">
                            {{uploading?'上传中'+percent+'%':'附件上传'}}
                        </el-button>
                    </el-upload>
                    <div :title="filename" style="flex-grow: 1;position: relative">
                        <div class="ice-full-absolute"
                             style="word-break: keep-all;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 32px;text-align: left">
                            {{filename}}({{getSize(size)}})
                        </div>

                    </div>
                    <el-button @click="evt=>{$downloadFile(value,false)}" type="text" title="点击下载"
                               v-if="!uploading&&filename">下载
                    </el-button>
                </div>

                <el-input placeholder="请选择上传的文件" style="line-height: 30px;" v-model="filename" clearable
                          @click.native.stop="evt=>{}"
                          readonly="readonly"
                          class="input" v-if="styleType=='input'&&!uploaderDisabled&&!$scopedSlots.default">
                    <el-upload
                            v-if="!uploaderDisabled"
                            ref="upload"
                            action="/"
                            style="width: 100%;display: flex"
                            :multiple="false"
                            :show-file-list="false"
                            :before-upload="defaultBeforeUpload"
                            :on-change="onchange"
                            :on-success="onSuccess?onSuccess:success"
                            :on-error="error"
                            :disabled="uploading"
                            :on-progress="progress?progress:onProgress"
                            :accept="accept"
                            :auto-upload="!doSecret"
                            :on-remove="beforeRemove"
                            :http-request="checkedFile"
                            :before-remove="beforeRemove"
                            slot="append"
                            :limit="1">
                        <el-button @click="uploading=false;percent=0;$refs.upload.clearFiles()"
                                   :disabled="uploading"
                                   style="margin-top: 0;padding: 8px 13px;"
                                   :icon="uploading?'el-icon-loading':'el-icon-upload'" :title="uploading?'上传中':'点击上传文件'"
                                   unauth></el-button>
                    </el-upload>
                    <div slot="suffix" v-if="uploading">
                        <i class="el-icon-close" @click="delUpload(uploadFile)" style="margin-right: 5px;cursor: pointer"></i>
                        <span>{{percent}}%</span>
                    </div>
                    <div slot="suffix" v-if="!uploading&&filename">
                        <span style="padding-right: 10px">{{getSize(size)}}</span>
                        <span class="el-icon-close" style="cursor: pointer" @click="reset" title="点击清空已上传文件"></span>
                        <span class="el-icon-download" style="padding-left: 5px;cursor: pointer"
                              @click="evt=>{$downloadFile(value,false)}" title="点击下载"></span>
                    </div>
                </el-input>


                <el-upload
                        v-if="$scopedSlots.default"
                        ref="upload"
                        action="/"
                        :multiple="false"
                        :show-file-list="false"
                        :before-upload="defaultBeforeUpload"
                        :on-change="onchange"
                        :on-success="onSuccess?onSuccess:success"
                        :on-error="error"
                        :disabled="uploading"
                        :on-progress="progress?progress:onProgress"
                        :accept="accept"
                        :auto-upload="!doSecret"
                        :on-remove="beforeRemove"
                        :http-request="checkedFile"
                        :before-remove="beforeRemove"
                        slot="append"
                        :limit="1">
                    <slot></slot>
                </el-upload>
                <!-- </slot>-->
            </div>


        </div>
        <ice-dialog :visible.sync="visible" width="500px" title="附件上传"
                    v-if="doSecret&&!uploaderDisabled">

            <ice-form-group :name="'附件密级（'+pendingSectetText+'）'" :expandable="false">

                <el-radio-group v-model="pendingFileSecurity" size="mini" :disabled="pendingFileSecurityLock"
                                style="display: flex;justify-content: flex-start;width: 100%">
                    <el-radio :label="item.value"
                              border
                              :key="item.value"
                              :style="'background: rgb(255, '+(255-30*index)+', '+(255-30*index)+');margin: 0;margin-right: 12px;'"
                              v-for=" (item,index) in secrets" v-if="!item.disable">
                        {{item.name}}
                    </el-radio>
                </el-radio-group>

            </ice-form-group>

            <ice-form-group name="附件" :expandable="false">

                <el-upload
                        ref="upload"
                        style="width: 360px;height:180px;margin: auto;display: flex"
                        action="/"
                        :multiple="false"
                        :show-file-list="false"
                        :before-upload="defaultBeforeUpload"
                        :on-change="onchange"
                        :on-success="onSuccess?onSuccess:success"
                        :on-error="error"
                        :disabled="uploading"
                        :on-progress="progress?progress:onProgress"
                        :accept="accept"
                        :auto-upload="!doSecret"
                        :on-remove="beforeRemove"
                        :http-request="checkedFile"
                        :before-remove="beforeRemove"
                        :limit="1">
                    <div @click="resetPending">
                        <el-progress style="margin: 10px 0" :width="80" type="circle" :percentage="percent"
                                     v-if="uploading"
                                     color="#d81902" :status="status">上传成功
                        </el-progress>

                        <i class="el-icon-upload" v-if="!pendingFileName"></i>
                        <i class="el-upload__text"
                           style="margin: 40px 0 16px;display: block;font-size: 16px;height: 50px;overflow: hidden"
                           v-if="pendingFileName">{{pendingFileName}} （待上传）
                        </i>
                        <div class="el-upload__text"><em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">文件大小不得超过<em>10GB</em></div>
                    </div>

                    <!-- <slot>
                         <el-input placeholder="请选择上传的文件" style="line-height: 30px;" v-model="filename" readonly="readonly"
                                   class="input">
                             <el-button slot="append" :icon="uploading?'el-icon-loading':'el-icon-upload'"></el-button>
                             <div slot="suffix" v-if="uploading">{{percent}}%</div>
                         </el-input>
                     </slot>-->
                </el-upload>
            </ice-form-group>
            <div class="ice-button-bar">
                <div style="margin-right: 100px">附件密级：<em style="color: red">{{pendingSectetText}}</em></div>
                <el-button type="primary" @click="fileSubmit" unauth>确认上传</el-button>
                <el-button type="info" @click="()=>{visible=false}" unauth>取消</el-button>
            </div>
        </ice-dialog>
        <!--      <div v-if="filename!='' && !uploading &&!$slots.default" @click="reset"
                   style="position:absolute;cursor: pointer;height: 32px;right: 50px;top: 8px">
                  <i class="el-icon-close" style="color: #efefef"></i>
              </div>-->
    </div>
</template>

<script>

    import IceAdvanceUploader from './IceAdvanceUploader'
    import IceFormGroup from "./IceFormGroup";
    import IceDialog from "./IceDialog";
    import {mapGetters, mapMutations} from 'vuex'
    import emitter from 'element-ui/src/mixins/emitter';

    export default {
        name: "IceSingleUpload",
        componentName: "IceSingleUpload",
        components: {IceDialog, IceFormGroup},
        mixins: [IceAdvanceUploader, emitter],
        inject: {
            elForm: {
                default: ''
            },
            elFormItem: {
                default: ''
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        data: function () {
            return {
                hasFile: false,//是否选择了文件，替换上传图标
                uploading: false,//是否正在上传
                status: '',//状态
                filename: "",
                fileid: '',
                size: 0,
                pendingFileName: '',
                pendingFileSecurity: '',
                pendingFileSecurityLock: false,
                percent: 0,
                /* secrets: [
                     /!* {name: '公开', value: '1'},
                      {name: '涉密', value: "2"},
                      {name: '保密', value: "3"},
                      {name: '绝密', value: "4"}*!/
                 ],//附加密级列表*/
                security: '', //this.$userInfo.securityLevel,//附件密级
                securityLocked: false,
                visible: false,
                buttons: [{
                    iscannel: false, name: '确认上传', click: () => {
                        this.$refs.upload.submit();
                    }
                }, {iscannel: true, name: '取消'}],
                /*headers: {
                    "Authorization": localstoreUtil.getAccessToken()
                }*/
                uploadFile:{},
            };
        },
        props: {
            value: {
                type: String,
                default: ""
            },
            accept: String,
            progress: Function,
            beforeUpload: Function,
            onSuccess: Function,
            doSecret: {//是否涉密
                type: Boolean,
                default: true
            },
            styleType: {
                type: String,
                default: 'button'//button input
            },
            disabled: Boolean,
            //优先disabled，优先级高于disabled
            priorDisabled: Boolean,
            /* isImg: {type: Boolean, default: false} //是否是图片*/
            isPublic: {//密级是否为不涉密类型
                type: Boolean,
                default: true
            },
        },
        computed: {
            sectetText() {
                const s = this.secrets.find(item => item.value == this.security);
                if (s) {
                    return s.name;
                } else {
                    return ''
                }
            },
            pendingSectetText() {
                const s = this.secrets.find(item => item.value == this.pendingFileSecurity);
                if (s) {
                    return s.name;
                } else {
                    return "请选择附件密级"
                }
            },
            uploaderDisabled() {
                return this.priorDisabled ||
                    ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled);
            },

        },
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap', 'getReversedDataMap']),
            onchange: function (file) {
                this.uploadFile = file;
                this.pendingFileName = file.name;
                this.uploading = false;
                this.hasFile = true
                //判定文件是否携带密级
                if (this.filenameHasSecret(file.name)) {
                    this.pendingFileSecurityLock = true;
                    const fileSecretText = this.getSecretByFileName(file.name);
                    this.pendingFileSecurity = this.security = this.getReversedDataMap()("DATA_SECRET_LEVEL")[fileSecretText];
                    if (this.isPublic && Number(this.security) > 2) {
                        this.$message.warning("不可上传涉密文件");
                        return
                    }
                }
                //this.filename = "";
            },
            defaultBeforeUpload: function (file) {

                this.hasFile = true;
                this.uploading = true;
                this.status = null
                this.filename = file.name;
                this.size = file.size;
                this.security = this.pendingFileSecurity;
                this.securityLocked = this.pendingFileSecurityLock;

                if (this.beforeUpload) {
                    this.fileMd5(file).then(result => {

                        file.md5 = result
                        this.beforeUpload(file);
                    });

                }
            },
            reset: function () {
                this.pendingFileName = '';
                this.pendingFileSecurity = '';
                this.pendingFileSecurityLock = false;
                this.filename = "";
                this.fileid = '';
                this.size = 0;
                this.uploading = false;
                this.hasFile = false
                this.securityLocked = false;
                if (this.$refs.upload) {
                    this.$refs.upload.clearFiles();
                }
                this.$emit('change', '');

            },
            //删除上传中的文件
            delUpload(file){
                this.$refs.upload.handleRemove(file);
                this.reset();
            },
            resetPending() {
                this.pendingFileName = '';
                this.pendingFileSecurityLock = false;
                this.hasFile = false;
                this.uploading = false;
                if (this.$refs.upload) {
                    this.$refs.upload.clearFiles();
                }
            },
            success: function (response) {
                //debugger

                if (response && response.code != 1) {
                    this.status = 'exception'
                    this.$message.error("上传失败！");
                    this.$refs.upload.clearFiles();
                    return;
                }
                this.percent = 100
                this.status = 'text'
                this.fileid = response.data;
                this.$emit('change', response.data, this.filename, this.security);
                this.$emit("uploadSuccess", response.data);
                this.$message.success("上传成功！");
                this.$refs.upload.clearFiles();
            },
            error(err, file, fileList) {
                this.status = 'exception'
                console.error(err, file, fileList)
            },
            onProgress(event, file, fileList) {
                let percent = Number(Number(event.percent).toFixed(0))
                if (percent >= 100) {
                    this.percent = 99
                } else {
                    this.percent = percent;
                }
            },
            getFileName() {
                if (this.value) {
                    this.$axios
                        .get(`/resources/attachment/get?id=${this.value}`)
                        .then(response => {
                            if (response.data) {
                                this.filename = response.data.fileName;
                                this.security = response.data.fileSecret;
                                this.fileid = response.data.oid;
                                this.size = response.data.fileSize;
                                this.securityLocked = this.filenameHasSecret(response.data.fileName);
                            }
                        })
                        .catch(error => {
                                // this.$message.error("出错啦！");
                            }
                        );
                }
            },
            beforeRemove(file) {
                this.hasFile = false;
                this.uploading = false;
                this.status = null
                this.securityLocked = file;
                this.removeFile(file)
            },
            fileSubmit() {
                if (this.doSecret) {
                    if (!this.pendingFileSecurity) {
                        this.$message.warning("请选择附件密级")
                        return
                    }
                    if (!this.hasFile) {
                        this.$message.warning("请选择需要上传的附件")
                        return
                    }
                }
                this.$refs.upload.submit();
                this.$emit("security", this.pendingFileSecurity);
                this.visible = false;
            },
            //修改附件密级
            updateSecret(commond) {
                if (this.value) {
                    this.$axios
                        .put(`/resources/attachment/saveOrUpdate`, {oid: this.value, fileSecret: commond})
                        .then(response => {
                            this.security = commond;
                            this.dispatch("IceFlowForm", "ice-upload-secret", {
                                "modifyFiles": [{fileid: this.value, secret: commond}]
                            });
                            this.$message.success("密级修改成功")
                        })
                        .catch(error => {
                                console.error(error);
                                this.$message.error("密级修改失败")
                            }
                        );
                }
            }
        },
        watch: {
            fileid(newValue, oldValue) {

                if (newValue && oldValue) {
                    this.dispatch("IceFlowForm", "ice-upload-secret", {
                        "addFiles": [{fileid: newValue, secret: this.security}],
                        "delFiles": [{fileid: oldValue}],
                    });//向上传递密级
                } else if (newValue) {
                    this.dispatch("IceFlowForm", "ice-upload-secret", {
                        "addFiles": [{fileid: newValue, secret: this.security}],
                    });//向上传递密级
                } else if (oldValue) {
                    this.dispatch("IceFlowForm", "ice-upload-secret", {
                        "delFiles": [{fileid: oldValue}],
                    });//向上传递密级
                }


            },
            value: function (newValue, oldValue) {
                if (newValue != oldValue && newValue != this.fileid) {
                    this.getFileName();
                }

            },
            visible(newvalue) {
                if (newvalue) {
                    this.pendingFileName = '';
                    this.pendingFileSecurity = '';
                    this.pendingFileSecurityLock = false;
                    if (this.$refs.upload) {
                        this.$refs.upload.clearFiles();
                    }
                }
            }
        },
        mounted() {
            this.getFileName();
        },
        created() {
            //流程初始化完毕事件
            this.$on('ice-flow-secret-ready', data => {
                //alert(data)
            })
        }
    };
</script>

<style lang="less" scoped>
    .fileName {
        overflow: hidden;
        height: 33px;
        display: flex;
        width: 100%;
    }

    .fileNameShow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: calc(100% - 50px);
    }

    .widthCalc {
        //减去固定值
        width: calc(100% - 50px);
    }

    .textOverFlow {
        //文本内容超出容器范围时以省略号展示
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100%
    }

    .inlineBlock {
        //行内块
        display: inline-block;
    }

    .sectetTextShow {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        position: relative;
        margin-top: -18px;
        margin-left: 37px
    }

    .closeFiles:hover {
        color: red;
    }

    .ice-upload {
        display: flex;
        /*height: 32px;*/
        position: relative;
        flex-direction: column;
    }

    /*  .ice-upload .el-upload--text {
          height: 32px;
          width: 100%;
          border: none;
      }*/
</style>

<style lang="less">
    .ice-upload {
        .el-input--prefix .el-input__inner {
            padding-left: 40px;
        }

        .el-input--suffix .el-input__inner {
            padding-right: 105px;
        }
    }
</style>
