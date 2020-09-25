import {SERVER_NAME, AXIOS_TYPE_ENUM} from "@/pages/biz/js/comm";

export default {
    data() {
        return {
            ENTER_ENUMS: {
                STATE: {
                    DRAFT: -1,
                    PROCESS: 1,
                    FINISH: 2,
                    RE_BACK: 3,
                    properties: [
                        {code: -1, name: "草稿"},
                        {code: 1, name: "审批中"},
                        {code: 2, name: "已完成"},
                        {code: 3, name: "驳回"},
                    ]
                },
                ACTIONS: {
                    GET_ENTER_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizDevNetworkInDetail/list`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    GET_DEPT_BY_CODE: {
                        URL: () => {
                            return "/permission/frame_org/get_dept_by_code"
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    }
                },
                ROUTER: {
                    //变更编辑页面
                    ENTER_DEV_EDIT: {
                        URL: (param) => {
                            return this.assembleUrl("/biz/businessprocess/enternet/edit", param);
                        }
                    },
                }
            }
        }
    },
    methods: {
        /**
         * 拼装跳转url
         * @param url
         * @returns {*}
         */
        assembleUrl(url) {
            let param = arguments[1];
            if (!!param) {
                let first = true;
                for (let i in param) {
                    if (first) {
                        first = false;
                        url += "?"
                    } else {
                        url += "&";
                    }
                    url += i + "=" + param[i];
                }
            }
            return url;
        }
    }
}
