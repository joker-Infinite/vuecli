<template>
    <div class="process_div">
        <table border="1" cellpadding="0" cellspacing="0" class="process_table" v-if="formData">
            <caption>
                <div class="apply_title">
                    设备入网审批单
                </div>
                <div class="apply_code">
                    申请单号:<label class="process">{{formData.afNo}}</label>
                </div>
            </caption>
            <tr>
                <td width="25%">申请人</td>
                <td width="25%"><label>{{formData.afUserName}}</label></td>
                <td width="25%">申请日期</td>
                <td width="25%"><label type="date">{{formData.afDate}}</label></td>
            </tr>
            <tr>
                <td>申请单位</td>
                <td><label>{{formData.afDepartmentName+ "[" +formData.afOrgName+"]"}}</label></td>
                <td>申请人联系电话</td>
                <td><label>{{formData.afPhone}}</label></td>
            </tr>
            <template v-for="(item,key) in formData.detailList">
                <tr>
                    <td colspan="4" class="infoTips">入网设备基本信息</td>
                </tr>
                <tr>
                    <td>设备名称</td>
                    <td><label>{{item.name}}</label></td>
                    <td>联网区域</td>
                    <td><label>{{onNetAndTypeRenderer(item.netArea,item.netType)}}</label></td>
                </tr>
                <tr>
                    <td>设备编号</td>
                    <td><label>{{item.devSn}}</label></td>
                    <td>保密编号</td>
                    <td><label>{{item.secretSn}}</label></td>
                </tr>
                <tr>
                    <td>设备类型</td>
                    <td><label>{{onCategoryRenderer(item.category)}}</label></td>
                    <td>设备子类</td>
                    <td><label>{{onChildTypeRenderer(item.childType)}}</label></td>
                </tr>
                <tr>
                    <td>设备密级</td>
                    <td><label>{{getNameByCode(ENUMS.DATA_SECRET_LEVEL_DATA,item.secretLevel)}}</label></td>
                    <td>出厂编号</td>
                    <td><label>{{item.birthSn}}</label></td>
                </tr>
                <tr>
                    <td>Mac地址</td>
                    <td><label>{{item.mac}}</label></td>
                    <td>放置地点</td>
                    <td><label>{{item.currentPlace}}</label></td>
                </tr>
                <tr>
                    <td>用途</td>
                    <td><label>{{item.useFor}}</label></td>
                    <td>是否安装操作系统</td>
                    <td><label>{{item.isVersion}}</label></td>
                </tr>
                <tr>
                    <td>设备责任人</td>
                    <td><label>{{item.dutyName}}</label></td>
                    <td>责任人涉密等级</td>
                    <td><label>{{item.dutySecretLevel}}</label></td>
                </tr>
                <tr>
                    <td>设备责任单位</td>
                    <td colspan="3" class="left_align"><label>{{item.deptName}}</label></td>
                </tr>
            </template>
            <tr>
                <td colspan="4" class="infoTips">关联设备信息</td>
            </tr>
            <tr>
                <td colspan="4">
                    <el-table :data="formData.childList" :border="true" :header-cell-style="headerCellStyle"
                              :cell-style="rowStyle">
                        <el-table-column
                                prop="name"
                                :width="150"
                                label="设备名称">
                        </el-table-column>
                        <el-table-column
                                prop="secretSn"
                                label="保密编号">
                        </el-table-column>
                        <el-table-column
                                prop="category"
                                label="设备类型" :formatter="categoryFormatter">
                        </el-table-column>
                        <el-table-column
                                prop="childType"
                                label="设备子类" :formatter="childTypeFormatter">
                        </el-table-column>
                        <el-table-column
                                :width="60"
                                prop="state"
                                label="状态">
                        </el-table-column>
                        <el-table-column
                                prop="license"
                                label="序列号">
                        </el-table-column>
                    </el-table>
                </td>
            </tr>
            <tr>
                <td>入网原因</td>
                <td colspan="3" class="left_align"><label>{{formData.afReason}}</label></td>
            </tr>
        </table>
    </div>
</template>

<script>
    import bizComm from "@/pages/biz/js/comm";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import devComm from "../../dev/js/comm/devComm"
    import processRender from "./js/renderer"

    export default {
        name: "process",
        mixins: [bizComm, renderer, devComm, processRender],
        props: {
            formData: {
                type: Object
            }
        },
        data() {
            return {}
        },
        methods: {
            headerCellStyle(object) {
                return "backgroundColor:white;border-left:solid 1px black;border-bottom:solid 1px black"
            },
            rowStyle(object) {
                return "border-left:solid 1px black;border-bottom:solid 1px black;color:blue; font-size: 12px"
            }
        },
        mounted() {
            //预处理任务链
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.USE_FOR.CODE, this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE),
                this.requestCategoryData(),
                this.requestNetAreaTypeData(),
                this.requestCommStateData(),
                this.requestSystemStateData()
            ];
            Promise.all(prepareTaskChain);
        }
    }
</script>

<style lang="less" src="./css/process.less" scoped></style>
<style scoped lang="less">
    /*@import "css/process.less";*/
    .infoTips {
        font-weight: bold;
        font-size: 16px;
    }
</style>