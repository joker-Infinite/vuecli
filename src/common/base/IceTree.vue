<template>
    <div class="treeBody" :style="{width: treeWidth}">
        <div v-show="$slots.prefix&&$slots.prefix.length > 0" style="margin-top: 7px">
        <slot name="prefix">
            <div style="display: flex;justify-content:space-around;display: none">
                <el-button unauth icon="el-icon-circle-plus" type="text" style="color: #85ce61" class="mar"
                           @click="addNode"
                           :disabled="!selected">
                    <span style="color: #222222">新增</span>
                </el-button>
                <el-button unauth icon="el-icon-edit" type="text" style="color: #ebb563" class="mar-u"
                           @click="updateNode"
                           :disabled="!selected">
                    <span style="color: #222222">编辑</span>
                </el-button>
                <el-button unauth icon="el-icon-delete" type="text" style="color: red" class="mar-d"
                           @click="deleteNode"
                           :disabled="!selected">
                    <span style="color: #222222">删除</span>
                </el-button>
            </div>
        </slot>
        </div>
        <el-input :class="$slots.prefix&&$slots.prefix.length > 0?'inputwithslots':'input'"
                  placeholder="关键字过滤"
                  ref="keyfliter"
                  v-model="filterText" v-if="filter">
        </el-input>
        <div style="overflow-x: hidden;flex-grow: 1;position: relative">
            <div class="ice-full-absolute">
                <vue-scroll :ops="{bar:{background:'#7b7b7b',opacity:0.3,keepShow:true}}">
                    <el-tree ref="tree"
                             v-if="isLazy"
                             :props="defaultProps"
                             :node-key="valueProp"
                             :lazy="true"
                             :load="load"
                             v-bind="$attrs"
                             :show-checkbox="showTreeCheckbox"
                             :highlight-current="true"
                             :expand-on-click-node="false"
                             :filter-node-method="filterNode"
                             @current-change="handleNodeClick"
                             @check="nodeCheck">
                        <div slot-scope="{ node, data }" style="padding-left: 5px">
                            <i :class="node.isLeaf?'el-icon-tickets':'el-icon-folder'"
                               :style="{color:node.isLeaf?'':'#0091b0'}"/>
                            <span style="padding-left: 5px" :title="data[labelProp]">{{data[labelProp]}} </span>
                            <slot name="append" :node="node" :data="node"></slot>
                        </div>
                    </el-tree>

                    <el-tree ref="tree"
                             v-if="!isLazy"
                             :props="defaultProps"
                             :node-key="valueProp"
                             :lazy="false"
                             :data="data"
                             v-bind="$attrs"
                             :show-checkbox="showTreeCheckbox"
                             :default-expanded-keys="defaultExpand"
                             :highlight-current="true"
                             :expand-on-click-node="false"
                             :filter-node-method="filterNode"
                             @current-change="handleNodeClick"
                             @check="nodeCheck">
                        <div slot-scope="{ node, data }" style="padding-left: 5px">
                            <i :class="node.isLeaf?'el-icon-tickets':'el-icon-folder'"
                               :style="{color:node.isLeaf?'':'#0091b0'}"/>
                            <span style="padding-left: 5px" :title="data[labelProp]">{{data[labelProp]}} </span>
                            <slot name="append" :node="node" :data="node"></slot>
                        </div>
                    </el-tree>
                </vue-scroll>
            </div>
        </div>
    </div>
</template>

