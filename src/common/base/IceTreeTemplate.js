export default {
    props:
        {
            loadUrl: String,//树形加载数据url,
            treeData: Array,
            lazy: Boolean,
            filter: {//是否启用树形过滤
                type: Boolean,
                default: true
            },
            labelProp: {
                type: String,
                default: 'label'
            },
            childrenProp: {
                type: String,
                default: 'children'
            },
            valueProp: {
                type: String,
                default: 'id'
            },
            treeParentProp: {
                type: String,
                default: 'pid'
            },
            rootValue: {
                type: String,
                default: '0'
            },
            showTreeCheckbox: {
                type: Boolean,
                default: false
            },
            treeWidth: {
                type: String,
                default: '200px'
            },
            nodeDisabledCode: {
                //根据nodeDisabledCode来禁用树节点
                type: String,
                default: ''
            },
            nodeDisabledVal: {
                //当树节点nodeDisabledCode的值等于nodeDisabledVal值，则禁用该节点
                type: [String,Array],
                default: null
            },
            nodeDisabledChild: {
                //父节点禁用则其子节点全部禁用
                type: Boolean,
                default: true
            },

            //默认展开的节点
            defaultExpandKey:Array,

            //treeData不为空时，设定默认选中节点
            currentNodeKey:[String,Number],
        }
}
