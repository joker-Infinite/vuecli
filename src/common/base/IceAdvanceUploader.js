import axios from 'axios'
import MD5 from 'md5.js'
import Buffer from 'safe-buffer'

export default {
    data() {
        return {
            maxSize: 20 * 1024 * 1024 * 1024, // 上传最大文件限制
            multiUploadSize: 50 * 1024 * 1024, // 大于这个大小的文件使用分块上传(后端可以支持断点续传)
            eachSize: 50 * 1024 * 1024, // 每块文件大小
            requestCancelQueue: {}, // 请求方法队列（调用取消上传
            chunksStatus: {},
            uploadStatus: {},
            securityArr: [],
            selfSecurity:'',//自身可上传附件的密级
        }
    },
    created() {
        if (this.doSecret) {
            this.addUndoTypeCodes(["DATA_SECRET_LEVEL", "USER_DATA_SECRET"])
        }

    },
    methods: {
        checkedFile(options) {

            const {maxSize, multiUploadSize, getSize, splitUpload} = this
            const {file, onProgress, onSuccess, onError} = options
            this.chunksStatus[file.uid] = [];
            this.uploadStatus[file.uid] = true;
            if (file.size > maxSize) {
                return this.$message({
                    message: `您选择的文件大于${getSize(maxSize)}`,
                    type: 'error'
                })
            }

            if (file.size == 0) {
                this.$message({
                    message: `禁止上传大小为0的文件`,
                    type: 'error'
                })
                return
            }


            const uploadFunc = splitUpload

            uploadFunc(file, onProgress).then(result => {
                //this.securityArr用于区别是单附件上传还是多附件上传
                if (this.securityArr && this.securityArr.length > 0) {
                    result.securityLevel = this.securityArr[0];

                    this.securityArr.splice(0, 1);
                } else {
                    result.securityLevel = this.security
                    result.sectetText = this.sectetText;//附件密级中文名
                }
                onSuccess(result)
            }).catch(e => {
                console.error(e)
                this.$message({
                    message: `${file.name}上传失败,请重试!`,
                    type: 'error'
                })
                onError()
            })
            // debugger
            let promise = new Promise((resolve, reject) => {

            })
            promise.abort = () => {
            }
            return promise
        },
        // 格式化文件大小显示文字
        getSize(size) {
            return size > 1024
                ? size / 1024 > 1024
                    ? size / (1024 * 1024) > 1024
                        ? (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
                        : (size / (1024 * 1024)).toFixed(2) + 'MB'
                    : (size / 1024).toFixed(2) + 'KB'
                : (size).toFixed(2) + 'B'
        },
        // 单文件直接上传
        /*   singleUpload(file, onProgress) {
               return new Promise(async (resolve, reject) => {
                   try {


                       const {data: {fileId: fileId, nextChunk: nextChunk}} = await this.createFile({
                           fileName: file.name,
                           fileSize: file.size,
                           fileMd5: this.fileMd5(file),
                           isHuge: 0,
                           chunkNum: 1
                       })

                       await this.postFile({
                           chunked: 0,
                           chunk: 0,
                           chunks: 1,
                           eachSize: file.size,
                           fileName: file.name,
                           fullSize: file.size,
                           fileId: fileId,
                           uid: file.uid,
                           file: file
                       }, onProgress)
                       resolve()
                   } catch (e) {
                       reject(e)
                   }

               })

           },*/
        // 大文件分块上传
        splitUpload(file, onProgress) {
            return new Promise(async (resolve, reject) => {
                try {
                    const {eachSize} = this
                    const chunks = Math.ceil(file.size / eachSize)
                    const fileChunks = await this.splitFile(file, eachSize, chunks)
                    let currentChunk = 0;
                    let security = '';
                    if (this.fileArr && this.fileArr.length > 0) {
                        security = this.fileArr[0].security;
                        this.securityArr.push(security);
                        this.fileArr.splice(0, 1);
                    } else {
                        security = this.security;
                    }


                    const {data: {fileId: fileId, nextChunk: nextChunk}} = await this.createFile({
                        fileName: file.name,
                        fileSize: file.size,
                        fileMd5: await this.fileMd5(file),
                        isHuge: chunks > 1 ? 1 : 0,
                        chunkNum: chunks,
                        fileSecret: this.doSecret ? security : '',
                        dataSecretLevcode: this.doSecret ? this.security : ''
                    })
                    const md5 = await this.fileMd5(file);
                    this.$emit("getMd5",md5);

                    // debugger
                    if (nextChunk > 0) {
                        for (let i = 0; i < nextChunk; i++) {
                            this.chunksStatus[file.uid][i] = fileChunks[i].size;
                        }
                    }

                    for (let i = nextChunk; i < fileChunks.length; i += 5) {

                        let promises = [];

                        for (let offset = 0; offset < 5 && i + offset < fileChunks.length; offset++) {
                            // console.log(fileChunks[i + offset])
                            promises.push(this.postFile({
                                chunked: 1,
                                chunk: i + offset,
                                chunks,
                                eachSize,
                                fileName: file.name,
                                fullSize: file.size,
                                fileId: fileId,
                                uid: file.uid,
                                file: fileChunks[i + offset]
                            }, onProgress))
                        }
                        await Promise.all(promises);
                    }
                    let isValidate = await this.validateFile({
                        fileId: fileId
                    })
                    if (!isValidate) {
                        throw new Error('文件校验异常')
                    }

                    resolve({code: 1, data: fileId})
                } catch (e) {
                    reject(e)
                }
            })
        },
        // 文件分块,利用Array.prototype.slice方法
        splitFile(file, eachSize, chunks) {
            return new Promise((resolve, reject) => {
                try {
                    setTimeout(() => {
                        const fileChunk = []
                        for (let chunk = 0; chunks > 0; chunks--) {
                            fileChunk.push(file.slice(chunk, chunk + eachSize))
                            chunk += eachSize
                        }
                        resolve(fileChunk)
                    }, 0)
                } catch (e) {
                    console.error(e)
                    reject(new Error('文件切块发生错误'))
                }
            })
        },
        removeFile(file) {
            this.uploadStatus[file.uid] = false;
            for (let k in this.requestCancelQueue) {
                if (k.startsWith(file.uid)) {
                    this.requestCancelQueue[k]()
                    delete this.requestCancelQueue[k]
                }

            }

            return true
        },

        createFile(params) {
            return this.$axios.post('/resources/attachment/create', params)
        },

        // 提交文件方法,将参数转换为FormData, 然后通过axios发起请求
        postFile(param, onProgress) {
            const formData = new FormData()
            for (let p in param) {
                formData.append(p, param[p])
            }
            const {requestCancelQueue} = this
            const config = {
                cancelToken: new axios.CancelToken(function executor(cancel) {
                    if (requestCancelQueue[param.uid + ":" + param.chunk]) {
                        requestCancelQueue[param.uid + ":" + param.chunk]()
                        delete requestCancelQueue[param.uid + ":" + param.chunk]
                    }
                    requestCancelQueue[param.uid + ":" + param.chunk] = cancel
                }),
                onUploadProgress: e => {
                    if (param.chunked) {
                        this.chunksStatus[param.uid][param.chunk] = e.loaded;
                        let loadedTotal = 0;
                        for (let i = 0; i < this.chunksStatus[param.uid].length; i++) {
                            if (this.chunksStatus[param.uid][i]) {
                                loadedTotal += this.chunksStatus[param.uid][i]
                            }
                        }
                        e.percent = Number(Number((loadedTotal / param.fullSize) * 100).toFixed(2));
                        // e.percent = Number(((((param.chunk * (param.eachSize - 1)) + (e.loaded)) / param.fullSize) * 100).toFixed(2))
                    } else {
                        e.percent = Number(((e.loaded / e.total) * 100).toFixed(2))
                    }
                    if (this.uploadStatus[param.uid]) {
                        if(this.files&&this.files.length==0){

                        }else {
                            onProgress(e)
                        }

                    }

                },
                timeout: 120000,
            }
            return this.$axios.post('/resources/attachment/upload', formData, config)
        },
        // 文件校验方法
        validateFile(param) {
            return this.$axios.post('/resources/attachment/upload/success', param)
        },
        fileMd5(file) {
            return new Promise((resolve, reject) => {
                try {
                    let md5Chunks = []
                    if (file.size > 20480) {
                        md5Chunks = file.slice(0, 20480);
                    } else {
                        md5Chunks = file.slice(0);
                    }

                    let filereader = new FileReader();
                    filereader.onload = res => {
                        // console.log(md5Chunks, res.target.result)
                        resolve(new MD5().update(Buffer.Buffer.from(res.target.result)).digest("hex"))
                    }
                    filereader.readAsArrayBuffer(md5Chunks)
                } catch (e) {
                    reject("md5计算失败");
                }


                //return new MD5().update(Buffer.Buffer.from(md5Chunks)).digest("hex");
            })

        },
        /**获取相应的密级名称*/
        getSecurityText(value) {
            for (let i = 0; i < this.secrets.length; i++) {
                if (this.secrets[i].value == value) {
                    return this.secrets[i].name;
                }
            }
            return '';
        },
        filenameHasSecret(filename) {
            if (filename.indexOf(this.getFileSecretSpliter()) != -1) {
                return true
            }
            return false;
        },
        getSecretByFileName(filename) {
            if (filename.indexOf(this.getFileSecretSpliter()) == -1) {
                return ""
            } else {
                return filename.substr(0, filename.indexOf(this.getFileSecretSpliter()))
            }
        },
        getFileSecretSpliter() {
            return "★"
        },
        getChangedName(secret, fileName) {
            if (!fileName) {
                return ""
            }
            if (!this.doSecret) {
                return fileName
            }
            if (this.filenameHasSecret(fileName)) {
                const arr = fileName.split(this.getFileSecretSpliter());
                const sourceFileName = arr[1];
                return this.getSecurityText(secret) + this.getFileSecretSpliter() + sourceFileName
            } else {
                return this.getSecurityText(secret) + this.getFileSecretSpliter() + fileName
            }
        },
    },
    computed: {
        //附加密级列表
        secrets() {

            const userDataSecrets = this.getReversedDataMap()("USER_DATA_SECRET");
            if (!userDataSecrets) {
                return []
            }
            const userEnabledSecret = userDataSecrets[this.$userInfo.securityLevel];
            if (!userEnabledSecret) {
                return []
            }
            let userSecret = userEnabledSecret.split(",");

            this.selfSecurity = userSecret[userSecret.length-1];

            const fileSecrets = this.getDataMap()("DATA_SECRET_LEVEL");
            if (!fileSecrets) {
                return []
            }
            const list = [];

            for (let key in fileSecrets) {
                list.push({
                    name: fileSecrets[key],
                    value: key,
                    sequence: Number(key),
                    disable: userSecret.indexOf(key) == -1
                })
            }
            if(this.isPublic && list.length>0){//密级只展示公开，内部
                return list.filter(item=>item.value<=2);
            }
            return list;
        }
    }
}
