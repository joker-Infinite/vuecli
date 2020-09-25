<template>

    <div class="ice-image-upload" :style="{height:height+'px',width:width+'px'}">
        <!--<img >-->
        <div class="ice-image-del" @click="imageDel">
            <i class="el-icon-close"></i>
        </div>
        <el-image :src="imageUrl" class="pre-img" :style="{height:height+'px',width:width+'px'}"
                  v-loading="loading&&!cropper" element-loading-text="图片上传中">
            <div slot="error">
                <!--<i class="el-icon-picture-outline"  style="line-height: 100px;"></i>-->
            </div>
        </el-image>
        <input class="upload-input" type="file" name="image" accept="image/*" @change="setImage" ref="input"
               v-if="!uploadDisabled"
               :style="{height:height+'px',width:width+'px'}"/>
        <div class="upload-btn" v-if="!uploadDisabled">{{name}}</div>
        <ice-dialog title="请进行图片裁剪" :visible.sync="dialogVisible" width="680px"
                    v-loading.fullscreen.lock="loading&&cropper">
            <div class="ice-image-pop">
                <vue-cropper ref='cropper' :src="imgSrc" :cropBoxResizable="false" dragMode="move" :aspectRatio="1"
                             :viewMode="1"
                             style="width:500px;height:500px;"></vue-cropper>
                <!--<el-card class="image-history">
                    <div slot="header" class="clearfix">
                        <span>上传历史</span>
                    </div>
                    <div >
                        {{'列表内容 ' + o }}
                    </div>
                </el-card>-->
                <div class="image-history el-card">
                    <div class=" title">上传历史</div>
                    <div class="image-content">
                        <div class="ice-full-absolute">
                            <vue-scroll :ops="{bar:{background:'#fff',opacity:0}}" @handle-scroll="handleScroll">
                                <div v-for="item in historyList" :key="item"
                                     style="margin-bottom: 5px;display: flex;flex-direction: column;justify-items: center">
                                    <el-image :src="$showImage(item)"
                                              style="width:128px;"/>
                                    <el-button type="text" @click="imageSelect(item)" unauth>选择</el-button>
                                </div>
                                <!--  <div style="display:flex;justify-content: center">
                                      <el-button type="text" @click="loadHistory">加载更多</el-button>
                                  </div>-->
                                <div style="height: 14px;padding:4px 0;width: 100%;display: flex;justify-content: center"
                                     v-show="hisloading||current==pages"><span
                                        class="el-icon-loading" v-if="hisloading"></span>
                                    <span v-if="current==pages" style="font-size: 11px">没有更多了</span></div>
                            </vue-scroll>
                        </div>

                    </div>
                </div>
            </div>


            <!--:ready="cropImage" :zoom="cropImage" :cropmove="cropImage"-->
            <span slot="footer" class="dialog-footer">
                 <el-button type="primary" @click="confirm" unauth>确 定</el-button>
                    <el-button @click="cancelCrop" unauth>取 消</el-button>
                </span>
        </ice-dialog>
    </div>
</template>