<script>
    import VueScroll from 'vuescroll'
    import IceTreeTemplate from '@/components/common/base/IceTreeTemplate'

    export default {
        name: "IceTree",
        inheritAttrs: false,
        mixins: [IceTreeTemplate],
        data() {
            return {
                filterText: '',
                defaultProps: {
                    children: this.childrenProp,
                    label: this.labelProp,
                    isLeaf: 'leaf'
                },
                defaultExpand: [],
                data: [],
                selected: ''
            }
        },
        methods: {
            /**
             * 重置模糊查询中输入的数据
             * */
            clearSearch() {
                this.filterText = "";
            },
            load(node, resolve) {
                if (node.level == 0) {//获取根节点
                    this.loadData(this.rootValue, resolve, true)
                } else {
                    this.loadData(node.data[this.valueProp], resolve, false)
                }

            },
            loadData(pid, resolve, isroot) {
                let params = {};
                params[this.treeParentProp] = pid
                this.$axios.get(this.loadUrl, {params: params})
                    .then(result => {
                        resolve(result.data);
                        if (isroot && result.data.length > 0) {
                            this.$refs.tree.setCurrentKey(result.data[0][this.valueProp]);
                            this.selected = result.data[0][this.valueProp];
                            this.$emit("node-click", result.data[0][this.valueProp], this.$refs.tree.getNode(this.data[0][this.valueProp]), this.$refs.tree);
                            if (this.defaultExpandKey && this.defaultExpandKey.length >= 0) {
                                this.defaultExpand = this.defaultExpandKey
                            } else {
                                this.defaultExpand = [result.data[0][this.valueProp]]
                            }
                        }
                    }).catch(error => {
                    console.error(error.message)
                })
            },
            handleNodeClick(data, node, nodeComponent) {
                this.selected = data[this.valueProp];
                this.$emit("node-click", data[this.valueProp], node, nodeComponent);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data[this.labelProp] ? data[this.labelProp].indexOf(value) !== -1 : false;
            },
            addNode(data) {
                /*console.log("addNode")
                data = {
                    children: null,
                    corporation: 1,
                    deptCode: "999-14suo-122shi",
                    deptLevel: null,
                    deptName: "122室",
                    enabled: 1,
                    inputDeptCode: "122shi",
                    oid: "eb3d45f65443e6a0f45438b73a0ec33521312",
                    orgCode: "999-14suo",
                    ou: null,
                    parentCode: "14suo",
                    sequencing: "1",
                    tenantModel: null,
                    typeCode: "SYS_DEPT_ORG",
                    viral: 0
                }
                console.log(this.$refs.tree.getNode(this.$refs.tree.getCurrentKey()))*/
                //console.log(this.getCheckedNodes())
                this.$refs.tree.append(data, this.$refs.tree.getNode(this.$refs.tree.getCurrentKey()))

            },
            updateNode(data) {

                if (this.valueProp) {
                    const node = this.$refs.tree.getNode(data[this.valueProp])
                    if (node) {
                        //this.$set(node, 'data', data);// .data = data
                        node.data = {...node.data, ...data};
                    }
                }

            },
            deleteNode() {
                this.selected = '';
                this.$refs.tree.getNode(this.$refs.tree.getCurrentKey()).remove();
            },
            remove(data) {
                this.$refs.tree.remove(data);
            },
            getCheckedNodes(leafOnly, includeHalfChecked) {
                return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked)
            },
            nodeCheck(changeNode, nodeStatus) {
                this.$emit('node-check', changeNode, nodeStatus)
            },
            setChecked(key_data, checked, deep) {
                this.$refs.tree.setChecked(key_data, checked, deep)
            },
            setCheckedNodes(nodes) {
                this.$refs.tree.setCheckedNodes(nodes)
            },
            setCheckedKeys(keys, leafOnly) {
                this.$refs.tree.setCheckedKeys(keys, leafOnly)
            },
            setCurrentKey(key) {
                this.$refs.tree.setCurrentKey(key);
            },
            setTreeCurrentNode(node) {
                this.$refs.tree.setCurrentKey(node);
            },
            getNode(data) {
                return this.$refs.tree.getNode(data)
            },
            refresh() {
                if (this.treeData && this.treeData.length > 0) {
                    //如果树形节点为checkBox并且nodeDisabledCode不为空，则根据条件禁用节点
                    /*if (this.nodeDisabledCode && this.showTreeCheckbox) {
                        this.disableNode(this.treeData);
                    }*/
                    this.data = this.treeData;
                    this.$nextTick(() => {
                        if (this.currentNodeKey) {//自定义默认节点
                            this.$refs.tree.setCurrentKey(this.currentNodeKey);
                            this.selected = this.currentNodeKey;
                            this.$emit("node-click", this.currentNodeKey, this.$refs.tree.getNode(this.currentNodeKey), this.$refs.tree);
                        } else {//未设置默认节点则默认为根节点
                            this.$refs.tree.setCurrentKey(this.data[0][this.valueProp]);
                            this.selected = this.data[0][this.valueProp];
                            this.$emit("node-click", this.data[0][this.valueProp], this.$refs.tree.getNode(this.data[0][this.valueProp]), this.$refs.tree);
                        }

                        if (this.defaultExpandKey && this.defaultExpandKey.length >= 0) {
                            this.defaultExpand = this.defaultExpandKey
                        } else {
                            this.defaultExpand = [this.data[0][this.valueProp]]
                        }
                        this.$nextTick(_ => {
                            //如果树形节点为checkBox并且nodeDisabledCode不为空，则根据条件禁用节点
                            if (this.nodeDisabledCode && this.showTreeCheckbox) {
                                this.initDisabled(this.$refs.tree.root)
                            }
                        });
                        if(this.filterText){//过滤
                            this.$refs.tree.filter(this.filterText);
                        }
                    });
                    return
                }
                if (this.isLazy === false && !this.treeData) {
                    this.$axios.get(this.loadUrl)
                        .then(result => {
                            //如果树形节点为checkBox并且nodeDisabledCode不为空，则根据条件禁用节点
                            /*  if (this.nodeDisabledCode && this.showTreeCheckbox) {
                                  //调用根据条件禁用节点
                                  this.disableNode(result.data);

                                  //nodeDisabledChild表示父子节点是否相关联，
                                  if (this.nodeDisabledChild) {
                                      //调用当子节点全部禁用时，则自身也禁用的方法
                                      for (let i = 0; i < 5; i++) {
                                          this.disableParentNode(result.data);
                                      }
                                  }
                              }*/
                            this.data = result.data;
                            this.$nextTick(() => {
                                if (this.currentNodeKey) {//自定义默认节点
                                    this.$refs.tree.setCurrentKey(this.currentNodeKey);
                                    this.selected = this.currentNodeKey;
                                    this.$emit("node-click", this.currentNodeKey, this.$refs.tree.getNode(this.currentNodeKey), this.$refs.tree);
                                } else {//未设置默认节点则默认为根节点
                                    this.$refs.tree.setCurrentKey(this.data[0][this.valueProp]);
                                    this.selected = this.data[0][this.valueProp];
                                    this.$emit("node-click", this.data[0][this.valueProp], this.$refs.tree.getNode(this.data[0][this.valueProp]), this.$refs.tree);
                                }

                                if (this.defaultExpandKey && this.defaultExpandKey.length >= 0) {
                                    this.defaultExpand = this.defaultExpandKey
                                } else {
                                    this.defaultExpand = [this.data[0][this.valueProp]]
                                }

                                this.$nextTick(_ => {
                                    //如果树形节点为checkBox并且nodeDisabledCode不为空，则根据条件禁用节点
                                    if (this.nodeDisabledCode && this.showTreeCheckbox) {
                                        this.initDisabled(this.$refs.tree.root)
                                    }
                                });
                                if(this.filterText){//过滤
                                    this.$refs.tree.filter(this.filterText);
                                }
                            })
                        }).catch(error => {
                        console.error(error && error.msg ? error.msg : error)
                    })
                }
            },
            disableParentNode(list) {
                /*list.forEach(item=>{
                    //如果有子集并且自身状态不为禁用
                   if(item.children&&item.children.length>0&&!item.disabled){
                       let disNum=0;
                       item.children.forEach(chi=>{
                           if(chi.disabled){
                               disNum++;
                           }
                       });
                       //disNum的值等于子集的数量，则将自身设为禁用状态
                       if(disNum==item.children.length){
                           item.disabled=true;
                       }
                       //如果子集还有子集，则如此循环
                       this.disableParentNode(item.children);
                   }
                });*/
            },

            /**
             * 禁用节点
             * @param node需要判定禁用的节点
             * @param force 是否强制禁用，一般指子节点全部禁用时父节点自动禁用
             */
            disableNode2(node, force = false) {


                //force用于表示：表达式nodeDisabledCondition方法不满足的状况下，但其子节点全部为禁用状态，则自身也应禁用
                if (force || this.nodeDisabledCondition(node)) {
                    this.$set(node.data, "disabled", true);
                    if (!force) {
                        node.childNodes.forEach(child => {
                            this.disableNode2(child)
                        })
                    }

                    //如果该节点有父节点并且为父子节点不相关联
                    if (node.parent && (!this.$attrs['check-strictly'] && !this.$attrs['checkStrictly'])) {

                        //如果父节点已经被禁用，则跳过
                        if (node.parent.data["disabled"]) {
                            return;
                        }
                        //查找当前节点的同胞节点是否有不为禁用状态的节点
                        const unDisabled = node.parent.childNodes.find(pchild => {
                            return pchild.data.disabled != true
                        });
                        //当前节点的同胞节点如果有一个节点的状态不为禁用，即不需要再次递归
                        if (!unDisabled) {

                            //如果同胞节点都为禁用状态，则传入父节点，传true表示，该节点不满足表达式，但又需要禁用
                            this.disableNode2(node.parent, true)
                        }
                    }

                }
            },


            /**
             * 初始化节点是否禁用
             * @param node
             */
            initDisabled(node) {

                //  const flatList = flatten(this.data)
                //  flatList.filter(item=>item[this.nodeDisabledCode]==this.nodeDisabledVal).forEa
                //const root= this.$refs.tree.root;


                this.disableNode2(node)


                node.childNodes.forEach(child => {

                    if (!child) {
                        return
                    } else {
                        this.initDisabled(child)
                    }
                })

            },

            nodeDisabledCondition(node) {

                let nodeData = node["data"]

                //为true则表示该节点需要被禁用
                if (this.nodeDisabledVal instanceof Array) {
                    return this.nodeDisabledVal.indexOf(nodeData[this.nodeDisabledCode]) != -1
                } else {
                    return nodeData[this.nodeDisabledCode] == this.nodeDisabledVal
                }

            },


            disableNode(arr) {
                //单节点禁用
                for (let i = 0; i < arr.length; i++) {
                    //当需要禁用的值为多个（Array）时
                    if (typeof this.nodeDisabledVal == 'object') {
                        //当一个字段对应多个值时，如节点字段nodeDisabledCode的值为a，nodeDisabledVal=【1,2,3】，
                        //则表示a的值为1或2或3的其中一个，则该节点禁用
                        let isTrue = false;
                        for (let j = 0; j < this.nodeDisabledVal.length; j++) {
                            //满足其中一个条件
                            if (arr[i][this.nodeDisabledCode] == this.nodeDisabledVal[j]) {
                                isTrue = true;
                                break;
                            }
                        }
                        arr[i].disabled = isTrue;
                    } else {
                        //类型为String时
                        arr[i].disabled = arr[i][this.nodeDisabledCode] == this.nodeDisabledVal;
                    }

                    if (arr[i].children && arr[i].children.length > 0) {
                        //如果该节点为禁用状态并且为父子相关联
                        if (arr[i].disabled && this.nodeDisabledChild) {
                            //调用父节点禁用则子节点全部禁用的方法
                            this.disableNodeMore(arr[i].children)
                        } else {
                            //父子节点不相关联，则根据条件禁用自身
                            this.disableNode(arr[i].children);
                        }
                    }
                }
            },
            disableNodeMore(arr) {
                //父节点禁用则其子节点全部禁用
                for (let i = 0; i < arr.length; i++) {
                    arr[i].disabled = true;
                    if (arr[i].children && arr[i].children.length > 0) {
                        this.disableNode(arr[i].children)
                    }
                }
            },
            startNodeDisabled() {
                this.$refs.tree()
            }
        },
        computed: {
            isLazy() {
                // debugger
                return this.treeData ? false : this.lazy
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            treeData() {
                this.refresh();
            },
            loadUrl() {
                this.refresh();
            }
        },
        mounted() {
            console.log('===> has slots %o', this.$slots)
            this.refresh();
            if(this.$slots.prefix && this.$slots.prefix.length > 0){
                this.$refs.keyfliter.className="inputwithslots";
            }
        },
        components: {
            VueScroll
        }
    }

</script>


<style lang="less" scoped>
    .treeBody {
        background: white;
        padding: 5px;
        box-sizing: border-box;
        /*max-height: 100%;*/
        /*overflow-y: auto;*/
        min-width: 200px;
        /*  height: 100%;*/
        flex-grow: 0;
        /*max-width: 500px;*/
        display: flex;
        flex-direction: column;

        .input {
            margin: 6px 0 4px 0;
            padding: 1px;
            box-sizing: border-box;
        }

        .inputwithslots {
            margin: 5px 0 4px 0;
        }

    }
</style>
