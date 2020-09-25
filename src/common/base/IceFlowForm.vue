<template>
    <div class="ice-full-absolute" ref="window">
        <el-tabs class="form-group-tools"
                 :value="formGroupList[activedForm]"
                 tab-position="right"
                 v-show="activeTabIndex == 0 && formGroupList.length > 2"
                 @tab-click="goGroup"
                 :style="{ right: formGroupLeft }">
            <el-tab-pane :label="item" :name="item" v-for="(item, index) in formGroupList" :key="item"></el-tab-pane>
        </el-tabs>
        <vue-scroll ref="scroll" :ops="{ bar: { background: '#000', opacity: 0.4, keepShow: true } }"
                    @handle-scroll="handleScroll">
            <div class="flow-form-base">
                <div class="flow-form-wrapper" ref="flow-form-wrapper">
                    <div class="operation-area" v-if="showTitle">
                        <div class="first">
                            <div :title="flowContext.actDefName" class="title">
                                {{ flowContext.actDefName ? flowContext.actDefName : '&nbsp;' }}
                                <span style="color: red">{{flowContext.additionalContent?flowContext.additionalContent:''}}</span>
                                <div class="secret">
                                    {{flowContext.dataSecretLevcode == '1'? '(非涉密表单请勿填写涉密信息)': '(涉密表单:' + dataSecretText
                                    + ')'}}
                                </div>
                            </div>
                            <div style="flex-grow: 1;position: relative">
                                <el-button-group class="button-group ice-button-group">
                                    <div v-for="button in flowButtons"
                                         :key="button.key"
                                         class="button-wrapper">
                                        <el-button :style="{background: button.background,color: button.color}"
                                                   @click="button.clickFun(button)"
                                                   v-if="flowReadyIsLoadOk && loadBtn && button.isShow && !button.list">
                                            {{ button.text }}
                                        </el-button>
                                        <el-dropdown
                                                v-if="button.isShow && button.list"
                                                size="medium"
                                                placement="bottom">
                                            <el-button :style="{background: button.background,color: button.color}">
                                                {{ button.text }}<i class="el-icon-arrow-down"></i>
                                            </el-button>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item
                                                        :divided="index != 0"
                                                        @click.native="option.clickFun(option, button)"
                                                        v-for="(option, index) in button.list"
                                                        :key="option.key">
                                                    {{ option.text }}
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </div>
                                    <div :class="{ invalid: true, enhance: showInvalidEnhance }" v-if="showInvalid">
                                        表单校验未通过,请检查表单信息!
                                    </div>
                                </el-button-group>
                            </div>
                        </div>
                        <div class="second">
                            <el-tabs type="border-card" @tab-click="handleClick">
                                <el-tab-pane :label="oneTabName"></el-tab-pane>
                                <el-tab-pane :label="twoTabName" v-if="tabShow"></el-tab-pane>
                                <el-tab-pane :label="item.name" v-for="item in extendTabs"
                                             :key="item.name"></el-tab-pane>
                            </el-tabs>
                        </div>
                        <div style="width: 100%;height: auto" ref="fixed" v-if="activeTabIndex == 0">
                            <slot name="fixed"></slot>
                        </div>
                    </div>
                    <div class="form-content" ref="formContent" style="display: flex;flex-direction: column">
                        <div v-show="activeTabIndex == 0" class="form-content-wrapper">
                            <ice-form-group name="申请人" v-if="applyShowRule == 'elRow'">
                                <el-form :model="bizdata" :rules="applyRules" ref="applyForm">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item
                                                    label="申请人"
                                                    label-width="100px"
                                                    prop="afUserName">
                                                <el-input v-model="bizdata.afUserName" disabled
                                                          placeholder="申请人"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item
                                                    label="部门"
                                                    label-width="100px"
                                                    prop="afDepartmentName">
                                                <el-input
                                                        disabled
                                                        placeholder="部门"
                                                        v-model="bizdata.afOrgName + '-' + bizdata.afDepartmentName"
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item
                                                    label="电话"
                                                    label-width="100px"
                                                    prop="afPhone"
                                            >
                                                <el-input
                                                        :disabled="formReadonly"
                                                        :maxlength="20"
                                                        :showWordLimit="true"
                                                        placeholder="联系电话"
                                                        v-model="bizdata.afPhone"
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </ice-form-group>
                            <el-form :model="bizdata"
                                     v-if="applyShowRule == 'gridLayout'"
                                     :rules="applyRules"
                                     ref="applyForm">
                                <ice-grid-layout :columns="3" name="申请人">
                                    <el-form-item label="申请人" label-width="100px" prop="afUserName">
                                        <el-input v-model="bizdata.afUserName" disabled placeholder="申请人"></el-input>
                                    </el-form-item>
                                    <el-form-item label="部门" label-width="100px" prop="afDepartmentName">
                                        <el-input disabled placeholder="部门"
                                                  v-model="bizdata.afOrgName + '-' + bizdata.afDepartmentName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="电话" label-width="100px" prop="afPhone">
                                        <el-input :disabled="formReadonly" :maxlength="20" :showWordLimit="true"
                                                  placeholder="联系电话" v-model="bizdata.afPhone"></el-input>
                                    </el-form-item>
                                </ice-grid-layout>
                            </el-form>
                            <slot :bizdata="bizdata" :flowcontext="{ flowInstData: flowInstData }" :isAuthor="isAuthor"
                                  :formReadonly="formReadonly" :isEndNode="isEndNode">
                                <h1>申请信息</h1>
                            </slot>
                        </div>
                        <ice-grid-layout name="审批信息" v-if="!urlRender" :columns=1>
                            <div class="form-content-wrapper">
                                <div class="shr-area">
                                    <div class="shr">审核人</div>
                                    <el-form :model="formP"
                                             label-position="right"
                                             label-width="120px">
                                        <ice-grid-layout :columns="2">
                                            <!--choose-item="multiple"-->
                                            <el-form-item v-for="item in nodeUserList"
                                                          v-if="item.roleFormula.visible && item.nodeType!='SubProcessNode'"
                                                          :key="item.nodeId"
                                                          :label="item.nodeName">
                                                <el-input v-model="item.assignerName"
                                                          readonly
                                                          :class="{'form-content-wrapper-persion-yellow':item.nodeStatus=='1','form-content-wrapper-persion-green':item.nodeStatus=='2'}"></el-input>
                                            </el-form-item>
                                            <!--<ice-persion-selector
                                                    style="padding: 0 2%;box-sizing: border-box"
                                                    :label="item.nodeName"
                                                    :labelWidth="120"
                                                    title="请选择"
                                                    :extend-prop="item.nodeId"
                                                    :class="{'form-content-wrapper-persion-yellow':item.nodeStatus=='1','form-content-wrapper-persion-green':item.nodeStatus=='2'}"
                                                    mode="readonly"
                                                    :chooseItem="item.roleFormula.multiple ? 'multiple' : 'single'"
                                                    v-model="item.assignerName"
                                                    v-if="item.roleFormula.visible && item.nodeType!='SubProcessNode'"
                                                    @select-confirm="selectConfirm"
                                                    v-for="item in nodeUserList"
                                                    :key="item.nodeId">
                                            </ice-persion-selector>-->
                                        </ice-grid-layout>
                                    </el-form>


                                    <slot name="shyj">
                                        <div>
                                            <div class="shr">处理意见</div>
                                            <el-timeline class="shyj">
                                                <el-timeline-item
                                                        v-for="(item, index) in operateDataList"
                                                        :key="item.oid"
                                                        color="#0bbd87"
                                                        :timestamp="new Date(item.operateTime).toLocaleString()"
                                                        v-if="item.operateKey != 'save'">
                                                    <!-- v-if="item.operateKey != 'save' && item.opinion != null && item.opinion != ''"> -->
                                                    {{ item.nodeName }}：{{ item.operaterName }}
                                                    {{!item.opinion ?' -处理意见： 无' : ' -处理意见：' + item.opinion }}
                                                </el-timeline-item>
                                            </el-timeline>
                                        </div>
                                    </slot>
                                </div>
                            </div>
                        </ice-grid-layout>
                        <div v-show="activeTabIndex == 1" class="form-content-wrapper">

                            <div class="shr-area">
                                <div class="shr">审核人</div>
                                <el-form :model="formP"
                                         label-position="right"
                                         label-width="120px">
                                    <ice-grid-layout :columns="2">
                                        <!--choose-item="multiple"-->
                                        <el-form-item v-for="item in nodeUserList"
                                                      v-if="item.roleFormula.visible && item.nodeType!='SubProcessNode'"
                                                      :key="item.nodeId"
                                                      :label="item.nodeName">
                                            <el-input v-model="item.assignerName"
                                                      readonly
                                                      :class="{'form-content-wrapper-persion-yellow':item.nodeStatus=='1','form-content-wrapper-persion-green':item.nodeStatus=='2'}"></el-input>
                                        </el-form-item>
                                        <!--<ice-persion-selector
                                                style="padding: 0 2%;box-sizing: border-box"
                                                :label="item.nodeName"
                                                :labelWidth="120"
                                                title="请选择"
                                                :extend-prop="item.nodeId"
                                                :class="{'form-content-wrapper-persion-yellow':item.nodeStatus=='1','form-content-wrapper-persion-green':item.nodeStatus=='2'}"
                                                mode="readonly"
                                                :chooseItem="item.roleFormula.multiple ? 'multiple' : 'single'"
                                                v-model="item.assignerName"
                                                v-if="item.roleFormula.visible && item.nodeType!='SubProcessNode'"
                                                @select-confirm="selectConfirm"
                                                v-for="item in nodeUserList"
                                                :key="item.nodeId">
                                        </ice-persion-selector>-->
                                    </ice-grid-layout>
                                </el-form>


                                <slot name="shyj">
                                    <div>
                                        <div class="shr">处理意见</div>
                                        <el-timeline class="shyj">
                                            <el-timeline-item
                                                    v-for="(item, index) in operateDataList"
                                                    :key="item.oid"
                                                    color="#0bbd87"
                                                    :timestamp="new Date(item.operateTime).toLocaleString()"
                                                    v-if="item.operateKey != 'save'">
                                                <!-- v-if="item.operateKey != 'save' && item.opinion != null && item.opinion != ''"> -->
                                                {{ item.nodeName }}：{{ item.operaterName }}
                                                {{!item.opinion ?' -处理意见： 无' : ' -处理意见：' + item.opinion }}
                                            </el-timeline-item>
                                        </el-timeline>
                                    </div>
                                </slot>
                            </div>

                        </div>
                        <div v-show="extendTabs.length > 0 && activeTabIndex == 2" class="form-content-wrapper">
                            <slot name="extendTab1"></slot>
                        </div>
                        <div v-show="extendTabs.length > 1 && activeTabIndex == 3" class="form-content-wrapper">
                            <slot name="extendTab2">
                                <h1>请完成相应的slot</h1>
                            </slot>
                        </div>
                        <div v-show="extendTabs.length > 2 && activeTabIndex == 4" class="form-content-wrapper">
                            <slot name="extendTab3">
                                <h1>请完成相应的slot</h1>
                            </slot>
                        </div>
                        <div v-show="extendTabs.length > 3 && activeTabIndex == 5" class="form-content-wrapper">
                            <slot name="extendTab4">
                                <h1>请完成相应的slot</h1>
                            </slot>
                        </div>
                        <div v-show="extendTabs.length > 4 && activeTabIndex == 6" class="form-content-wrapper">
                            <slot name="extendTab5">
                                <h1>请完成相应的slot</h1>
                            </slot>
                        </div>
                    </div>
                </div>

                <el-dialog
                        v-dialogDrag
                        title="流程查看"
                        center
                        :visible.sync="viewFlowDialog"
                        width="1000px"
                        top="5vh"
                        custom-class="customDialog"
                >
                    <el-tabs type="border-card" style="height: 670px">
                        <el-tab-pane label="流程图">
                            <div class="flow-pic">
                                <div
                                        style="width: 600px;height: 600px;display: flex;justify-content: center"
                                >
                                    <ice-flow-image
                                            :status="flowNodesStatus"
                                            :flow-context="flowContext"
                                            :json="flowInstData.definition.bpmDefJson"
                                            :flow-nodes-info="flowNodesInfo"
                                    ></ice-flow-image>
                                </div>
                                <div class="remark">
                                    <div class="title">{{ flowContext.actDefName }}</div>
                                    <div style="margin: 10px 0">流程说明：</div>
                                    <div
                                            v-html="flowInstData.definition.description"
                                            class="flow_description"
                                    ></div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="任务记录">
                            <ice-query-grid
                                    :data-url="taskGridDataUrl"
                                    :beforeBindData="beforeBindData"
                                    :span-method="taskRowSpanMethod"
                                    :stripe="false"
                                    :columns="taskColumns"
                                    style="height:600px"
                                    :pagination="false"
                            >
                            </ice-query-grid>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="处理意见">
                                         <ice-query-grid :grid-data="operateDataMsgList"
                                                         :columns="suggestionColumns" style="height:600px" :pagination="false">
                                         </ice-query-grid>
                                     </el-tab-pane>-->

                        <!--<el-tab-pane label="流转记录">
                                        <ice-query-grid :data-url="movingGridDataUrl"
                                                        :columns="movingColumns" style="height:600px" :pagination="false">
                                        </ice-query-grid>
                                    </el-tab-pane>-->
                        <el-tab-pane label="操作记录">
                            <ice-query-grid
                                    :grid-data="operateDataList"
                                    :operations="operationsBtn"
                                    :columns="operateColumns"
                                    style="height:600px"
                                    :pagination="false"
                            >
                            </ice-query-grid>
                        </el-tab-pane>
                    </el-tabs>
                </el-dialog>

                <el-dialog
                        v-dialogDrag
                        title="请确认操作"
                        center
                        :close-on-click-modal="false"
                        :visible.sync="submitFlowDialog"
                        width="600px"
                        custom-class="customDialog"
                >
                    <div style="padding:10px 30px;">
                        <ice-label name="操作类型" :width="120">
                            <el-input
                                    readonly=""
                                    :disabled="true"
                                    value="提交"
                                    v-model="flowContext.operateName"
                            ></el-input>
                        </ice-label>
                        <ice-label name="下一处理环节" :width="120" v-if="nextNodeShow">
                            <el-input
                                    readonly=""
                                    :disabled="true"
                                    value="总经理审核"
                                    v-model="flowContext.nextNodeName"
                            ></el-input>
                        </ice-label>

                        <ice-static-persion-selector
                                v-if="showNextUser && isPersionRefresh"
                                :label="nextUserLabel"
                                :label-width="120"
                                :extend-prop="flowContext.nextNodeId"
                                :grid-index="false"
                                v-model="nextUserName"
                                :grid-data="replacePersonUser"
                                :mode="nextUserMode"
                                @select-confirm="selectConfirm"
                        ></ice-static-persion-selector>
                        <ice-label name="密级" :width="120" v-if="showSecret">
                            <el-radio-group
                                    v-model="flowContext.dataSecretLevcode"
                                    size="mini"
                                    style="display: flex;justify-content: flex-start;width: 100%"
                            >
                                <el-radio
                                        :label="item.value"
                                        border
                                        :style="
                    'background: rgb(255, ' +
                      (255 - 30 * index) +
                      ', ' +
                      (255 - 30 * index) +
                      ');margin: 0;margin-right: 5px;'
                  "
                                        v-for="(item, index) in secrets"
                                        v-if="!item.disable"
                                >
                                    {{ item.name }}
                                </el-radio>
                            </el-radio-group>
                        </ice-label>

                        <ice-label :name="isFirstNode ? '备注' : '处理意见'" :width="120">
                            <el-input type="textarea"
                                      :rows="5"
                                      resize="none"
                                      show-word-limit
                                      :placeholder="isFirstNode ? '请输入备注' : '请输入处理意见'"
                                      v-model="flowContext.flowComment"
                                      maxlength="128">
                            </el-input>
                        </ice-label>

                        <div
                                style="margin-left: 120px;padding-bottom: 20px"
                                v-if="!isFirstNode"
                        >
                            <el-tag
                                    v-for="tag in showTag"
                                    class="tag"
                                    @click="flowContext.flowComment = tag.content"
                            >{{ tag.content }}
                            </el-tag>
                            <!--<button data-v-4457333a="" type="button" class="el-button el-button&#45;&#45;text el-button&#45;&#45;small" style="float: right; padding: 3px 0px;">
                                              <span>更多&gt;&gt;</span>
                                          </button>-->
                            <button
                                    @click="showUserOptionsDialog"
                                    type="button"
                                    class="el-button el-button--text el-button--small"
                                    style="float: right; padding: 3px 0px;"
                            >
                                <span>维护&gt;&gt;</span>
                            </button>
                        </div>
                        <div class="operate-button">
                            <!---->
                            <el-button
                                    :disabled="submiting"
                                    type="success"
                                    icon="el-icon-check"
                                    @click="flowOperate"
                            >确定
                            </el-button>
                            <el-button
                                    type="info"
                                    icon="el-icon-close"
                                    @click="reduction"
                            >
                                取消
                            </el-button>
                        </div>
                    </div>
                </el-dialog>

                <ice-flow-opinion :call-back="saveUserOptions" ref="flowOpinion"></ice-flow-opinion>
                <ice-persion-selector
                        :grid-index="false"
                        mode="hidden"
                        ref="deliver"
                        @select-confirm="selectConfirmDeliver"
                ></ice-persion-selector>
                <ice-persion-selector
                        :grid-index="false"
                        mode="hidden"
                        ref="handover"
                        :allDept="allDept"
                        choose-item="single"
                        @select-confirm="selectConfirmHandover"
                ></ice-persion-selector>
                <ice-persion-selector
                        :grid-index="false"
                        mode="hidden"
                        ref="appendUser"
                        choose-item="single"
                        @select-confirm="selectConfirmAppendUser"
                ></ice-persion-selector>
            </div>
        </vue-scroll>
        <ice-datamap-translater
                style="display: none"
                map-type-code="DATA_SECRET_LEVEL"
                :value="flowContext.dataSecretLevcode"
                :text.sync="dataSecretText">
        </ice-datamap-translater>
        <ice-flow-print-view ref="printView"></ice-flow-print-view>
    </div>