<script>
    import VueCropper from 'vue-cropperjs';
    import VueScroll from 'vuescroll'
    import IceDialog from "./IceDialog";

    export default {
        name: "IceImageUploader",
        model: {
            prop: 'value',
            event: 'uploadChange'
        },
        inject: {
            elForm: {
                default: ''
            },
            elFormItem: {
                default: ''
            }
        },
        props: {
            value: {
                type: [String,Object],
                default: "",
                required: true
            },
            defaultImage: String,
            name: {
                type: String,
                default: '请选择图片'
            },
            width: {
                type: Number,
                default: 100
            },
            height: {
                type: Number,
                default: 100
            },
            disabled: Boolean,
            //优先disabled，优先级高于disabled
            priorDisabled: Boolean,
            cropper: {//是否需要裁减
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                loading: false,
                historyList: [],
                size: 10,
                current: 0,
                pages: -1,
                hisloading: false
            }
        },
        methods: {
            setImage(e) {
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imgSrc = event.target.result;
                    if (this.cropper) {
                        this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                        this.dialogVisible = true;
                    } else {
                        this.uploadBase64(this.imgSrc)
                    }
                    this.$refs.input.value = '';
                };
                reader.readAsDataURL(file);
                this.$refs.input.value = '';
            },
            cropImage() {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop() {
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
                this.$refs.input.value = '';
            },
            confirm() {
                //this.loading = true;
                this.uploadBase64(this.$refs.cropper.getCroppedCanvas().toDataURL())
            },
            uploadBase64(data) {
                this.loading = true;
                this.$axios.post('/resources/image/base64',
                    data, //this.$refs.cropper.getCroppedCanvas().toDataURL(),
                    {
                        headers: {'Content-Type': 'text/plain'},
                    })
                    .then(result => {
                        this.imageSelect(result.data)
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("上传失败")
                        this.loading = false;
                        this.$refs.input.value = '';
                    })
            },
            imageSelect(imageId) {
                this.dialogVisible = false;
                this.loading = false;
                this.$emit("uploadChange", imageId);
                this.$refs.input.value = '';
            },
            imageDel(){
                this.imageUrl = '';
                this.$emit("uploadChange", '');
            },
            handleScroll(vevent) {
                if (vevent.process == 1) {
                    //console.log("over")
                    if (this.current < this.pages) {
                        this.loadHistory();
                    }
                }
            },
            loadHistory() {
                this.hisloading = true;
                this.$axios.get("resources/image/history",
                    {params: {size: this.size, current: this.current + 1}})
                    .then(result => {
                        this.hisloading = false;
                        if (result.data) {
                            this.pages = result.data.pages;
                            this.current = result.data.current;
                            this.historyList.push(...result.data.records);
                        }

                        //console.log(result.data)
                    })
            }
        },
        computed: {
            imageUrl() {
                if (this.defaultImage) {
                    if (this.value) {
                        return this.$showImage(this.value)/*this.$apicontext + "resources/image?id=" + this.value*/
                    } else {
                        return this.defaultImage
                    }
                } else {
                    if (this.value) {
                        return this.$showImage(this.value)/*this.$apicontext + "resources/image?id=" + this.value*/
                    }
                }

            },
            uploadDisabled() {
                return this.priorDisabled ||
                    ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled);

            }
        },
        watch: {
            dialogVisible(newValue) {
                if (newValue && this.pages == -1) {
                    this.loadHistory();
                }
            }
        },
        mounted() {
            // this.loadHistory();
        },
        components: {
            IceDialog,
            VueCropper,
            VueScroll
        }
    }

</script>


<style scoped lang="less">
    .ice-image-upload {
        position: relative;
        width: 200px;
        height: 200px;
        background: #FFFFFF;
        border: 1px solid #ebeef5;
        /* display: flex;
         justify-content: center;
         align-items: center;*/
        .ice-image-del{
            position: absolute;
            width: 25px;
            height: 25px;
            right: 0;
            background: rgba(1,1,1,0.3);
            z-index: 11;
            border-bottom-left-radius: 100%;
            color: #FFF;
            display: none;
            transition: linear 0.3s;
            i{
                position: absolute;
                right: 3px;
                top: 3px;
            }
        }

        .pre-img {
            width: 200px;
            height: 200px;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 1;
        }

        .upload-btn {
            width: 100px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            left: 50%;
            top: 50%;
            margin-left: -50px;
            margin-top: -25px;
            cursor: pointer;
            color: #20a0ff;
            position: absolute;
            z-index: 2;
        }

        .upload-input {
            opacity: 0;
            width: 200px;
            height: 200px;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 10;
            cursor: pointer;

        }

    }
    .ice-image-upload:hover .ice-image-del{
        display: block;
    }

    .ice-image-pop {
        display: flex;
        justify-content: space-around;

        .image-history {
            width: 140px;
            box-sizing: border-box;
            padding: 0 5px;
            display: flex;
            flex-direction: column;
            /* height: 100%;*/
            /*    background: red;*/

            .title {
                height: 30px;
                line-height: 30px;
                text-align: center;
                /*margin: 0 2px;*/
                border-bottom: 1px solid #ebeef5;
            }

            .image-content {
                flex-grow: 1;
                position: relative;
            }
        }

    }

</style>
