<template>
  <div class="content-filled">
    <ice-flow-form
      :showTitle="false"
      name
      valiate
      :flow-ready="flowReady"
      ref="flowForm"
      :flow-operate-btn="flowOperateBtn"
      :flow-biz-data="flowBizData"
      :urlRender="false"
      :renderComponentString="renderComponentString"
    >
      <div slot-scope="flowScope">
        <el-form
          :rules="formRules"
          :model="mainData"
          ref="form"
          label-width="80px"
        >
          <ice-grid-layout name="台账确认" :columns="1" v-if="managerSureFlag">
            <el-form-item
              label="台账属性确认"
              prop="managerSure"
              label-width="110px"
            >
              <el-checkbox
                v-model="mainData.managerSure"
                true-label="1"
                :disabled="operateForbid"
                >确认台账属性修改无误</el-checkbox
              >
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                rows="3"
                v-model="mainData.remark"
                :disabled="operateForbid"
              ></el-input>
            </el-form-item>
            <div style="width: 100%">
              <label>服务单号：</label
              ><span
                style="color: blue;cursor: pointer;"
                @click="jumpToEvent"
                >{{ mainData.serviceTicket }}</span
              >
              <ice-editable-table
                :data="mainData.resetRecordList"
                height="200px"
              >
                <el-table-column
                  label="序号"
                  width="50px"
                  type="index"
                ></el-table-column>
                <el-table-column label="设备子类" prop="childType" width="80px">
                  <template slot-scope="scope">
                    {{ onChildTypeRenderer(scope.row.childType) }}
                  </template>
                </el-table-column>
                <el-table-column label="设备编号" prop="devSn">
                </el-table-column>
                <el-table-column label="安装地点" prop="currentPlace">
                </el-table-column>
                <el-table-column label="IP地址" prop="masterIp" width="90px">
                </el-table-column>
                <el-table-column
                  label="Mac地址"
                  :show-overflow-tooltip="true"
                  width="120px"
                  prop="mac"
                >
                </el-table-column>
                <el-table-column label="责任人" width="80px" prop="dutyName">
                </el-table-column>
                <el-table-column label="安装类型" prop="installType">
                </el-table-column>
                <el-table-column
                  label="拟新操作系统"
                  width="120px"
                  prop="newOsName"
                >
                </el-table-column>
                <el-table-column label="实施工程师" prop="engineer">
                </el-table-column>
                <el-table-column label="台账属性变更" width="100px">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="lookDevPopModifyDetail(scope.$index)"
                      >查看</el-button
                    >
                  </template>
                </el-table-column>
              </ice-editable-table>
            </div>
          </ice-grid-layout>
          <ice-grid-layout
            name="申请人信息"
            :columns="flowScope.formReadonly ? 4 : 3"
          >
            <el-form-item
              label="申请单号"
              prop="afNo"
              label-width="70px"
              v-if="flowScope.formReadonly"
            >
              <el-input v-model="mainData.afNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item
              label="申请人"
              prop="afDepartmentName"
              label-width="70px"
            >
              <el-input
                :value="
                  mainData.afUserName + '(' + mainData.afDepartmentName + ')'
                "
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="afPhone" label-width="70px">
              <el-input v-model="mainData.afPhone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="申请时间" prop="afDate" label-width="70px">
              <el-input v-model="mainData.afDate" :disabled="true"></el-input>
            </el-form-item>
          </ice-grid-layout>

          <ice-form-group name="申请设备信息">
            <div style="margin-bottom: 2px" v-if="!flowScope.formReadonly">
              <el-button icon="el-icon-plus" type="primary" @click="addDev()"
                >选择</el-button
              >
              <el-button
                icon="el-icon-delete"
                type="primary"
                @click="deleteDev()"
                :disabled="devSelected.length === 0"
                >删除</el-button
              >
            </div>
            <div style="width: 100%">
              <ice-editable-table
                :data="detailList"
                ref="tbl"
                :height="200"
                :rules="tableRules"
                @selection-change="devTableChange"
              >
                <el-table-column
                  type="selection"
                  width="40"
                  v-if="!flowScope.formReadonly"
                ></el-table-column>
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                ></el-table-column>
                <el-table-column
                  label="设备子类"
                  prop="childType"
                  width="100px"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{ onChildTypeRenderer(scope.row.childType) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="设备编号"
                  prop="devSn"
                  :how-overflow-tooltip="true"
                >
                </el-table-column>
                <ice-table-column
                  label="密级"
                  prop="secretLevel"
                  map-type-code="devSecretLevel"
                  width="80px"
                >
                </ice-table-column>
                <el-table-column label="责任人" prop="dutyName">
                </el-table-column>
                <el-table-column label="IP地址" prop="masterIp" width="90px">
                </el-table-column>
                <el-table-column
                  label="Mac地址"
                  :show-overflow-tooltip="true"
                  width="120px"
                  prop="mac"
                >
                </el-table-column>
                <el-table-column
                  label="操作系统及版本"
                  :show-overflow-tooltip="true"
                  width="140"
                  prop="osName"
                >
                </el-table-column>
                <ice-editable-table-column
                  label="新操作系统版本"
                  :isTooltip="true"
                  prop="applyOsVersion"
                  :width="160"
                  type="input"
                >
                  <template slot-scope="scope">
                    <el-tooltip
                      placement="top"
                      :disabled="!scope.row.applyOsName"
                    >
                      <div slot="content">{{ scope.row.applyOsName }}</div>
                      <ice-select
                        v-model="scope.row.applyOsVersion"
                        :text.sync="scope.row.applyOsName"
                        :disabled="flowScope.formReadonly"
                        @change="
                          $nextTick(() => {
                            $refs.tbl.validateField(
                              scope.$index,
                              'applyOsVersion'
                            );
                            selectChange(scope.row.applyOsVersion, scope.row);
                          })
                        "
                        mapTypeCode="operatingSystem"
                      ></ice-select>
                    </el-tooltip>
                  </template>
                </ice-editable-table-column>
              </ice-editable-table>
            </div>
          </ice-form-group>
          <ice-grid-layout :columns="1" name="申请原因">
            <el-form-item label="申请原因" prop="afReason">
              <el-input
                v-model="mainData.afReason"
                type="textarea"
                rows="3"
                :show-word-limit="true"
                :disabled="flowScope.formReadonly"
                maxlength="256"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="applyRemark">
              <el-input
                v-model="mainData.applyRemark"
                type="textarea"
                rows="3"
                :show-word-limit="true"
                :disabled="flowScope.formReadonly"
                maxlength="256"
              ></el-input>
            </el-form-item>
          </ice-grid-layout>
        </el-form>
      </div>
    </ice-flow-form>
    <dev-select
      :ref="PAGE_ENUM.REFS.DEV_SELECT.REF"
      v-if="PAGE_ENUM.REFS.DEV_SELECT.SHOW"
      :multiple="true"
      :get-all-dev-info="true"
      :columns="columns"
      :querys="query"
      :filterTreeData="filterTreeData"
      width="1170px"
      :on-close-handler="selectOverHandler"
    ></dev-select>
    <dev-property-change
      ref="devPopChange"
      v-if="visibleDevPopChange"
      :devId="devId"
      :headFormCode="mainData.afNo"
      :headSource="mainData.headSource"
      :isEdit="isEdit"
    ></dev-property-change>
  </div>
</template>

<script>
import IceGridLayout from '@/components/common/base/IceGridLayout.vue';
import IceSelect from '@/components/common/base/IceSelect';
import IceEditableTable from '@/components/common/base/IceEditableTable';
import IceEditableTableColumn from '@/components/common/base/IceEditableTableColumn';
import IceQueryGrid from '@/components/common/base/IceQueryGrid';
import IcePersionSelector from '@/components/common/biz/IcePersionSelector.vue';
import processForm from '@/pages/biz/businessprocess/osReinstall/process';
import IceFlowForm from '@/components/common/base/IceFlowForm';
import IcePersionByDeptSelector from '@/components/common/biz/IcePersionByDeptSelector';
import DevSelect from '@/pages/biz/dev/devSelect';
import bizComm from '@/pages/biz/js/comm';
import renderer from '@/pages/biz/dev/js/comm/renderer';
import devComm from '@/pages/biz/dev/js/comm/devComm';
import editRenderer from '@/pages/biz/businessprocess/osReinstall/js/renderer';
import editComm from '@/pages/biz/businessprocess/osReinstall/js/comm';
import IceFormGroup from '@/components/common/base/IceFormGroup';
import IceTableColumn from '@/components/common/base/IceTableColumn';
import DevPropertyChange from '@/pages/biz/dev/devPropertyChange';
import devFlowFilter from '@/pages/biz/businessprocess/osReinstall/js/devFlowFilter';

export default {
  name: 'edit',
  props: ['renderComponentString'],
  components: {
    DevPropertyChange,
    IceTableColumn,
    IceFormGroup,
    DevSelect,
    IcePersionByDeptSelector,
    IceFlowForm,
    IceEditableTable,
    IceEditableTableColumn,
    IceGridLayout,
    IceQueryGrid,
    IceSelect,
    IcePersionSelector,
    processForm
  },
  mixins: [bizComm, renderer, devComm, editRenderer, editComm, devFlowFilter],
  data() {
    return {
      formRules: {
        afReason: {
          required: true,
          message: '请选择系统重装原因',
          trigger: 'blur'
        }
      },
      managerSure: { required: true, message: '请确认台账属性无误' },
      mainData: {
        oid: '',
        afNo: '', //审批单号
        afDate: '', //申请时间
        afUserCode: '', //申请人编码
        afUserName: '', //申请人名字
        afDepartmentCode: '', //申请人部门编码
        afDepartmentName: '', //申请人部门名字
        afOrgCode: '', //申请人单位编码
        afOrgName: '', //申请人单位名字
        afReason: '', //申请原因
        afRemark: '', //申请备注
        afPhone: '', //申请人联系电话
        dutyName: '', //责任人
        deptName: '', //责任部门
        dutyCode: '', //责任人code
        dutyOrgCode: '', //责任人orgcode
        dutyOrgName: '', //责任人orgName
        deptCode: '', //责任人部门code
        dutySecretLevel: '', //责任人涉密等级
        detailList: [], //设备list
        childList: [], //关联设备list
        resetRecordList: [], //操作记录
        headSource: 5,
        managerSure: '',
        remark: '',
        catalogId: '' //服务项ID
      },
      detailList: [], //列表数据

      PAGE_ENUM: {
        REFS: {
          DEV_SELECT: { REF: 'devSelect', SHOW: false },
          FORM: { REF: 'form' }
        },
        //部门选择以及人员选择mode
        MODE: 'readonly',
        MODE_TYPE: {
          READ_ONLY: 'readonly',
          ONLY_SELECT: 'onlySelect'
        }
      },
      devSelected: [], //列表勾选的数据，用作删除
      query: [
        {
          type: 'static',
          code: 'deptCode',
          exp: '=',
          value: () => {
            return this.deptCode;
          }
        }
        /*{type: 'static', code: 'areaId',exp: '=', value: () => {
                            return this.areaId;
                        }
                    },*/
      ],
      columns: [], //选择设备的列
      deptCode: '', //设备选择过滤条件--责任人code
      tableRules: {
        //列表字段的验证规则
        /*applyOsName: {required: true,whitespace:true, message: "请填写系统名称"},*/
        //applyOsVersion:{required: true,whitespace:true, message: "请选择新操作系统版本"},
        /*hostName:{required: true,whitespace:true, message: "请填写主机名"},
                    afReason:{required: true,whitespace:true, message: "请填重装系统原因"},*/
      },
      managerSureFlag: false,
      operateForbid: true,
      visibleDevPopChange: false,
      devId: '',
      eventUrl: '/biz/event/serviceTicket/transaction',
      isEdit: false,
      areaId: '',
      mapTypeCodeList: ['CE_SHI'],
      filterTreeData: []
    };
  },
  methods: {
    /**
     * 初始化页面数据
     * @param flowContext
     * @param bizData
     */
    flowReady(flowContext, bizData) {
      //areaId=1a16f5aae62c5cb615fc8d38a293cc5f&catalogId=0732a7f170283a378694cea0619f14de&dataId=27f5936eb0624f57a0d78a016ff0e1eb&actInstId=2855213&taskUserId=03f5d2190b804006833bd0b8550061de&sign=C5E5011D8099375F6FF5C86B7CA7B64E&_blank=true
      // bizData.catalogId = this.$route.query['catalogId'];
      //   console.log(bizData);
      bizData.catalogId = '0732a7f170283a378694cea0619f14de';
      // this.areaId = this.$route.query['areaId'];
      this.areaId = '1a16f5aae62c5cb615fc8d38a293cc5f';
      //初始化设备类别枚举--this.requestCategoryData()
      //初始化使用情况枚举--this.requestSystemStateData()
      //初始化联网类型--this.requestNetAreaTypeData()
      //预处理任务链
      let prepareTaskChain = [
        this.assembleEnumByDataDictionary(
          this.ENUMS.DATA_DICTIONARY.USE_FOR.CODE,
          this.ENUMS.DATA_DICTIONARY.USE_FOR_TWO.CODE,
          this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
          this.ENUMS.DATA_DICTIONARY.DEV_VERSION.CODE
        ),
        this.requestCategoryData(),
        this.requestNetAreaTypeData()
      ];
      Promise.all(prepareTaskChain).then(this.initColumns);
      this.deptCode = bizData.afDepartmentCode;
      if (!!bizData.devDetails && bizData.devDetails.length > 0) {
        this.detailList = [];
        bizData.devDetails.forEach(item => {
          let obj = {};
          Object.assign(obj, item.commonDTO, item.applyDTO);
          obj.devId = item.devId;
          this.detailList.push(obj);
        });
        //this.detailList = bizData.detailList;
      }
      if (flowContext.nodeId == 'SureNode') {
        debugger;
        this.mainData.resetRecordList = [];
        bizData.managerSureList.forEach(item => {
          let obj = {};
          Object.assign(obj, item.commonDTO, item.recordDTO);
          if (!!item.recordDTO && !!item.recordDTO.osRecord) {
            obj.newOsName = item.recordDTO.osRecord.osName;
          }
          obj.devId = item.devId;
          this.mainData.resetRecordList.push(obj);
        });
        this.managerSureFlag = true;
        this.operateForbid = false;
        this.isEdit = true;
      } else if (flowContext.nodeId == 'EndEvent') {
        this.mainData.resetRecordList = [];
        bizData.managerSureList.forEach(item => {
          let obj = {};
          Object.assign(obj, item.commonDTO, item.recordDTO);
          if (!!item.recordDTO && !!item.recordDTO.osRecord) {
            obj.newOsName = item.recordDTO.osRecord.osName;
          }
          obj.devId = item.devId;
          this.mainData.resetRecordList.push(obj);
        });
        this.managerSureFlag = true;
      }
      if (this.managerSureFlag) {
        this.formRules.managerSure = this.managerSure;
      } else {
        if (this.formRules.managerSure) {
          delete this.formRules.managerSure;
        }
      }
      Object.assign(this.mainData, bizData);
    },
    /**
     * 流程操作按钮监听事件
     * @param flowContext
     * @param bizData
     */
    flowOperateBtn(flowContext, bizData) {
      let isTrue = true;
      //let isTblTrue = true;
      if (this.detailList.length === 0) {
        this.$message.warning('重装系统列表不可为空');
        return false;
      }
      //列表验证
      /*this.$refs.tbl.validateAll((valid) => {
                    isTblTrue = valid;
                });*/

      //表单验证
      this.$refs.form.validate(valid => {
        isTrue = valid;
      });
      flowContext.processVar = {
        devUseType: this.detailList[0].devUseType
          ? this.detailList[0].devUseType
          : 1
      };
      return isTrue;
    },
    /**
     * 向流程引擎传递数据
     * @returns {mainData|{}}
     */
    flowBizData() {
      let arr = [];
      this.detailList.forEach(item => {
        let obj = {};
        obj.commonDTO = {};
        obj.applyDTO = {};
        obj.devId = item.devId;
        Object.assign(obj.commonDTO, item);
        obj.applyDTO.applyOsVersion = item.applyOsVersion;
        obj.applyDTO.applyOsName = item.applyOsName;
        obj.applyDTO.osReinstall = '1';
        arr.push(obj);
      });
      //this.mainData.detailList = this.detailList;
      this.mainData.devDetails = arr;
      return this.mainData;
    },
    /**
     * 设置责任人信息
     */
    setDutyUserInfo(data) {
      this.mainData.dutyName = data.dutyName;
      this.mainData.dutyCode = data.dutyCode;
      this.mainData.deptName = data.deptName;
      this.mainData.deptCode = data.deptCode;
      this.dutyCode = data.dutyCode; //设备选择的过滤条件(责任人code)
    },
    /**
     * 设备选择页面关闭事件
     * @param data
     */
    selectOverHandler(data) {
      return new Promise((resolve, reject) => {
        if (data.length > 0) {
          if (this.detailList.length === 0) {
            //当列表为空时，设备选择列表没有过滤条件，需判断责任人是否相同
            /*if(!this.isRepeatPer(data)){
                                return
                            }*/
            //如果列表的数据为空，则设置第一个数据的责任人信息填充到设备责任人
            //this.setDutyUserInfo(data[0]);//责任人信息填充

            let devUseType = data[0].devUseType ? data[0].devUseType : '1';
            for (let i = 0; i < data.length; i++) {
              let isDevUseType = data[i].devUseType ? data[i].devUseType : '1';
              if (devUseType != isDevUseType) {
                this.$message.warning('不可同时选择终端设备与服务端设备!');
                return;
              }
            }
          } else {
            let devUseType = this.detailList[0].devUseType;
            for (let i = 0; i < data.length; i++) {
              let isDevUseType = data[i].devUseType ? data[i].devUseType : '1';
              if (devUseType != isDevUseType) {
                this.$message.warning('不可同时选择终端设备与服务端设备!');
                return;
              }
            }
          }
          for (let i = 0; i < data.length; i++) {
            //根据oid判断选择的设备是否与已选择的设备相同，不相同则添加进去
            if (!this.isRepeatEq(data[i].oid, this.detailList)) {
              let obj = {};
              obj.devId = data[i].oid;
              obj.devSn = data[i].devSn;
              obj.masterIp = data[i].masterIp;
              obj.mac = data[i].mac;
              obj.secretLevel = data[i].secretLevel;
              obj.dutyName = data[i].dutyName;
              obj.childType = data[i].childType;
              obj.osVersion = data[i].osVersion;
              obj.osName = this.getOsName(data[i].osVersion);
              obj.devUseType = data[i].devUseType ? data[i].devUseType : '1';
              obj.applyOsName = '';
              obj.applyOsVersion = '';
              obj.hostName = '';
              obj.afReason = '';
              this.detailList.push(obj);
            }
          }
        }
        resolve();
        this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = false;
      });
    },
    /**
     * 检查责任人是否不同
     */
    isRepeatPer(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (i !== j && arr[i].dutyCode !== arr[j].dutyCode) {
            this.$message.warning('请选择责任人责任部门相同的设备');
            return false;
          }
        }
      }
      return true;
    },
    /**
     * 检查选择的设备是否与已选择的设备相同
     */
    isRepeatEq(oid, targetList) {
      //判断列表是否有值，没有则返回false
      if (targetList.length !== 0) {
        for (let i = 0; i < targetList.length; i++) {
          if (targetList[i].devId === oid) {
            //相同true
            return true;
          }
        }
      } else {
        return false;
      }
      //不相同false
      return false;
    },
    /**
     * 初始化列
     */
    initColumns() {
      let _this = this;
      this.columns = [
        { code: 'devId', hidden: true },
        { code: 'oid', hidden: true },
        { code: 'dependType', hidden: true },
        { code: 'devUseType', hidden: true },
        { code: 'mac', hidden: true },
        {
          label: '设备子类',
          code: 'childType',
          width: 90,
          renderCell(h, data) {
            return _this.onChildTypeRenderer(data.row.childType);
          }
        },
        { label: '责任人', code: 'dutyName', width: 90 },
        { label: '责任部门', code: 'deptName', width: 80 }, //devSn
        { label: '资产编号', code: 'sn', width: 100 },
        { label: '设备编号', code: 'devSn', width: 100 },
        { label: 'IP地址', code: 'masterIp', width: 100 },
        { label: '设备名称', code: 'name', width: 90 },
        {
          label: '联网类型/用途',
          code: 'netAreaAndType',
          width: 120,
          ignore: true,
          formatter: row => {
            return _this.onNetAndTypeRenderer(
              row.netArea,
              row.netType,
              row.useFor
            );
          }
        },
        {
          label: '密级',
          code: 'secretLevel',
          width: 50,
          mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE
        }
      ];
    },
    /**
     * 添加设备
     */
    addDev() {
      this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = true;
      this.$nextTick(() => {
        this.$refs[this.PAGE_ENUM.REFS.DEV_SELECT.REF].openDialog();
      });
    },
    /**
     * 选中的设备
     * @param rows
     */
    devTableChange(rows) {
      this.devSelected = rows;
    },
    /**
     * 删除设备
     */
    deleteDev() {
      for (let i = 0; i < this.devSelected.length; i++) {
        let index = this.detailList.indexOf(this.devSelected[i]);
        this.$refs.tbl.clearValidateRow(index); //清除验证
        this.detailList.splice(index, 1);
      }
      /*if(this.detailList.length===0){
                    this.dutyCode = '';//如果列表的数据已清空，择设备选择的过滤条件和责任人也清空
                    this.mainData.dutyName = '';
                    this.mainData.dutyCode = '';
                    this.mainData.deptName = '';
                    this.mainData.deptCode = '';
                }*/
    },
    selectChange(val, row) {
      //判断当前行是否是勾选项
      if (
        this.devSelected.indexOf(row) > -1 ||
        this.devSelected.indexOf(row) == '0'
      ) {
        //是勾选项，将所有的勾选项都复制为相同的值
        this.devSelected.forEach(item => {
          let index = this.detailList.indexOf(item);
          if (index || index == '0') {
            this.detailList[index].applyOsVersion = val;
            this.$refs.tbl.validateField(index, 'applyOsVersion');
          }
        });
      }
    },
    /**
     * 获取版本的名字
     * @param val
     * @returns {*}
     */
    getOsName(val) {
      for (let i = 0; i < this.ENUMS.DEV_VERSION_DATA.length; i++) {
        if (this.ENUMS.DEV_VERSION_DATA[i].code == val) {
          return this.ENUMS.DEV_VERSION_DATA[i].name;
        }
      }
      return '';
    },
    /**
     * 关联单据信息点击事件
     * @param data
     */
    jumpToEvent() {
      let host = window.location.href.substring(
        0,
        window.location.href.indexOf('#') + 1
      );
      window.open(
        host + this.eventUrl + '?dataId=' + this.mainData.serviceTicketId
      );
      // this.$router.push(data.url + "?dataId=" + data.otherModelID);
    },
    lookDevPopModifyDetail(index) {
      this.visibleDevPopChange = true;
      this.devId = this.mainData.resetRecordList[index].devId;
      this.$nextTick(() => {
        this.$refs.devPopChange.openDialog();
      });
    }
  },
  mounted() {
    this.filterTreeData = this.getMapTypeCodeList('CE_SHI')
      .filter(item => !item.disabled)
      .map(t => t.value);
  }
};
</script>

<style lang="less" src="./css/process.less" scoped>
/*@import "css/process.less";*/
</style>
