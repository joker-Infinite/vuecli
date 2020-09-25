<script>
    import {TableColumn} from 'element-ui'
    import {mapMutations,mapGetters} from 'vuex'

    export default {
        mixins: [{
            created() {
                if (this.renderCell) {
                    this.columnConfig.renderCell = (h, data) => {
                        return (<div class="cell"> {this.renderCell(h, data)}</div>)
                    }
                } else {
                    if (this.mapTypeCode) {
                        let thiz = this;
                        this.columnConfig.renderCell = (h, data) => {
                            if (this.showTips) {
                                if (thiz.datamap) {
                                    return <div class="cell"
                                                title={thiz.datamap[data.row[thiz.prop]]}> {thiz.datamap[data.row[thiz.prop]]}</div>;
                                } else {
                                    // console.error("未找到数据字典：typecode=" + thiz.mapTypeCode);
                                    return <div class="cell" title={data.row[thiz.prop]}> {data.row[thiz.prop]}</div>;
                                }
                            } else {
                                if (thiz.datamap) {
                                    return <div class="cell"> {thiz.datamap[data.row[thiz.prop]]}</div>;
                                } else {
                                    // console.error("未找到数据字典：typecode=" + thiz.mapTypeCode);
                                    return <div class="cell"> {data.row[thiz.prop]}</div>;
                                }
                            }


                        }
                        this.addUndoTypeCodes(this.mapTypeCode);
                    } else {
                        let thiz = this;
                        this.columnConfig.renderCell = (h, data) => {
                            if (this.showTips) {
                                if (this.formatter) {
                                    return <div class="cell"
                                                title={this.formatter(data.row)}>
                                        <div class="cell-wrapper">{this.formatter(data.row)}</div>
                                    </div>;
                                } else {
                                    return <div class="cell" title={data.row[thiz.prop]}>
                                        <div class="cell-wrapper">{data.row[thiz.prop]}</div>
                                    </div>;
                                }

                            } else {
                                if (this.formatter) {
                                    return <div class="cell">
                                        <div class="cell-wrapper">{this.formatter(data.row)}</div>
                                    </div>;
                                } else {
                                    return <div class="cell">
                                        <div class="cell-wrapper">{data.row[thiz.prop]}</div>
                                    </div>;
                                }

                            }

                        }
                    }
                }

            }
        }],
        name: 'IceTableColumn',
        extends: TableColumn,
        props: {
            mapTypeCode: String,
            showTips: {
                type: Boolean,
                default: false
            },
            renderCell: {
                type: Function,
                default: null
            }
        },
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap']),
        },
        computed: {
            datamap() {

                // let datamap = this.$store.state.datamapStore.datamap[this.mapTypeCode];
                return this.getDataMap()(this.mapTypeCode);
            }
        },

    }

</script>
