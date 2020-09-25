import {Loading} from 'element-ui';
import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event';
import {mapGetters, mapMutations} from 'vuex';
import IceFlowBtn from './IceFlowBtn';
import qs from 'qs'
import MD5 from 'md5.js'
import uploadFiles from '../uploadFiles'

export default {
    mixins: [IceFlowBtn,uploadFiles],
    props: {
        extendTabs: {
            type: Array,
            default: function () {
                return [
                    /* {name: '附加1'},
                               {name: '附加2'}*/
                ];
            }
        },
        tabShow: {
            //是否隐藏审批信息
            type: Boolean,
            default: true
        },
        loadBtn: {
            //流程按钮的加载
            type: Boolean,
            default: true
        },
        isSecret: {type: Boolean, default: false}, //是否涉密
        oneTabName: {type: String, default: '申请信息'},
        twoTabName: {type: String, default: '审批信息'},
        callActTransmitVar: {type: Object},
        flowReady: {type: Function},
        flowOperateBtn: {type: Function},
        flowValidate: {type: Function},
        flowBizData: {type: Function, required: true},
        btnExtend1: {type: Function},
        btnExtend2: {type: Function},
        btnExtend3: {type: Function},
        btnExtend4: {type: Function},
        btnExtend5: {type: Function},
        btnExtend6: {type: Function},
        btnExtend7: {type: Function},
        btnExtend8: {type: Function},
        btnExtend9: {type: Function},
        btnExtend10: {type: Function},
        applyType: [Boolean, String], //1、formGroup  使用iceFormGroup 布局     2、elRow  使用el-row 布局  3、true:默认使用el-row
        urlRender: {
            type: Boolean,
            default: true
        },
        renderComponentString: {
            type: String,
            default: ''
        },
        customButton:{//按钮是否走校验
            type:[Boolean,Array],
            default:false
        }
    },
    data() {
        return {
            //showUserOptionsDialog: false,
            flowReadyIsLoadOk: false, //flowReady方法是否已经加载
            userOptions: [],
            closeWindows: true,
            reloadWindows: false,
            appendText: {before: '加签在我之前', after: '加签在我之后'},
            //showTag: ["请检查", "同意", "反对"],
            showTag: [
                {type: 'warning', content: '请检查'},
                {type: 'success', content: '同意'},
                {
                    type: 'danger',
                    content: '反对'
                }
            ],
            /* tags: {
                       "submit": [{type: "warning", text: "请检查"}, {type: "success", text: "同意"}],
                       "reject": [{type: "danger", text: "反对"}, {type: "warning", text: "不同意"}]
                   },*/
            width: 0,
            activeTabIndex: 0,
            popSelectColumns: [
                {label: '姓名', code: 'name', width: 120},
                {label: '部门', code: 'dept', width: 120},
                {label: '岗位', code: 'city', width: 120}
            ],
            popSelectData: [],
            movingColumns: [
                {label: '环节名称', code: 'nodeName', width: 120},
                {label: '环节类型', code: 'nodeType', width: 120},
                {label: '开始时间', code: 'nodeBeginTime', width: 200},
                {label: '完成时间', code: 'nodeEndTime', width: 200}
            ],
            movingGridDataUrl: '',
            taskGridDataUrl: '',
            operationsBtn: [
                //remark by rocky 2020-03-19 FIXBUG #4858 取消操作记录的查看按钮
                //{name: '查看', callback: this.showOperationDetail}
            ],
            operateColumns: [
                {label: '操作时间', code: 'operateTime', width: 200},
                {
                    label: '操作人', code: 'operaterName', width: 150, formatter: row => {
                        return row.nodeType === 'SubProcessNode' ? '系统' : row.operaterName
                    }
                },
                {label: '操作类型', code: 'operateName', width: 120},
                {label: '操作环节', code: 'nodeName', width: 120},
                {label: '流向环节', code: 'flowNodeName', width: 120}
            ],
            taskColumns: [
                {label: '任务环节', code: 'nodeName', width: 100},
                {label: '环节类型', code: 'nodeType', width: 80},
                {label: '开始时间', code: 'beginTime', width: 150},
                {label: '预定处理人', code: 'assignerName', width: 150},
                {label: '完成时间', code: 'endTime', width: 150},
                {label: '实际处理人', code: 'realAssignerName', width: 150},
                {label: '意见', code: 'opinion', width: 120, showOverflow: 'title'}
            ],
            suggestionColumns: [
                {label: '处理人', code: 'operaterName', width: 150},
                {label: '处理环节', code: 'nodeName', width: 120},
                {label: '处理类型', code: 'operateName', width: 100},
                {label: '处理时间', code: 'operateTime', width: 150},
                {label: '处理结果', code: 'opinion'}
            ],
            operateDataList: [], //操作记录
            operateDataMsgList: [],
            viewFlowDialog: false,
            nextNodeShow: true,
            nextUserShow: true,
            dataSecretText: '非密', //名字
            fileSecretObj: {}, //文件密级
            submitFlowDialog: false,
            collectorAssigners: true,
            replacePersonUser: [],
            flowAssignerMap: {},
            flowNodesStatus: '{}',
            flowNodesInfo: {},
            flowContext: {
                dataSecretLevcode: '1',
                actDefName: '',
                additionalContent: '',//流程标题后追加内容
                actInstId: '',
                actDefId: '',
                dataId: null,
                nodeId: 'FirstNode',
                // formId: this.$route.fullPath,

                formId: this.urlRender
                    ? this.$route.fullPath
                    : this.renderComponentString,
                executionId: null,
                taskUserId: null,
                nextNodeId: null,
                nextNodeName: null,
                operater: null,
                applyer: null,
                operateType: 'submit',
                operateName: null,
                subOperateType: null,
                subOperateName: null,
                targetNodeId: null,
                authorAssigner: null,
                appendType: null,
                appendAuthors: null,
                notifyReceivers: null,
                targetTaskPoolId: null,
                claimNumber: 0,
                claimType: null,
                //流程处理意见
                flowComment: null,
                //流程消息提示
                flowMessage: null,
                deliverUser: '',
                assigners: {},
                //processVar: {},
                bizCallClass: '',
                callActTransmitVar: '',
                preAssigners: {},
                getFormReadonly: _ => this.formReadonly,
                getIsAuthor: _ => this.isAuthor
            },
            nextUserLabel: '下一处理人',
            nextUserName: '',
            nextUserNameComm: '',//下一处理人name备份，用于取消还原
            nextUserIdComm: '',//下一处理人code备份，用于取消还原
            nodeId: '',//用于取消时的数据还原
            isPersionRefresh: true,//刷新数据
            currentAssignersList: [],//当前处理人
            isFirstInit: true,
            nodeUserList: [],//审核人数据
            formP: {},
            nextUserId: '',
            // nextUserMode: "readonly",
            nextUserRead: false,
            flowInstData: {
                isNewFlow: true,
                actDefId: '',
                currentTask: {oid: ''},
                nodeButtons: [
                    {
                        key: 'save',
                        text: '保存',
                        type: null,
                        value: null,
                        accessKey: null
                    }
                ],
                actInstId: '',
                definition: {
                    id: '',
                    key: '',
                    version: 1,
                    name: '',
                    description: '',
                    type: 't1',
                    bizDataRule: null
                },
                isAuthor: true,
                nodeUserSetList: []
            },
            bizdata: {},
            submiting: false,
            formGroupRepostory: {}, //form组信息列表
            formGroupRepostoryList: [],
            formGroupLeft: 0, //分组左边对齐偏移量
            userActived: false, //用户点击了分组信息
            activedForm: 0, //当前激活的form组
            activeTimeOut: -1,
            resizeEventListener: e => {
                this.formGroupLeft = this.$refs['flow-form-wrapper']
                    ? Number(this.$refs['flow-form-wrapper'].offsetLeft) - 128 + 'px'
                    : '-128px';
            },
            applyRules: {
                //申请人信息校验
                afPhone: [
                    {
                        required: true,
                        whitespace: true,
                        message: '请输入联系电话',
                        trigger: 'blur'
                    }
                ]
            },
            printItems: {}, //打印元素收集
            showInvalid: false,
            showInvalidTimer: null,
            showInvalidEnhance: false,
            showInvalidEnhanceTimer: null,
            callActTransmitVarComm: {},
            pageModified: false,//页面数据已被修改
            allDept:false,//选人组件是否显示全组织机构
        };
    },
    methods: {
        ...mapMutations('datamapStore', ['addUndoTypeCodes']),
        ...mapGetters('datamapStore', ['getDataMap', 'getReversedDataMap']),
        taskRowSpanMethod({row, column, rowIndex, columnIndex, data}) {
            /*  if (columnIndex === 4) {
                        if (row.nodeType == "单签多人" && data[rowIndex + 1] && data[rowIndex + 1].nodeId == row.nodeId) {
                            //data[rowIndex+1].endTime="";
                            return {
                                rowspan: 2,
                                colspan: 1
                            };
                        }
                    }
                    if (columnIndex === 5) {
                        if (row.nodeType == "单签多人" && data[rowIndex + 1] && data[rowIndex + 1].nodeId == row.nodeId) {
                            return {
                                rowspan: 2,
                                colspan: 1
                            };
                        }
                    }*/
        },
        beforeBindData(data) {
            return data.filter(item => (!!item.realAssignerId || item.status != '1') && item.nodeTaskType !== 'SubProcessNode');
        },
        selectConfirmAppendUser(rows) {
            this.nextUserName = rows[0].name;
            this.flowContext.appendAuthors = rows[0].code;
            this.nextNodeShow = false;
            this.submitFlowDialog = true;
        },
        selectConfirmHandover(rows) {
            this.flowContext.newAssigner = rows[0].code;
            this.nextUserName = rows[0].name;
            this.nextNodeShow = false;
            this.submitFlowDialog = true;
        },
        selectConfirmDeliver(rows) {
            this.flowContext.deliverUser = JSON.stringify(rows);
            this.closeWindows = false;
            this.flowOperate();
        },
        flowNodesStatusInit() {
            // console.log(this.flowInstData)
            if (this.flowInstData.proOperates) {
                let nodeStatus = {},
                    flowNodesInfo = {};
                this.flowInstData.proOperates.forEach(item => {
                    nodeStatus[item.nodeId] = 'success';
                    if (item.operateKey == 'reject') {
                        nodeStatus[item.nodeId] = 'reject';
                    }
                    flowNodesInfo[item.nodeId] = {
                        operaterName: item.operaterName,
                        operateName: item.operateName,
                        operateTime: item.operateTime,
                        opinion: item.opinion,
                        status: nodeStatus[item.nodeId]
                    };
                });
                if (this.flowInstData.proNodeList) {
                    this.flowInstData.proNodeList.forEach(item => {
                        nodeStatus[item.nodeId] = 'runing';
                        let task = this.flowInstData.currentTask;
                        let assignerName = '';
                        if(task && this.currentAssignersList.length > 0){
                            this.currentAssignersList.forEach(assigner => {
                                if(item.nodeId == assigner.nodeId && assigner.status == 0){
                                    if(assignerName === ''){
                                        assignerName = assigner.assignerName;
                                    }else{
                                        assignerName += ','+assigner.assignerName;
                                    }
                                }
                            });
                        }
                        flowNodesInfo[item.nodeId] = {
                            operaterName: assignerName ? assignerName : task ? task.assignerName : '',
                            beginTime: task.beginTime,
                            operateName: '',
                            operateTime: '',
                            opinion: '',
                            status: nodeStatus[item.nodeId]
                        };
                    });
                }
                this.flowNodesStatus = JSON.stringify(nodeStatus);
                this.flowNodesInfo = flowNodesInfo;
            }
        },
        showOperationDetail(row) {
            let formId = '';
            if (this.flowInstData.proRun && this.flowInstData.proRun.formId) {
                formId = this.flowInstData.proRun.formId;
            }
            formId = formId + '&operateId=' + row.oid;
            //this.openWin("#" + formId, "环节历史数据查看");
            this.$openFlow(formId, {blank: true});
            //this.$router.push( );
        },
        openWin(url, name) {
            var iWidth = window.screen.availWidth - 10; //弹出窗口的宽度;
            var iHeight = window.screen.availHeight - 30; //弹出窗口的高度;
            //获得窗口的垂直位置
            var iTop = 0; // (window.screen.availHeight - 30 - iHeight) / 2;
            //获得窗口的水平位置
            var iLeft = 0; // (window.screen.availWidth - 10 - iWidth) / 2;
            window.open(url); //,'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
            // window.open("AddScfj.aspx", "newWindows", 'height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        },
        handleClick(tab, event) {
            this.activeTabIndex = tab.index;
        },
        selectConfirm(rows, key, texts, nodeId) {
            // alert(JSON.stringify(rows))
            // debugger
            let assginIds = '',
                assginNames = '';
            rows.forEach(item => {
                assginIds += ',' + item.code;
                assginNames += ',' + item.name;
            });
            assginIds = assginIds.substr(1);
            assginNames = assginNames.substr(1);
            let obj = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == nodeId
            );
            obj.assignerId = assginIds;
            obj.assignerName = assginNames;
            this.nextUserName = assginNames;
            this.nextUserId = assginIds;
            this.collectorAssigners = true;
        },
        showButton() {
            for (let i = 0; i < this.flowButtons.length; i++) {
                //隐藏所有
                if (
                    !(
                        this.flowButtons[i].key == 'quit' ||
                        this.flowButtons[i].key == 'view'
                    )
                ) {
                    this.flowButtons[i].isShow = false;
                }
                //驳回
                if (this.flowButtons[i].key == 'reject') {
                    let nodeSet = this.flowInstData.flowNodes['FirstNode'];
                    let list = [
                        {
                            text: nodeSet.nodeName ? nodeSet.nodeName : '填写申请',
                            key: 'FirstNode',
                            clickFun: this.btnReject
                        }
                    ];
                    this.$set(this.flowButtons[i], 'list', list);
                }
                //跳转
                if (this.flowButtons[i].key == 'jump') {
                    let nodeSet = this.flowInstData.flowNodes['FirstNode'];
                    let list = [
                        {
                            text: nodeSet.nodeName ? nodeSet.nodeName : '填写申请',
                            key: 'FirstNode',
                            clickFun: this.btnJump
                        }
                    ];
                    this.$set(this.flowButtons[i], 'list', list);
                }
            }
            let buttons = this.flowInstData.nodeButtons
                ? this.flowInstData.nodeButtons.btnList
                : [];
            //  alert(JSON.stringify(this.flowContext))
            let task = this.flowInstData.currentTask;
            if (task && task.classify == 'HANGUP' && this.flowInstData.isAuthor) {
                buttons = ['cancelHangup'];
            }
            if (task && task.classify != 'HANGUP') {
                let index = buttons.indexOf('cancelHangup');
                if (index != -1) {
                    buttons.splice(index, 1);
                }
            }
            if (task && task.groupTask == '1' && this.flowInstData.isAuthor) {
                buttons = ['claim'];
            }
            if (
                task &&
                task.groupTask == '2' &&
                task.status == 0 &&
                this.flowInstData.isAuthor
            ) {
                buttons.push('backpool');
                if (buttons.indexOf('claim') != -1) {
                    buttons.splice(buttons.indexOf('claim'), 1);
                }
            }
            if (
                task &&
                task.inOperateType == 'reject' &&
                this.flowContext.nodeId == 'FirstNode' &&
                this.flowInstData.isAuthor
            ) {
                buttons.push('stop');
            }
            if (
                this.flowInstData.currentNodeSet &&
                this.flowInstData.currentNodeSet.nodeType == 'SubProcessNode'
            ) {
                buttons = [];
            }
            if (buttons) {
                //当前为处理人
                buttons.forEach(key => {
                    for (let i = 0; i < this.flowButtons.length; i++) {
                        if (this.flowButtons[i].key == key) {
                            if (this.flowInstData.isNewFlow) {
                                let isNewBtn = key == 'save' || key == 'submit';
                                if (!isNewBtn) {
                                    continue;
                                }
                            }
                            this.flowButtons[i].isShow = true;
                            if (
                                this.flowInstData.nodeButtons &&
                                this.flowInstData.nodeButtons[key]
                            ) {
                                this.flowButtons[i].text = this.flowInstData.nodeButtons[key];
                            }
                        }
                    }
                });
            }
        },
        hiddenBtn(btns) {
            // 根据btnkey隐藏按钮  keys逗号间隔 支持多个
            this.optButton(btns, false);
        },
        hiddenBtnChild(btn, codes) {
            // 隐藏按钮的下级按钮
            for (let i = 0; i < this.flowButtons.length; i++) {
                if (this.flowButtons[i].key == btn) {
                    if (this.flowButtons[i].list && this.flowButtons[i].list.length > 1) {
                        let list = this.flowButtons[i].list.filter(
                            item => codes.indexOf(item.key) == -1
                        );
                        this.flowButtons[i].list = list;
                    }
                }
            }
        },
        optButton(btns, bol) {
            if (btns) {
                let keys = btns.split(',');
                keys.forEach(key => {
                    for (let i = 0; i < this.flowButtons.length; i++) {
                        if (this.flowButtons[i].key == key) {
                            this.flowButtons[i].isShow = bol;
                        }
                    }
                });
            }
        },
        showBtn(btns) {
            this.optButton(btns, true);
        },
        isAdmin() {
            let isAdmin = false;
            if (this.flowInstData.isAdmin) {
                isAdmin = true;
            }
            return isAdmin;
        },
        async callBizFlowBtn(call) {
            if (this.showInvalidEnhanceTimer) {
                clearTimeout(this.showInvalidEnhanceTimer);
            }
            this.showInvalidEnhanceTimer = null;
            if (this.showInvalidTimer) {
                clearTimeout(this.showInvalidTimer);
            }
            this.showInvalidTimer = null;
            this.showInvalid = false;
            this.showInvalidEnhance = false;
            if(this.getUploadStatus()){
                this.$message.warning("还有附件在上传中,请等附件上传完或者关掉该附件");
                return
            }

            let isTrue = false;
            //customButton为false时，则默认提交和跳转要校验，其他的不校验，为true则走流程自己写的的校验
            if(typeof this.customButton === 'boolean' && !this.customButton){
                isTrue = this.flowContext.operateType !== 'submit' && this.flowContext.operateType !== 'jump'
            }

            if(this.customButton instanceof Array){
                //找到的则校验，没找的则不校验
                isTrue = this.customButton.indexOf(this.flowContext.operateType) === -1;
            }

            //为true时代表不校验
            if(isTrue){
                call();
                return
            }

            if (this.flowOperateBtn) {
                //流程操作按钮
                //校验申请人信息
                let applyValid = true;
                if (
                    this.applyShowRule == 'gridLayout' ||
                    this.applyShowRule == 'elRow'
                ) {
                    const applyForm = this.$refs.applyForm;
                    try {
                        applyValid = await applyForm.validate();
                    } catch (e) {
                        applyValid = false;
                    }
                }

                let operateValid = true;
                const operate = this.flowOperateBtn(this.flowContext, this.bizdata);
                try {
                    operateValid = await operate;
                } catch (e) {
                    operateValid = false;
                    if (operate.catchHandler) {
                        operate.catchHandler(e);
                    } else {
                        // this.$message.error("按钮出错!");
                    }
                }

                let result = {success: false, break: false};

                if (
                    typeof operateValid === 'object' &&
                    !(operateValid instanceof Array)
                ) {
                    result = operateValid;
                } else {
                    result = {
                        success: operateValid,
                        break: false
                    };
                }

                if ((result.success && result.break === false && applyValid)) {
                    call();
                    return;
                }

                if (result.break === false) {
                    this.showInvalid = true;
                    this.showInvalidEnhance = true;
                    this.showInvalidEnhanceTimer = setTimeout(_ => {
                        this.showInvalidEnhance = false;
                        this.showInvalidEnhanceTimer = null;
                    }, 1000);
                    this.showInvalidTimer = setTimeout(_ => {
                        this.showInvalid = false;
                        this.showInvalidTimer = null;
                    }, 10000);
                }

                return false;

                /*
                                        if (operate instanceof Promise) {
                                            operate.then((result) => {
                                                if (result) {
                                                    if (call) call();
                                                } else {
                                                    // this.$message.error("请检查表单数据，存在校验未通过的数据")
                                                }
                                            }).catch((res) => {

                                            });
                                        } else {
                                            if (!operate) {
                                                // this.$message.error("请检查表单数据，存在校验未通过的数据")
                                                return false;
                                            }
                                            if (call) call();
                                        }*/
            } else {
                if (call) call();
            }
        },
        __flowOperate() {
            this.$confirm('确定保存操作吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            })
                .then(() => {
                    // this.closeWindows = false;
                    this.flowOperate();
                })
                .catch(() => {
                    this.closeWindows = true;
                });
        },
        validateFlowAssigners() {
            ////1.本环节处理人不允许为空 2.下一环节处理人不鞥为空3.后端配置为必填不允许为空
            let auto = true;
            let obj = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == this.flowContext.nodeId
            );
            let nodeSet = this.flowInstData.flowNodes[this.flowContext.nodeId];
            if (obj && !obj.assignerId && nodeSet && !nodeSet.autoSkipNull && (this.flowContext.operateType == 'submit' || this.flowContext.operateType == 'jump')) {
                this.$message.error(obj.nodeName + '：环节审批人为空');
                auto = false;
                return auto;
            }
            let next = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == this.flowContext.nextNodeId
            );
            nodeSet = this.flowInstData.flowNodes[this.flowContext.nextNodeId];
            if (next && !next.assignerId && nodeSet && !nodeSet.autoSkipNull && (this.flowContext.operateType == 'submit' || this.flowContext.operateType == 'jump')) {
                this.$message.error(next.nodeName + '：环节审批人为空');
                auto = false;
                return auto;
            }

            this.flowInstData.nodeUserSetList.forEach(item => {
                let roleFormula = item.roleFormula;
                if (typeof item.roleFormula == 'string') {
                    roleFormula = JSON.parse(item.roleFormula);
                }
                if (!item.assignerId && roleFormula.required && (this.flowContext.operateType == 'submit' || this.flowContext.operateType == 'jump')) {
                    this.$message.error(item.nodeName + '：环节审批人为空');
                    auto = false;
                    return auto;
                }
            });

            //校验表单密级
            if (this.showSecret) {
                if (!this.flowContext.dataSecretLevcode) {
                    this.$message.error('必须选择密级');
                    auto = false;
                }
                if (this.flowContext.dataSecretLevcode < this.minSecret) {
                    this.$message.error('表单密级必须大于上传的附件密级');
                    auto = false;
                }
            }
            return auto;
        },
        validateNodeSet() {
            if (
                this.flowInstData.currentNodeSet &&
                this.flowInstData.currentNodeSet.isRequiredCommont
            ) {
                if (!this.flowContext.flowComment && this.submitFlowDialog) {
                    this.$message.warning(this.isFirstNode?'备注必填':'处理意见必填');
                    return false;
                }
            }
            return true;
        },
        flowOperate() {
            if (this.flowBizData) {
                //流程点击提交时的扩展
                this.$emit("beforeSave", this.flowContext, this.bizdata);
                let data = this.flowBizData();
                if (!data.oid) {
                    data.oid = this.bizdata.oid ? this.bizdata.oid : '';
                }
                this.bizdata = {...this.bizdata, ...data};
            }
            if (!this.validateFlowAssigners()) {
                return;
            }
            if (!this.validateNodeSet()) {
                return;
            }
            let loadingInstance = this.showLoading();
            let obj = Object.assign({}, this.flowContext);
            let ass = {};
            let assigners = {};
            this.flowInstData.nodeUserSetList.forEach(item => {
                if (item.assignerId && item.nodeId == this.flowContext.nextNodeId) {
                    let o = {
                        assignerId: item.assignerId,
                        assignerName: item.assignerName
                    };
                    assigners[item.nodeId] = item.assignerId;
                    ass[item.nodeId] = o;
                }
            });

            if (obj.processVar) {
                obj.processVar = JSON.stringify(obj.processVar);
            }
            if (this.collectorAssigners) {
                obj.preAssigners = JSON.stringify(ass);
                obj.assigners = JSON.stringify(assigners);
            }
            if (this.isFirstNode && this.flowInstData.isNewFlow) {
                //obj.applyer = ass[this.flowContext.nodeId].assignerId;
            }
            if (this.flowInstData && this.flowInstData.proRun) {
                obj.applyer = this.flowInstData.proRun.afPersonId
            }
            if (this.callActTransmitVar) {
                obj.callActTransmitVar = JSON.stringify(this.callActTransmitVar);
            }
            if (!this.isSecret) {
                //不涉密数据
                this.flowContext.dataSecretLevcode = '1';
            }
            this.submiting = true;
            this.submitFlowDialog = false;
            this.$axios
                .post('/bpm/pro/run', {
                    bizData: JSON.stringify(this.bizdata),
                    flowContext: obj
                })
                .then(result => {
                    if (result.data) {
                        this.bizdata = result.data;
                        this.$emit("bizDataReload", this.bizdata);
                    }
                    this.pageModified = false
                    this.$message.success('成功');
                    loadingInstance.close();
                    if (this.reloadWindows) {
                        this.$$loadData();
                        this.reloadWindows = false;
                        return;
                    }
                    if (this.closeWindows) {
                        this.btnExit();
                    }
                    this.closeWindows = true;
                })
                .catch(error => {
                    loadingInstance.close();
                    this.$message.error(error.msg);
                })
                .finally(() => {
                    this.submiting = false;
                    this.$emit('callBackSuccess');
                });
        },
        flowGetNexNode() {
            if (this.flowBizData) {
                let data = this.flowBizData();
                if (!data.oid) {
                    data.oid = this.bizdata.oid ? this.bizdata.oid : '';
                }
                this.bizdata = {...this.bizdata, ...data};
            }
            this.nextUserName = '';
            let loadingInstance = this.showLoading();
            let obj = Object.assign({},this.bizdata,this.flowContext.processVar);
            this.$axios
                .post('/bpm/pro/getNextNode', {
                    actDefId: this.flowContext.actDefId,
                    nodeId: this.flowContext.nodeId,
                    processParams: JSON.stringify(obj),
                    currentBtnType: this.flowContext.operateType,
                    nextNodeId: this.flowContext.nextNodeId,
                    proTaskUserId: this.flowInstData.currentTask
                        ? this.flowInstData.currentTask.oid
                        : ''
                })
                .then(result => {
                    let nextNodeIds = '',
                        nextNodeNames = '';
                    let showChildFlowName = false;
                    result.data.forEach(item => {
                        nextNodeIds += ',' + item.id;
                        nextNodeNames += ',' + item.name;
                        let node = this.flowInstData.flowNodes[item.id];
                        if(node && node.nodeType == 'SubProcessNode'){
                            showChildFlowName = true;
                        }
                        let assigners = [];
                        if(item.replacePerson === 1){
                            assigners = item.realAssigners;
                        }else{
                            assigners = item.assigners;
                        }
                        if (assigners && assigners.length > 0) {
                            let nextUserId = '',
                                nextUserName = '';
                            assigners.forEach(user => {
                                if (this.nextUserName) {
                                    this.nextUserName += ',' + user.name;
                                } else {
                                    this.nextUserName = user.name;
                                }
                                nextUserId += ',' + user.code;
                                nextUserName += ',' + user.name;
                            });
                            if (item.isCollect == 0) {
                                this.nextUserRead = true;
                            } else {
                                let obj = this.flowInstData.nodeUserSetList.find(
                                    ii => ii.nodeId == item.id
                                );
                                obj.assignerId = nextUserId.substr(1);
                                obj.assignerName = nextUserName.substr(1);
                            }
                            // console.log(816)
                            this.setReplacePersonUser(item.assigners);
                        } else {
                            let obj = this.flowInstData.nodeUserSetList.find(
                                it => it.nodeId == item.id
                            );
                            if (obj && obj.assignerName) {
                                if (this.nextUserName) {
                                    this.nextUserName += ',' + obj.assignerName;
                                } else {
                                    this.nextUserName = obj.assignerName;
                                }
                                //this.nextUserMode = obj.modifiable ? "input" : "readonly";
                            }
                            this.flowGetNextUser(obj);
                        }
                    });
                    this.flowContext.nextNodeId = nextNodeIds.substr(1);
                    this.flowContext.nextNodeName = nextNodeNames.substr(1);
                    if(showChildFlowName){
                        this.nextUserName = this.flowContext.nextNodeName;
                    }
                    loadingInstance.close();
                })
                .catch(error => {
                    console.error(error);
                    loadingInstance.close();
                    this.$message.error(error.msg);
                });
        },
        flowGetNextUser(next) {
            // let next = this.flowInstData.nodeUserSetList.find(item => item.nodeId == this.flowContext.nextNodeId);
            if (next && next.nodeAssigners && next.nodeAssigners.length > 0) {
                next.nodeAssigners.forEach(item => {
                    let obj = Object.assign({}, item);
                    if (this.isHasVariable(obj) || obj.assignPreNodeId) {
                        // debugger
                        this.setVariable(obj);
                        // if (this.isHasVariable(obj)) {
                        //     this.$message.error(
                        //         next.nodeName + ':获取审批人失败，业务中无相关参数-'
                        //     ); // + JSON.stringify(obj));
                        //     return;
                        // }
                        obj.nodeId = next.nodeId;
                        delete obj.nodeMap;
                        delete obj.persons;
                        if(this.flowContext && this.flowContext.actInstId){
                            obj.actInstId = this.flowContext.actInstId;
                        }
                        if(this.bizdata){
                            obj.processParams = JSON.stringify(this.bizdata);
                        }
                        this.$axios
                            .post('/bpm/pro/getAssigners', obj)
                            .then(result => {
                                let persons = result.data.nodeAssignerPersons;
                                if (persons && persons.length > 0) {
                                    // let next = this.flowInstData.nodeUserSetList.find(item => item.nodeId == next.nodeId);
                                    let ids = '',
                                        names = '';
                                    persons.forEach(item => {
                                        ids += ',' + item.code;
                                        names += ',' + item.name;
                                    });
                                    ids = ids.substr(1);
                                    names = names.substr(1);
                                    next.assignerId = ids;
                                    next.assignerName = names;

                                    if (
                                        this.nextUserName &&
                                        this.flowContext.nextNodeId &&
                                        this.flowContext.nextNodeId.indexOf(',') != -1
                                    ) {
                                        this.nextUserName += ',' + names;
                                    } else {
                                        this.nextUserName = names;
                                    }
                                    // console.log(887)
                                    this.setReplacePersonUser(persons);
                                    //this.collectorAssigners = true;
                                }
                            })
                            .catch(error => {
                                this.$message.error(error.msg);
                            });
                    }
                });
            } else {
                if (next) {
                    this.setNextNodeUser(next.nodeId);
                }
            }
        },
        loadButtonExt() {
            this.$axios
                .get('/bpm/nodeButtonExt/list', {
                    params: {
                        actDefId: this.flowContext.actDefId,
                        nodeId: this.flowContext.nodeId,
                        current: 1,
                        size: 100
                    }
                })
                .then(result => {
                    let extList = result.data;
                    if (!extList) {
                        return;
                    }
                    this.flowButtons.forEach(obj => {
                        extList.forEach(item => {
                            if (obj.key == item.buttonKey) {
                                if (item.value) {
                                    let list = [];
                                    let btnKeys = item.value.split(',');
                                    btnKeys.forEach(btn => {
                                        let text = this.flowInstData.flowNodes[btn]
                                            ? this.flowInstData.flowNodes[btn].nodeName
                                            : '';
                                        if (btn == 'toPreNode') {
                                            if (this.flowInstData.upProNode) {
                                                text = this.flowInstData.upProNode.nodeName;
                                                btn = this.flowInstData.upProNode.nodeId;
                                            }
                                        }
                                        if (!text) {
                                            text = this.appendText[btn];
                                        }
                                        let b = {text: text, key: btn, clickFun: obj.clickFun};
                                        list.push(b);
                                    });
                                    let res = new Map();
                                    this.$set(
                                        obj,
                                        'list',
                                        list.filter(a => !res.has(a.key) && res.set(a.key, 1))
                                    ); //去重
                                }
                            }
                        });
                    });
                });
        },
        getCurrentAssigners() {
            this.$axios.get("/bpm/proTaskUser/searchTasks?actInstId=" + this.flowContext.actInstId).then(res => {
                this.currentAssignersList = res.data
                this.isFirstInit = false;
                this.flowNodesStatusInit();
            })
        },
        loadAssigners() {
            let t = this;
            this.$axios
                .get('/bpm/pro/loadAssigners', {
                    params: {
                        actDefId: this.flowContext.actDefId,
                        actInstId: this.flowContext.actInstId
                    }
                })
                .then(result => {
                    let assignerMap = result.data;
                    this.flowAssignerMap = assignerMap;
                    if (!assignerMap || !assignerMap['FirstNode']) {
                        return;
                    }
                    this.flowInstData.nodeUserSetList.forEach(item => {
                        let nodeAssigner = assignerMap[item.nodeId];
                        // debugger
                        if (nodeAssigner && nodeAssigner.nodeAssignerPersons && nodeAssigner.nodeAssignerPersons.length > 0) {
                            let ids = '', names = '';
                            nodeAssigner.nodeAssignerPersons.forEach(item => {
                                ids += ',' + item.code;
                                names += ',' + item.name;
                            });
                            ids = ids.substr(1);
                            names = names.substr(1);
                            item.assignerId = ids;
                            item.assignerName = names;
                            //nodeStatus为2代表已处理的环节
                            /*if(item.nodeStatus == '2'){
                              let id = '';
                              let name = '';
                                for (let i = 0; i < this.currentAssignersList.length; i++) {
                                    //ok判断一个环节是否被多个人处理
                                    if(this.currentAssignersList[i].nodeId === item.nodeId && !!this.currentAssignersList[i].realAssignerId){
                                      //将处理人改为实际处理人
                                        id = id+','+this.currentAssignersList[i].realAssignerId;
                                        name = name+','+this.currentAssignersList[i].realAssignerName;
                                    }
                                }
                                item.assignerId = id?id.substr(1):item.assignerId;
                                item.assignerName = name?name.substr(1):item.assignerName;
                                //流程图节点操作人信息
                                this.flowNodesInfo[item.nodeId].operaterName = item.assignerName;
                            }*/
                        } else {
                            item.assignerId = '';
                            item.assignerName = '';
                        }
                        item.nodeAssigners = nodeAssigner.nodeAssigners;

                    });
                    let clone = require('clone');
                    //拷贝数据，用于审核人展示
                    this.nodeUserList = clone(this.flowInstData.nodeUserSetList);
                    for (let i = 0; i < this.nodeUserList.length; i++) {
                        let nodeAssigner = assignerMap[this.nodeUserList[i].nodeId];
                        //判断当前节点是否有人
                        let flag = nodeAssigner && nodeAssigner.nodeAssignerPersons && nodeAssigner.nodeAssignerPersons.length > 0;
                        if (flag) {
                            //为2代表当前节点为已处理过
                            if (this.nodeUserList[i].nodeStatus == '2') {
                                let id = '';
                                let name = '';
                                for (let j = 0; j < this.currentAssignersList.length; j++) {
                                    if (this.currentAssignersList[j].nodeId === this.nodeUserList[i].nodeId && !!this.currentAssignersList[j].realAssignerId) {
                                        //将处理人改为实际处理人
                                        id = id.indexOf(this.currentAssignersList[j].realAssignerId) > -1 ? id : id + ',' + this.currentAssignersList[j].realAssignerId;
                                        name = name.indexOf(this.currentAssignersList[j].realAssignerName) > -1 ? name : name + ',' + this.currentAssignersList[j].realAssignerName;
                                    }
                                }
                                this.nodeUserList[i].assignerId = id ? id.substr(1) : this.nodeUserList[i].assignerId;
                                this.nodeUserList[i].assignerName = name ? name.substr(1) : this.nodeUserList[i].assignerName;
                                //流程图节点操作人信息
                                this.flowNodesInfo[this.nodeUserList[i].nodeId].operaterName = this.nodeUserList[i].assignerName;
                            }
                        } else {
                            this.nodeUserList[i].assignerId = '';
                            this.nodeUserList[i].assignerName = '';
                        }
                    }

                    let temp = {};//临时变量
                    for (let i = 0; i < this.nodeUserList.length - 1; i++) {
                        for (let j = this.nodeUserList.length - 1; j > i; j--) {
                            if (this.nodeUserList[j].nodeStatus > this.nodeUserList[j - 1].nodeStatus) {
                                temp = this.nodeUserList[j];
                                this.nodeUserList[j] = this.nodeUserList[j - 1];
                                this.nodeUserList[j - 1] = temp;
                            }
                        }
                    }
                })
                .catch(data => {
                    this.$alert(data.msg, '警告-加载审批人异常', {
                        confirmButtonText: '确定',
                        type: 'error',
                        callback: action => {
                            // this.$router.back();
                        }
                    });
                });
        },
        isHasVariable(obj) {
            let has = false;
            for (let k in obj) {
                if (obj[k] && typeof obj[k] == 'string' && obj[k].indexOf('{') != -1) {
                    if (
                        obj[k] != '{applierPerson}' &&
                        obj[k] != '{currentPerson}' &&
                        obj[k] != '{applierLeader}' &&
                        obj[k] != '{currentLeader}' &&
                        obj[k] != '{applierOrganization}' &&
                        obj[k] != '{currentOrganization}' &&
                        obj[k] != '{applierUnit}' &&
                        obj[k] != '{applierTenantCode}' &&
                        obj[k] != '{currentUnit}' &&
                        obj[k] != '{currentTenantCode}'
                    ) {
                        has = true;
                        return has;
                    }
                }
            }
            return has;
        },
        setVariable(item) {
            for (let k in item) {
                if (
                    item[k] &&
                    typeof item[k] == 'string' &&
                    item[k].indexOf('{') != -1
                ) {
                    let key = item[k].substr(1, item[k].length - 2);
                    let value = this.bizdata[key];
                    if (value) {
                        item[k] = value;
                    }
                }
            }
        },
        setBizData(data) {
            this.bizdata = data;
        },
        getBizData() {
            return this.bizdata;
        },
        reduction() {
            this.submitFlowDialog = false
            let obj = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == this.nodeId
            );
            if (obj) {
                obj.assignerName = this.nextUserNameComm;
                obj.assignerId = this.nextUserIdComm;
            }
        },
        setNextNodeUser(nodeId) {
            //设置下一步处理人
            if (!nodeId) {
                nodeId = this.flowContext.nextNodeId;
            }
            let obj = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == nodeId
            );
            if (obj && obj.assignerId) {
                /*  let assignerId="",assignerName="";
                           obj.nodeAssignerPersons.forEach(it=>{
                               assignerId+=","+it.code;
                               assignerName+=","+it.name;
                           })
                          assignerId=assignerId.substr(1);
                          assignerName=assignerName.substr(1);*/
                //用于取消时还原数据
                this.nextUserNameComm = obj.assignerName;
                this.nextUserIdComm = obj.assignerId;
                this.nodeId = nodeId;
                this.isPersionRefresh = false;
                this.$nextTick(() => {
                    this.isPersionRefresh = true;
                })


                this.nextUserName = obj.assignerName;
                this.nextUserId = obj.assignerId;
            }
        },
        getFormRole() {
            //获取规则
            var role = {};
            ////全局字段规则
            if (
                this.flowInstData.definition &&
                this.flowInstData.definition.bizFormRule
            ) {
                let data = JSON.parse(this.flowInstData.definition.bizFormRule);
                this.filterProperty(role, data);
            }
            //环节字段规则
            if (
                this.flowInstData.currentNodeSet &&
                this.flowInstData.currentNodeSet.formRole
            ) {
                let data = JSON.parse(this.flowInstData.currentNodeSet.formRole);
                this.filterProperty(role, data);
            }
            return role;
        },
        getFormProperty() {
            //获取属性
            var role = {};
            //环节字段规则
            if (
                this.flowInstData.currentNodeSet &&
                this.flowInstData.currentNodeSet.formTemplate
            ) {
                let data = JSON.parse(this.flowInstData.currentNodeSet.formTemplate);
                this.filterProperty(role, data);
            }
            return role;
        },
        filterProperty(role, data) {
            //过滤属性
            for (let i = 0; i < data.length; i++) {
                //debugger
                if (data[i].isAuth == undefined || data[i].isAuth == '0') {
                    //默认
                    role[data[i].code] = data[i];
                }
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].isAuth == '1') {
                    //处理人
                    if (this.isAuthor) {
                        role[data[i].code] = data[i];
                    }
                }
            }
            for (let i = 0; i < data.length; i++) {
                // debugger
                if (data[i].isAuth == '2') {
                    //管理员
                    if (this.isAdmin()) {
                        role[data[i].code] = data[i];
                    }
                }
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].isAuth == '3') {
                    //其他人员
                    if (!this.isAdmin() && !this.isAuthor) {
                        role[data[i].code] = data[i];
                    }
                }
            }
        },
        $$loadData: function () {
            //初始化
            let actInstId, dataId, taskUserId, sign, routeUrl;
            // console.log(this.urlRender);
            if (this.urlRender) {
                let queryObj = {...this.$route.query}
                actInstId = this.$route.query['actInstId'];
                delete queryObj.actInstId;
                dataId = this.$route.query['dataId'];
                delete queryObj.dataId;
                taskUserId = this.$route.query['taskUserId'];
                delete queryObj.taskUserId;
                sign = this.$route.query['sign'];
                delete queryObj.sign;
                routeUrl = this.$route.fullPath;
                delete queryObj[""];
                this.callActTransmitVarComm = {...queryObj, ...this.callActTransmitVar}
            } else {
                let url = this.renderComponentString
                let urlPar = url.split("?");
                const query = qs.parse(urlPar[1]);
                if (url.includes("&sign=")) {
                    let index = url.indexOf('&sign=');
                    let frontStr = url.substr(index);
                    url = url.split('&sign=')[0];
                    if (frontStr) {
                        let includeSignStr = frontStr.split('&');
                        if(includeSignStr && includeSignStr.length > 1){
                            for (let signStr of includeSignStr) {
                               if(signStr && !signStr.includes('sign=')){
                                   url+=('&'+signStr);
                               }
                            }
                        }
                    }
                }
                let md5String = `(${url})[${this.$userInfo.userCode}]<${query.dataId}>`;
                sign = new MD5().update(md5String).digest('HEX').toUpperCase()
                url += `&sign=${sign}`;
                let index = url.indexOf('?');
                let str = url.substr(index);
                var obj = qs.parse(str, {ignoreQueryPrefix: true});
                actInstId = obj['actInstId'];
                delete obj.actInstId;
                dataId = obj['dataId'];
                delete obj.dataId;
                taskUserId = obj['taskUserId'];
                delete obj.taskUserId;
                sign = obj['sign'];
                delete obj.sign;
                routeUrl = url;
                this.callActTransmitVarComm = {...obj, ...this.callActTransmitVar}

            }
            //console.log('====> this.callActTransmitVar = %o', this.callActTransmitVar)
            let loadingInstance = this.showLoading();
            this.$axios
                .get('/bpm/pro/init', {
                    params: {
                        sign: sign,
                        dataId: dataId,
                        actInstId: actInstId,
                        routeUrl: routeUrl,
                        callActTransmitVar: this.callActTransmitVarComm
                            ? JSON.stringify(this.callActTransmitVarComm)
                            : '',
                        taskUserId: taskUserId
                    }
                })
                .then(result => {
                    if (result.data.nodeUserSetList) {
                        result.data.nodeUserSetList.forEach(item => {
                            let roleFormula = JSON.parse(item.roleFormula);
                            if (result.data.proOperates) {
                                result.data.proOperates.forEach(is2 => {
                                    if (is2.operateKey == 'submit' && item.nodeId == is2.nodeId) {
                                        roleFormula.modifiable = false;
                                    }
                                });
                                if (
                                    result.data.currentNode &&
                                    item.nodeId == result.data.currentNode.nodeId
                                ) {
                                    roleFormula.modifiable = false;
                                }
                            }
                            item.roleFormula = roleFormula;
                        });
                    }
                    this.flowInstData = result.data;
                    this.flowContext.actDefName = this.flowInstData.definition.name;
                    this.flowContext.bizCallClass = this.flowInstData.definition.bizCallClass;
                    this.flowContext.actInstId = result.data.actInstId
                        ? result.data.actInstId
                        : '';
                    if (this.isFirstInit) {
                        this.getCurrentAssigners();
                    }
                    this.flowContext.actDefId = result.data.actDefId;
                    this.flowContext.isNewFlow = result.data.isNewFlow;
                    this.flowContext.isAuthor = result.data.isAuthor;
                    this.flowContext.isAdmin = result.data.isAdmin;
                    this.flowContext.isManageFlow = result.data.isManageFlow;
                    //TODO add by Rocky.R 为获取当前任务是否是加签
                    this.flowContext.inOperateType =
                        result.data.currentTask && result.data.currentTask.inOperateType
                            ? result.data.currentTask.inOperateType
                            : '';
                    this.flowContext.isFlowParticipant = result.data.isFlowParticipant;
                    this.flowContext.taskUserId = result.data.currentTask
                        ? result.data.currentTask.oid
                        : '';
                    if (result.data.currentNode) {
                        this.flowContext.nodeId = result.data.currentNode.nodeId;
                        this.flowContext.dataSecretLevcode = result.data.proRun
                            .dataSecretLevcode
                            ? result.data.proRun.dataSecretLevcode
                            : '1';
                    }
                    if (!result.data.currentNode && result.data.currentNodeSet) {
                        this.flowContext.nodeId = result.data.currentNodeSet.nodeId;
                    }
                    this.operateDataList = result.data.proOperates
                        ? result.data.proOperates.filter(
                            item => item.nodeId != 'StartEvent'
                        )
                        : [];
                    this.operateDataMsgList = result.data.proOperates
                        ? result.data.proOperates.filter(
                            item =>
                                item.nodeId != 'StartEvent' &&
                                item.operateKey != 'save' &&
                                item.opinion != null &&
                                item.opinion != ''
                        )
                        : [];
                    if (result.data.currentBizData) {
                        this.bizdata = JSON.parse(result.data.currentBizData.bizData);
                    }
                    this.showButton();
                    if (this.isFirstNode) {
                        this.collectorAssigners = true;
                    }
                    if (result.data.proRun) {
                        this.flowContext.actDefName = result.data.proRun.bpmDefName;
                        if (result.data.proRun.value2) {
                            this.callActTransmitVarComm = JSON.parse(result.data.proRun.value2);
                        }
                    }
                    this.movingGridDataUrl =
                        '/bpm/proNode/list?actInstId=' + this.flowContext.actInstId;
                    this.taskGridDataUrl =
                        '/bpm/proTaskUser/searchTasks?actInstId=' +
                        this.flowContext.actInstId;


                    this.loadButtonExt();
                    this.loadAssigners();

                    //广播流程上下文信息，向父组件发送信息
                    this.$parent.$emit('FlowContextBroadcastEvent', this);

                    if (this.flowReady) {
                        this.$nextTick(_ => {
                            let formRole = this.getFormRole();
                            let formProperty = this.getFormProperty();

                            this.flowReady(
                                this.flowContext,
                                this.bizdata,
                                {
                                    formRole: formRole,
                                    formProperty: formProperty
                                },
                                this.flowInstData.definition.bizDataRule
                            ); //业务事件

                            //TODO向下广播权限数据，支持isHidden、isDisabled
                            this.broadcast('ElFormItem', 'ice-flow-form-ready', formRole);
                            this.broadcast('IceFormGroup', 'ice-flow-form-ready', formRole);
                            this.flowReadyIsLoadOk = true;
                            this.$nextTick(_ => {
                                this.pageModified = false
                            })
                        });
                    }
                    this.showUserOptions();
                    // this.flowNodesStatusInit();
                    //debugger
                    this.broadcast(
                        'IceMultipleUpload',
                        'ice-flow-secret-ready',
                        this.isSecret
                    ); //广播表单密级
                    this.broadcast(
                        'IceSingleUpload',
                        'ice-flow-secret-ready',
                        this.isSecret
                    ); //广播表单密级
                    loadingInstance.close();

                    this.$nextTick(_ => {
                        this.formGroupRepostoryList = [...this.formGroupRepostoryList];
                    });
                })
                .catch(data => {
                    console.error(data);
                    // debugger
                    this.$alert(
                        data.msg ? data.msg : data.data ? data.data.msg : '流程加载失败',
                        '警告',
                        {
                            confirmButtonText: '确定',
                            type: 'error',
                            callback: action => {
                                loadingInstance.close();
                                this.$router.back();
                            }
                        }
                    );

                    // this.$message.error(data.data.msg);
                });

        },
        showLoading() {
            //显示遮罩
            const contentDiv = document.getElementById('$base-content');
            let $el = null;
            if (contentDiv) {
                $el = contentDiv.parentElement;
            } else {
                $el = this.$el.parentElement;
            }
            return Loading.service({target: $el});
        },
        showUserOptions(callback) {
            //显示标记
            //let loadingInstance = this.showLoading();
            this.$axios
                .get('/bpm/UserOpinion/getByUser', {params: {operateType: ''}})
                .then(result => {
                    let data = result.data;
                    if (data && data.length > 0) {
                        this.showTag = data;
                    }
                    this.userOptions = data;
                    if (callback) callback(data);
                    //loadingInstance.close();
                });
        },
        saveUserOptions(obj, griddata) {
            //保存标记
            this.showTag = griddata;
            this.$axios
                .post('/bpm/UserOpinion/saveList', {userOpinions: griddata})
                .then(result => {
                });
        },
        showUserOptionsDialog() {
            //显示用户意见标记框
            this.showUserOptions(() => {
                this.$refs.flowOpinion.showDialog();
                this.$nextTick(() => {
                    this.$refs.flowOpinion.setGridData(this.userOptions);
                });
            });
        },
        //分组快捷跳转
        goGroup(panel) {
            let name = panel.label;
            const el = this.formGroupRepostory[name];
            const y =
                Number(el.offsetTop) -
                Number(this.$refs.fixed ? this.$refs.fixed.offsetHeight : 0) -
                100;
            this.userActived = true;

            const group = this.formGroupRepostoryList.find(
                item => item.name == panel.name
            );
            if (group && group.$vue) {
                group.$vue.setExpanded(true);
            }
            this.$nextTick(_ => {
                this.$refs.scroll.scrollTo({x: 0, y}, true);
                this.activedForm = this.formGroupList.indexOf(name);
            });
        },
        goItemEl(el) {
            this.$nextTick(_ => {
                this.$refs.scroll.scrollIntoView(el, true);
            });
        },
        //滚动条滚动监听
        handleScroll(v) {
            // console.log(v)
            for (let i = this.formGroupList.length - 1; i >= 0; i--) {
                const groupName = this.formGroupList[i];
                const el = this.formGroupRepostory[groupName];
                const y =
                    Number(el.offsetTop) -
                    Number(this.$refs.fixed ? this.$refs.fixed.offsetHeight : 0) -
                    100;
                if (y - 120 <= v.scrollTop) {
                    if (!this.userActived && this.activedForm != i) {
                        this.activedForm = i;
                    }
                    if (this.activeTimeOut) {
                        clearTimeout(this.activeTimeOut);
                    }
                    this.activeTimeOut = setTimeout(_ => {
                        this.userActived = false;
                    }, 500);
                    return;
                }
            }
        },

        setReplacePersonUser(nodeAssignerPersons) {
            //设置可替换人员
            //debugger
            if (nodeAssignerPersons && nodeAssignerPersons.length > 0) {
                let user = [];
                nodeAssignerPersons.forEach(item => {
                    let u = {
                        oid: item.oid,
                        name: item.name,
                        code: item.code,
                        phone: item.landlineTel ? item.landlineTel : item.handphoneTel,
                        deptShortName: item.department ? item.department.deptShortName : '',
                        orgShortName: item.department ? item.department.orgShortName : ''
                    };
                    user.push(u);
                });
                this.replacePersonUser = user;
            }
        },
        historyOperate(historyTicket){
            this.$axios.get('/biz/bizHistory/getHistoryOperateRecord', {
                "params": {
                    "historyTicket": historyTicket
                }
            }).then(result => {
                if(result.data && result.data.length >0){
                    this.operateDataList = result.data;
                }
            }).catch(error => {
                // this.$message.error(error.msg);
            });
        }
    },
    computed: {
        formReadonly() {
            //柯确认 只在当前作者并且为第一环节时可编辑
            if (
                this.flowInstData.isAuthor &&
                this.flowContext.nodeId == 'FirstNode'
            ) {
                return false;
            }
            return true;
        },
        isAuthor() {
            if (this.flowInstData.isAuthor) {
                return true;
            }
            return false;
        },
        isFirstNode() {
            if (
                this.flowContext.nodeId == 'FirstNode' &&
                this.flowInstData.isNewFlow
            ) {
                return true;
            }
            return false;
        },
        isEndNode() {
            if (this.flowContext.nodeId == 'EndEvent') {
                return true;
            }
            if (
                this.flowInstData.proRun &&
                this.flowInstData.proRun.currentNodeId == 'EndEvent'
            ) {
                return true;
            }
            return false;
        },
        nextIsEndNode() {
            if (this.flowContext.nextNodeId == 'EndEvent') {
                return true;
            }
            return false;
        },
        showNextUser() {
            if (!this.nextUserShow) {
                return false;
            }
            if (this.nextIsEndNode) {
                return false;
            }
            if (this.flowContext.operateType == 'backpool') {
                return false;
            }
            return true;
        },
        nextUserMode() {
            if (this.nextUserRead) {
                return 'readonly';
            }
            if (this.flowInstData && this.flowInstData.flowNodes) {
                let obj = this.flowInstData.flowNodes[this.flowContext.nextNodeId];
                if (obj && obj.replacePerson) {
                    let nodeSet = this.flowAssignerMap[this.flowContext.nextNodeId];
                    let btn = this.flowButtons.find(item => item.isShow && item.text === '提交');
                    //如果提交为下拉选，则每次打开选人时重新根据节点赋值，目前只加了提交
                    if ((this.replacePersonUser && this.replacePersonUser.length <= 0) || (btn && btn.list && btn.list.length > 0)) {
                        this.setReplacePersonUser(nodeSet.nodeAssignerPersons);
                    }
                    return 'onlySelect';
                }
            }
            return 'readonly';
        },
        showSecret() {
            if (this.isSecret) {
                if (
                    this.flowInstData.isNewFlow ||
                    this.flowContext.nodeId == 'FirstNode'
                ) {
                    return true;
                }
            }
            return false;
        },
        //分组列表
        formGroupList() {
            return this.formGroupRepostoryList
                .filter(item => item.el.style.display != 'none')
                .map(item => item.name);
        },
        //附加密级列表
        secrets() {
            const userDataSecrets = this.getReversedDataMap()('USER_DATA_SECRET');
            if (!userDataSecrets) {
                return [];
            }
            const userEnabledSecret = userDataSecrets[this.$userInfo.securityLevel];
            if (!userEnabledSecret) {
                return [];
            }
            let userSecret = userEnabledSecret.split(',');

            const fileSecrets = this.getDataMap()('DATA_SECRET_LEVEL');
            if (!fileSecrets) {
                return [];
            }
            const list = [];
            for (let key in fileSecrets) {
                if (key >= this.minSecret) {
                    list.push({
                        name: fileSecrets[key],
                        value: key,
                        sequence: Number(key),
                        disable: userSecret.indexOf(key) == -1
                    });
                }
            }
            return list;
        },
        //最小密级
        minSecret() {
            let max = 1;
            for (let key in this.fileSecretInfo) {
                if (this.fileSecretInfo[key] > max) {
                    max = this.fileSecretInfo[key];
                }
            }
            return max;
        },
        applyShowRule() {
            if (this.applyType === 'true' || this.applyType === true) {
                return 'elRow';
            }

            if (typeof this.applyType === 'string') {
                return this.applyType;
            }
        }
    },
    watch: {
        $route(newVlaue, old) {
            if (newVlaue.path == old.path) {
                this.$$loadData();
            }
        }
    },
    mounted() {
        this.$$loadData();
        this.$nextTick(_ => {
            addResizeListener(this.$refs['window'], this.resizeEventListener);
        });
    },
    beforeDestroy() {
        removeResizeListener(this.$refs['window'], this.resizeEventListener);
    },
    created() {
        //分组信息注册
        this.$on('ice-flow-group-regist', data => {
            const {name, el} = data;
            this.formGroupRepostory[name] = el;
            this.formGroupRepostoryList.push(data);
            this.$nextTick(_ => {
                this.formGroupRepostoryList.sort(
                    (t1, t2) => t1.el.offsetTop - t2.el.offsetTop
                );
            });
        });
        this.$on('ice-flow-group-destory', data => {
            // debugger
            const {name, el} = data;
            delete this.formGroupRepostory[name];
            const deleteIndex = this.formGroupRepostoryList.findIndex(
                item => item.name == name
            );
            this.formGroupRepostoryList.splice(deleteIndex, 1);
            // console.log( this.formGroupRepostoryList)
            this.$nextTick(_ => {
                this.formGroupRepostoryList.sort(
                    (t1, t2) => t1.el.offsetTop - t2.el.offsetTop
                );
            });
        });
        //通过导航条定位
        this.$on('validateGO', data => {
            this.goGroup({label: data});
        });

        //通过表单元素定位
        this.$on('validateGOItemEl', el => {
            this.goItemEl(el);
        });

        this.addUndoTypeCodes(['DATA_SECRET_LEVEL', 'USER_DATA_SECRET']);
        //接收单文件附件密级
        this.$on('ice-upload-secret', data => {
            //console.log(data)
            const fileSecretInfo = {...this.fileSecretInfo};

            if (data['delFiles']) {
                const files = data['delFiles'];
                files.forEach(file => {
                    delete fileSecretInfo[file.fileid];
                });
            }
            if (data['addFiles']) {
                const files = data['addFiles'];
                files.forEach(file => {
                    fileSecretInfo[file.fileid] = file.secret;
                });
            }
            if (data['modifyFiles']) {
                const files = data['modifyFiles'];
                files.forEach(file => {
                    fileSecretInfo[file.fileid] = file.secret;
                });
            }

            this.fileSecretInfo = fileSecretInfo;
        });

        this.$on('printFormItemRegist', ({key, ref}) => {
            try {
                this.printItems[key] = ref;
            } catch (e) {
                // debugger;
            }
        });

        this.$on('page-item-modified', _ => {
            this.pageModified = true
        });

    }
};