</template>

<script>
    import IceQueryGrid from './IceQueryGrid';
    import IcePopSelector from './IcePopSelector';
    import IcePersionSelector from '@/components/common/biz/IcePersionSelector.vue';
    import IceStaticPersionSelector from '@/components/common/biz/IceStaticPersionSelector.vue';
    import IceGridLayout from './IceGridLayout';
    import IceLabel from './IceLabel';
    import IceFlowImage from './IceFlowImage';
    import emitter from 'element-ui/src/mixins/emitter';
    import IceFlowOpinion from './IceFlowOpinion';
    import VueScroll from 'vuescroll';
    import IceDatamapTranslater from './IceDatamapTranslater';
    import IceFlowFormJs from './IceFlow/IceFlowForm';
    import IceFormGroup from './IceFormGroup';
    import IceFlowPrintView from './IceFlow/IceFlowPrintView';

    export default {
        name: 'IceFlowForm',
        componentName: 'IceFlowForm',
        components: {
            IceFlowPrintView,
            IceFormGroup,
            IceDatamapTranslater,
            IceFlowOpinion,
            IceFlowImage,
            IceLabel,
            IceGridLayout,
            IcePopSelector,
            IceQueryGrid,
            IcePersionSelector,
            IceStaticPersionSelector,
            VueScroll
        },
        mixins: [emitter, IceFlowFormJs],
        props: {
            showTitle: {
                default: true
            }
        }
    };
</script>

<style lang="less">
    @import './IceFlow/IceFlowForm-all.less';
</style>
<style lang="less" src="./IceFlow/IceFlowForm.less" scoped>
    /*@import "./IceFlow/IceFlowForm.less";*/
</style>
<style lang="less">
    .form-content-wrapper .form-content-wrapper-persion-green.el-input input {
        border-color: #67c23a;
    }

    .form-content-wrapper .form-content-wrapper-persion-yellow.el-input input {
        border-color: #cf9236;
    }

</style>
