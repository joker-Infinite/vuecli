<template>
    <div>
        <!--<el-dialog v-dialogDrag title="操作系统安装" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="1000px" append-to-body :close-on-click-modal="false" :show-close="true" v-if="dialogVisible">-->
            <div style="width: 100%">
                <div style="width: 100%;margin-bottom: 2px">
                    <!--<el-button type="primary" @click="addItem">新增</el-button>-->
                    <!--<el-button type="primary" @click="del" :disabled="isDel || delList.length===0" title="从申请列表带来的数据不能删除">删除</el-button>-->
                    <el-button type="primary" @click="save" :disabled="delList.length===0">保存</el-button>
                    <div style="float: right">
                        <el-button type="primary" @click="moreItem">批量操作</el-button>
                    </div>
                </div>
                <div style="width: 100%;">
                    <ice-editable-table :data="tableData"
                                        :rules="tableRules"
                                        :height="250"
                                        ref="tbl"
                                        highlight-current-row
                                        @selection-change="selectionChange"
                                        @row-click="rowClick">
                        <el-table-column type="selection" width="40px"></el-table-column>
                        <el-table-column type="index" label="序号" width="50px"></el-table-column>
                        <el-table-column label="设备子类" prop="childType" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{onChildTypeRenderer(scope.row.childType)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="设备编号" prop="devSn" show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column label="责任人" prop="dutyName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="保密编号" prop="secretSn" show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column label="放置地点" prop="currentPlace" show-overflow-tooltip
                        ></el-table-column>
                        <ice-editable-table-column label="安装类型"
                                                   input-type="input"
                                                   :width="null"
                                                   prop="installType">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.installType"
                                          :disabled="scope.row.engineer != userName && !!scope.row.engineer"></el-input>
                            </template>
                        </ice-editable-table-column>
                        <ice-editable-table-column label="新操作系统/版本"
                                                   input-type="select"
                                                   map-type-code="operatingSystem"
                                                   :width="120"
                                                   prop="osVersion">
                            <template slot-scope="scope">
                                <el-tooltip placement="top">
                                    <div slot="content">{{scope.row.osName}}</div>
                                    <ice-select v-model="scope.row.osVersion"
                                                map-type-code="operatingSystem"
                                                @change="$nextTick(()=>{$refs.tbl.validateField(scope.$index,'osVersion')})"
                                                :text.sync="scope.row.osName"
                                                :disabled="scope.row.engineer != userName && !!scope.row.engineer"></ice-select>
                                </el-tooltip>
                            </template>
                        </ice-editable-table-column>
                        <ice-editable-table-column label="安装时间"
                                                   input-type="date"
                                                   :width="140"
                                                   prop="installDate">
                            <template slot-scope="scope">
                                <el-date-picker v-model="scope.row.installDate"
                                                type="datetime"
                                                :disabled="scope.row.engineer != userName && !!scope.row.engineer"></el-date-picker>
                            </template>
                        </ice-editable-table-column>
                        <el-table-column label="实施工程师" prop="engineer"></el-table-column>
                    </ice-editable-table>
                </div>
            </div>
            <div style="width: 100%;">
                <el-table :data="tableDetails"
                          :span-method="spanMethod"
                          border
                          v-if="isTerminal"
                          ref="tblDetails"
                          :show-header="false">
                    <el-table-column label="对应列表名称" prop="categoryName" width="150" align="left">
                    </el-table-column>
                    <el-table-column label="指令名称" prop="opName" width="200" align="left">
                        <template slot-scope="scope">
                            <div v-if="scope.$index==0">
                                {{scope.row.opName}}
                            </div>
                            <div v-if="scope.$index==1">
                                {{scope.row.opName}}
                            </div>
                            <div v-if="scope.$index==2">
                                {{scope.row.opName}}
                            </div>
                            <div v-if="scope.$index==3" style="width: 100%">
                                <ice-datamap-check-group map-type-code="SAFE_UNINSTALL"
                                                         @checkedChange="checkedChange"
                                                         :disabled="!isEdit"
                                                         v-model="scope.row.values"></ice-datamap-check-group>
                                <div style="width: 100%" v-if="scope.row.values.indexOf('OTHER')>-1">
                                    <div style="display:inline-block;width: 10%">
                                        <label>其他产品</label>
                                    </div>
                                    <div style="display:inline-block;width: 90%">
                                        <el-input v-model="scope.row.reason" style="width: 100%"
                                                  :disabled="!isEdit"></el-input>
                                    </div>
                                </div>
                            </div>
                            <div v-if="scope.$index==5" style="width: 100%">
                                <ice-datamap-check-group map-type-code="SAFE_UNINSTALL"
                                                         @checkedChange="checkedChange"
                                                         :disabled="!isEdit"
                                                         v-model="scope.row.values"></ice-datamap-check-group>
                                <div style="width: 100%" v-if="scope.row.values.indexOf('OTHER')>-1">
                                    <div style="display:inline-block;width: 10%">
                                        <label>其他产品</label>
                                    </div>
                                    <div style="display:inline-block;width: 90%">
                                        <el-input v-model="scope.row.reason" style="width: 100%"
                                                  :disabled="!isEdit"></el-input>
                                    </div>
                                    notInstallReason
                                </div>
                                <div style="width: 100%" v-if="scope.row.values.length===0">
                                    <div style="display:inline-block;width: 10%">
                                        <label>未装原因</label>
                                    </div>
                                    <div style="display:inline-block;width: 90%">
                                        <el-input v-model="scope.row.notInstallReason" style="width: 100%"
                                                  :disabled="!isEdit"></el-input>
                                    </div>
                                </div>
                            </div>
                            <div v-if="scope.$index==4" style="width: 100%">
                                <ice-datamap-check-group map-type-code="APP_INSTALL"
                                                         @checkedChange="checkedChange"
                                                         :disabled="!isEdit"
                                                         v-model="scope.row.values"></ice-datamap-check-group>
                                <div style="width: 100%" v-if="scope.row.values.indexOf('OTHER_TOOL')>-1">
                                    <div style="display:inline-block;width: 10%">
                                        <label>其他软件</label>
                                    </div>
                                    <div style="display:inline-block;width: 90%">
                                        <el-input v-model="scope.row.reason" style="width: 100%"
                                                  :disabled="!isEdit"></el-input>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="原因名称" prop="reasonName" align="left">
                        <template slot-scope="scope">
                            <div v-if="scope.$index == 0" style="width: 100%;height: 30px">
                                <el-checkbox true-label="1"
                                             false-label="0"
                                             style="padding-top: 4px"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';}"
                                             v-model="scope.row.setFlag">是
                                </el-checkbox>
                                <el-checkbox true-label="0"
                                             false-label="1"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';checkedChange()}"
                                             v-model="scope.row.setFlag">否
                                </el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;

                                <div style="width: 75%;display: inline-block" v-if="scope.row.setFlag=='0'">
                                    原因:
                                    <el-input style="width: 95%" v-model="scope.row.reason"
                                              :disabled="!isEdit"></el-input>
                                </div>

                            </div>
                            <div v-if="scope.$index == 1" style="width: 100%;height: 30px">
                                <el-checkbox true-label="1"
                                             false-label="0"
                                             style="padding-top: 4px"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';}"
                                             v-model="scope.row.setFlag">是
                                </el-checkbox>
                                <el-checkbox true-label="0"
                                             false-label="1"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';checkedChange()}"
                                             v-model="scope.row.setFlag">否
                                </el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                                <div style="width: 75%;display: inline-block" v-if="scope.row.setFlag=='0'">
                                    原因:
                                    <el-input style="width: 95%" v-model="scope.row.reason"
                                              :disabled="!isEdit"></el-input>
                                </div>
                            </div>
                            <div v-if="scope.$index == 2" style="width: 100%;height: 30px">
                                <el-checkbox true-label="1"
                                             false-label="0"
                                             style="padding-top: 4px"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';}"
                                             v-model="scope.row.setFlag">是
                                </el-checkbox>
                                <el-checkbox true-label="0"
                                             false-label="1"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';checkedChange()}"
                                             v-model="scope.row.setFlag">否
                                </el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                                <div style="width: 75%;display: inline-block" v-if="scope.row.setFlag=='0'">
                                    原因:
                                    <el-input style="width: 95%" v-model="scope.row.reason"
                                              :disabled="!isEdit"></el-input>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :data="serverTableData"
                          :span-method="spanMethodServer"
                          border
                          v-if="!isTerminal"
                          ref="tblDetails"
                          :show-header="false">
                    <el-table-column label="对应列表名称" prop="categoryName" width="150" align="left">
                    </el-table-column>
                    <el-table-column label="指令名称" prop="opName" width="200" align="left">
                        <template slot-scope="scope">
                            <div v-if="scope.$index==0">
                                {{scope.row.opName}}
                            </div>
                            <div v-if="scope.$index==1">
                                {{scope.row.opName}}
                            </div>
                            <div v-if="scope.$index==2" style="width: 100%">
                                <ice-datamap-check-group map-type-code="SAFE_UNINSTALL"
                                                         @checkedChange="checkedChange"
                                                         :disabled="!isEdit"
                                                         v-model="scope.row.values"></ice-datamap-check-group>
                                <div style="width: 100%" v-if="scope.row.values.indexOf('OTHER')>-1">
                                    <div style="display:inline-block;width: 10%">
                                        <label>其他产品</label>
                                    </div>
                                    <div style="display:inline-block;width: 90%">
                                        <el-input v-model="scope.row.reason" style="width: 100%"
                                                  :disabled="!isEdit"></el-input>
                                    </div>
                                </div>
                                <div style="width: 100%" v-if="scope.row.values.length===0">
                                    <div style="display:inline-block;width: 10%">
                                        <label>未装原因</label>
                                    </div>
                                    <div style="display:inline-block;width: 90%">
                                        <el-input v-model="scope.row.notInstallReason" style="width: 100%"
                                                  :disabled="!isEdit"></el-input>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="原因名称" prop="reasonName" align="left">
                        <template slot-scope="scope">
                            <div v-if="scope.$index == 0" style="width: 100%">
                                <el-checkbox true-label="1"
                                             false-label="0"
                                             style="padding-top: 4px"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';}"
                                             v-model="scope.row.setFlag">是
                                </el-checkbox>
                                <el-checkbox true-label="0"
                                             false-label="1"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';checkedChange()}"
                                             v-model="scope.row.setFlag">否
                                </el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                                <div style="width: 75%;display: inline-block" v-if="scope.row.setFlag=='0'">
                                    原因:
                                    <el-input style="width: 95%" v-model="scope.row.reason"
                                              :disabled="!isEdit"></el-input>
                                </div>

                            </div>
                            <div v-if="scope.$index == 1" style="width: 100%">
                                <el-checkbox true-label="1"
                                             false-label="0"
                                             style="padding-top: 4px"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';}"
                                             v-model="scope.row.setFlag">是
                                </el-checkbox>
                                <el-checkbox true-label="0"
                                             false-label="1"
                                             :disabled="!isEdit"
                                             @change="()=>{scope.row.reason='';checkedChange()}"
                                             v-model="scope.row.setFlag">否
                                </el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                                <div style="width: 75%;display: inline-block" v-if="scope.row.setFlag=='0'">
                                    原因:
                                    <el-input style="width: 95%" v-model="scope.row.reason"
                                              :disabled="!isEdit"></el-input>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        <!--</el-dialog>-->
        <ice-dialog title="批量操作" :visible.sync="moreDialog" width="700px" remounted :before-close="moreClose">
            <div style="height: 250px;width: 100%">
                <div style="height: 250px;width: 100%;display: flex">
                    <div style="width: 50%;">
                        <div style="background-color: rgba(124,112,128,0.38);text-align: center;margin-right: 2px">
                            复制对象
                        </div>
                        <el-table :data="tableDataSource" highlight-current-row style="width: 100%;padding-right: 2px;"
                                  height="215px" @row-click="rowClickCopy">
                            <el-table-column prop="childType" label="设备类型">
                                <template slot-scope="scope">
                                    {{onChildTypeRenderer(scope.row.childType)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="devSn" label="设备编号"></el-table-column>
                            <el-table-column prop="dutyName" label="责任人"></el-table-column>
                        </el-table>
                    </div>
                    <div style="width: 50%">
                        <div style="background-color: rgba(124,112,128,0.38);text-align: center">粘贴对象</div>
                        <el-table :data="tableDataTarget" height="215px" @selection-change="selectionTarget">
                            <el-table-column type="selection" width="42px"></el-table-column>
                            <el-table-column prop="childType" label="设备子类">
                                <template slot-scope="scope">
                                    {{onChildTypeRenderer(scope.row.childType)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="devSn" label="设备编号"></el-table-column>
                            <el-table-column prop="dutyName" label="责任人"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div>
                <ice-datamap-check-group map-type-code="OS_OP_ATTR"
                                         ref="idc"
                                         v-if="isTerminal"
                                         v-model="listArr"
                                         :checkAllBtn="true"
                                         :min="1"
                                         checkHeight="30px"
                                         checkAllHeight="30px"></ice-datamap-check-group>
                <ice-datamap-check-group map-type-code="OS_OP_SERVER"
                                         ref="idc"
                                         v-if="!isTerminal"
                                         v-model="listArr"
                                         :checkAllBtn="true"
                                         :min="1"
                                         checkHeight="30px"
                                         checkAllHeight="30px"></ice-datamap-check-group>
            </div>

            <div class="ice-button-bar">
                <el-button type="primary" @click="saveItem" :disabled="listArr.length===0">确定</el-button>
            </div>
        </ice-dialog>
        <dev-select ref="devSelect"
                    v-if="devSelectShow"
                    :multiple="true"
                    :columns="columns"
                    :querys="query"
                    :filterTreeData="[11,12,13,14]"
                    width="1150px"
                    :on-close-handler="selectOverHandler"></dev-select>
    </div>

</template>

<script>
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceDatamapCheckGroup from "../../../../components/common/base/IceDatamapCheckGroup";
    import DevSelect from "../../../biz/dev/devSelect";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../../components/common/base/IceSelect";

    export default {
        name: "osRecord",
        components: {IceSelect, IceEditableTableColumn, DevSelect, IceDatamapCheckGroup, IceDialog, IceEditableTable},
        mixins: [bizComm, devComm, renderer],
        props: {
            headFormCode: String,
            installType: String,
            headSource: String
        },
        data() {
            return {
                tableDataSource: [],//复制对象
                tableDataTarget: [],//粘贴对象
                dialogVisible: false,
                moreDialog: false,
                isTerminal: true,//是否为终端数据
                isDel: false,//是否能删除列表数据，勾选的数据中如果有从申请列表带来的数据，则不能删除
                listArr: [],
                tableData: [],
                tableRules: {
                    osVersion: {required: true, message: "请选择系统/版本"},
                },
                tableDetails: [],//终端数据
                serverTableData: [],//服务端数据
                tableDetailsComm: _ => [
                    {
                        categoryName: '操作系统安装与配置',
                        opName: '是否设置BIOS管理员口令',
                        setFlag: '1',//0、未设置 1、已设置
                        reason: '',//BIOS管理员口令未设置原因
                        mark: '1',
                        values: [],
                    },
                    {
                        categoryName: '操作系统安装与配置',
                        opName: '是否设置BIOS口令',
                        reason: '',//BIOS口令未设置原因
                        setFlag: '1',//0、未设置 1、已设置
                        mark: '2',
                        values: [],
                    },
                    {
                        categoryName: '操作系统安装与配置',
                        opName: '是否设置开机口令',
                        reason: '',//开机口令未设置原因
                        setFlag: '1',//0、未设置 1、已设置
                        mark: '3',
                        values: [],
                    },
                    {
                        categoryName: '安全产品卸载情况',
                        opName: '',
                        reason: '',//原因
                        setFlag: '1',//0、未设置 1、已设置
                        mark: '4',
                        values: [],
                    },
                    {
                        categoryName: '应用软件安装情况',
                        opName: '',
                        reason: '',//原因
                        setFlag: '1',//0、未设置 1、已设置
                        mark: '5',
                        values: [],
                    },

                    {
                        categoryName: '安全产品安装情况',
                        opName: '',
                        reason: '',//原因
                        setFlag: '1',//0、未设置 1、已设置
                        mark: '6',
                        values: [],
                        notInstallReason: '',//未装原因
                    },
                ],
                serverTableComm: _ => [
                    {
                        categoryName: '安全策略配置',
                        opName: '是否按照安全策略基线进行配置',
                        setFlag: '1',//0、未设置 1、已设置
                        reason: '',//未设置原因
                        mark: '7',
                        values: [],
                    },
                    {
                        categoryName: '安全策略配置',
                        opName: '是否新增其他安全策略',
                        reason: '',//未设置原因
                        setFlag: '1',//0、未设置 1、已设置
                        mark: '8',
                        values: [],
                    },
                    {
                        categoryName: '安全产品安装情况',
                        opName: '',
                        reason: '',//原因
                        setFlag: '1',//0、未设置 1、已设置
                        mark: '6',
                        values: [],
                        notInstallReason: '',//未装原因
                    },
                ],
                devSelectShow: false,
                columns: [],
                query: [
                    {
                        type: 'static', code: 'devUseType', value: () => {
                            return this.devUseType
                        }
                    }
                ],
                delList: [],
                selectionTargetArr: [],
                index: 0,
                userName: '',//当前登录人
                isEdit: true,
                devUseType: 1,//1为终端设备，2为服务端设备
            }
        },
        methods: {
            checkedChange() {
                this.$nextTick(() => {
                    this.$refs.tblDetails.doLayout();
                });
            },
            /**打开弹窗*/
            openDialog() {
                this.dialogVisible = true;
                //重新刷新数据
                this.initData();
            },
            /**
             * 初始化列表数据
             * @returns {*}
             */
            initData() {
                this.$axios.get("/biz/BizDevOsReinstallRecord/getRecord", {
                    params: {
                        afNo: this.headFormCode,
                        installType: this.installType,
                        headSource: this.headSource
                    }
                })
                    .then((res) => {
                        //this.tableData = res.data;
                        //等待弹窗加载完成，判断列表是否有数据
                        if (res.data.length > 0) {
                            this.tableData = [];
                            res.data.forEach(item => {
                                let obj = {};
                                Object.assign(obj, item.devFlowCommon, item);
                                this.tableData.push(obj)
                            });

                            //是否为终端数据，1为终端，2为服务端
                            this.isTerminal = this.tableData[0].devUseType == '2' ? false : true;
                            //如果当条数据的实施工程师和当前登录人不一致，则展示列表为不可编辑
                            //this.isEdit = this.tableData[0].engineer == this.userName || !this.tableData[0].engineer;
                            //如果有数据将第一条数据设置为选中的一条
                            this.$refs.tbl.setCurrentRow(this.tableData[0]);
                            //展示第一条的数据
                            if (this.isTerminal) {
                                this.devUseType = 1;
                                this.tableDetails = this.tableData[0].resetPartVoList;
                            } else {
                                this.devUseType = 2;
                                this.serverTableData = this.tableData[0].resetPartVoList;
                            }
                        }
                        this.checkedChange();
                    }).catch(e => {
                    if (e.msg) {
                        this.$message.error(e.msg);
                    } else {
                        this.$message.error(e);
                    }
                });
            },
            isSelectable(row) {
                //如果当条数据的实施工程师和当前登录人不一致或者实施工程师不为空，则展示列表的该项不可勾选
                return row.engineer == this.userName || !row.engineer;
            },
            /**
             * 初始化列表
             * @returns {*}
             */
            initTemplate() {
                let _this = this;
                this.columns = [
                    {code: 'devId', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'dependType', hidden: true},
                    {code: 'devUseType', hidden: true},
                    {
                        label: '设备子类', code: 'childType', width: 90, renderCell(h, data) {
                            return _this.onChildTypeRenderer(data.row.childType);
                        }
                    },
                    {label: '责任人', code: 'dutyName', width: 90},
                    {label: '责任部门', code: 'deptName', width: 80},
                    {label: '资产编号', code: 'sn', width: 100},
                    {label: '保密编号', code: 'secretSn', width: 100},
                    {label: '设备名称', code: 'name', width: 90},
                    {
                        label: '联网类型/用途', code: 'netAreaAndType', width: 120, ignore: true, formatter: row => {
                            return _this.onNetAndTypeRenderer(row.netArea, row.netType, row.useFor);
                        }
                    },
                    {label: '放置地点', code: 'currentPlace', width: 90},
                    {
                        label: '密级',
                        code: 'secretLevel',
                        width: 50,
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE
                    },
                ];
            },
            /**
             * 选择设备--确定后的相关数据处理
             * @param data
             */
            selectOverHandler(data) {
                return new Promise((resolve, reject) => {
                    if (data.length > 0) {
                        data.forEach(item => {
                            //检查添加的设备是否与列表里面的数据重复
                            if (this.delRepeat(this.tableData, item.oid)) {
                                item.devId = item.oid;
                                item.oid = '';
                                item.osVersion = '';
                                item.devUseType = item.devUseType ? item.devUseType : 1;
                                //添加resetPartVoList数组
                                let arr = [];
                                if (this.isTerminal) {
                                    arr.push(...this.tableDetailsComm());
                                } else {
                                    arr.push(...this.serverTableComm());
                                }
                                item.resetPartVoList = arr;
                                item.afNo = this.recordObj.afNo;
                                this.tableData.push(item);
                            }
                        })
                    }
                    resolve();
                    this.devSelectShow = false;
                })
            },
            /**
             * 选择设备--去除相同的数据
             * @param arr
             * @param oid
             */
            delRepeat(arr, oid) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].devId === oid) {
                        return false
                    }
                }
                return true;
            },
            /**
             * 新增
             */
            addItem() {
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            /**
             * 删除
             */
            del() {
                this.deletes(this.tableData, this.delList);
            },
            /**
             * 选择设备--删除
             * @param rows
             */
            selectionChange(rows) {
                this.isDel = this.isDelItem(rows)
                this.delList = rows;
            },
            validate(index,code){
                let isTrue = false;
                this.$refs.tbl.validateField(index,code,validateResult=>{
                    isTrue = validateResult;
                });
                return isTrue;
            },
            /**
             * 保存
             */
            save() {
                for(let i=0;i<this.delList.length;i++){
                    let index = this.tableData.indexOf(this.delList[i]);
                    let isTrue = this.validate(index,'osVersion');
                    if(!isTrue){
                        return;
                    }
                }
                let arr = [];
                this.delList.forEach(item => {
                    let obj = {};
                    Object.assign(obj, item);
                    obj.devFlowCommon = {};
                    Object.assign(obj.devFlowCommon, item);
                    arr.push(obj);
                });
                this.$axios.post("/biz/BizDevOsReinstallRecord/saveRecord", {list: JSON.stringify(arr)}).then(res => {
                    this.$message.success("保存成功");
                    this.$emit('closeDialog');
                }).catch(e => {
                    if (e.msg) {
                        this.$message.error(e.msg);
                    } else {
                        this.$message.error(e);
                    }
                })
            },
            /**
             * 批量操作
             */
            moreItem() {
                this.tableDataSource = [];
                this.tableDataTarget = [];
                Object.assign(this.tableDataSource, this.tableData);
                Object.assign(this.tableDataTarget, this.tableData.filter(item => item.engineer == this.userName || !item.engineer));
                this.moreDialog = true;
            },
            /**
             * table的行列自定义
             * @param row
             * @param column
             * @param rowIndex
             * @param columnIndex
             */
            spanMethod({row, column, rowIndex, columnIndex}) {//参数分别是当前行，当前列，当前行号，当前列号
                if (columnIndex === 0) {
                    if (rowIndex === 0) {
                        return [3, 1]//合并3行为一列
                    } else if (rowIndex === 1) {
                        return [0, 0]//为第二行时，将里面的数据至空
                    } else if (rowIndex === 2) {
                        return [0, 0]
                    } else {
                        return [1, 1]//保留当行数据
                    }
                } else if (columnIndex === 1) {
                    if (rowIndex === 3) {
                        return [1, 2]
                    } else if (rowIndex === 4) {
                        return [1, 2]
                    } else if (rowIndex === 5) {
                        return [1, 2]
                    } else {
                        return [1, 1]
                    }
                } else if (columnIndex === 2) {
                    if (rowIndex === 3) {
                        return [0, 0]
                    } else if (rowIndex === 4) {
                        return [0, 0]
                    } else if (rowIndex === 5) {
                        return [0, 0]
                    } else {
                        return [1, 1]
                    }
                }
            },
            /**
             * 批量操作的确定按钮
             */
            saveItem() {
                let arr = [];
                let arrNum = [];
                for (let i = 0; i < this.listArr.length; i++) {
                    if (this.listArr[i] > 6) {
                        //大于6的数据代表复制的是列表里的字段
                        arrNum.push(this.listArr[i]);
                    } else {
                        //不大于6的数据表示复制的是展示列表的数据
                        arr.push(this.listArr[i]);
                    }
                }
                //循环复制目标数组
                this.selectionTargetArr.forEach(item => {
                    //在列表中找到该对象的下标
                    let index = this.tableData.indexOf(item);
                    if (index || index == '0') {
                        //调用复制标记小于7的数据的方法
                        this.copyItem(arr, index);
                        //调用复制标记不小于7的数据的方法
                        this.copyItemBig(arrNum, index);
                    }
                });
                this.$message.success("操作成功");
                this.moreClose();
            },
            moreClose() {
                this.moreDialog = false;
                this.listArr = [];
            },
            /**
             * 复制标记小于7的数据
             * @param arr
             * @param index
             */
            copyItem(arr, index) {
                for (let i = 0; i < arr.length; i++) {
                    Object.assign(this.tableData[index].resetPartVoList[Number(arr[i]) - 1], this.tableData[this.index].resetPartVoList[Number(arr[i]) - 1]);
                }
            },
            /**
             * 复制标记不小于7的数据
             * @param list
             * @param arr
             * @param targetList
             */
            copyItemBig(arr, index) {
                for (let i = 0; i < arr.length; i++) {
                    let obj = {};
                    Object.assign(obj, this.tableData[this.index]);
                    if (arr[i] == '7') {
                        this.tableData[index].osVersion = obj.osVersion;
                    } else if (arr[i] == '8') {
                        this.tableData[index].installDate = obj.installDate;
                    }
                }
            },
            /**
             * 点击列表的行事件
             * @param row
             * @param event
             * @param column
             */
            rowClick(row, event, column) {
                if (this.isTerminal) {
                    this.tableDetails = row.resetPartVoList;
                } else {
                    this.serverTableData = row.resetPartVoList;
                }
                //this.isEdit = row.engineer == this.userName || !row.engineer;

            },
            /**
             * 点击列表的行事件--复制列表
             * @param row
             * @param event
             * @param column
             */
            rowClickCopy(row, event, column) {
                //获取行下标
                this.index = this.tableData.indexOf(row);
            },
            /**
             *复制对象的勾选事件
             * @param rows
             */
            selectionTarget(rows) {
                this.selectionTargetArr = rows;
            },
            spanMethodServer({row, column, rowIndex, columnIndex}) {//参数分别是当前行，当前列，当前行号，当前列号
                if (columnIndex === 0) {
                    if (rowIndex === 0) {
                        return [2, 1]//合并3行为一列
                    } else if (rowIndex === 1) {
                        return [0, 0]//为第二行时，将里面的数据至空
                    } else {
                        return [1, 1]//保留当行数据
                    }
                } else if (columnIndex === 1) {
                    if (rowIndex === 2) {
                        return [1, 2]
                    } else {
                        return [1, 1]
                    }
                } else if (columnIndex === 2) {
                    if (rowIndex === 2) {
                        return [0, 0]
                    } else {
                        return [1, 1]
                    }
                }
            },
            /**
             * 列表数据是否可删除
             * @param arr
             */
            isDelItem(arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (!!arr[i].oid) {
                        //如果有oid，则表明该数据是从申请列表带来的数据，则不允许删除
                        return false
                    }
                }
                return true
            }
        },
        mounted() {
            this.initData();
            this.userName = this.$userInfo.userName;
            this.tableDetails = Object.assign([], this.tableDetailsComm());
            this.serverTableData = Object.assign([], this.serverTableComm());
            this.requestCategoryData();
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE),
                this.requestCategoryData(),
            ];
            Promise.all(prepareTaskChain).then(this.initTemplate);
        },
        watch: {
            /*afNo(){
                this.initData();
            },
            devIds(){
                this.initData();
            }*/
        }
    }
</script>

<style scoped>

</style>
