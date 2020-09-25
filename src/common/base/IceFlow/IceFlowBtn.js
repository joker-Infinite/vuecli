import printUtil from '@/utils/printUtil'

export default {
    data() {
        return {
            flowButtons: [],
            flowButtonsCommon: [
                {
                    text: '退出',
                    key: 'quit',
                    background: '#909399',
                    color: '#fff',
                    isShow: true,
                    clickFun: this.btnExit
                },
                {
                    text: '保存',
                    key: 'save',
                    background: '#409EFF',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnSave
                },
                {
                    text: '提交',
                    key: 'submit',
                    background: '#67c23a',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnSubmit
                },
                {
                    text: '驳回',
                    key: 'reject',
                    background: '#f9d68f',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnReject,
                    list: [{text: '填写申请', key: 'FirstNode', clickFun: this.btnReject}]
                },
                {
                    text: '加签',
                    key: 'append',
                    background: '#c23f35',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnAppend,
                    list: [
                        {text: '加签在我之前', key: 'before', clickFun: this.btnAppend},
                        {text: '加签在我之后并提交', key: 'after', clickFun: this.btnAppend}
                    ]
                },
                {
                    text: '转办',
                    key: 'handover',
                    background: '#a467c2',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnHandover
                },
                {
                    text: '撤签',
                    key: 'revoke',
                    background: '#38b9c2',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnSubmit
                },
                {
                    text: '抄送',
                    key: 'deliver',
                    background: '#827f46',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnDeliver
                },
                {
                    text: '跳转',
                    key: 'jump',
                    background: '#d71b18',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnJump,
                    list: [
                        {text: '填写申请', key: 'FirstNode', clickFun: this.btnJump}
                    ]
                },

                {
                    text: '强制驳回',
                    key: 'forceReject',
                    background: '#f9cc0d',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnForceReject
                },
                {
                    text: '重新启动',
                    key: 'restart',
                    background: '#f9f506',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnRestart
                },
                {
                    text: '删除流程',
                    key: 'destroy',
                    background: '#d73d0f',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnDestroy
                },

                {
                    text: '终止',
                    key: 'stop',
                    background: '#d71f66',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnStop
                },

                {
                    text: '认领',
                    key: 'claim',
                    background: '#2014c2',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnClaim
                },
                {
                    text: '退回任务池',
                    key: 'backpool',
                    background: '#2014c2',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnBackpool
                },

                {
                    text: '挂起',
                    key: 'hangup',
                    background: '#c2716c',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnHangup
                },
                {
                    text: '取消挂起',
                    key: 'cancelHangup',
                    background: '#67c23a',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnCancelHangup
                },
                {
                    text: '扩展按钮1',
                    key: 'extend1',
                    background: '#c21b2d',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮2',
                    key: 'extend2',
                    background: '#67c23a',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮3',
                    key: 'extend3',
                    background: '#1407c2',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮4',
                    key: 'extend4',
                    background: '#1407c2',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮5',
                    key: 'extend5',
                    background: '#7053c2',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮6',
                    key: 'extend6',
                    background: '#7fc218',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮7',
                    key: 'extend7',
                    background: '#3d97c2',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮8',
                    key: 'extend8',
                    background: '#c2549d',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮9',
                    key: 'extend9',
                    background: '#c2bf16',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '扩展按钮10',
                    key: 'extend10',
                    background: '#14c293',
                    color: '#fff',
                    isShow: false,
                    clickFun: this.btnExtend
                },
                {
                    text: '打印',
                    key: 'print',
                    background: '#89acd8',
                    color: '#fff',
                    isShow: true,
                    clickFun: this.btnPrint
                },
                {
                    text: '查看流程',
                    key: 'view',
                    background: '#30d80a',
                    color: '#fff',
                    isShow: true,
                    clickFun: this.btnView
                }
            ]
        }
    },
    props: {
        flowBtnList: {//将按钮变为下拉选--目前只做了提交
            type: Array,
            default: null
        },
        defineFun: {//提交之前执行的方法--目前只做了提交--提交时手动调用btnSubmit方法
            type: Function,
            default: null,
        },
        printConfig: Object
    },
    watch: {
        flowBtnList: {
            handler(val) {
                this.flowButtons = [];
                this.flowButtonsCommon[2].list = val;//将值赋给提交
                this.flowButtons = this.flowButtonsCommon
            },
            deep: true,
            immediate: true
        },
        defineFun: {
            handler(val) {
                if (val) {
                    this.flowButtons = [];
                    this.flowButtonsCommon[2].clickFun = val;//将值赋给提交
                    this.flowButtons = this.flowButtonsCommon
                }
            },
            deep: true,
            immediate: true
        },

    },
    methods: {
        //打印表单页面
        btnPrint() {
            if (!this.printConfig || !this.printConfig.rows) {
                this.$message.error("未检测到可以打印的信息，请联系管理员！")
                return
            }

            const operateInfo = {
                head: [
                    {prop: 'nodeName', title: '节点名称'},
                    {prop: 'operaterName', title: '操作人'},
                    {prop: 'operateTime', title: '处理时间'},
                    {prop: 'opinion', title: '处理意见'}
                ],
                data: this.operateDataList
            }

            this.$refs.printView.print(printUtil.toHtml(this.printConfig, {...this.printItems, operateInfo}))
        },
        btnView() {
            this.viewFlowDialog = true;
        },
        btnExtend(button) {
            let fun = 'btnE' + button.key.substr(1);
            if (this[fun]) {
                this[fun](this.flowContext, this.bizdata);
            }
        },
        btnSubmit(button, parent) {
            this.flowContext.operateName = parent && parent.text ? parent.text : button.text;
            this.flowContext.operateType = parent && parent.key ? parent.key : button.key;
            if (this.flowValidate) {
                let isTrue = this.flowValidate(this.bizdata, this.flowContext);
                if (!isTrue) {
                    return;
                }
            }

            this.callBizFlowBtn(() => {
                this.flowGetNexNode();
                this.submitFlowDialog = true;
            });

        },
        btnReject(button) {
            // debugger
            this.flowContext.operateName = "驳回";
            this.flowContext.operateType = "reject";
            this.flowContext.targetNodeId = button.key;
            this.flowContext.nextNodeId = button.key;
            this.flowContext.nextNodeName = button.text;
            this.callBizFlowBtn(() => {
                this.flowGetNexNode();
                this.submitFlowDialog = true;
            });
        },
        btnForceReject(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = "reject";
            this.flowContext.targetNodeId = "FirstNode";
            let node = this.flowInstData.flowNodes[this.flowContext.targetNodeId];
            this.flowContext.nextNodeName = node ? node.nodeName : "填写申请";
            this.submitFlowDialog = true;
        },
        btnRestart(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.flowContext.targetNodeId = "FirstNode";
            let node = this.flowInstData.flowNodes[this.flowContext.targetNodeId];
            this.flowContext.nextNodeName = node ? node.nodeName : "填写申请";
            this.submitFlowDialog = true;
            this.setNextNodeUser(this.flowContext.targetNodeId)
        },
        btnDestroy(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.submitFlowDialog = true;
            this.nextNodeShow = false;
        },
        btnStop(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.flowContext.nextNodeId = "EndEvent";
            this.flowContext.nextNodeName = "结束";
            this.callBizFlowBtn(() => {
                this.submitFlowDialog = true;
            });
        },
        btnJump(button, btngroup) {
            this.flowContext.operateName = btngroup ? btngroup.text : "跳转";
            this.flowContext.operateType = btngroup ? btngroup.key : "jump";
            this.flowContext.targetNodeId = button.key;//默认第一环节
            let node = this.flowInstData.flowNodes[this.flowContext.targetNodeId];
            this.flowContext.nextNodeName = node.nodeName;
            this.flowContext.nextNodeId = node.nodeId;
            // this.flowContext.nodeId = node.nodeId;
            //this.flowContext.nodeName = node.nodeName;
            this.callBizFlowBtn(() => {
                if (this.flowBizData) {
                    let data = this.flowBizData();
                    if (!data.oid) {
                        data.oid = this.bizdata.oid ? this.bizdata.oid : "";
                    }
                    this.bizdata = data;
                }
                this.submitFlowDialog = true;
                let next = this.flowInstData.nodeUserSetList.find(item => item.nodeId == this.flowContext.nextNodeId);
                this.flowGetNextUser(next);
                this.setNextNodeUser(this.flowContext.targetNodeId);
                if(node.nodeType == 'SubProcessNode'){
                    this.nextUserName = node.nodeName;
                }
            });
        },
        btnDeliver(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            //this.nextUserLabel = "抄送人";
            // this.nextNodeShow = false;
            // this.submitFlowDialog = true;
            this.$refs.deliver.openDialog();
            //this.$refs.deliver.selectCannel();
        },
        btnAppend(button, parent) {
            this.flowContext.operateType = parent.key;
            this.flowContext.operateName = button.text;
            this.flowContext.appendType = button.key;
            //子操作
            this.flowContext.subOperateName = button.text;
            this.flowContext.nodeId = this.flowInstData.currentNode.nodeId;
            if (!this.flowContext.appendType) {
                this.flowContext.appendType = "before";
                this.flowContext.operateName = button.text + "我之前";
            }
            this.$refs.appendUser.openDialog();
        },
        btnHandover(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.allDept = !!this.flowContext.isManageFlow;
            this.$refs.handover.openDialog();
        },
        btnClaim(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.flowContext.claimType = "single";
            this.flowContext.taskUserId = this.flowInstData.currentTask.oid;
            this.flowContext.newAssigner = this.$userInfo.userCode;
            this.nextUserName = this.$userInfo.userName;
            this.reloadWindows = true;
            this.nextNodeShow = false;
            this.submitFlowDialog = true;
        },
        btnBackpool(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.flowContext.claimType = "single";
            this.flowContext.taskUserId = this.flowInstData.currentTask.oid;
            this.flowContext.proRunId = this.flowInstData.proRun.oid;
            this.nextNodeShow = false;
            this.submitFlowDialog = true;
        },
        btnHangup(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.flowContext.classify = "HANGUP";//挂起任务
            this.nextNodeShow = false;
            this.submitFlowDialog = true;
        },
        btnCancelHangup(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.nextNodeShow = false;
            this.submitFlowDialog = true;
        },
        btnExit() {

            //检查用户是否已经修改数据，如果修改则提示用户是否暂存数据
            if(this.flowButtons&&this.flowButtons.find(item=>item.key=='save'&&item.isShow==true)&&this.pageModified){
                this.$confirm('页面数据未保存, 是否保存?', '提示', {
                    confirmButtonText: '保存',
                    cancelButtonText: '直接退出',
                    type: 'warning',
                    distinguishCancelAndClose: true,//区分取消按钮和右上角叉叉
                }).then(() => {
                    const button=this.flowButtons.find(item=>item.key=='save'&&item.isShow==true)
                    this.flowContext.operateName = button.text;
                    this.flowContext.operateType = button.key;
                    this.callBizFlowBtn(this.flowOperate);
                    this.closeWindows = true;


                }).catch(action => {
                   if (action != 'close'){
                    this.submitFlowDialog = false;
                    // console.log(this.$route.query)
                    if (this.$route.query.$temporaryUsername || this.$route.query['_blank']) {
                        localStorage.setItem("refresh." + this.$route.query.$fromPage, new Date().getTime())
                        window.self.close();
                    } else {
                        this.$router.back();
                    }
                }
                });
            }else {
                this.submitFlowDialog = false;
                // console.log(this.$route.query)
                if (this.$route.query.$temporaryUsername || this.$route.query['_blank']) {
                    localStorage.setItem("refresh." + this.$route.query.$fromPage, new Date().getTime())
                    window.self.close();
                } else {
                    this.$router.back();
                }
            }



        },
        btnSave(button) {
            this.flowContext.operateName = button.text;
            this.flowContext.operateType = button.key;
            this.callBizFlowBtn(this.__flowOperate);
            this.closeWindows = false;
        }
    }
}
